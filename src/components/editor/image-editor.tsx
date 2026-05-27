'use client';

import { useRef } from 'react';
import { useEditorStore } from '@/store/useEditorStore';
import { FabricCanvas, type FabricCanvasHandle } from '@/components/editor/fabric-canvas';
import { ZoomControls } from '@/components/editor/zoom-controls';

export function ImageEditor() {
  const image = useEditorStore((s) => s.image);
  const cropEnabled = useEditorStore((s) => s.crop.enabled);
  const canvasRef = useRef<FabricCanvasHandle>(null);

  if (!image.dataUrl) return null;

  return (
    <div className="flex flex-1 relative overflow-hidden">
      <div className="flex-1 relative">
        <FabricCanvas ref={canvasRef} />
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
        <ZoomControls />
        {cropEnabled && (
          <button
            onClick={() => canvasRef.current?.applyCrop()}
            className="rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground shadow-lg hover:bg-primary/90 transition-all"
          >
            Apply Crop (Enter)
          </button>
        )}
      </div>
    </div>
  );
}
