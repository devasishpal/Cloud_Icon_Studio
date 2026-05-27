'use client';

import { MousePointer2, Crop, RotateCw, Palette, Expand, Download } from 'lucide-react';
import { useEditorStore } from '@/store/useEditorStore';
import { cn } from '@/lib/utils';

const tools = [
  { id: 'select', icon: MousePointer2, label: 'Select' },
  { id: 'crop', icon: Crop, label: 'Crop' },
  { id: 'rotate', icon: RotateCw, label: 'Rotate' },
  { id: 'background', icon: Palette, label: 'BG' },
  { id: 'padding', icon: Expand, label: 'Padding' },
] as const;

export function MobileBottomBar() {
  const activeTool = useEditorStore((s) => s.activeTool);
  const setActiveTool = useEditorStore((s) => s.setActiveTool);
  const setExportModalOpen = useEditorStore((s) => s.setExportModalOpen);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      <div className="border-t border-border/50 bg-background/80 backdrop-blur-xl px-2 py-1.5">
        <div className="flex items-center justify-around">
          {tools.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveTool(id as any)}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors',
                activeTool === id ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className="size-4" />
              <span className="text-[9px] font-medium">{label}</span>
            </button>
          ))}
          <button
            onClick={() => setExportModalOpen(true)}
            className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-primary bg-primary/10"
          >
            <Download className="size-4" />
            <span className="text-[9px] font-medium">Export</span>
          </button>
        </div>
      </div>
    </div>
  );
}
