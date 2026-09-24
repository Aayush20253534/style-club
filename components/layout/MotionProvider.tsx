"use client";

import { MotionConfig } from "framer-motion";

/** Honour the OS reduced-motion setting: transform/layout animations become instant. */
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
