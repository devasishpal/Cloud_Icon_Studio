'use client';

import { Move, RotateCcw, FlipHorizontal2, FlipVertical2 } from 'lucide-react';
import { useEditorStore } from '@/store/useEditorStore';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { ImageFit } from '@/types';

const fits: { value: ImageFit; label: string }[] = [
  { value: 'contain', label: 'Contain' },
  { value: 'cover', label: 'Cover' },
  { value: 'stretch', label: 'Stretch' },
];

function Row({
  label,
  value,
  min,
  max,
  step = 1,
  suffix = '',
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  onChange: (value: number) => void;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-muted-foreground">{label}</span>
        <span className="text-[11px] tabular-nums text-muted-foreground">
          {Math.round(value)}{suffix}
        </span>
      </div>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-primary h-1"
      />
    </div>
  );
}

export function TransformPanel() {
  const transform = useEditorStore((s) => s.transform);
  const fit = useEditorStore((s) => s.fit);
  const effects = useEditorStore((s) => s.effects);
  const setTransform = useEditorStore((s) => s.setTransform);
  const setFit = useEditorStore((s) => s.setFit);
  const setEffects = useEditorStore((s) => s.setEffects);
  const resetTransform = useEditorStore((s) => s.resetTransform);

  return (
    <div className="space-y-4">
      <Label className="text-xs text-muted-foreground flex items-center gap-2">
        <Move className="size-3.5" />
        Artwork
      </Label>

      <p className="text-[11px] text-muted-foreground leading-relaxed">
        Drag the icon to reposition. Use the corner handle to scale and the top handle to rotate.
        Double-click the canvas to reset.
      </p>

      <div>
        <p className="mb-1.5 text-[11px] text-muted-foreground">Fit mode</p>
        <div className="flex gap-1.5">
          {fits.map((item) => (
            <button
              key={item.value}
              onClick={() => setFit(item.value)}
              className={cn(
                'flex-1 rounded-lg border px-2 py-1.5 text-[11px] transition-all',
                fit === item.value
                  ? 'border-primary/30 bg-primary/10 text-primary'
                  : 'border-border/50 text-muted-foreground hover:bg-muted/50'
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <Row
        label="Scale"
        value={transform.scale * 100}
        min={10}
        max={400}
        suffix="%"
        onChange={(v) => setTransform({ scale: v / 100 })}
      />
      <Row
        label="Horizontal position"
        value={transform.offsetX * 100}
        min={-100}
        max={100}
        suffix="%"
        onChange={(v) => setTransform({ offsetX: v / 100 })}
      />
      <Row
        label="Vertical position"
        value={transform.offsetY * 100}
        min={-100}
        max={100}
        suffix="%"
        onChange={(v) => setTransform({ offsetY: v / 100 })}
      />

      <div className="flex gap-1.5">
        <button
          onClick={() => setEffects({ flipX: !effects.flipX })}
          className={cn(
            'flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-2 py-1.5 text-[11px] transition-all',
            effects.flipX
              ? 'border-primary/30 bg-primary/10 text-primary'
              : 'border-border/50 text-muted-foreground hover:bg-muted/50'
          )}
        >
          <FlipHorizontal2 className="size-3.5" />
          Flip H
        </button>
        <button
          onClick={() => setEffects({ flipY: !effects.flipY })}
          className={cn(
            'flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-2 py-1.5 text-[11px] transition-all',
            effects.flipY
              ? 'border-primary/30 bg-primary/10 text-primary'
              : 'border-border/50 text-muted-foreground hover:bg-muted/50'
          )}
        >
          <FlipVertical2 className="size-3.5" />
          Flip V
        </button>
      </div>

      <button
        onClick={resetTransform}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-border/50 px-3 py-2 text-xs text-muted-foreground hover:bg-muted/50 transition-all"
      >
        <RotateCcw className="size-3.5" />
        Reset position &amp; scale
      </button>
    </div>
  );
}
