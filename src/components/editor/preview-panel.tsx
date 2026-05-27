'use client';

import { motion } from 'framer-motion';
import { Smartphone, Apple, Globe, Monitor } from 'lucide-react';
import { useEditorStore } from '@/store/useEditorStore';

function PreviewCard({ label, icon: Icon, size, platform }: {
  label: string;
  icon: React.ElementType;
  size: number;
  platform: string;
}) {
  const image = useEditorStore((s) => s.image);
  const padding = useEditorStore((s) => s.padding);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-3"
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon className="size-3.5 text-muted-foreground" />
        <span className="text-[11px] font-medium text-muted-foreground">{label}</span>
        <span className="ml-auto text-[10px] text-muted-foreground">{size}×{size}</span>
      </div>
      <div
        className="relative mx-auto rounded-lg overflow-hidden"
        style={{ width: size / 2, height: size / 2, maxWidth: 80, maxHeight: 80 }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(45deg, #1a1a1e 25%, transparent 25%), linear-gradient(-45deg, #1a1a1e 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1a1a1e 75%), linear-gradient(-45deg, transparent 75%, #1a1a1e 75%)',
            backgroundSize: '10px 10px',
            backgroundPosition: '0 0, 0 5px, 5px -5px, -5px 0px',
          }}
        />
        {image.dataUrl ? (
          <img
            src={image.dataUrl}
            alt={label}
            className="relative size-full object-contain"
            style={{
              padding: `${padding}%`,
              borderRadius: platform === 'ios' ? '22.5%' : platform === 'android' ? '12.5%' : 0,
              transform: 'scale(1)',
            }}
          />
        ) : (
          <div className="relative flex size-full items-center justify-center text-muted-foreground/30 text-[10px]">
            No image
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function PreviewPanel() {
  const activeTab = useEditorStore((s) => s.activeTab);

  if (activeTab === 'upload') return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-3">
        <Monitor className="size-4 text-muted-foreground" />
        <span className="text-sm font-medium">Live Previews</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <PreviewCard
          label="Android"
          icon={Smartphone}
          size={96}
          platform="android"
        />
        <PreviewCard
          label="iOS"
          icon={Apple}
          size={120}
          platform="ios"
        />
        <PreviewCard
          label="Favicon"
          icon={Globe}
          size={32}
          platform="web"
        />
        <PreviewCard
          label="App Icon"
          icon={Smartphone}
          size={512}
          platform="web"
        />
      </div>
    </div>
  );
}
