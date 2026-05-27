'use client';

import { useEditorStore } from '@/store/useEditorStore';
import { Separator } from '@/components/ui/separator';
import { Sliders } from 'lucide-react';
import { ZoomControls } from '@/components/editor/zoom-controls';
import { RotationControls } from '@/components/editor/rotation-controls';
import { BackgroundPanel } from '@/components/editor/background-panel';
import { PaddingControls } from '@/components/editor/padding-controls';
import { CropOverlay } from '@/components/editor/crop-overlay';
import { SafeAreaOverlay } from '@/components/editor/safe-area-overlay';
import { PreviewPanel } from '@/components/editor/preview-panel';
import { ScrollArea } from '@/components/ui/scroll-area';

export function SettingsPanel() {
  const image = useEditorStore((s) => s.image);
  const activeTab = useEditorStore((s) => s.activeTab);

  if (!image.dataUrl) return null;
  if (activeTab === 'upload') return null;

  return (
    <div className="w-72 border-l border-border/50 bg-background/50 hidden xl:block">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50">
        <Sliders className="size-4 text-muted-foreground" />
        <span className="text-sm font-medium">Properties</span>
      </div>
      <ScrollArea className="h-[calc(100vh-8rem)]">
        <div className="space-y-5 p-4">
          <ZoomControls />
          <Separator />
          <RotationControls />
          <Separator />
          <BackgroundPanel />
          <Separator />
          <PaddingControls />
          <Separator />
          <CropOverlay />
          <Separator />
          <SafeAreaOverlay />
          <Separator />
          <PreviewPanel />
          <Separator />
          <div className="pb-4">
            <p className="text-xs text-muted-foreground">
              {image.width} × {image.height}px &middot; {image.file?.name}
            </p>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
