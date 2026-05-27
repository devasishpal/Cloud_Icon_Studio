'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { DeviceStyle } from '@/types';

interface DeviceMockupProps {
  style: DeviceStyle;
  children: React.ReactNode;
  className?: string;
  label?: string;
  dark?: boolean;
}

const deviceConfig = {
  pixel: {
    width: 260,
    height: 520,
    radius: 32,
    shellColor: '#1a1a2e',
    bezel: 3,
    innerRadius: 28,
  },
  samsung: {
    width: 260,
    height: 520,
    radius: 24,
    shellColor: '#0f0f14',
    bezel: 2.5,
    innerRadius: 20,
  },
  iphone: {
    width: 240,
    height: 490,
    radius: 40,
    shellColor: '#1c1c1e',
    bezel: 3,
    innerRadius: 36,
  },
  ipad: {
    width: 280,
    height: 380,
    radius: 20,
    shellColor: '#1c1c1e',
    bezel: 3,
    innerRadius: 16,
  },
};

export function DeviceMockup({ style, children, className, label, dark = true }: DeviceMockupProps) {
  const cfg = deviceConfig[style];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4 }}
      className={cn('flex flex-col items-center gap-3', className)}
    >
      <div
        className="relative overflow-hidden shadow-2xl w-full max-w-[260px]"
        style={{
          aspectRatio: cfg.width / cfg.height,
          borderRadius: cfg.radius,
          background: cfg.shellColor,
          padding: cfg.bezel,
          boxShadow: `
            0 0 0 1px rgba(255,255,255,0.05),
            0 20px 60px rgba(0,0,0,0.5),
            0 8px 20px rgba(0,0,0,0.3)
          `,
        }}
      >
        {style === 'iphone' && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 w-[120px] h-[30px] bg-black rounded-b-2xl flex items-center justify-center">
            <div className="w-20 h-1.5 rounded-full bg-zinc-800" />
          </div>
        )}
        <div
          className="size-full overflow-hidden"
          style={{ borderRadius: cfg.innerRadius }}
        >
          <div className={cn('size-full', dark ? 'bg-zinc-900' : 'bg-zinc-100')}>
            {children}
          </div>
        </div>
      </div>
      {label && (
        <span className="text-xs text-muted-foreground">{label}</span>
      )}
    </motion.div>
  );
}
