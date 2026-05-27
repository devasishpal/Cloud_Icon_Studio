'use client';

import { useEditorStore } from '@/store/useEditorStore';
import { MousePointer2, Crop, Shapes, ZoomIn, RotateCw, Expand, Palette, Grid3x3, Square } from 'lucide-react';
import { RotationControls } from '@/components/editor/rotation-controls';
import { BackgroundPanel } from '@/components/editor/background-panel';
import { CropOverlay } from '@/components/editor/crop-overlay';
import { SafeAreaOverlay } from '@/components/editor/safe-area-overlay';
import { PaddingControls } from '@/components/editor/padding-controls';
import { ICON_SHAPES } from '@/lib/constants';
import { cn } from '@/lib/utils';

const toolMeta: Record<string, { label: string; icon: React.ElementType }> = {
  select: { label: 'Move', icon: MousePointer2 },
  crop: { label: 'Crop', icon: Crop },
  shape: { label: 'Shape', icon: Shapes },
  zoom: { label: 'Zoom', icon: ZoomIn },
  rotate: { label: 'Rotate', icon: RotateCw },
  padding: { label: 'Padding', icon: Expand },
  background: { label: 'Fill', icon: Palette },
  grid: { label: 'Grid', icon: Grid3x3 },
  'safe-area': { label: 'Safe Area', icon: Square },
};

function ShapePanel() {
  const iconShape = useEditorStore((s) => s.previewPreferences.iconShape);
  const setIconShape = useEditorStore((s) => s.setIconShape);
  return (
    <div className="grid grid-cols-2 gap-1.5">
      {ICON_SHAPES.map(({ label, value }) => (
        <button
          key={value}
          onClick={() => setIconShape(value)}
          className={cn(
            'rounded-lg px-2 py-2 text-xs transition-all text-center',
            iconShape === value
              ? 'bg-primary/10 text-primary border border-primary/20'
              : 'bg-muted/30 text-muted-foreground border border-border/50 hover:bg-muted/50'
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function GridPanel() {
  const showGrid = useEditorStore((s) => s.showGrid);
  const toggleGrid = useEditorStore((s) => s.toggleGrid);
  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground">Overlay a alignment grid on the canvas</p>
      <button
        onClick={toggleGrid}
        className={cn(
          'flex w-full items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs transition-all',
          showGrid
            ? 'border-primary/20 bg-primary/5 text-primary'
            : 'border-border/50 text-muted-foreground hover:bg-muted/30'
        )}
      >
        <Grid3x3 className="size-3.5" />
        {showGrid ? 'Visible' : 'Hidden'}
      </button>
    </div>
  );
}

function ZoomSlider() {
  const zoom = useEditorStore((s) => s.zoom);
  const setZoom = useEditorStore((s) => s.setZoom);
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-muted-foreground">Zoom Level</span>
        <span className="text-xs tabular-nums text-muted-foreground">{zoom}%</span>
      </div>
      <input
        type="range"
        value={zoom}
        onChange={(e) => setZoom(Number(e.target.value))}
        min={10}
        max={500}
        className="w-full accent-primary h-1"
      />
    </div>
  );
}

const toolContent: Record<string, React.ReactNode> = {
  select: (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">Select and drag the icon on the canvas to reposition it.</p>
    </div>
  ),
  crop: <CropOverlay />,
  shape: <ShapePanel />,
  zoom: (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">Use the slider or Ctrl+Scroll to zoom</p>
      <ZoomSlider />
    </div>
  ),
  rotate: <RotationControls />,
  padding: <PaddingControls />,
  background: <BackgroundPanel />,
  grid: <GridPanel />,
  'safe-area': <SafeAreaOverlay />,
};

export function ToolCard() {
  const activeTool = useEditorStore((s) => s.activeTool);
  const image = useEditorStore((s) => s.image);

  if (!image.dataUrl) return null;

  const meta = toolMeta[activeTool];
  const Icon = meta?.icon;
  const content = toolContent[activeTool];

  return (
    <div className="w-56 border-r border-border/40 bg-background/95 flex-shrink-0 flex flex-col overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border/30 bg-muted/5 shrink-0">
        {Icon && <Icon className="size-3.5 text-muted-foreground/60" />}
        <span className="text-xs font-medium text-muted-foreground">{meta?.label}</span>
      </div>
      <div className="flex-1 px-4 py-3 overflow-y-auto min-h-0">
        {content}
      </div>
    </div>
  );
}
