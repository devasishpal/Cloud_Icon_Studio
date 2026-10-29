'use client';

import { motion } from 'framer-motion';
import { ZoomIn, ZoomOut } from 'lucide-react';
import { useEditorStore } from '@/store/useEditorStore';
import { ZOOM_MIN, ZOOM_MAX, ZOOM_STEP } from '@/lib/constants';

export function ZoomControls() {
  const zoom = useEditorStore((s) => s.zoom);
  const setZoom = useEditorStore((s) => s.setZoom);
  const resetView = useEditorStore((s) => s.resetView);

  const zoomIn = () => setZoom(Math.min(ZOOM_MAX, zoom + ZOOM_STEP));
  const zoomOut = () => setZoom(Math.max(ZOOM_MIN, zoom - ZOOM_STEP));
  const zoomToFit = () => resetView();

  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#1b1c21]/90 px-3 py-2 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.8)] backdrop-blur-xl"
    >
      <button
        onClick={zoomOut}
        className="flex items-center justify-center rounded-lg p-1.5 text-zinc-500 hover:text-zinc-100 hover:bg-white/[0.06] transition-all"
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
        className="flex items-center justify-center rounded-lg p-1.5 text-zinc-500 hover:text-zinc-100 hover:bg-white/[0.06] transition-all"
        title="Zoom in"
      >
        <ZoomIn className="size-4" />
      </button>

      <div className="h-4 w-px bg-white/10" />

      <button
        onClick={zoomToFit}
        className="min-w-[48px] text-center text-xs font-medium text-zinc-400 hover:text-zinc-100 transition-colors tabular-nums"
        title="Reset zoom"
      >
        {zoom}%
      </button>
    </motion.div>
  );
}
