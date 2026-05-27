'use client';

import type { ImageInfo, NamingStyle, BackgroundType, GradientPreset, IconShape } from '@/types';
import type { ExportPreset } from './processor';
import { runExportPreset } from './processor';
import { generateReadme, packZip, getCompressionLevel } from './zip-utils';

export interface ExportTask {
  image: ImageInfo;
  preset: ExportPreset;
  padding: number;
  backgroundColor: string;
  rotation: number;
  backgroundType: BackgroundType;
  gradientPreset: GradientPreset | null;
  iconShape: IconShape;
  compressionLevel: 'low' | 'balanced' | 'maximum';
  exportName: string;
  includeREADME: boolean;
  includeManifests: boolean;
  includeSource: boolean;
  addTimestamp: boolean;
  namingStyle: NamingStyle;
}

export type ExportCallback = (status: {
  stage: 'idle' | 'preparing' | 'rendering' | 'generating' | 'packaging' | 'downloading' | 'done' | 'error';
  progress: number;
  total: number;
  message: string;
  platform?: string;
  error?: string;
}) => void;

export async function runExport(task: ExportTask, onStatus: ExportCallback) {
  const startTime = Date.now();

  try {
    onStatus({
      stage: 'preparing', progress: 0, total: 1,
      message: 'Preparing export pipeline...',
    });

    const preset = task.preset;
    const filename = buildFilename(task);

    await sleep(100);

    onStatus({
      stage: 'rendering', progress: 0, total: 1,
      message: 'Rendering master canvas...',
    });

    onStatus({
      stage: 'generating', progress: 0, total: 1,
      message: `Generating ${preset} icons...`,
    });

    const result = await runExportPreset(
      preset,
      task.image,
      task.padding,
      task.backgroundColor,
      task.rotation,
      task.backgroundType,
      task.gradientPreset,
      task.iconShape,
      (t) => {
        onStatus({
          stage: 'generating',
          progress: t.done,
          total: t.total,
          message: `${t.platform}: ${t.step}`,
          platform: t.platform,
        });
      }
    );

    onStatus({
      stage: 'packaging', progress: 0,
      total: result.files.length + result.texts.length + (task.includeREADME ? 1 : 0),
      message: 'Packaging ZIP archive...',
    });

    const { blob, size } = await packZip(
      result.files,
      result.texts,
      {
        compressionLevel: task.compressionLevel,
        exportName: filename,
        includeREADME: task.includeREADME,
        includeManifests: task.includeManifests,
        includeSource: task.includeSource,
      },
      (current, total) => {
        onStatus({
          stage: 'packaging',
          progress: current,
          total,
          message: `Packaging files... (${current}/${total})`,
        });
      }
    );

    onStatus({
      stage: 'downloading', progress: 1, total: 1,
      message: 'Starting download...',
    });

    const { saveAs } = await import('file-saver');
    saveAs(blob, `${filename}.zip`);

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

    onStatus({
      stage: 'done', progress: 1, total: 1,
      message: `Exported in ${elapsed}s — ${(size / 1024 / 1024).toFixed(1)} MB`,
    });
  } catch (err) {
    onStatus({
      stage: 'error',
      progress: 0,
      total: 0,
      message: 'Export failed',
      error: err instanceof Error ? err.message : 'Unknown error',
    });
  }
}

function buildFilename(task: ExportTask): string {
  let name = task.exportName || 'CloudIcon-Pack';
  if (task.addTimestamp) {
    const ts = new Date().toISOString().slice(0, 16).replace('T', '-').replace(':', '');
    name += `-${ts}`;
  }
  if (task.namingStyle === 'lowercase') name = name.toLowerCase();
  else if (task.namingStyle === 'uppercase') name = name.toUpperCase();
  return name;
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
