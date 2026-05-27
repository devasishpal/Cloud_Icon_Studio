'use client';

import { motion } from 'framer-motion';
import { ZoomIn, ZoomOut } from 'lucide-react';
import { useEditorStore } from '@/store/useEditorStore';
import { ZOOM_MIN, ZOOM_MAX, ZOOM_STEP } from '@/lib/constants';

export function ZoomControls() {
  const zoom = useEditorStore((s) => s.zoom);
  const setZoom = useEditorStore((s) => s.setZoom);

  const zoomIn = () => setZoom(Math.min(ZOOM_MAX, zoom + ZOOM_STEP));
  const zoomOut = () => setZoom(Math.max(ZOOM_MIN, zoom - ZOOM_STEP));
  const zoomToFit = () => setZoom(100);

  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="flex items-center gap-2 rounded-2xl border border-border/50 bg-card/80 backdrop-blur-xl px-3 py-2 shadow-lg"
    >
      <button
        onClick={zoomOut}
        className="flex items-center justify-center rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
        title="Zoom out"
      >
        <ZoomOut className="size-4" />
      </button>

      <input
        type="range"
        value={zoom}
        onChange={(e) => setZoom(Number(e.target.value))}
        min={ZOOM_MIN}
        max={ZOOM_MAX}
        className="w-20 accent-primary h-1 cursor-pointer"
      />

      <button
        onClick={zoomIn}
        className="flex items-center justify-center rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
        title="Zoom in"
      >
        <ZoomIn className="size-4" />
      </button>

      <div className="h-4 w-px bg-border/50" />

      <button
        onClick={zoomToFit}
        className="min-w-[48px] text-center text-xs font-medium text-muted-foreground hover:text-foreground transition-colors tabular-nums"
        title="Reset zoom"
      >
        {zoom}%
      </button>
    </motion.div>
  );
}
