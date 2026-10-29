'use client';

import { motion } from 'framer-motion';
import { useEditorStore } from '@/store/useEditorStore';
import { usePreviewIcon } from '@/components/previews/use-preview-icon';
import { cn } from '@/lib/utils';

interface PwaPreviewProps {
  className?: string;
}

export function PwaPreview({ className }: PwaPreviewProps) {
  const image = useEditorStore((s) => s.image);
  const previewPrefs = useEditorStore((s) => s.previewPreferences);
  const rendered = usePreviewIcon(256);

  if (!image.dataUrl) return null;
  const src = rendered ?? image.dataUrl;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('space-y-3', className)}
    >
      <span className="text-xs text-muted-foreground">PWA Installation</span>

      <div className="rounded-xl border border-border/50 overflow-hidden">
        <div className="bg-zinc-800/80 p-4 flex items-center gap-3">
          <div className="size-12 overflow-hidden drop-shadow-lg">
            <img
              src={src}
              alt="PWA icon"
              className="size-full object-contain"
            />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">CloudIcon</p>
            <p className="text-xs text-muted-foreground">example.com</p>
          </div>
          <div className="rounded-lg bg-primary/20 text-primary text-xs px-3 py-1.5 font-medium">
            Install
          </div>
        </div>

        <div className={cn('p-4 space-y-3', previewPrefs.theme === 'dark' ? 'bg-zinc-900' : 'bg-zinc-100')}>
          <div className="flex items-center gap-3">
            <div className="size-8 overflow-hidden drop-shadow-sm">
              <img
                src={src}
                alt="App icon"
                className="size-full object-contain"
              />
            </div>
            <div>
              <p className="text-xs font-medium">CloudIcon Studio</p>
              <p className="text-[10px] text-muted-foreground">App drawer</p>
            </div>
          </div>

          <div className="rounded-lg border border-border/50 bg-card/50 p-3">
            <p className="text-[11px] text-muted-foreground">
              Splash screen background color matches your theme.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
