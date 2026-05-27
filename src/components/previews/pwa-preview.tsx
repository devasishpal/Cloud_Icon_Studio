'use client';

import { motion } from 'framer-motion';
import { useEditorStore } from '@/store/useEditorStore';
import { cn, paddingStyle, shapeStyle } from '@/lib/utils';

interface PwaPreviewProps {
  className?: string;
}

export function PwaPreview({ className }: PwaPreviewProps) {
  const image = useEditorStore((s) => s.image);
  const padding = useEditorStore((s) => s.padding);
  const rotation = useEditorStore((s) => s.rotation);
  const previewPrefs = useEditorStore((s) => s.previewPreferences);

  if (!image.dataUrl) return null;
  const src = image.dataUrl;
  const shape = previewPrefs.iconShape;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('space-y-3', className)}
    >
      <span className="text-xs text-muted-foreground">PWA Installation</span>

      <div className="rounded-xl border border-border/50 overflow-hidden">
        <div className="bg-zinc-800/80 p-4 flex items-center gap-3">
          <div
            className="size-12 rounded-xl overflow-hidden shadow-lg bg-card"
            style={{ ...shapeStyle(shape) }}
          >
            <img
              src={src}
              alt="PWA icon"
              className="size-full object-contain"
              style={{ ...paddingStyle(padding), rotate: `${rotation}deg` }}
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
            <div className="size-8 rounded-xl overflow-hidden shadow-sm bg-card" style={{ ...shapeStyle(shape) }}>
              <img
                src={src}
                alt="App icon"
                className="size-full object-contain"
                style={{ ...paddingStyle(padding), rotate: `${rotation}deg` }}
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
