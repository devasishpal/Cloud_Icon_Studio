'use client';

import { useRef } from 'react';
import { Frame } from 'lucide-react';
import { useEditorStore } from '@/store/useEditorStore';
import { FabricCanvas, type FabricCanvasHandle } from '@/components/editor/fabric-canvas';
import { ZoomControls } from '@/components/editor/zoom-controls';

export function ImageEditor() {
  const cropEnabled = useEditorStore((s) => s.crop.enabled);
  const zoom = useEditorStore((s) => s.zoom);
  const iconShape = useEditorStore((s) => s.previewPreferences.iconShape);
  const canvasRef = useRef<FabricCanvasHandle>(null);

  return (
    <div className="flex flex-1 relative overflow-hidden">
      <div className="flex min-w-0 flex-1 relative flex-col">
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-white/[0.08] bg-[#25262b] px-4">
          <div className="flex items-center gap-2.5">
            <span className="flex size-5 items-center justify-center rounded-[5px] border border-white/10 bg-white/[0.04]">
              <Frame className="size-3 text-zinc-400" />
            </span>
            <span className="text-[11px] font-semibold tracking-wide text-zinc-200">
              Artboard
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.03] px-1.5 py-0.5 text-[9px] tabular-nums text-zinc-500">
              512 × 512
            </span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-zinc-500">
            <span className="tabular-nums">{Math.round(zoom)}%</span>
            <span className="h-3 w-px bg-white/10" />
            <span className="capitalize">{iconShape.replace('-', ' ')}</span>
          </div>
        </div>

        <div className="relative flex-1 min-h-0">
          <FabricCanvas ref={canvasRef} />
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
        <ZoomControls />
        {cropEnabled && (
          <>
            <button
              onClick={() => canvasRef.current?.applyCrop()}
              className="rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground shadow-lg hover:bg-primary/90 transition-all"
            >
              Apply Crop (Enter)
            </button>
            <button
              onClick={() => {
                const s = useEditorStore.getState();
                s.setCrop({ enabled: false });
                s.setActiveTool('select');
              }}
              className="rounded-lg border border-white/10 bg-[#1b1c21]/90 px-3 py-2 text-xs font-medium text-zinc-400 shadow-lg hover:text-zinc-100 transition-all"
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
}
