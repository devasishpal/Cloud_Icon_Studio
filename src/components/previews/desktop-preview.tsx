'use client';

import { motion } from 'framer-motion';
import { useEditorStore } from '@/store/useEditorStore';
import { usePreviewIcon } from '@/components/previews/use-preview-icon';
import { cn } from '@/lib/utils';

interface DesktopPreviewProps {
  className?: string;
}

export function DesktopPreview({ className }: DesktopPreviewProps) {
  const image = useEditorStore((s) => s.image);
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
          <div className="rounded-xl border border-border/50 overflow-hidden">
            <div className="bg-gradient-to-b from-zinc-800 to-zinc-900 p-4">
              <span className="text-[10px] text-zinc-400 font-medium">macOS Dock</span>
              <div className="flex items-end justify-center gap-1.5 mt-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="size-10 rounded-xl bg-zinc-700/50 flex items-center justify-center"
                  >
                    {i === 3 ? (
                      <img
                        src={src}
                        alt="App icon"
                        className="size-8 object-contain"
                      />
                    ) : (
                      <div className="size-6 rounded-md bg-zinc-600/50" />
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-b from-blue-500 to-blue-700 p-6 flex items-center justify-center min-h-[120px]">
              <img
                src={src}
                alt="Desktop icon"
                className="size-16 object-contain drop-shadow-lg"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 min-w-[200px]">
          <div className="rounded-xl border border-border/50 bg-card/50 p-4 space-y-3">
            <span className="text-xs text-muted-foreground">Windows Taskbar</span>
            <div className="flex items-center gap-2 bg-zinc-800/80 rounded-lg p-2">
              <div className="size-3 rounded-sm bg-blue-500" />
              <div className="size-6 overflow-hidden">
                <img
                  src={src}
                  alt="Windows icon"
                  className="size-full object-contain"
                />
              </div>
              <div className="size-3 rounded-sm bg-zinc-600" />
              <div className="flex-1" />
              <span className="text-[9px] text-zinc-400">10:41</span>
            </div>
          </div>

          <div className="rounded-xl border border-border/50 bg-card/50 p-4 space-y-3">
            <span className="text-xs text-muted-foreground">Desktop Shortcut</span>
            <div className="flex items-center gap-3">
              <div className="size-12 overflow-hidden">
                <img
                  src={src}
                  alt="Shortcut"
                  className="size-full object-contain drop-shadow-lg"
                />
              </div>
              <div>
                <p className="text-xs font-medium">CloudIcon</p>
                <p className="text-[10px] text-muted-foreground">Application</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
