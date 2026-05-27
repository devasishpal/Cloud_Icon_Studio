'use client';

import { Palette } from 'lucide-react';
import { useEditorStore } from '@/store/useEditorStore';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { GRADIENT_PRESETS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { GradientPreset } from '@/types';

export function BackgroundPanel() {
  const backgroundColor = useEditorStore((s) => s.backgroundColor);
  const backgroundType = useEditorStore((s) => s.backgroundType);
  const gradientPreset = useEditorStore((s) => s.gradientPreset);
  const setBackgroundColor = useEditorStore((s) => s.setBackgroundColor);
  const setBackgroundType = useEditorStore((s) => s.setBackgroundType);
  const setGradient = useEditorStore((s) => s.setGradient);

  const handleGradientSelect = (preset: GradientPreset) => {
    setGradient(preset);
  };

  return (
    <div className="space-y-4">
      <Label className="text-xs text-muted-foreground flex items-center gap-2">
        <Palette className="size-3.5" />
        Background
      </Label>

      <div className="flex gap-1.5">
        {(['solid', 'transparent', 'gradient'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setBackgroundType(type)}
            className={cn(
              'flex-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all capitalize',
              backgroundType === type
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'text-muted-foreground border border-border/50 hover:bg-muted/50'
            )}
          >
            {type}
          </button>
        ))}
      </div>

      {backgroundType === 'solid' && (
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
            className="size-9 rounded-lg border border-border/50 cursor-pointer shrink-0"
          />
          <Input
            type="text"
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
            className="h-9 text-xs"
          />
        </div>
      )}

      {backgroundType === 'gradient' && (
        <div className="space-y-2">
          <p className="text-[11px] text-muted-foreground">Presets</p>
          <div className="grid grid-cols-3 gap-1.5">
            {GRADIENT_PRESETS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => handleGradientSelect(preset)}
                className={cn(
                  'relative h-10 rounded-lg overflow-hidden border transition-all',
                  gradientPreset?.name === preset.name
                    ? 'border-primary ring-1 ring-primary'
                    : 'border-border/50 hover:border-primary/50'
                )}
                title={preset.name}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(${preset.angle}deg, ${preset.colors[0]}, ${preset.colors[1]})`,
                  }}
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {backgroundType === 'transparent' && (
        <div className="rounded-lg border border-border/50 p-3">
          <div
            className="h-24 rounded-md"
            style={{
              backgroundImage:
                'linear-gradient(45deg, #1a1a1e 25%, transparent 25%), linear-gradient(-45deg, #1a1a1e 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1a1a1e 75%), linear-gradient(-45deg, transparent 75%, #1a1a1e 75%)',
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
            }}
          />
          <p className="mt-2 text-[11px] text-center text-muted-foreground">
            Transparent background with checkerboard
          </p>
        </div>
      )}
    </div>
  );
}
