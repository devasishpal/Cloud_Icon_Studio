'use client';

import { motion } from 'framer-motion';
import { useEditorStore } from '@/store/useEditorStore';
import { BrowserMockup } from '@/components/previews/browser-mockup';
import { FaviconPreview } from '@/components/previews/favicon-preview';
import { NavbarPreview } from '@/components/previews/navbar-preview';
import { PwaPreview } from '@/components/previews/pwa-preview';
import { cn } from '@/lib/utils';
import { usePreviewIcon } from '@/components/previews/use-preview-icon';
import { BROWSER_PRESETS } from '@/lib/constants';

interface WebPreviewProps {
  className?: string;
}

export function WebPreview({ className }: WebPreviewProps) {
  const image = useEditorStore((s) => s.image);
  const previewPrefs = useEditorStore((s) => s.previewPreferences);
  const rendered = usePreviewIcon(256);

  if (!image.dataUrl) return null;
  const src = rendered ?? image.dataUrl;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn('space-y-6', className)}
    >
      <div className="flex flex-wrap gap-6 justify-center">
        <div className="flex flex-col gap-4 flex-1 min-w-[300px] max-w-lg">
          <BrowserMockup
            browser={previewPrefs.browserType}
            title="Website"
            url="https://example.com"
          >
            <div className="flex items-center gap-2 px-3 py-2 border-b border-zinc-200 dark:border-zinc-800">
              <div className="size-4 overflow-hidden shrink-0">
                <img
                  src={src}
                  alt="Favicon"
                  className="size-full object-contain"
                />
              </div>
              <span className="text-xs text-zinc-500 truncate flex-1">example.com</span>
              <div className="flex items-center gap-1 text-[9px] text-zinc-400">
                <span className="rounded bg-zinc-200 dark:bg-zinc-800 px-1">×</span>
              </div>
            </div>
            <div className="p-6 flex items-center justify-center min-h-[120px] bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900">
              <div className="text-center">
                <div className="size-12 mx-auto overflow-hidden drop-shadow-md mb-2">
                  <img
                    src={src}
                    alt="Logo"
                    className="size-full object-contain"
                  />
                </div>
                <p className="text-xs text-zinc-500">Your website with the custom favicon</p>
              </div>
            </div>
          </BrowserMockup>

          <div className="grid grid-cols-3 gap-2">
            {(['chrome', 'safari', 'firefox'] as const).map((b) => (
              <div
                key={b}
                className="flex items-center gap-2 rounded-lg border border-border/50 bg-card/50 p-2"
              >
                <div
                  className="size-3 rounded-full shrink-0"
                  style={{ backgroundColor: BROWSER_PRESETS[b].color }}
                />
                <span className="text-[10px] text-muted-foreground">{BROWSER_PRESETS[b].name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 min-w-[200px]">
          <FaviconPreview />
          <NavbarPreview />
          <PwaPreview />
        </div>
      </div>
    </motion.div>
  );
}
