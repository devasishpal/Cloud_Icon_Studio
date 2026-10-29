'use client';

import { useEffect, useState } from 'react';
import { Palette, Pipette } from 'lucide-react';
import { useEditorStore } from '@/store/useEditorStore';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { GRADIENT_PRESETS } from '@/lib/constants';
import { isHexColor } from '@/lib/render';
import { extractPalette } from '@/lib/image-ops';
import { cn } from '@/lib/utils';
import type { GradientPreset } from '@/types';

export function BackgroundPanel() {
  const image = useEditorStore((s) => s.image);
  const backgroundColor = useEditorStore((s) => s.backgroundColor);
  const backgroundType = useEditorStore((s) => s.backgroundType);
  const gradientPreset = useEditorStore((s) => s.gradientPreset);
  const setBackgroundColor = useEditorStore((s) => s.setBackgroundColor);
  const setBackgroundType = useEditorStore((s) => s.setBackgroundType);
  const setGradient = useEditorStore((s) => s.setGradient);

  const [hex, setHex] = useState(backgroundColor);
  const [palette, setPalette] = useState<string[]>([]);
  const [paletteBusy, setPaletteBusy] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setHex(backgroundColor), 0);
    return () => window.clearTimeout(timer);
  }, [backgroundColor]);

  const gradientColors = gradientPreset?.colors ?? ['#7C3AED', '#2563EB'];
  const gradientAngle = gradientPreset?.angle ?? 135;

  const updateGradient = (colors: [string, string], angle: number, name = 'Custom') => {
    setGradient({ name, colors, angle } as GradientPreset);
  };

  const detectPalette = async () => {
    if (!image.dataUrl) return;
    setPaletteBusy(true);
    try {
      const colors = await extractPalette(image.dataUrl, 8);
      setPalette(colors);
    } catch {
      // Ignore – palette detection is a convenience.
    } finally {
      setPaletteBusy(false);
    }
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
              'flex-1 rounded-lg px-2 py-1.5 text-[11px] font-medium transition-all capitalize',
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
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={isHexColor(backgroundColor) ? backgroundColor : '#7C3AED'}
              onChange={(e) => setBackgroundColor(e.target.value)}
              className="size-9 rounded-lg border border-border/50 cursor-pointer shrink-0"
            />
            <Input
              type="text"
              value={hex}
              onChange={(e) => {
                setHex(e.target.value);
                if (isHexColor(e.target.value)) setBackgroundColor(e.target.value);
              }}
              className={cn('h-9 text-xs font-mono', !isHexColor(hex) && 'border-destructive/50')}
            />
          </div>
          <button
            onClick={detectPalette}
            disabled={!image.dataUrl || paletteBusy}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-border/50 px-3 py-1.5 text-[11px] text-muted-foreground hover:bg-muted/50 disabled:opacity-40 transition-all"
          >
            <Pipette className="size-3" />
            {paletteBusy ? 'Extracting…' : 'Colours from image'}
          </button>
          {palette.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {palette.map((color) => (
                <button
                  key={color}
                  onClick={() => setBackgroundColor(color)}
                  title={color}
                  className={cn(
                    'size-6 rounded-md border transition-transform hover:scale-110',
                    backgroundColor.toLowerCase() === color.toLowerCase()
                      ? 'border-primary ring-1 ring-primary'
                      : 'border-border/50'
                  )}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {backgroundType === 'gradient' && (
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-1.5">
            {GRADIENT_PRESETS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => setGradient(preset)}
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

          <div className="space-y-2 rounded-lg border border-border/50 p-2.5">
            <p className="text-[11px] text-muted-foreground">Custom gradient</p>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={gradientColors[0]}
                onChange={(e) => updateGradient([e.target.value, gradientColors[1]], gradientAngle)}
                className="size-8 rounded-md border border-border/50 cursor-pointer"
              />
              <input
                type="color"
                value={gradientColors[1]}
                onChange={(e) => updateGradient([gradientColors[0], e.target.value], gradientAngle)}
                className="size-8 rounded-md border border-border/50 cursor-pointer"
              />
              <div
                className="h-8 flex-1 rounded-md border border-border/50"
                style={{ background: `linear-gradient(${gradientAngle}deg, ${gradientColors[0]}, ${gradientColors[1]})` }}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground">Angle</span>
              <input
                type="range"
                min={0}
                max={360}
                value={gradientAngle}
                onChange={(e) => updateGradient([gradientColors[0], gradientColors[1]], Number(e.target.value))}
                className="flex-1 accent-primary h-1"
              />
              <span className="text-[10px] tabular-nums text-muted-foreground">{gradientAngle}°</span>
            </div>
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
            Transparent background – exports keep an alpha channel
          </p>
        </div>
      )}
    </div>
  );
}
