'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEditorStore } from '@/store/useEditorStore';
import { PreviewTabs } from '@/components/previews/preview-tabs';
import { AndroidPreview } from '@/components/previews/android-preview';
import { IOSPreview } from '@/components/previews/ios-preview';
import { WebPreview } from '@/components/previews/web-preview';
import { DesktopPreview } from '@/components/previews/desktop-preview';
import { PreviewSettingsPanel } from '@/components/previews/preview-settings-panel';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Wand2 } from 'lucide-react';

export function PreviewEngine() {
  const image = useEditorStore((s) => s.image);
  const previewTab = useEditorStore((s) => s.previewTab);

  if (!image.dataUrl) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-muted/50">
            <Wand2 className="size-7 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">Upload an image to see previews</p>
        </div>
      </div>
    );
  }

  const renderPreview = () => {
    switch (previewTab) {
      case 'android':
        return <AndroidPreview />;
      case 'ios':
        return <IOSPreview />;
      case 'web':
        return <WebPreview />;
      case 'desktop':
        return <DesktopPreview />;
      case 'all':
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-medium mb-4 text-muted-foreground">Android</h3>
              <AndroidPreview />
            </div>
            <div className="border-t border-border/50 pt-8">
              <h3 className="text-sm font-medium mb-4 text-muted-foreground">iOS</h3>
              <IOSPreview />
            </div>
            <div className="border-t border-border/50 pt-8">
              <h3 className="text-sm font-medium mb-4 text-muted-foreground">Web</h3>
              <WebPreview />
            </div>
            <div className="border-t border-border/50 pt-8">
              <h3 className="text-sm font-medium mb-4 text-muted-foreground">Desktop</h3>
              <DesktopPreview />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center justify-center px-4 py-3 border-b border-border/50">
        <PreviewTabs />
      </div>
      <div className="flex flex-1">
        <ScrollArea className="flex-1">
          <div className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={previewTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {renderPreview()}
              </motion.div>
            </AnimatePresence>
          </div>
        </ScrollArea>
        <div className="w-56 border-l border-border/50 bg-background/50 hidden xl:block">
          <PreviewSettingsPanel />
        </div>
      </div>
    </div>
  );
}
