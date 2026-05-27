'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useEditorStore } from '@/store/useEditorStore';
import { cn, paddingStyle, shapeStyle } from '@/lib/utils';

interface MonochromePreviewProps {
  className?: string;
}

function MonochromeIcon({ src, theme, padding, rotation }: { src: string; theme: 'dark' | 'light'; padding: number; rotation: number }) {
  const svgDataUrl = useMemo(() => {
    const color = theme === 'dark' ? '#ffffff' : '#1a1a1e';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
      <defs><mask id="m"><image href="${src}" width="100" height="100" /></mask></defs>
      <rect width="100" height="100" fill="${color}" mask="url(#m)" />
    </svg>`;
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
  }, [src, theme]);

  return (
    <img
      src={svgDataUrl}
      alt="Monochrome icon"
      className="size-full object-contain"
      style={{ ...paddingStyle(padding), rotate: `${rotation}deg` }}
    />
  );
}

export function MonochromePreview({ className }: MonochromePreviewProps) {
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
      className={cn('space-y-4', className)}
    >
      <span className="text-xs text-muted-foreground">Android 13+ Themed Icon</span>

      <div className="flex items-center gap-6">
        {(['dark', 'light'] as const).map((theme) => (
          <div key={theme} className="flex flex-col items-center gap-2">
            <div
              className="relative size-20 rounded-2xl overflow-hidden shadow-lg ring-1 ring-black/5"
              style={{ ...shapeStyle(shape), backgroundColor: theme === 'dark' ? '#1c1c1e' : '#f0f0f5' }}
            >
              <MonochromeIcon src={src} theme={theme} padding={padding} rotation={rotation} />
            </div>
            <span className="text-[10px] text-muted-foreground capitalize">{theme}</span>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-border/50 bg-card/50 p-3">
        <p className="text-[11px] text-muted-foreground">
          Monochrome icons adapt to system theme on Android 13+ devices with Material You.
        </p>
      </div>
    </motion.div>
  );
}
