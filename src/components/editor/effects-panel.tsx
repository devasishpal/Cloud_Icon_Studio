'use client';

import { Sparkles, RotateCcw, FlipHorizontal2, FlipVertical2 } from 'lucide-react';
import { useEditorStore } from '@/store/useEditorStore';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export function EffectsPanel() {
  const effects = useEditorStore((s) => s.effects);
  const setEffects = useEditorStore((s) => s.setEffects);
  const resetEffects = useEditorStore((s) => s.resetEffects);

  return (
    <div className="space-y-4">
      <Label className="text-xs text-muted-foreground flex items-center gap-2">
        <Sparkles className="size-3.5" />
        Effects
      </Label>

      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground">Drop shadow</span>
          <span className="text-[11px] tabular-nums text-muted-foreground">{effects.shadow}%</span>
        </div>
        <input
          type="range"
          value={effects.shadow}
          min={0}
          max={40}
          onChange={(e) => setEffects({ shadow: Number(e.target.value) })}
          className="w-full accent-primary h-1"
        />
      </div>

      {effects.shadow > 0 && (
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={effects.shadowColor}
            onChange={(e) => setEffects({ shadowColor: e.target.value })}
            className="size-8 rounded-lg border border-border/50 cursor-pointer shrink-0"
          />
          <span className="text-[11px] text-muted-foreground">Shadow colour</span>
        </div>
      )}

      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground">Border width</span>
          <span className="text-[11px] tabular-nums text-muted-foreground">{effects.borderWidth}%</span>
        </div>
        <input
          type="range"
          value={effects.borderWidth}
          min={0}
          max={10}
          step={0.5}
          onChange={(e) => setEffects({ borderWidth: Number(e.target.value) })}
          className="w-full accent-primary h-1"
        />
      </div>

      {effects.borderWidth > 0 && (
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={effects.borderColor}
            onChange={(e) => setEffects({ borderColor: e.target.value })}
            className="size-8 rounded-lg border border-border/50 cursor-pointer shrink-0"
          />
          <span className="text-[11px] text-muted-foreground">Border colour</span>
        </div>
      )}

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
        onClick={resetEffects}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-border/50 px-3 py-2 text-xs text-muted-foreground hover:bg-muted/50 transition-all"
      >
        <RotateCcw className="size-3.5" />
        Reset effects
      </button>
    </div>
  );
}
