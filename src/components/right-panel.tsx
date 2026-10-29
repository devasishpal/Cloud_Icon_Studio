'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEditorStore } from '@/store/useEditorStore';
import { Eye, Smartphone, Apple, Globe, Monitor } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AndroidPreview } from '@/components/previews/android-preview';
import { IOSPreview } from '@/components/previews/ios-preview';
import { WebPreview } from '@/components/previews/web-preview';
import { DesktopPreview } from '@/components/previews/desktop-preview';
import { cn } from '@/lib/utils';

const previewTabs = [
  { id: 'android' as const, label: 'Android', icon: Smartphone },
  { id: 'ios' as const, label: 'iOS', icon: Apple },
  { id: 'web' as const, label: 'Web', icon: Globe },
  { id: 'desktop' as const, label: 'Desktop', icon: Monitor },
];

interface RightPanelProps {
  className?: string;
}

export function RightPanel({ className }: RightPanelProps) {
  const image = useEditorStore((s) => s.image);
  const previewTab = useEditorStore((s) => s.previewTab);
  const setPreviewTab = useEditorStore((s) => s.setPreviewTab);

  if (!image.dataUrl) return null;

  return (
    <div className={className ?? 'border-l border-white/[0.08] bg-[#1e1f24] hidden lg:flex lg:w-64 xl:w-80 flex-col overflow-hidden'}>
      <div className="flex h-14 shrink-0 items-center gap-2 border-b border-white/[0.07] bg-[#24252b] px-4">
        <Eye className="size-3 text-zinc-500" />
        <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">Preview</span>
        <div className="ml-auto flex gap-0.5">
          {previewTabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setPreviewTab(id)}
              className={cn(
                'rounded-md p-1.5 text-[10px] font-medium transition-all',
                previewTab === id
                  ? 'bg-primary/20 text-[#9bb7ff]'
                  : 'text-zinc-500 hover:text-zinc-100 hover:bg-white/[0.06]'
              )}
              title={label}
            >
              <Icon className="size-3.5" />
            </button>
          ))}
        </div>
      </div>
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={previewTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
            >
              {previewTab === 'android' && <AndroidPreview />}
              {previewTab === 'ios' && <IOSPreview />}
              {previewTab === 'web' && <WebPreview />}
              {previewTab === 'desktop' && <DesktopPreview />}
            </motion.div>
          </AnimatePresence>
        </div>
      </ScrollArea>
    </div>
  );
}
