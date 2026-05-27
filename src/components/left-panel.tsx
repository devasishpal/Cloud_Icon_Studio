'use client';

import { useEditorStore } from '@/store/useEditorStore';
import { Sliders, Shapes, RotateCcw, Palette, Expand, Crop, Smartphone } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RotationControls } from '@/components/editor/rotation-controls';
import { BackgroundPanel } from '@/components/editor/background-panel';
import { PaddingControls } from '@/components/editor/padding-controls';
import { CropOverlay } from '@/components/editor/crop-overlay';
import { SafeAreaOverlay } from '@/components/editor/safe-area-overlay';
import { ICON_SHAPES } from '@/lib/constants';
import { cn } from '@/lib/utils';

function ToolGroup({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="border-b border-border/30 last:border-b-0">
      <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/10">
        <Icon className="size-3 text-muted-foreground/60" />
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">{title}</span>
      </div>
      <div className="px-4 py-3 space-y-3">
        {children}
      </div>
    </div>
  );
}

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
            'rounded-lg px-2 py-1.5 text-xs transition-all text-center',
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

export function LeftPanel() {
  const image = useEditorStore((s) => s.image);

  if (!image.dataUrl) return null;

  return (
    <div className="border-r border-border/40 bg-background/95 hidden md:flex md:w-60 lg:w-72 flex-col overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border/30 bg-muted/5 shrink-0">
        <Sliders className="size-3 text-muted-foreground/60" />
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">Properties</span>
      </div>
      <ScrollArea className="flex-1 min-h-0">
        <ToolGroup title="Rotate" icon={RotateCcw}>
          <RotationControls />
        </ToolGroup>
        <ToolGroup title="Background" icon={Palette}>
          <BackgroundPanel />
        </ToolGroup>
        <ToolGroup title="Padding" icon={Expand}>
          <PaddingControls />
        </ToolGroup>
        <ToolGroup title="Shape" icon={Shapes}>
          <ShapePanel />
        </ToolGroup>
        <ToolGroup title="Crop" icon={Crop}>
          <CropOverlay />
        </ToolGroup>
        <ToolGroup title="Safe Area" icon={Smartphone}>
          <SafeAreaOverlay />
        </ToolGroup>
      </ScrollArea>
    </div>
  );
}
