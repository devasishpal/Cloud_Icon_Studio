'use client';

import { motion } from 'framer-motion';
import { useEditorStore } from '@/store/useEditorStore';
import { usePreviewIcon } from '@/components/previews/use-preview-icon';
import { cn, shapeStyle } from '@/lib/utils';

interface MonochromePreviewProps {
  className?: string;
}

export function MonochromePreview({ className }: MonochromePreviewProps) {
  const image = useEditorStore((s) => s.image);
  const previewPrefs = useEditorStore((s) => s.previewPreferences);
  const shape = previewPrefs.iconShape;
  const darkIcon = usePreviewIcon(256, 'dark', false);
  const lightIcon = usePreviewIcon(256, 'light', false);

  if (!image.dataUrl) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('space-y-4', className)}
    >
      <span className="text-xs text-muted-foreground">Android 13+ Themed Icon</span>

      <div className="flex items-center gap-6">
        {(['dark', 'light'] as const).map((theme) => {
          const src = theme === 'dark' ? darkIcon : lightIcon;
          return (
            <div key={theme} className="flex flex-col items-center gap-2">
              <div
                className="relative size-20 rounded-2xl overflow-hidden shadow-lg ring-1 ring-black/5"
                style={{ ...shapeStyle(shape), backgroundColor: theme === 'dark' ? '#1c1c1e' : '#f0f0f5' }}
              >
                {src && (
                  <img
                    src={src}
                    alt="Monochrome icon"
                    className="size-full object-contain"
                  />
                )}
              </div>
              <span className="text-[10px] text-muted-foreground capitalize">{theme}</span>
            </div>
          );
        })}
      </div>

      <div className="rounded-lg border border-border/50 bg-card/50 p-3">
        <p className="text-[11px] text-muted-foreground">
          Monochrome icons adapt to system theme on Android 13+ devices with Material You.
        </p>
      </div>
    </motion.div>
  );
}
