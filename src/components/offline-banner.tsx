'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function OfflineBanner() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const onOffline = () => setOffline(true);
    const onOnline = () => setOffline(false);
    const timer = window.setTimeout(() => setOffline(!navigator.onLine), 0);
    window.addEventListener('offline', onOffline);
    window.addEventListener('online', onOnline);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('offline', onOffline);
      window.removeEventListener('online', onOnline);
    };
  }, []);

  return (
    <AnimatePresence>
      {offline && (
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          className="fixed top-0 left-0 right-0 z-[200]"
        >
          <div className="bg-amber-500/90 dark:bg-amber-600/90 backdrop-blur-md px-4 py-2 text-center">
            <p className="text-xs font-medium text-amber-950">
              You are offline — editor still works. Changes will be saved locally.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
