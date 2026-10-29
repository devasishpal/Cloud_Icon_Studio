'use client';

import { motion } from 'framer-motion';
import { ImageEditor } from '@/components/editor/image-editor';

export function WorkspaceLayout() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.12 }}
      className="flex flex-1 overflow-hidden bg-[#2a2b30]"
    >
      <ImageEditor />
    </motion.div>
  );
}
