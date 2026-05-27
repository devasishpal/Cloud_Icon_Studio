'use client';

import { useEditorStore } from '@/store/useEditorStore';

export function StatusBar() {
  const zoom = useEditorStore((s) => s.zoom);
  const canvasWidth = useEditorStore((s) => s.canvasWidth);
  const canvasHeight = useEditorStore((s) => s.canvasHeight);
  const image = useEditorStore((s) => s.image);

  return (
    <div className="hidden lg:flex h-7 items-center justify-between border-t border-border/30 bg-muted/10 px-4 text-[10px] text-muted-foreground/60">
      <div className="flex items-center gap-4">
        {image.dataUrl && (
          <>
            <span>{image.width}x{image.height}px</span>
            <span className="w-px h-3 bg-border/30" />
          </>
        )}
        <span>Zoom: {zoom}%</span>
        <span className="w-px h-3 bg-border/30" />
        <span>Canvas: {canvasWidth}x{canvasHeight}</span>
      </div>
      <div className="flex items-center gap-4">
        <span>100% client-side</span>
      </div>
    </div>
  );
}
