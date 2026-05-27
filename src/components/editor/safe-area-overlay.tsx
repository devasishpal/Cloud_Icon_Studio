'use client';

import { motion } from 'framer-motion';
import { Eye, EyeOff, Smartphone, Apple, Globe } from 'lucide-react';
import { useEditorStore } from '@/store/useEditorStore';
import { cn } from '@/lib/utils';


export function SafeAreaOverlay() {
  const safeArea = useEditorStore((s) => s.safeArea);
  const setSafeArea = useEditorStore((s) => s.setSafeArea);
  const image = useEditorStore((s) => s.image);

  const masks = [
    { key: 'android' as const, icon: Smartphone, label: 'Android Adaptive' },
    { key: 'iOS' as const, icon: Apple, label: 'iOS Rounded' },
    { key: 'web' as const, icon: Globe, label: 'Favicon' },
  ];

  if (!image.dataUrl) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground flex items-center gap-2">
          <Smartphone className="size-3.5" />
          Safe Area Guides
        </span>
        <button
          onClick={() => setSafeArea({ show: !safeArea.show })}
          className={cn(
            'flex items-center gap-1 rounded-md px-2 py-1 text-[11px] transition-all',
            safeArea.show
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {safeArea.show ? <Eye className="size-3" /> : <EyeOff className="size-3" />}
          {safeArea.show ? 'Visible' : 'Hidden'}
        </button>
      </div>

      <div className="space-y-1.5">
        {masks.map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            onClick={() => setSafeArea({ [key]: !safeArea[key] })}
            className={cn(
              'flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-xs transition-all',
              safeArea[key]
                ? 'border-primary/20 bg-primary/5 text-foreground'
                : 'border-border/50 text-muted-foreground hover:bg-muted/30'
            )}
          >
            <Icon className="size-4" />
            <span className="flex-1 text-left">{label}</span>
            <div
              className={cn(
                'size-2 rounded-full transition-all',
                safeArea[key] ? 'bg-primary' : 'bg-border'
              )}
            />
          </button>
        ))}
      </div>

      {safeArea.show && safeArea.android && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="rounded-lg border border-border/50 p-3 space-y-2"
        >
          <p className="text-[11px] text-muted-foreground">Adaptive Icon Zones</p>
          <div className="flex items-center gap-3">
            <div className="relative size-12 shrink-0">
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-green-500/50" />
              <div className="absolute inset-[6px] rounded-full border-2 border-green-500" />
            </div>
            <div>
              <p className="text-xs font-medium">Safe zone (inner 66%)</p>
              <p className="text-[11px] text-muted-foreground">
                Keep key content inside the inner circle
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
