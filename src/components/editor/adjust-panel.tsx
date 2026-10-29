'use client';

import { SlidersHorizontal, RotateCcw } from 'lucide-react';
import { useEditorStore } from '@/store/useEditorStore';
import { Label } from '@/components/ui/label';
import type { ImageAdjustments } from '@/types';

const controls: {
  key: keyof ImageAdjustments;
  label: string;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
}[] = [
  { key: 'brightness', label: 'Brightness', min: 0, max: 200, suffix: '%' },
  { key: 'contrast', label: 'Contrast', min: 0, max: 200, suffix: '%' },
  { key: 'saturation', label: 'Saturation', min: 0, max: 200, suffix: '%' },
  { key: 'hue', label: 'Hue rotate', min: -180, max: 180, suffix: '°' },
  { key: 'blur', label: 'Blur', min: 0, max: 20, step: 0.5, suffix: 'px' },
  { key: 'grayscale', label: 'Grayscale', min: 0, max: 100, suffix: '%' },
  { key: 'opacity', label: 'Opacity', min: 0, max: 100, suffix: '%' },
];

export function AdjustPanel() {
  const adjustments = useEditorStore((s) => s.adjustments);
  const setAdjustments = useEditorStore((s) => s.setAdjustments);
  const resetAdjustments = useEditorStore((s) => s.resetAdjustments);

  return (
    <div className="space-y-4">
      <Label className="text-xs text-muted-foreground flex items-center gap-2">
        <SlidersHorizontal className="size-3.5" />
        Image Adjustments
      </Label>

      <div className="space-y-3">
        {controls.map((control) => (
          <div key={control.key} className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground">{control.label}</span>
              <span className="text-[11px] tabular-nums text-muted-foreground">
                {Math.round(adjustments[control.key] * 10) / 10}
                {control.suffix}
              </span>
            </div>
            <input
              type="range"
              value={adjustments[control.key]}
              min={control.min}
              max={control.max}
              step={control.step ?? 1}
              onChange={(e) => setAdjustments({ [control.key]: Number(e.target.value) })}
              className="w-full accent-primary h-1"
            />
          </div>
        ))}
      </div>

      <button
        onClick={resetAdjustments}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-border/50 px-3 py-2 text-xs text-muted-foreground hover:bg-muted/50 transition-all"
      >
        <RotateCcw className="size-3.5" />
        Reset adjustments
      </button>

      <p className="text-[10px] leading-relaxed text-muted-foreground/70">
        Adjustments are applied in the editor, previews and every exported size.
      </p>
    </div>
  );
}
