'use client';

import { motion } from 'framer-motion';
import {
  MousePointer2, Crop, ZoomIn, RotateCw, Palette, Square, Grid3x3,
  RotateCcw, Redo2,
} from 'lucide-react';
import { useEditorStore } from '@/store/useEditorStore';
import { cn } from '@/lib/utils';
import type { ActiveTool } from '@/types';

const tools: { tool: ActiveTool; icon: React.ReactNode; label: string }[] = [
  { tool: 'select', icon: <MousePointer2 className="size-4" />, label: 'Move' },
  { tool: 'crop', icon: <Crop className="size-4" />, label: 'Crop' },
  { tool: 'zoom', icon: <ZoomIn className="size-4" />, label: 'Zoom' },
  { tool: 'rotate', icon: <RotateCw className="size-4" />, label: 'Rotate' },
  { tool: 'background', icon: <Palette className="size-4" />, label: 'Background' },
  { tool: 'safe-area', icon: <Square className="size-4" />, label: 'Safe Area' },
  { tool: 'grid', icon: <Grid3x3 className="size-4" />, label: 'Grid' },
];

export function ToolBar() {
  const activeTool = useEditorStore((s) => s.activeTool);
  const setActiveTool = useEditorStore((s) => s.setActiveTool);
  const showGrid = useEditorStore((s) => s.showGrid);
  const toggleGrid = useEditorStore((s) => s.toggleGrid);
  const safeArea = useEditorStore((s) => s.safeArea);
  const setSafeArea = useEditorStore((s) => s.setSafeArea);

  const handleClick = (tool: ActiveTool) => {
    if (tool === 'grid') { toggleGrid(); return; }
    if (tool === 'safe-area') { setSafeArea({ show: !safeArea.show }); return; }
    setActiveTool(tool);
  };

  const isActive = (tool: ActiveTool) =>
    tool === 'grid' ? showGrid
    : tool === 'safe-area' ? safeArea.show
    : activeTool === tool;

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col gap-0.5 rounded-xl border border-border/50 bg-card/80 backdrop-blur-xl p-1 shadow-lg"
    >
      {tools.map(({ tool, icon, label }) => (
        <motion.button
          key={tool}
          onClick={() => handleClick(tool)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title={label}
          className={cn(
            'relative flex items-center justify-center rounded-lg p-2 transition-all',
            isActive(tool)
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          )}
        >
          {icon}
        </motion.button>
      ))}
      <div className="my-0.5 h-px bg-border/50" />
      <motion.button
        onClick={() => useEditorStore.getState().setRotation(0)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="Reset rotation"
        className="flex items-center justify-center rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
      >
        <RotateCcw className="size-4" />
      </motion.button>
      <motion.button
        onClick={() => useEditorStore.getState().setZoom(100)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="Reset view"
        className="flex items-center justify-center rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
      >
        <Redo2 className="size-4" />
      </motion.button>
    </motion.div>
  );
}
