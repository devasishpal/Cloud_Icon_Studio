'use client';

import { motion } from 'framer-motion';
import { Crop, Lock, Unlock, Scissors } from 'lucide-react';
import { useEditorStore } from '@/store/useEditorStore';
import { cn } from '@/lib/utils';
import { ASPECT_RATIOS } from '@/lib/constants';

export function CropOverlay() {
  const crop = useEditorStore((s) => s.crop);
  const setCrop = useEditorStore((s) => s.setCrop);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      <div className="flex items-center gap-2">
        <Crop className="size-3.5 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">Crop</span>
      </div>

      <div className="flex gap-1.5">
        {ASPECT_RATIOS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setCrop({ aspectRatio: value })}
            className={cn(
              'flex-1 rounded-lg px-2 py-1.5 text-[11px] font-medium transition-all',
              crop.aspectRatio === value
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground bg-muted/30 hover:bg-muted/50'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setCrop({ enabled: !crop.enabled })}
          className={cn(
            'flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs transition-all',
            crop.enabled
              ? 'border-primary/20 bg-primary/5 text-primary'
              : 'border-border/50 text-muted-foreground hover:bg-muted/30'
          )}
        >
          {crop.enabled ? <Lock className="size-3.5" /> : <Unlock className="size-3.5" />}
          {crop.enabled ? 'Active' : 'Enable'}
        </button>

        {crop.enabled && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => {
              setCrop({ enabled: false });
            }}
            className="flex items-center justify-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-xs text-primary transition-all hover:bg-primary/10"
            title="Cancel crop"
          >
            <Scissors className="size-3.5" />
            Clear
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
