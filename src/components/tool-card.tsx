'use client';

import { useEditorStore } from '@/store/useEditorStore';
import {
  MousePointer2,
  Hand,
  Crop,
  Shapes,
  ZoomIn,
  RotateCw,
  Expand,
  Palette,
  Grid3x3,
  Square,
  SlidersHorizontal,
  Sparkles,
  Eraser,
} from 'lucide-react';
import { RotationControls } from '@/components/editor/rotation-controls';
import { BackgroundPanel } from '@/components/editor/background-panel';
import { CropOverlay } from '@/components/editor/crop-overlay';
import { SafeAreaOverlay } from '@/components/editor/safe-area-overlay';
import { PaddingControls } from '@/components/editor/padding-controls';
import { TransformPanel } from '@/components/editor/transform-panel';
import { AdjustPanel } from '@/components/editor/adjust-panel';
import { EffectsPanel } from '@/components/editor/effects-panel';
import { RemoveBgPanel } from '@/components/editor/remove-bg-panel';
import { ICON_SHAPES } from '@/lib/constants';
import { cn } from '@/lib/utils';

const toolMeta: Record<string, { label: string; icon: React.ElementType }> = {
  select: { label: 'Transform', icon: MousePointer2 },
  pan: { label: 'Pan', icon: Hand },
  crop: { label: 'Crop', icon: Crop },
  shape: { label: 'Shape', icon: Shapes },
  zoom: { label: 'Zoom', icon: ZoomIn },
  rotate: { label: 'Rotate', icon: RotateCw },
  padding: { label: 'Padding', icon: Expand },
  background: { label: 'Background', icon: Palette },
  adjust: { label: 'Adjustments', icon: SlidersHorizontal },
  effects: { label: 'Effects', icon: Sparkles },
  'remove-bg': { label: 'Remove Background', icon: Eraser },
  grid: { label: 'Grid', icon: Grid3x3 },
  'safe-area': { label: 'Safe Area', icon: Square },
};

function ShapePanel() {
  const iconShape = useEditorStore((s) => s.previewPreferences.iconShape);
  const setIconShape = useEditorStore((s) => s.setIconShape);
  return (
    <div className="space-y-3">
      <p className="text-[11px] leading-relaxed text-muted-foreground">
        The mask is applied to the background, artwork and every exported icon.
      </p>
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
    </div>
  );
}

function GridPanel() {
  const showGrid = useEditorStore((s) => s.showGrid);
  const toggleGrid = useEditorStore((s) => s.toggleGrid);
  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground">Overlay an alignment grid on the canvas</p>
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
  const resetView = useEditorStore((s) => s.resetView);
  return (
    <div className="space-y-3">
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
      <button
        onClick={resetView}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-border/50 px-3 py-2 text-xs text-muted-foreground hover:bg-muted/50 transition-all"
      >
        Reset view
      </button>
    </div>
  );
}

function PanPanel() {
  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground leading-relaxed">
        Drag anywhere on the canvas to pan. Hold Alt or the middle mouse button to pan with any tool.
        Ctrl + scroll zooms around the cursor.
      </p>
    </div>
  );
}

const toolContent: Record<string, React.ReactNode> = {
  select: <TransformPanel />,
  pan: <PanPanel />,
  crop: <CropOverlay />,
  shape: <ShapePanel />,
  zoom: <ZoomSlider />,
  rotate: <RotationControls />,
  padding: <PaddingControls />,
  background: <BackgroundPanel />,
  adjust: <AdjustPanel />,
  effects: <EffectsPanel />,
  'remove-bg': <RemoveBgPanel />,
  grid: <GridPanel />,
  'safe-area': <SafeAreaOverlay />,
};

interface ToolCardProps {
  className?: string;
}

export function ToolCard({ className }: ToolCardProps) {
  const activeTool = useEditorStore((s) => s.activeTool);
  const image = useEditorStore((s) => s.image);

  if (!image.dataUrl) return null;

  const meta = toolMeta[activeTool];
  const Icon = meta?.icon;
  const content = toolContent[activeTool];

  return (
    <div className={className ?? 'w-64 border-r border-white/[0.08] bg-[#202127] flex-shrink-0 flex flex-col overflow-hidden'}>
      <div className="flex h-14 shrink-0 items-center gap-2.5 border-b border-white/[0.07] bg-[#24252b] px-4">
        {Icon && (
          <span className="flex size-6 items-center justify-center rounded-md border border-primary/20 bg-primary/10">
            <Icon className="size-3.5 text-[#8fb0ff]" />
          </span>
        )}
        <div className="min-w-0">
          <span className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-200">
            {meta?.label ?? 'Tool'}
          </span>
          <span className="block text-[9px] uppercase tracking-[0.12em] text-zinc-500">
            Properties
          </span>
        </div>
      </div>
      <div className="flex-1 px-4 py-4 overflow-y-auto min-h-0 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.14)_transparent]">
        {content}
      </div>
    </div>
  );
}
