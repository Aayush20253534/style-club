"use client";

import { motion, useReducedMotion, type HTMLMotionProps, type Variants } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

type RevealProps = HTMLMotionProps<"div"> & { delay?: number; y?: number };

/** Restrained rise-and-fade used for headings and copy. */
export function Reveal({ delay = 0, y = 28, children, ...rest }: RevealProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: reduce ? 0.2 : 0.8, ease: EASE, delay: reduce ? 0 : delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/**
 * Line-by-line headline reveal: each line slides up from behind a mask.
 * The in-view trigger lives on the (unclipped) wrapper — the masked lines
 * themselves start fully clipped, so they can't be observed directly.
 */
export function MaskLines({
  lines,
  className = "",
  lineClassName = "",
  delay = 0,
}: {
  lines: React.ReactNode[];
  className?: string;
  lineClassName?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const line: Variants = {
    hidden: { y: "105%" },
    show: (i: number) => ({
      y: "0%",
      transition: reduce ? { duration: 0 } : { duration: 0.9, ease: EASE, delay: delay + i * 0.08 },
    }),
  };

  return (
    <motion.span
      className={`block ${className}`}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
    >
      {lines.map((l, i) => (
        <span key={i} className="block overflow-hidden pb-[0.06em]">
          <motion.span className={`block ${lineClassName}`} variants={line} custom={i}>
            {l}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
