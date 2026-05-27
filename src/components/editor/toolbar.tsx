'use client';

import { MousePointer2, Crop, ZoomIn, RotateCw, Palette, Square, Grid3x3, Shapes, Expand } from 'lucide-react';
import { useEditorStore } from '@/store/useEditorStore';
import { cn } from '@/lib/utils';
import type { ActiveTool } from '@/types';

interface ToolDef {
  tool: ActiveTool;
  label: string;
}

const tools: ToolDef[] = [
  { tool: 'select', label: 'Move' },
  { tool: 'crop', label: 'Crop' },
  { tool: 'shape', label: 'Shape' },
  { tool: 'zoom', label: 'Zoom' },
  { tool: 'rotate', label: 'Rotate' },
  { tool: 'padding', label: 'Pad' },
  { tool: 'background', label: 'Fill' },
  { tool: 'grid', label: 'Grid' },
  { tool: 'safe-area', label: 'Safe' },
];

const toolIcons: Record<string, React.ReactNode> = {
  select: <MousePointer2 className="size-[18px]" />,
  crop: <Crop className="size-[18px]" />,
  shape: <Shapes className="size-[18px]" />,
  zoom: <ZoomIn className="size-[18px]" />,
  rotate: <RotateCw className="size-[18px]" />,
  padding: <Expand className="size-[18px]" />,
  background: <Palette className="size-[18px]" />,
  'safe-area': <Square className="size-[18px]" />,
  grid: <Grid3x3 className="size-[18px]" />,
};

export function Toolbar() {
  const activeTool = useEditorStore((s) => s.activeTool);
  const showGrid = useEditorStore((s) => s.showGrid);
  const safeArea = useEditorStore((s) => s.safeArea);
  const crop = useEditorStore((s) => s.crop);
  const image = useEditorStore((s) => s.image);

  if (!image.dataUrl) return null;

  const handleTool = (tool: ActiveTool) => {
    const s = useEditorStore.getState();

    const turnOffAll = () => {
      if (s.crop.enabled) s.setCrop({ enabled: false });
      if (s.safeArea.show) s.setSafeArea({ show: false });
    };

    if (tool === 'crop') {
      if (s.crop.enabled) {
        s.setCrop({ enabled: false });
        s.setActiveTool('select');
      } else {
        turnOffAll();
        s.setCrop({ enabled: true });
        s.setActiveTool('crop');
      }
      return;
    }

    if (tool === 'grid') {
      if (s.showGrid) {
        s.toggleGrid();
        s.setActiveTool('select');
      } else {
        turnOffAll();
        s.toggleGrid();
        s.setActiveTool('select');
      }
      return;
    }

    if (tool === 'safe-area') {
      if (s.safeArea.show) {
        s.setSafeArea({ show: false });
        s.setActiveTool('select');
      } else {
        turnOffAll();
        s.setSafeArea({ show: true });
        s.setActiveTool('select');
      }
      return;
    }

    turnOffAll();
    s.setActiveTool(tool);
  };

  const isActive = (tool: ActiveTool) => {
    if (tool === 'grid') return showGrid;
    if (tool === 'safe-area') return safeArea.show;
    if (tool === 'crop') return crop.enabled;
    return activeTool === tool;
  };

  return (
    <div className="flex flex-col items-center gap-px border-r border-border/50 bg-background/90 px-1 py-2 w-12 overflow-hidden shrink-0">
      {tools.map(({ tool, label }) => (
        <button
          key={tool}
          onClick={() => handleTool(tool)}
          title={label}
          className={cn(
            'relative flex items-center justify-center rounded-[7px] size-9 transition-all shrink-0',
            isActive(tool)
              ? 'bg-primary/15 text-primary shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          )}
        >
          {toolIcons[tool]}
        </button>
      ))}
    </div>
  );
}
