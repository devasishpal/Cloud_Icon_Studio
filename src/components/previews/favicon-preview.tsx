'use client';

import { motion } from 'framer-motion';
import { useEditorStore } from '@/store/useEditorStore';
import { cn, paddingStyle, shapeStyle } from '@/lib/utils';

interface FaviconPreviewProps {
  className?: string;
}

export function FaviconPreview({ className }: FaviconPreviewProps) {
  const image = useEditorStore((s) => s.image);
  const padding = useEditorStore((s) => s.padding);
  const rotation = useEditorStore((s) => s.rotation);
  const backgroundColor = useEditorStore((s) => s.backgroundColor);
  const backgroundType = useEditorStore((s) => s.backgroundType);
  const gradientPreset = useEditorStore((s) => s.gradientPreset);
  const previewPrefs = useEditorStore((s) => s.previewPreferences);

  if (!image.dataUrl) return null;
  const src = image.dataUrl;
  const shape = previewPrefs.iconShape;
  const iconBg = backgroundType === 'transparent' ? 'repeating-conic-gradient(#1a1a1e 0% 25%, transparent 0% 50%) 50% / 8px 8px'
    : backgroundType === 'gradient' && gradientPreset
      ? `linear-gradient(${gradientPreset.angle}deg, ${gradientPreset.colors[0]}, ${gradientPreset.colors[1]})`
      : backgroundColor;

  const faviconSizes = [
    { label: 'Favicon', size: 16 },
    { label: 'Large', size: 32 },
    { label: 'Apple Touch', size: 180 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn('space-y-3', className)}
    >
      <span className="text-xs text-muted-foreground">Favicon Sizes</span>
      <div className="flex flex-wrap gap-3">
        {faviconSizes.map(({ label, size }) => {
          const displaySize = size > 64 ? 64 : size * 2;
          return (
            <div key={label} className="flex flex-col items-center gap-1.5">
              <div
                className="rounded border border-border/50 overflow-hidden shadow-sm"
                style={{ width: displaySize, height: displaySize, ...shapeStyle(shape), backgroundColor: iconBg }}
              >
                <img
                  src={src}
                  alt={label}
                  className="size-full object-contain"
                  style={{ ...paddingStyle(padding), rotate: `${rotation}deg` }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground">{label}</span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
