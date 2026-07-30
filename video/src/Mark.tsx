import React from "react";
import { T } from "./theme";

/**
 * The Changeloom mark: three changelog entries with a cobalt thread drawn
 * through them. `draw` (0..1) animates the thread being pulled through.
 */
export const Mark: React.FC<{ size: number; draw?: number }> = ({
  size,
  draw = 1,
}) => {
  // The diagonal is ~23 units long in the 32-unit viewBox.
  const len = 23.4;
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect x="6" y="8.5" width="20" height="3.5" rx="1.75" fill={T.ink} opacity={0.92} />
      <rect x="6" y="20" width="17" height="3.5" rx="1.75" fill={T.ink} opacity={0.92} />
      <path
        d="M9.5 25.5 L 22.5 6.5"
        stroke={T.cobalt}
        strokeWidth={3.2}
        strokeLinecap="round"
        strokeDasharray={len}
        strokeDashoffset={len * (1 - draw)}
      />
      <rect x="6" y="14.25" width="14" height="3.5" rx="1.75" fill={T.ink} opacity={0.92} />
    </svg>
  );
};
