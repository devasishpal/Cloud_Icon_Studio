'use client';

import { useEditorStore } from '@/store/useEditorStore';

export function StatusBar() {
  const zoom = useEditorStore((s) => s.zoom);
  const canvasWidth = useEditorStore((s) => s.canvasWidth);
  const canvasHeight = useEditorStore((s) => s.canvasHeight);
  const image = useEditorStore((s) => s.image);

  return (
    <div className="hidden lg:flex h-7 items-center justify-between border-t border-white/[0.08] bg-[#17181c] px-4 text-[10px] text-zinc-500">
      <div className="flex items-center gap-4">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-emerald-400" />
          Ready
        </span>
        <span className="h-3 w-px bg-white/10" />
        {image.dataUrl && (
          <>
            <span className="tabular-nums">{image.width} × {image.height}px</span>
            <span className="h-3 w-px bg-white/10" />
          </>
        )}
        <span className="tabular-nums">Zoom {zoom}%</span>
        <span className="h-3 w-px bg-white/10" />
        <span className="tabular-nums">Canvas {canvasWidth} × {canvasHeight}</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="uppercase tracking-[0.14em]">Local workspace</span>
        <span className="h-3 w-px bg-white/10" />
        <span>100% client-side</span>
      </div>
    </div>
  );
}
