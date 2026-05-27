'use client';

import { RotateCcw, RotateCw, Undo2 } from 'lucide-react';
import { useEditorStore } from '@/store/useEditorStore';
import { Label } from '@/components/ui/label';

export function RotationControls() {
  const rotation = useEditorStore((s) => s.rotation);
  const setRotation = useEditorStore((s) => s.setRotation);

  return (
    <div className="space-y-3">
      <Label className="text-xs text-muted-foreground flex items-center gap-2">
        <RotateCcw className="size-3.5" />
        Rotation
      </Label>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setRotation(rotation - 90)}
          className="flex items-center justify-center rounded-lg border border-border/50 p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
          title="Rotate left 90°"
        >
          <RotateCcw className="size-4" />
        </button>

        <input
          type="range"
          value={rotation}
          onChange={(e) => setRotation(Number(e.target.value))}
          min={-360}
          max={360}
          className="flex-1 accent-primary h-1"
        />

        <button
          onClick={() => setRotation(rotation + 90)}
          className="flex items-center justify-center rounded-lg border border-border/50 p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
          title="Rotate right 90°"
        >
          <RotateCw className="size-4" />
        </button>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground tabular-nums">{rotation}°</span>
        <button
          onClick={() => setRotation(0)}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <Undo2 className="size-3" />
          Reset
        </button>
      </div>
    </div>
  );
}
