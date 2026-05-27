'use client';

import { motion } from 'framer-motion';
import { useEditorStore } from '@/store/useEditorStore';
import { cn, paddingStyle, shapeStyle } from '@/lib/utils';

interface DesktopPreviewProps {
  className?: string;
}

export function DesktopPreview({ className }: DesktopPreviewProps) {
  const storeImage = useEditorStore((s) => s.image);
  const padding = useEditorStore((s) => s.padding);
  const rotation = useEditorStore((s) => s.rotation);
  const backgroundColor = useEditorStore((s) => s.backgroundColor);
  const backgroundType = useEditorStore((s) => s.backgroundType);
  const gradientPreset = useEditorStore((s) => s.gradientPreset);
  const previewPrefs = useEditorStore((s) => s.previewPreferences);
  const image = storeImage;

  if (!image.dataUrl) return null;
  const src = image.dataUrl;
  const shape = previewPrefs.iconShape;
  const iconBg = backgroundType === 'transparent' ? 'transparent'
    : backgroundType === 'gradient' && gradientPreset
      ? `linear-gradient(${gradientPreset.angle}deg, ${gradientPreset.colors[0]}, ${gradientPreset.colors[1]})`
      : backgroundColor;

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
                        style={{ ...paddingStyle(padding), rotate: `${rotation}deg`, ...shapeStyle(shape), backgroundColor: iconBg }}
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
                className="size-16 object-contain shadow-lg rounded-xl"
                style={{ ...paddingStyle(padding), rotate: `${rotation}deg`, ...shapeStyle(shape), backgroundColor: iconBg }}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 min-w-[200px]">
          <div className="rounded-xl border border-border/50 bg-card/50 p-4 space-y-3">
            <span className="text-xs text-muted-foreground">Windows Taskbar</span>
            <div className="flex items-center gap-2 bg-zinc-800/80 rounded-lg p-2">
              <div className="size-3 rounded-sm bg-blue-500" />
              <div
                className="size-6 rounded-md overflow-hidden shadow-sm"
                style={{ ...shapeStyle(shape), backgroundColor: iconBg }}
              >
                <img
                  src={src}
                  alt="Windows icon"
                  className="size-full object-contain"
                  style={{ ...paddingStyle(padding), rotate: `${rotation}deg` }}
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
              <div
                className="size-12 rounded-xl overflow-hidden shadow-lg"
                style={{ ...shapeStyle(shape), backgroundColor: iconBg }}
              >
                <img
                  src={src}
                  alt="Shortcut"
                  className="size-full object-contain"
                  style={{ ...paddingStyle(padding), rotate: `${rotation}deg` }}
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
