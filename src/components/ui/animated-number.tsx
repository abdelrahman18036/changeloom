"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useReducedMotion } from "motion/react";

/** Count-up with tabular-nums; respects prefers-reduced-motion. */
export function AnimatedNumber({
  value,
  className,
  format = (n) => Math.round(n).toLocaleString(),
}: {
  value: number;
  className?: string;
  format?: (n: number) => string;
}) {
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(reduce ? value : 0);
  // Seed the animation origin to the same starting point as `display` so the
  // first mount actually counts up from 0 → value (not value → value).
  const node = useRef(reduce ? value : 0);

  useEffect(() => {
    if (reduce) {
      setDisplay(value);
      node.current = value;
      return;
    }
    const controls = animate(node.current, value, {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(v),
    });
    node.current = value;
    return () => controls.stop();
  }, [value, reduce]);

  return (
    <span className={className} style={{ fontVariantNumeric: "tabular-nums" }}>
      {format(display)}
    </span>
  );
}
