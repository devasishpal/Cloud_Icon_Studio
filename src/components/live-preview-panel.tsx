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
import { Eye } from 'lucide-react';

export function LivePreviewPanel() {
  const image = useEditorStore((s) => s.image);
  const previewTab = useEditorStore((s) => s.previewTab);

  if (!image.dataUrl) return null;

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
              <h3 className="text-xs font-medium mb-3 text-muted-foreground uppercase tracking-wider">Android</h3>
              <AndroidPreview />
            </div>
            <SeparatorLine />
            <div>
              <h3 className="text-xs font-medium mb-3 text-muted-foreground uppercase tracking-wider">iOS</h3>
              <IOSPreview />
            </div>
            <SeparatorLine />
            <div>
              <h3 className="text-xs font-medium mb-3 text-muted-foreground uppercase tracking-wider">Web</h3>
              <WebPreview />
            </div>
            <SeparatorLine />
            <div>
              <h3 className="text-xs font-medium mb-3 text-muted-foreground uppercase tracking-wider">Desktop</h3>
              <DesktopPreview />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-[480px] border-l border-border/50 bg-background/50 hidden xl:flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Eye className="size-4 text-muted-foreground" />
          <span className="text-sm font-medium">Live Preview</span>
        </div>
      </div>
      <div className="flex items-center justify-center px-4 py-2 border-b border-border/50">
        <PreviewTabs />
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4">
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
      <div className="border-t border-border/50 p-3">
        <PreviewSettingsPanel />
      </div>
    </div>
  );
}

function SeparatorLine() {
  return <div className="h-px bg-border/50 my-2" />;
}
