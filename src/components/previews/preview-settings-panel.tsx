'use client';

import { useEditorStore } from '@/store/useEditorStore';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ICON_SHAPES, DEVICE_PRESETS, BROWSER_PRESETS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Moon, Sun, Monitor } from 'lucide-react';
import type { DeviceStyle, BrowserType } from '@/types';

export function PreviewSettingsPanel() {
  const prefs = useEditorStore((s) => s.previewPreferences);
  const setPreviewTheme = useEditorStore((s) => s.setPreviewTheme);
  const setIconShape = useEditorStore((s) => s.setIconShape);
  const setDeviceStyle = useEditorStore((s) => s.setDeviceStyle);
  const setBrowserType = useEditorStore((s) => s.setBrowserType);
  const setPreviewPreferences = useEditorStore((s) => s.setPreviewPreferences);
  const image = useEditorStore((s) => s.image);

  if (!image.dataUrl) return null;

  return (
    <div className="p-4 space-y-5">
      <span className="text-xs text-muted-foreground flex items-center gap-2">
        <Monitor className="size-3.5" />
        Preview Settings
      </span>

      <div>
        <Label className="text-[11px] text-muted-foreground mb-2 block">Theme</Label>
        <div className="flex gap-1.5">
          {[
            { id: 'dark' as const, icon: Moon, label: 'Dark' },
            { id: 'light' as const, icon: Sun, label: 'Light' },
          ].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setPreviewTheme(id)}
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs flex-1 justify-center transition-all',
                prefs.theme === id
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'bg-muted/30 text-muted-foreground border border-border/50 hover:bg-muted/50'
              )}
            >
              <Icon className="size-3.5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <Label className="text-[11px] text-muted-foreground mb-2 block">Icon Shape</Label>
        <div className="grid grid-cols-2 gap-1.5">
          {ICON_SHAPES.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setIconShape(value)}
              className={cn(
                'rounded-lg px-2 py-1.5 text-xs transition-all',
                prefs.iconShape === value
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'bg-muted/30 text-muted-foreground border border-border/50 hover:bg-muted/50'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <Label className="text-[11px] text-muted-foreground mb-2 block">Device</Label>
        <div className="space-y-1">
          {(Object.entries(DEVICE_PRESETS) as [DeviceStyle, typeof DEVICE_PRESETS.pixel][]).map(
            ([key, val]) => (
              <button
                key={key}
                onClick={() => setDeviceStyle(key)}
                className={cn(
                  'flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs transition-all',
                  prefs.deviceStyle === key
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'bg-muted/30 text-muted-foreground border border-border/50 hover:bg-muted/50'
                )}
              >
                <div
                  className="size-3 rounded-sm"
                  style={{ backgroundColor: val.shellColor }}
                />
                {val.name}
              </button>
            )
          )}
        </div>
      </div>

      <Separator />

      <div>
        <Label className="text-[11px] text-muted-foreground mb-2 block">Browser</Label>
        <div className="space-y-1">
          {(Object.entries(BROWSER_PRESETS) as [BrowserType, typeof BROWSER_PRESETS.chrome][]).map(
            ([key, val]) => (
              <button
                key={key}
                onClick={() => setBrowserType(key)}
                className={cn(
                  'flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs transition-all',
                  prefs.browserType === key
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'bg-muted/30 text-muted-foreground border border-border/50 hover:bg-muted/50'
                )}
              >
                <div
                  className="size-3 rounded-full"
                  style={{ backgroundColor: val.color }}
                />
                {val.name}
              </button>
            )
          )}
        </div>
      </div>

      <Separator />

      <div>
        <Label className="text-[11px] text-muted-foreground mb-2 block">Display</Label>
        <div className="space-y-1.5">
          {[
            { key: 'showLabels' as const, label: 'Show labels' },
            { key: 'showShadows' as const, label: 'Show shadows' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setPreviewPreferences({ [key]: !prefs[key] })}
              className={cn(
                'flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition-all',
                'bg-muted/30 text-muted-foreground border border-border/50 hover:bg-muted/50'
              )}
            >
              <span>{label}</span>
              <div
                className={cn(
                  'size-3.5 rounded border transition-all flex items-center justify-center',
                  prefs[key]
                    ? 'bg-primary border-primary'
                    : 'border-border bg-transparent'
                )}
              >
                {prefs[key] && <span className="text-primary-foreground text-[8px]">✓</span>}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
