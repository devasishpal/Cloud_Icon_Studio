'use client';

import {
  MousePointer2,
  Hand,
  Crop,
  ZoomIn,
  RotateCw,
  Palette,
  Square,
  Grid3x3,
  Shapes,
  Expand,
  Eye,
  Sliders,
  SlidersHorizontal,
  Sparkles,
  Eraser,
} from 'lucide-react';
import { useEditorStore } from '@/store/useEditorStore';
import { cn } from '@/lib/utils';
import type { ActiveTool } from '@/types';

interface ToolDef {
  tool: ActiveTool;
  label: string;
}

const tools: ToolDef[] = [
  { tool: 'select', label: 'Move & Transform' },
  { tool: 'pan', label: 'Pan view' },
  { tool: 'crop', label: 'Crop' },
  { tool: 'zoom', label: 'Zoom' },
  { tool: 'rotate', label: 'Rotate' },
  { tool: 'padding', label: 'Padding' },
  { tool: 'shape', label: 'Shape' },
  { tool: 'background', label: 'Background' },
  { tool: 'adjust', label: 'Adjustments' },
  { tool: 'effects', label: 'Effects' },
  { tool: 'remove-bg', label: 'Remove background' },
  { tool: 'grid', label: 'Grid' },
  { tool: 'safe-area', label: 'Safe area' },
];

const toolIcons: Record<string, React.ReactNode> = {
  select: <MousePointer2 className="size-[18px] max-md:size-5" />,
  pan: <Hand className="size-[18px] max-md:size-5" />,
  crop: <Crop className="size-[18px] max-md:size-5" />,
  shape: <Shapes className="size-[18px] max-md:size-5" />,
  zoom: <ZoomIn className="size-[18px] max-md:size-5" />,
  rotate: <RotateCw className="size-[18px] max-md:size-5" />,
  padding: <Expand className="size-[18px] max-md:size-5" />,
  background: <Palette className="size-[18px] max-md:size-5" />,
  adjust: <SlidersHorizontal className="size-[18px] max-md:size-5" />,
  effects: <Sparkles className="size-[18px] max-md:size-5" />,
  'remove-bg': <Eraser className="size-[18px] max-md:size-5" />,
  'safe-area': <Square className="size-[18px] max-md:size-5" />,
  grid: <Grid3x3 className="size-[18px] max-md:size-5" />,
};

interface ToolbarProps {
  onMobilePreview?: () => void;
  onMobileTool?: () => void;
}

export function Toolbar({ onMobilePreview, onMobileTool }: ToolbarProps) {
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
      if (!s.showGrid) turnOffAll();
      s.toggleGrid();
      s.setActiveTool('grid');
      return;
    }

    if (tool === 'safe-area') {
      if (s.safeArea.show) {
        s.setSafeArea({ show: false });
      } else {
        turnOffAll();
        s.setSafeArea({ show: true });
      }
      s.setActiveTool('safe-area');
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

  const propertyTools: ActiveTool[] = [
    'select', 'shape', 'rotate', 'padding', 'background', 'adjust', 'effects', 'remove-bg',
    'grid', 'safe-area',
  ];
  const hasToolProperties = propertyTools.includes(activeTool);

  const groups: ActiveTool[][] = [
    ['select', 'pan'],
    ['crop', 'zoom', 'rotate', 'padding', 'shape'],
    ['background', 'adjust', 'effects', 'remove-bg'],
    ['grid', 'safe-area'],
  ];

  return (
    <div className="flex flex-col items-center border-r border-white/[0.08] bg-[#1a1b20] px-1.5 py-3 w-12 max-md:w-14 overflow-y-auto overflow-x-hidden shrink-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {groups.map((group, groupIndex) => (
        <div key={groupIndex} className="flex w-full flex-col items-center gap-0.5">
          {groupIndex > 0 && <div className="my-2 h-px w-6 shrink-0 bg-white/[0.08]" />}
          {group.map((tool) => {
            const meta = tools.find((item) => item.tool === tool)!;
            return (
              <button
                key={tool}
                onClick={() => handleTool(tool)}
                title={meta.label}
                aria-label={meta.label}
                className={cn(
                  'relative flex items-center justify-center rounded-[7px] size-9 max-md:size-10 transition-all shrink-0',
                  isActive(tool)
                    ? 'bg-primary/20 text-[#9bb7ff] shadow-[inset_0_0_0_1px_rgba(74,125,255,0.28)]'
                    : 'text-zinc-500 hover:text-zinc-100 hover:bg-white/[0.06]'
                )}
              >
                {toolIcons[tool]}
              </button>
            );
          })}
        </div>
      ))}
      <div className="my-2 h-px w-6 shrink-0 bg-white/[0.08]" />
      <button
        onClick={onMobilePreview}
        title="Preview"
        className="flex items-center justify-center rounded-[7px] size-9 max-md:size-10 text-zinc-500 hover:text-zinc-100 hover:bg-white/[0.06] transition-all shrink-0 md:hidden"
      >
        <Eye className="size-[18px] max-md:size-5" />
      </button>
      <button
        onClick={onMobileTool}
        title="Tool Properties"
        className={cn(
          'flex items-center justify-center rounded-[7px] size-9 max-md:size-10 transition-all shrink-0 md:hidden',
          hasToolProperties
            ? 'text-[#9bb7ff] bg-primary/20'
            : 'text-zinc-500 hover:text-zinc-100 hover:bg-white/[0.06]'
        )}
      >
        <Sliders className="size-[18px] max-md:size-5" />
      </button>
    </div>
  );
}
