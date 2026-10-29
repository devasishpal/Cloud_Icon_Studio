'use client';

import type {
  BackgroundType,
  GradientPreset,
  IconShape,
  ImageAdjustments,
  ImageEffects,
  ImageFit,
  ImageInfo,
  ImageTransform,
  NamingStyle,
} from '@/types';
import type { ExportPreset, RenderSettings } from './processor';
import { buildExportPlan, executeExportPlan } from './processor';
import { packZip } from './zip-utils';

export interface ExportTask {
  image: ImageInfo;
  preset: ExportPreset;
  padding: number;
  backgroundColor: string;
  rotation: number;
  backgroundType: BackgroundType;
  gradientPreset: GradientPreset | null;
  iconShape: IconShape;
  fit: ImageFit;
  transform: ImageTransform;
  adjustments: ImageAdjustments;
  effects: ImageEffects;
  compressionLevel: 'low' | 'balanced' | 'maximum';
  exportName: string;
  includeREADME: boolean;
  includeManifests: boolean;
  includeSource: boolean;
  addTimestamp: boolean;
  namingStyle: NamingStyle;
}

export interface ExportResult {
  size: number;
  fileCount: number;
  filename: string;
}

export type ExportCallback = (status: {
  stage: 'idle' | 'preparing' | 'rendering' | 'generating' | 'packaging' | 'downloading' | 'done' | 'error';
  progress: number;
  total: number;
  message: string;
  platform?: string;
  error?: string;
}) => void;

export async function runExport(
  task: ExportTask,
  onStatus: ExportCallback
): Promise<ExportResult | null> {
  const startTime = Date.now();

  try {
    onStatus({
      stage: 'preparing',
      progress: 0,
      total: 1,
      message: 'Preparing export pipeline...',
    });

    const filename = buildFilename(task);
    const settings: RenderSettings = {
      image: task.image,
      padding: task.padding,
      rotation: task.rotation,
      backgroundColor: task.backgroundColor,
      backgroundType: task.backgroundType,
      gradientPreset: task.gradientPreset,
      iconShape: task.iconShape,
      fit: task.fit,
      transform: task.transform,
      adjustments: task.adjustments,
      effects: task.effects,
    };

    const plan = buildExportPlan(task.preset, settings, task.exportName);

    onStatus({
      stage: 'generating',
      progress: 0,
      total: plan.total,
      message: `Generating ${plan.files.length} files...`,
    });

    const result = await executeExportPlan(plan, (progress) => {
      onStatus({
        stage: 'generating',
        progress: progress.done,
        total: progress.total,
        message: `${progress.platform}: ${progress.step}`,
        platform: progress.platform,
      });
    });

    const source = await buildSource(task);

    onStatus({
      stage: 'packaging',
      progress: 0,
      total: plan.total + (task.includeREADME ? 1 : 0) + (source ? 1 : 0),
      message: 'Packaging ZIP archive...',
    });

    const packed = await packZip(
      result.files,
      result.texts,
      {
        compressionLevel: task.compressionLevel,
        exportName: filename,
        includeREADME: task.includeREADME,
        includeManifests: task.includeManifests,
        includeSource: task.includeSource,
        source,
        appName: task.exportName,
        preset: task.preset,
        backgroundColor: task.backgroundColor,
        transparent: task.backgroundType === 'transparent',
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
      stage: 'downloading',
      progress: 1,
      total: 1,
      message: 'Starting download...',
    });

    const { saveAs } = await import('file-saver');
    saveAs(packed.blob, `${filename}.zip`);

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    const sizeLabel = packed.size >= 1024 * 1024
      ? `${(packed.size / 1024 / 1024).toFixed(1)} MB`
      : `${Math.max(1, Math.round(packed.size / 1024))} KB`;

    onStatus({
      stage: 'done',
      progress: 1,
      total: packed.fileCount,
      message: `Exported in ${elapsed}s — ${sizeLabel} · ${packed.fileCount} files`,
    });

    return { size: packed.size, fileCount: packed.fileCount, filename };
  } catch (err) {
    onStatus({
      stage: 'error',
      progress: 0,
      total: 0,
      message: 'Export failed',
      error: err instanceof Error ? err.message : 'Unknown error',
    });
    return null;
  }
}

async function buildSource(task: ExportTask): Promise<{ name: string; blob: Blob } | null> {
  if (!task.includeSource || !task.image.dataUrl) return null;

  if (task.image.file) {
    return { name: `source/${task.image.file.name}`, blob: task.image.file };
  }

  const response = await fetch(task.image.dataUrl);
  const blob = await response.blob();
  const ext = blob.type === 'image/jpeg'
    ? 'jpg'
    : blob.type === 'image/webp'
      ? 'webp'
      : blob.type === 'image/svg+xml'
        ? 'svg'
        : 'png';
  return { name: `source/original.${ext}`, blob };
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
