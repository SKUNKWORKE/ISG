"use client";

import { LazyMotion, domAnimation } from "framer-motion";

/**
 * Loads only the animation features the site uses — enter and exit
 * transitions — rather than framer-motion's full bundle, on every page.
 * Components use `m.div` rather than `motion.div`; `strict` makes a stray
 * `motion.*` throw in development instead of quietly pulling the rest back in.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
