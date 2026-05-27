'use client';

import { Expand } from 'lucide-react';
import { useEditorStore } from '@/store/useEditorStore';
import { Label } from '@/components/ui/label';
import { PADDING_MIN, PADDING_MAX } from '@/lib/constants';

export function PaddingControls() {
  const padding = useEditorStore((s) => s.padding);
  const setPadding = useEditorStore((s) => s.setPadding);

  return (
    <div className="space-y-3">
      <Label className="text-xs text-muted-foreground flex items-center gap-2">
        <Expand className="size-3.5" />
        Padding
      </Label>

      <div className="flex items-center gap-3">
        <input
          type="range"
          value={padding}
          onChange={(e) => setPadding(Number(e.target.value))}
          min={PADDING_MIN}
          max={PADDING_MAX}
          className="flex-1 accent-primary h-1"
        />
        <span className="min-w-10 text-right text-xs text-muted-foreground tabular-nums">
          {padding}%
        </span>
      </div>

      <div className="flex items-center gap-2">
        {[-20, -10, 0, 10, 20, 30, 40].map((val) => (
          <button
            key={val}
            onClick={() => setPadding(val)}
            className={`flex-1 rounded-md py-1 text-[11px] transition-all ${
              padding === val
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:text-foreground bg-muted/30'
            }`}
          >
            {val}%
          </button>
        ))}
      </div>
    </div>
  );
}
