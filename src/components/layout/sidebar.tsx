'use client';

import { motion } from 'framer-motion';
import {
  Upload,
  Wand2,
  Smartphone,
  Apple,
  Globe,
  Monitor,
  Download,
} from 'lucide-react';
import { useEditorStore } from '@/store/useEditorStore';
import { NAV_ITEMS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ZoomControls } from '@/components/editor/zoom-controls';
import { RotationControls } from '@/components/editor/rotation-controls';
import { BackgroundPanel } from '@/components/editor/background-panel';
import { PaddingControls } from '@/components/editor/padding-controls';
import { CropOverlay } from '@/components/editor/crop-overlay';
import { SafeAreaOverlay } from '@/components/editor/safe-area-overlay';

const iconMap: Record<string, React.ReactNode> = {
  Upload: <Upload className="size-4" />,
  Wand2: <Wand2 className="size-4" />,
  Smartphone: <Smartphone className="size-4" />,
  Apple: <Apple className="size-4" />,
  Globe: <Globe className="size-4" />,
  Monitor: <Monitor className="size-4" />,
  Download: <Download className="size-4" />,
};

export function Sidebar({ className }: { className?: string }) {
  const activeTab = useEditorStore((s) => s.activeTab);
  const setActiveTab = useEditorStore((s) => s.setActiveTab);
  const setPreviewTab = useEditorStore((s) => s.setPreviewTab);
  const hasImage = useEditorStore((s) => s.image.dataUrl !== null);

  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col w-56 border-r border-border/50 bg-background/50',
        className
      )}
    >
      <nav className="flex flex-col gap-1 p-3 border-b border-border/50">
        {NAV_ITEMS.map((item) => {
          const isDisabled = !hasImage && item.value !== 'upload';
          return (
            <motion.button
              key={item.value}
              onClick={() => {
                if (isDisabled) return;
                setActiveTab(item.value);
                const previewMap: Record<string, 'android' | 'ios' | 'web' | 'desktop'> = { android: 'android', ios: 'ios', web: 'web', desktop: 'desktop' };
                if (previewMap[item.value]) setPreviewTab(previewMap[item.value]);
              }}
              disabled={isDisabled}
              whileTap={{ scale: 0.98 }}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                activeTab === item.value
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
                isDisabled && 'opacity-40 cursor-not-allowed'
              )}
            >
              {iconMap[item.icon]}
              <span>{item.label}</span>
              {activeTab === item.value && (
                <motion.div
                  layoutId="sidebar-active"
                  className="ml-auto size-1.5 rounded-full bg-primary"
                />
              )}
            </motion.button>
          );
        })}
      </nav>

      {hasImage && (
        <ScrollArea className="flex-1">
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
            <div className="pb-4">
              <p className="text-xs text-muted-foreground">
                Drag image on canvas with <span className="font-medium">Select</span> tool
              </p>
            </div>
          </div>
        </ScrollArea>
      )}
    </aside>
  );
}
