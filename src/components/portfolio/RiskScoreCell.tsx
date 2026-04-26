"use client";

import { Tooltip, Group } from "@mantine/core";
import { getRiskLevel, RISK_COLOR, RISK_BG } from "../../utils/riskUtils";

interface SubScoreProps {
  label: string;
  score: number;
}

function SubScore({ label, score }: SubScoreProps) {
  const level = getRiskLevel(score);
  return (
    <Tooltip label={`${label}: ${score.toFixed(1)}`} withArrow>
      <span
        style={{
          fontSize: 10,
          fontWeight: 600,
          padding: "2px 5px",
          borderRadius: 3,
          backgroundColor: RISK_BG[level],
          color: RISK_COLOR[level],
          cursor: "default",
          letterSpacing: "0.02em",
        }}
      >
        {label[0]}
        {score.toFixed(1)}
      </span>
    </Tooltip>
  );
}

interface RiskScoreCellProps {
  physicalRisk: number;
  natureRisk: number;
  transitionRisk: number;
}

export function RiskScoreCell({
  physicalRisk,
  natureRisk,
  transitionRisk,
}: RiskScoreCellProps) {
  return (
    <Group gap={4} wrap="nowrap">
      <SubScore label="Physical" score={physicalRisk} />
      <SubScore label="Nature" score={natureRisk} />
      <SubScore label="Transition" score={transitionRisk} />
    </Group>
  );
}
