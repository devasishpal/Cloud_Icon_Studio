import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { CSSProperties } from 'react';
import type { IconShape } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function paddingStyle(padding: number): CSSProperties {
  if (padding >= 0) {
    return { padding: `${padding}%` };
  }
  const scale = 1 - padding / 50;
  return {
    transform: `scale(${scale})`,
    transformOrigin: 'center center',
  };
}

export function getShapeClip(shape: IconShape, size: number): string {
  const r = size / 2;
  switch (shape) {
    case 'circle':
      return `circle(${r}px at ${r}px ${r}px)`;
    case 'squircle':
      return `path('M${r} 0 C${r * 0.75} 0,0 ${r * 0.25},0 ${r} C0 ${r * 0.75},${r * 0.25} ${size},${r} ${size} C${r * 0.75} ${size},${size} ${r * 0.75},${size} ${r} C${size} ${r * 0.25},${r * 0.75} 0,${r} 0Z')`;
    case 'rounded-square':
      return `inset(0 round ${size * 0.22}px)`;
    case 'teardrop':
      return `path('M${r} ${size} C${size} ${size},${size} ${r * 0.5},${size} ${r} C${size} ${r * 0.2},${r * 1.4} 0,${r} 0 C${r * 0.6} 0,0 ${r * 0.2},0 ${r} C0 ${r * 0.5},0 ${size},${r} ${size}Z')`;
    case 'square':
    default:
      return 'none';
  }
}

export function shapeBorderRadius(shape: IconShape): string {
  switch (shape) {
    case 'circle': return '50%';
    case 'squircle': return '30%';
    case 'rounded-square': return '20%';
    case 'teardrop': return '0';
    case 'square': return '0';
  }
}

const teardropClipPathData = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3CclipPath id='t' clipPathUnits='objectBoundingBox'%3E%3Cpath d='M0.5 1 C1 1,1 0.65,1 0.5 C1 0.2,0.8 0,0.5 0 C0.2 0,0 0.2,0 0.5 C0 0.65,0 1,0.5 1Z'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E#t`;

export function shapeStyle(shape: IconShape): CSSProperties {
  return {
    borderRadius: shapeBorderRadius(shape),
    clipPath: shape === 'teardrop' ? `url("${teardropClipPathData}")` : undefined,
  };
}
