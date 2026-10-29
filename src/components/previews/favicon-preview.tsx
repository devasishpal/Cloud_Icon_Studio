'use client';

import { motion } from 'framer-motion';
import { useEditorStore } from '@/store/useEditorStore';
import { usePreviewIcon } from '@/components/previews/use-preview-icon';
import { cn } from '@/lib/utils';

interface FaviconPreviewProps {
  className?: string;
}

export function FaviconPreview({ className }: FaviconPreviewProps) {
  const image = useEditorStore((s) => s.image);
  const rendered = usePreviewIcon(256);

  if (!image.dataUrl) return null;
  const src = rendered ?? image.dataUrl;

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
                className="overflow-hidden drop-shadow-sm"
                style={{ width: displaySize, height: displaySize }}
              >
                <img
                  src={src}
                  alt={label}
                  className="size-full object-contain"
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
