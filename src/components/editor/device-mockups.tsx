'use client';

import { motion } from 'framer-motion';
import { Smartphone, Monitor } from 'lucide-react';
import { useEditorStore } from '@/store/useEditorStore';

export function DeviceMockups() {
  const image = useEditorStore((s) => s.image);

  if (!image.dataUrl) return null;

  return (
    <div className="space-y-4">
      <span className="text-xs text-muted-foreground flex items-center gap-2">
        <Smartphone className="size-3.5" />
        Device Previews
      </span>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="relative mx-auto rounded-[32px] border-[3px] border-zinc-700 bg-zinc-900 px-3 pt-8 pb-3 shadow-2xl">
          <div className="absolute left-1/2 top-2 h-1.5 w-16 -translate-x-1/2 rounded-full bg-zinc-800" />
          <div
            className="overflow-hidden rounded-2xl bg-black"
            style={{ width: 160, height: 160 }}
          >
            <img
              src={image.dataUrl}
              alt="Android preview"
              className="size-full object-contain"
              style={{ imageRendering: 'auto' }}
            />
          </div>
          <div className="absolute bottom-1.5 left-1/2 h-1 w-24 -translate-x-1/2 rounded-full bg-zinc-800" />
        </div>

        <div className="relative mx-auto rounded-[24px] border-[2px] border-zinc-600 bg-white px-2.5 pt-10 pb-2.5 shadow-2xl">
          <div className="absolute left-1/2 top-3 h-1 w-20 -translate-x-1/2 rounded-full bg-zinc-400" />
          <div
            className="overflow-hidden rounded-xl bg-white"
            style={{ width: 120, height: 120 }}
          >
            <img
              src={image.dataUrl}
              alt="iOS preview"
              className="size-full object-contain"
              style={{ borderRadius: '22.5%' }}
            />
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-card/50 px-4 py-2">
          <Monitor className="size-4 text-muted-foreground" />
          <div className="flex items-center gap-2">
            <div
              className="size-6 rounded border border-border/50 overflow-hidden"
            >
              <img
                src={image.dataUrl}
                alt="Favicon"
                className="size-full object-contain"
              />
            </div>
            <span className="text-xs text-muted-foreground">favicon.ico</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
