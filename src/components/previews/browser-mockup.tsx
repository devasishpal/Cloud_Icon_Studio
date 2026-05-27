'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { BROWSER_PRESETS } from '@/lib/constants';
import type { BrowserType } from '@/types';

interface BrowserMockupProps {
  browser: BrowserType;
  children: React.ReactNode;
  className?: string;
  title?: string;
  url?: string;
}

export function BrowserMockup({
  browser,
  children,
  className,
  url = 'https://example.com',
}: BrowserMockupProps) {
  const preset = BROWSER_PRESETS[browser];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('rounded-xl overflow-hidden border border-border/50 shadow-xl', className)}
    >
      <div className="flex items-center gap-2 bg-zinc-800/80 px-3 py-2.5">
        <div className="flex items-center gap-1.5">
          <div className="size-2.5 rounded-full bg-red-500/80" />
          <div className="size-2.5 rounded-full bg-yellow-500/80" />
          <div className="size-2.5 rounded-full bg-green-500/80" />
        </div>
        <div
          className="flex items-center gap-1.5 flex-1 mx-2 rounded-md bg-zinc-700/50 px-2 py-1"
        >
          <div
            className="size-3 rounded"
            style={{ backgroundColor: preset.color }}
          />
          <span className="text-[10px] text-zinc-400 truncate flex-1">{url}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {[preset.color, preset.color, preset.color].map((c, i) => (
            <div key={i} className="size-2 rounded-sm opacity-60" style={{ backgroundColor: c }} />
          ))}
        </div>
      </div>
      <div className="bg-white dark:bg-zinc-900">{children}</div>
    </motion.div>
  );
}
