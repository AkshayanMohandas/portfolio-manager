"use client";

import { RiskLevel } from "../../types";
import {
  RISK_LABEL,
  RISK_COLOR,
  RISK_BG,
  RISK_BORDER,
} from "../../utils/riskUtils";

interface RiskBadgeProps {
  level: RiskLevel;
  size?: "sm" | "md" | "lg";
}

const SIZE_STYLES = {
  sm: { fontSize: 10, px: 6, py: 2 },
  md: { fontSize: 11, px: 8, py: 3 },
  lg: { fontSize: 12, px: 10, py: 4 },
};

export function RiskBadge({ level, size = "md" }: RiskBadgeProps) {
  const s = SIZE_STYLES[size];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        backgroundColor: RISK_BG[level],
        color: RISK_COLOR[level],
        border: `1px solid ${RISK_BORDER[level]}`,
        borderRadius: 4,
        paddingLeft: s.px,
        paddingRight: s.px,
        paddingTop: s.py,
        paddingBottom: s.py,
        fontWeight: 600,
        fontSize: s.fontSize,
        letterSpacing: "0.04em",
        lineHeight: 1,
        whiteSpace: "nowrap",
      }}
    >
      {RISK_LABEL[level]}
    </span>
  );
}
