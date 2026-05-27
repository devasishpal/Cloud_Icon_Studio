'use client';

import { motion } from 'framer-motion';
import { useEditorStore } from '@/store/useEditorStore';
import { ImageEditor } from '@/components/editor/image-editor';
import { Wand2 } from 'lucide-react';

export function WorkspaceLayout() {
  const image = useEditorStore((s) => s.image);

  if (!image.dataUrl) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-1 items-center justify-center"
      >
        <div className="text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-muted/50">
            <Wand2 className="size-6 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">Select an image to start editing</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.12 }}
      className="flex flex-1 overflow-hidden"
    >
      <ImageEditor />
    </motion.div>
  );
}
