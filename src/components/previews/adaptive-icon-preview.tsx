'use client';

import { motion } from 'framer-motion';
import { useEditorStore } from '@/store/useEditorStore';
import { cn, paddingStyle, getShapeClip } from '@/lib/utils';

interface AdaptiveIconPreviewProps {
  size?: number;
  className?: string;
}

function LayerPreview({ label, size, children, isMasked = false }: { label: string; size: number; children: React.ReactNode; isMasked?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className="relative overflow-hidden"
        style={{ width: size, height: size, borderRadius: 6 }}
      >
        {children}
      </div>
      <span className="text-[9px] font-medium text-muted-foreground">{label}</span>
    </div>
  );
}

export function AdaptiveIconPreview({ size = 80, className }: AdaptiveIconPreviewProps) {
  const image = useEditorStore((s) => s.image);
  const backgroundColor = useEditorStore((s) => s.backgroundColor);
  const backgroundType = useEditorStore((s) => s.backgroundType);
  const gradientPreset = useEditorStore((s) => s.gradientPreset);
  const previewPrefs = useEditorStore((s) => s.previewPreferences);
  const padding = useEditorStore((s) => s.padding);
  const rotation = useEditorStore((s) => s.rotation);

  if (!image.dataUrl) return null;
  const src = image.dataUrl;

  const iconBg = backgroundType === 'transparent' ? 'repeating-conic-gradient(#1a1a1e 0% 25%, transparent 0% 50%) 50% / 8px 8px'
    : backgroundType === 'gradient' && gradientPreset
      ? `linear-gradient(${gradientPreset.angle}deg, ${gradientPreset.colors[0]}, ${gradientPreset.colors[1]})`
      : backgroundColor;
  const outerClip = getShapeClip(previewPrefs.iconShape, size);
  const safeInner = size * 0.66;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn('flex items-center gap-5', className)}
    >
      {/* Foreground layer - image on transparent bg, clipped to shape */}
      <LayerPreview label="Foreground" size={size}>
        <div className="size-full" style={{ backgroundImage: 'linear-gradient(45deg, #1a1a1e 25%, transparent 25%), linear-gradient(-45deg, #1a1a1e 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1a1a1e 75%), linear-gradient(-45deg, transparent 75%, #1a1a1e 75%)', backgroundSize: '12px 12px', backgroundPosition: '0 0, 0 6px, 6px -6px, -6px 0px' }}>
          <div
            className="size-full"
            style={{ clipPath: outerClip, WebkitClipPath: outerClip }}
          >
            <img src={src} alt="" className="size-full object-contain" style={{ ...paddingStyle(padding), rotate: `${rotation}deg` }} />
          </div>
        </div>
        <div
          className="absolute border border-dashed border-white/25 rounded-full pointer-events-none"
          style={{ width: safeInner, height: safeInner, top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}
        />
      </LayerPreview>

      {/* Background layer - solid color clipped to shape */}
      <LayerPreview label="Background" size={size}>
        <div
          className="size-full"
          style={{
            clipPath: outerClip,
            WebkitClipPath: outerClip,
            background: iconBg,
          }}
        />
      </LayerPreview>

      {/* Masked result - image composited on background */}
      <LayerPreview label="Final" size={size} isMasked>
        <div
          className="size-full shadow-inner"
          style={{
            clipPath: outerClip,
            WebkitClipPath: outerClip,
            background: iconBg,
          }}
        >
          <img src={src} alt="" className="size-full object-contain" style={{ padding: `${padding}%`, rotate: `${rotation}deg` }} />
        </div>
        <div
          className="absolute inset-0 shadow-[inset_0_0_4px_rgba(0,0,0,0.2)] pointer-events-none"
          style={{ clipPath: outerClip, WebkitClipPath: outerClip }}
        />
      </LayerPreview>
    </motion.div>
  );
}
