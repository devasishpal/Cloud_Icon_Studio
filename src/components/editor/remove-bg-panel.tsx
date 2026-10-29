'use client';

import { useState } from 'react';
import { Eraser, Pipette, Loader2, Palette, Sparkles, Wand2 } from 'lucide-react';
import { useEditorStore } from '@/store/useEditorStore';
import { Label } from '@/components/ui/label';
import { extractPalette, removeBackground, sampleCornerColor } from '@/lib/image-ops';
import { removeBackgroundAi, type AiStage } from '@/lib/u2net';
import { isHexColor } from '@/lib/render';
import { cn } from '@/lib/utils';

type BusyMode = 'ai' | 'chroma' | null;

export function RemoveBgPanel() {
  const image = useEditorStore((s) => s.image);
  const setImage = useEditorStore((s) => s.setImage);
  const [keyColor, setKeyColor] = useState('#ffffff');
  const [tolerance, setTolerance] = useState(18);
  const [busy, setBusy] = useState<BusyMode>(null);
  const [aiStage, setAiStage] = useState<AiStage>('model');
  const [aiProgress, setAiProgress] = useState(0);
  const [palette, setPalette] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const commitResult = async (next: string) => {
    // Probe the result dimensions before replacing the source.
    const probe = new Image();
    await new Promise<void>((resolve, reject) => {
      probe.onload = () => resolve();
      probe.onerror = () => reject(new Error('Processing failed'));
      probe.src = next;
    });
    setImage(
      { file: image.file, dataUrl: next, width: probe.naturalWidth, height: probe.naturalHeight },
      { preserveEdits: true }
    );
  };

  const pickCorner = async () => {
    if (!image.dataUrl) return;
    setError(null);
    try {
      const color = await sampleCornerColor(image.dataUrl);
      setKeyColor(color);
    } catch {
      setError('Could not read the image.');
    }
  };

  const detectPalette = async () => {
    if (!image.dataUrl) return;
    setError(null);
    try {
      setPalette(await extractPalette(image.dataUrl, 6));
    } catch {
      setError('Could not read the image.');
    }
  };

  const applyAi = async () => {
    if (!image.dataUrl) return;
    setBusy('ai');
    setError(null);
    setAiStage('model');
    setAiProgress(0);
    try {
      const next = await removeBackgroundAi(image.dataUrl, {
        onProgress: (progress, stage) => {
          setAiStage(stage);
          setAiProgress(progress);
        },
      });
      await commitResult(next);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'AI background removal failed. Try the colour-key option below.'
      );
    } finally {
      setBusy(null);
    }
  };

  const applyChroma = async () => {
    if (!image.dataUrl) return;
    setBusy('chroma');
    setError(null);
    try {
      const next = await removeBackground(image.dataUrl, keyColor, tolerance);
      await commitResult(next);
    } catch {
      setError('Background removal failed. Try a different key colour.');
    } finally {
      setBusy(null);
    }
  };

  const aiBusy = busy === 'ai';
  const chromaBusy = busy === 'chroma';
  const disabled = busy !== null || !image.dataUrl;

  return (
    <div className="space-y-4">
      <Label className="text-xs text-muted-foreground flex items-center gap-2">
        <Eraser className="size-3.5" />
        Remove Background
      </Label>

      <div className="rounded-xl border border-primary/25 bg-primary/[0.06] p-3 space-y-2.5">
        <div className="flex items-center gap-2">
          <Sparkles className="size-3.5 text-primary" />
          <span className="text-xs font-semibold">U2Net AI removal</span>
          <span className="ml-auto rounded-full bg-primary/15 px-1.5 py-0.5 text-[9px] font-medium tracking-wide text-primary">
            LOCAL
          </span>
        </div>
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          Detects the subject automatically and removes any background — photos, gradients, hair and
          complex edges. Runs entirely on your device.
        </p>

        {aiBusy && aiStage === 'model' && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
              <span>Loading AI model…</span>
              <span className="tabular-nums">{Math.round(aiProgress * 100)}%</span>
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-primary/15">
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-200"
                style={{ width: `${Math.max(4, aiProgress * 100)}%` }}
              />
            </div>
          </div>
        )}

        <button
          onClick={applyAi}
          disabled={disabled}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          {aiBusy ? <Loader2 className="size-3.5 animate-spin" /> : <Wand2 className="size-3.5" />}
          {aiBusy
            ? aiStage === 'model'
              ? 'Loading model…'
              : 'Removing background…'
            : 'Remove background with AI'}
        </button>
        <p className="text-[10px] leading-relaxed text-muted-foreground/70">
          One-time 4.6 MB model download · cached for offline use · no image is uploaded
        </p>
      </div>

      <div className="flex items-center gap-2">
        <div className="h-px flex-1 bg-border/60" />
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60">
          or remove a flat colour
        </span>
        <div className="h-px flex-1 bg-border/60" />
      </div>

      <p className="text-[11px] leading-relaxed text-muted-foreground">
        Chroma key removes one colour and makes it transparent. Works best on logos with a flat
        background. Undo with Ctrl+Z if needed.
      </p>

      <div className="flex items-center gap-2">
        <input
          type="color"
          value={isHexColor(keyColor) ? keyColor : '#ffffff'}
          onChange={(e) => setKeyColor(e.target.value)}
          className="size-9 rounded-lg border border-border/50 cursor-pointer shrink-0"
        />
        <input
          type="text"
          value={keyColor}
          onChange={(e) => setKeyColor(e.target.value)}
          className="h-9 min-w-0 flex-1 rounded-lg border border-border/50 bg-background px-2 text-xs outline-none focus:border-primary/50"
        />
        <button
          onClick={pickCorner}
          disabled={disabled}
          title="Sample the corner colour"
          className="flex size-9 items-center justify-center rounded-lg border border-border/50 text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all shrink-0 disabled:opacity-40"
        >
          <Pipette className="size-3.5" />
        </button>
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground">Tolerance</span>
          <span className="text-[11px] tabular-nums text-muted-foreground">{tolerance}%</span>
        </div>
        <input
          type="range"
          value={tolerance}
          min={0}
          max={60}
          onChange={(e) => setTolerance(Number(e.target.value))}
          className="w-full accent-primary h-1"
        />
      </div>

      <button
        onClick={applyChroma}
        disabled={disabled || !isHexColor(keyColor)}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-border/50 px-3 py-2 text-xs font-medium text-foreground hover:bg-muted/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        {chromaBusy ? <Loader2 className="size-3.5 animate-spin" /> : <Eraser className="size-3.5" />}
        {chromaBusy ? 'Removing…' : 'Remove colour'}
      </button>

      <div className="space-y-2">
        <button
          onClick={detectPalette}
          disabled={disabled}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-border/50 px-3 py-2 text-xs text-muted-foreground hover:bg-muted/50 transition-all disabled:opacity-40"
        >
          <Palette className="size-3.5" />
          Detect colours
        </button>
        {palette.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {palette.map((color) => (
              <button
                key={color}
                onClick={() => setKeyColor(color)}
                title={color}
                className={cn(
                  'size-7 rounded-md border transition-transform hover:scale-110',
                  keyColor.toLowerCase() === color.toLowerCase()
                    ? 'border-primary ring-1 ring-primary'
                    : 'border-border/50'
                )}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        )}
      </div>

      {error && <p className="text-[11px] text-destructive">{error}</p>}
    </div>
  );
}
