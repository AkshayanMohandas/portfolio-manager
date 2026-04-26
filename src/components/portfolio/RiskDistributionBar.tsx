"use client";

import { Tooltip } from "@mantine/core";
import { RiskLevel } from "../../types";
import {
  RISK_COLOR,
  RISK_LABEL,
} from "../../utils/riskUtils";

interface RiskDistributionBarProps {
  distribution: Record<RiskLevel, number>;
  total: number;
  height?: number;
}

const RISK_LEVELS: RiskLevel[] = ["low", "medium", "high", "extreme"];

export function RiskDistributionBar({
  distribution,
  total,
  height = 8,
}: RiskDistributionBarProps) {
  if (total === 0) {
    return (
      <div
        style={{
          height,
          borderRadius: 100,
          backgroundColor: "#e5e7eb",
          width: "100%",
        }}
      />
    );
  }

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height,
        borderRadius: 100,
        overflow: "hidden",
        gap: 1,
      }}
    >
      {RISK_LEVELS.map((level) => {
        const count = distribution[level];
        if (count === 0) return null;
        const pct = (count / total) * 100;
        return (
          <Tooltip
            key={level}
            label={`${RISK_LABEL[level]}: ${count} ${count === 1 ? "company" : "companies"}`}
            withArrow
          >
            <div
              style={{
                flex: pct,
                backgroundColor: RISK_COLOR[level],
                cursor: "default",
                transition: "opacity 0.15s",
              }}
            />
          </Tooltip>
        );
      })}
    </div>
  );
}
