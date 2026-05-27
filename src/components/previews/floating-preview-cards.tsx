'use client';

import { motion } from 'framer-motion';
import { Smartphone, Tablet, Monitor } from 'lucide-react';

const previews = [
  {
    icon: Smartphone,
    label: 'Android',
    size: '192x192',
    color: '#16a34a',
  },
  {
    icon: Smartphone,
    label: 'iOS',
    size: '180x180',
    color: '#2563eb',
  },
  {
    icon: Monitor,
    label: 'Web',
    size: '512x512',
    color: '#215ee9',
  },
  {
    icon: Tablet,
    label: 'Tablet',
    size: '152x152',
    color: '#d97706',
  },
];

export function FloatingPreviewCards() {
  return (
    <div className="relative flex flex-wrap justify-center gap-4 perspective-1000">
      {previews.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 40, rotateX: 15 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ delay: 0.8 + i * 0.15, duration: 0.6, ease: 'easeOut' }}
          whileHover={{ y: -8, scale: 1.02 }}
          className="group relative"
        >
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 shadow-lg transition-shadow hover:shadow-xl hover:shadow-primary/5">
            <div
              className="flex size-16 items-center justify-center rounded-xl"
              style={{ backgroundColor: `${item.color}15` }}
            >
              <item.icon className="size-7" style={{ color: item.color }} />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.size}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
