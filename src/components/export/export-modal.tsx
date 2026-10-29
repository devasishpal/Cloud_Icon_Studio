'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, Smartphone, Apple, Globe, Monitor, FileDown,
  Download, X, ChevronRight, FileText, FolderTree, Settings,
  Zap, Sliders, Clock, CheckCircle2, AlertCircle, Images, Image as ImageIcon,
} from 'lucide-react';
import { useEditorStore } from '@/store/useEditorStore';
import { runExport, type ExportTask } from '@/lib/exporter';
import { EXPORT_PRESETS, estimateExport, type ExportPreset } from '@/lib/processor';
import { formatFileSize } from '@/lib/helpers';
import { cn } from '@/lib/utils';
import type { ExportEntry } from '@/types';

const presetIcons: Record<string, typeof Package> = {
  full: Package, android: Smartphone, ios: Apple,
  web: Globe, pwa: Globe, desktop: Monitor, minimal: FileDown,
  splash: Images, social: ImageIcon,
};

const stageMessages: Record<string, string> = {
  idle: 'Ready to export',
  preparing: 'Preparing pipeline...',
  rendering: 'Rendering master image...',
  generating: 'Generating platform icons...',
  packaging: 'Building ZIP archive...',
  downloading: 'Starting download...',
  done: 'Export complete!',
  error: 'Export failed',
};

const compressionOptions = [
  { value: 'low' as const, label: 'Fast', desc: 'Quick export, larger file', icon: Zap },
  { value: 'balanced' as const, label: 'Balanced', desc: 'Good size & speed', icon: Sliders },
  { value: 'maximum' as const, label: 'Maximum', desc: 'Smallest file, slower', icon: Clock },
];

export function ExportModal() {
  const store = useEditorStore();
  const modalOpen = store.modalOpen as boolean;
  const setModalOpen = store.setExportModalOpen;

  const image = store.image;
  const padding = store.padding;
  const backgroundColor = store.backgroundColor;
  const rotation = store.rotation;

  const [preset, setPreset] = useState<string>(store.exportPreset || 'full');
  const [exportName, setExportName] = useState<string>(store.exportName || 'CloudIcon-Pack');
  const [compression, setCompression] = useState<'low' | 'balanced' | 'maximum'>(store.compressionLevel || 'balanced');
  const [addTimestamp, setAddTimestamp] = useState(true);
  const [includeREADME, setIncludeREADME] = useState(true);
  const [includeManifests, setIncludeManifests] = useState(true);
  const [includeSource, setIncludeSource] = useState(false);

  const [progress, setProgress] = useState<{
    stage: string; progress: number; total: number; message: string; error?: string;
  } | null>(null);

  const [estimate, setEstimate] = useState<{ size: number; fileCount: number }>({
    size: 0,
    fileCount: 0,
  });

  useEffect(() => {
    if (!modalOpen || !image.dataUrl) return;
    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        const next = await estimateExport(
          preset as ExportPreset,
          {
            image,
            padding,
            rotation,
            backgroundColor,
            backgroundType: store.backgroundType,
            gradientPreset: store.gradientPreset,
            iconShape: store.previewPreferences.iconShape,
            fit: store.fit,
            transform: store.transform,
            adjustments: store.adjustments,
            effects: store.effects,
          },
          exportName
        );
        if (!cancelled) setEstimate(next);
      } catch {
        // Keep the previous estimate if a sample render fails.
      }
    }, 220);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [
    modalOpen,
    preset,
    image,
    padding,
    rotation,
    backgroundColor,
    exportName,
    store.backgroundType,
    store.gradientPreset,
    store.previewPreferences.iconShape,
    store.fit,
    store.transform,
    store.adjustments,
    store.effects,
  ]);

  const handleExport = useCallback(async () => {
    if (!image.dataUrl) return;

    const task: ExportTask = {
      image,
      preset: preset as ExportPreset,
      padding,
      backgroundColor,
      rotation,
      backgroundType: store.backgroundType,
      gradientPreset: store.gradientPreset,
      iconShape: store.previewPreferences.iconShape,
      fit: store.fit,
      transform: store.transform,
      adjustments: store.adjustments,
      effects: store.effects,
      compressionLevel: compression,
      exportName,
      includeREADME,
      includeManifests,
      includeSource,
      addTimestamp,
      namingStyle: store.namingStyle,
    };

    const result = await runExport(task, setProgress);

    if (result) {
      const entry: ExportEntry = {
        id: Date.now().toString(),
        date: new Date().toLocaleString(),
        preset,
        name: result.filename,
        size: result.size,
        fileCount: result.fileCount,
        compressionLevel: compression,
      };
      store.addExportEntry(entry);
    }
  }, [image, preset, padding, backgroundColor, rotation, compression, exportName,
    includeREADME, includeManifests, includeSource, addTimestamp, store]);

  const isExporting = progress !== null &&
    (progress.stage === 'preparing' || progress.stage === 'rendering' ||
     progress.stage === 'generating' || progress.stage === 'packaging' ||
     progress.stage === 'downloading');

  const isDone = progress?.stage === 'done';
  const isError = progress?.stage === 'error';

  const handleClose = () => {
    if (isExporting) return;
    setModalOpen(false);
    setProgress(null);
  };

  return (
    <AnimatePresence>
      {modalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl border border-border/50 bg-background/95 backdrop-blur-2xl shadow-2xl"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                  <Download className="size-4 text-primary" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold">Export Icons</h2>
                  <p className="text-[10px] text-muted-foreground">
                    {isDone ? 'Download ready' : isError ? 'Export failed' : 'Configure your export pack'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                disabled={isExporting}
                className={cn(
                  'flex size-7 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all',
                  isExporting && 'opacity-40 cursor-not-allowed'
                )}
              >
                <X className="size-3.5" />
              </button>
            </div>

            <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-5 space-y-5">
              {!progress ? (
                <>
                  <section>
                    <div className="flex items-center gap-2 mb-3">
                      <Package className="size-3.5 text-muted-foreground" />
                      <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Export Preset</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {(Object.entries(EXPORT_PRESETS) as [ExportPreset, typeof EXPORT_PRESETS[ExportPreset]][]).map(([key, p]) => {
                        const Icon = presetIcons[key] || Package;
                        const active = preset === key;
                        return (
                          <button
                            key={key}
                            onClick={() => setPreset(key)}
                            className={cn(
                              'relative flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-all',
                              active
                                ? 'border-primary/40 bg-primary/5 shadow-sm'
                                : 'border-border/50 hover:border-primary/20 hover:bg-muted/30'
                            )}
                          >
                            <div className={cn(
                              'flex size-8 items-center justify-center rounded-lg',
                              active ? 'bg-primary/15 text-primary' : 'bg-muted/50 text-muted-foreground'
                            )}>
                              <Icon className="size-4" />
                            </div>
                            <span className={cn('text-xs font-medium', active ? 'text-foreground' : 'text-muted-foreground')}>
                              {p.label}
                            </span>
                            <span className="text-[9px] text-muted-foreground/70 leading-tight">{p.description}</span>
                          </button>
                        );
                      })}
                    </div>
                  </section>

                  <section>
                    <div className="flex items-center gap-2 mb-3">
                      <Settings className="size-3.5 text-muted-foreground" />
                      <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Export Settings</span>
                    </div>
                    <div className="rounded-xl border border-border/50 bg-muted/20 p-4 space-y-4">
                      <div>
                        <label className="text-xs text-muted-foreground mb-1.5 block">File Name</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={exportName}
                            onChange={(e) => setExportName(e.target.value)}
                            placeholder="MyApp-IconPack"
                            className="flex-1 h-9 rounded-lg border border-border/50 bg-background px-3 text-xs outline-none focus:border-primary/50 transition-colors"
                          />
                          <button
                            onClick={() => setAddTimestamp(!addTimestamp)}
                            className={cn(
                              'flex items-center gap-1.5 px-3 rounded-lg border text-xs transition-all',
                              addTimestamp
                                ? 'border-primary/30 bg-primary/5 text-primary'
                                : 'border-border/50 text-muted-foreground hover:bg-muted/50'
                            )}
                          >
                            <Clock className="size-3" />
                            {addTimestamp ? 'With TS' : 'No TS'}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs text-muted-foreground mb-2 block">Compression</label>
                        <div className="flex gap-2">
                          {compressionOptions.map((opt) => {
                            const Icon = opt.icon;
                            const active = compression === opt.value;
                            return (
                              <button
                                key={opt.value}
                                onClick={() => setCompression(opt.value)}
                                className={cn(
                                  'flex-1 flex flex-col items-center gap-1 rounded-lg border p-2.5 text-center transition-all',
                                  active
                                    ? 'border-primary/30 bg-primary/5'
                                    : 'border-border/50 hover:bg-muted/30'
                                )}
                              >
                                <Icon className={cn('size-3.5', active ? 'text-primary' : 'text-muted-foreground')} />
                                <span className={cn('text-[10px] font-medium', active ? 'text-foreground' : 'text-muted-foreground')}>
                                  {opt.label}
                                </span>
                                <span className="text-[8px] text-muted-foreground/70">{opt.desc}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </section>

                  <section>
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="size-3.5 text-muted-foreground" />
                      <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Options</span>
                    </div>
                    <div className="rounded-xl border border-border/50 bg-muted/20 p-3">
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { key: 'includeREADME' as const, label: 'README.txt', checked: includeREADME, set: setIncludeREADME },
                          { key: 'includeManifests' as const, label: 'Manifest Files', checked: includeManifests, set: setIncludeManifests },
                          { key: 'includeSource' as const, label: 'Source Image', checked: includeSource, set: setIncludeSource },
                        ].map((opt) => (
                          <label
                            key={opt.key}
                            className="flex items-center gap-2.5 rounded-lg border border-border/50 px-3 py-2.5 cursor-pointer hover:bg-muted/30 transition-all"
                          >
                            <input
                              type="checkbox"
                              checked={opt.checked}
                              onChange={(e) => opt.set(e.target.checked)}
                              className="size-3.5 accent-primary rounded"
                            />
                            <span className="text-xs text-muted-foreground">{opt.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </section>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/50">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <FolderTree className="size-3.5" />
                      Estimated ZIP size:{' '}
                      <span className="font-medium text-foreground">
                        {estimate.size ? formatFileSize(estimate.size) : 'Calculating…'}
                      </span>
                      {estimate.fileCount > 0 && (
                        <span className="text-muted-foreground/70">· {estimate.fileCount} files</span>
                      )}
                    </div>
                    <button
                      onClick={handleExport}
                      disabled={!image.dataUrl}
                      className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-xs font-medium text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      <Download className="size-3.5" />
                      Generate &amp; Download
                      <ChevronRight className="size-3" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 px-4">
                  {isDone ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', damping: 20 }}
                      className="flex flex-col items-center gap-4"
                    >
                      <div className="flex size-16 items-center justify-center rounded-2xl bg-green-500/10">
                        <CheckCircle2 className="size-8 text-green-500" />
                      </div>
                      <p className="text-sm font-medium">{progress?.message || 'Export complete!'}</p>
                      <button
                        onClick={handleClose}
                        className="rounded-lg bg-primary px-6 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-all"
                      >
                        Done
                      </button>
                    </motion.div>
                  ) : isError ? (
                    <div className="flex flex-col items-center gap-4">
                      <div className="flex size-16 items-center justify-center rounded-2xl bg-red-500/10">
                        <AlertCircle className="size-8 text-red-500" />
                      </div>
                      <p className="text-sm font-medium text-destructive">{progress?.error || 'Export failed'}</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => { setProgress(null); }}
                          className="rounded-lg border border-border/50 px-5 py-2 text-xs font-medium hover:bg-muted/50 transition-all"
                        >
                          Back
                        </button>
                        <button
                          onClick={handleExport}
                          className="rounded-lg bg-primary px-5 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-all"
                        >
                          Retry
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-5 w-full max-w-sm">
                      <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                        >
                          <Download className="size-7 text-primary" />
                        </motion.div>
                      </div>

                      <div className="text-center">
                        <p className="text-sm font-medium mb-1">
                          {progress?.message || stageMessages[progress?.stage || ''] || 'Processing...'}
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {progress?.stage?.replace('-', ' ')}
                        </p>
                      </div>

                      <div className="w-full space-y-1.5">
                        <div className="flex justify-between text-[10px] text-muted-foreground">
                          <span>Progress</span>
                          <span>
                            {progress?.total
                              ? `${Math.round((progress.progress / progress.total) * 100)}%`
                              : '...'}
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                          <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-primary to-accent-2"
                            animate={{
                              width: progress?.total
                                ? `${(progress.progress / progress.total) * 100}%`
                                : '60%',
                            }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                        <div className="flex gap-1">
                          {['preparing', 'rendering', 'generating', 'packaging', 'downloading'].map((s, i) => {
                            const stages = ['preparing', 'rendering', 'generating', 'packaging', 'downloading'];
                            const idx = stages.indexOf(progress?.stage || '');
                            return (
                              <div
                                key={s}
                                className={cn(
                                  'size-1.5 rounded-full transition-all',
                                  i < idx ? 'bg-primary' : i === idx ? 'bg-primary animate-pulse' : 'bg-muted'
                                )}
                              />
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
