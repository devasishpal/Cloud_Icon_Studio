'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const COOKIE_CONSENT_KEY = 'cloudicon-cookie-consent';

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consented = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consented) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="fixed bottom-4 right-4 z-50 w-[260px] rounded-2xl border border-border/50 bg-background/95 backdrop-blur-md p-4 shadow-lg flex flex-col gap-2.5"
        >
          <div className="flex items-start justify-between">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10">
              <Cookie className="size-4 text-primary" />
            </div>
            <button
              onClick={accept}
              className="flex size-5 items-center justify-center rounded-md text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="size-3.5" />
            </button>
          </div>

          <div className="flex-1">
            <p className="text-sm font-semibold mb-1">We respect your privacy</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              This site uses local storage to remember your preferences and editor state. No tracking cookies are used, and no data is ever sent to any server.
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <button
              onClick={accept}
              className={cn(
                'w-full rounded-lg py-2 text-xs font-medium transition-all',
                'bg-primary text-primary-foreground hover:bg-primary/90'
              )}
            >
              Got it
            </button>
            <Link
              href="/cookies"
              className="w-full text-center rounded-lg py-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all"
            >
              Read our Cookie Policy
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
