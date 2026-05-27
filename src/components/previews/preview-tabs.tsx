'use client';

import { motion } from 'framer-motion';
import { Smartphone, Apple, Globe, Monitor, LayoutGrid } from 'lucide-react';
import { useEditorStore } from '@/store/useEditorStore';
import { cn } from '@/lib/utils';
import type { PreviewTabType } from '@/types';

const tabs: { id: PreviewTabType; label: string; icon: React.ElementType }[] = [
  { id: 'android', label: 'Android', icon: Smartphone },
  { id: 'ios', label: 'iOS', icon: Apple },
  { id: 'web', label: 'Web', icon: Globe },
  { id: 'desktop', label: 'Desktop', icon: Monitor },
  { id: 'all', label: 'All Previews', icon: LayoutGrid },
];

export function PreviewTabs() {
  const previewTab = useEditorStore((s) => s.previewTab);
  const setPreviewTab = useEditorStore((s) => s.setPreviewTab);

  return (
    <div className="flex items-center gap-1 rounded-2xl border border-border/50 bg-card/50 p-1 backdrop-blur-sm">
      {tabs.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => setPreviewTab(id)}
          className={cn(
            'relative flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition-all',
            previewTab === id
              ? 'text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
          )}
        >
          {previewTab === id && (
            <motion.div
              layoutId="preview-tab-bg"
              className="absolute inset-0 rounded-xl bg-primary"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-2">
            <Icon className="size-4" />
            <span className="hidden sm:inline">{label}</span>
          </span>
        </button>
      ))}
    </div>
  );
}
