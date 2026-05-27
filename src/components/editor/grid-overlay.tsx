'use client';

import { useEditorStore } from '@/store/useEditorStore';

export function GridOverlay() {
  const showGrid = useEditorStore((s) => s.showGrid);
  const image = useEditorStore((s) => s.image);

  if (!showGrid || !image.dataUrl) return null;

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg className="size-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="editor-grid"
            width="50"
            height="50"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 50 0 L 0 0 0 50"
              fill="none"
              stroke="rgba(139, 92, 246, 0.12)"
              strokeWidth="0.5"
            />
          </pattern>
          <pattern
            id="editor-grid-large"
            width="200"
            height="200"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 200 0 L 0 0 0 200"
              fill="none"
              stroke="rgba(139, 92, 246, 0.2)"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#editor-grid)" />
        <rect width="100%" height="100%" fill="url(#editor-grid-large)" />
        <line
          x1="50%" y1="0" x2="50%" y2="100%"
          stroke="rgba(139, 92, 246, 0.3)"
          strokeWidth="1"
          strokeDasharray="6,4"
        />
        <line
          x1="0" y1="50%" x2="100%" y2="50%"
          stroke="rgba(139, 92, 246, 0.3)"
          strokeWidth="1"
          strokeDasharray="6,4"
        />
      </svg>
    </div>
  );
}
