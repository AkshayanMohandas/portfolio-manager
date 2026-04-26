"use client";

import { Group, Stack, Text } from "@mantine/core";
import { ConcentrationMetrics } from "../../utils/insightUtils";
import { formatAum } from "../../utils/riskUtils";

interface ConcentrationCardProps {
  label: string;
  name: string;
  amount: number;
  pct: number;
}

function ConcentrationCard({
  label,
  name,
  amount,
  pct,
}: ConcentrationCardProps) {
  return (
    <Stack
      gap={4}
      style={{
        minWidth: 180,
        flex: 1,
        padding: "10px 12px",
        border: "1px solid #e2e8f0",
        borderRadius: 10,
        backgroundColor: "#fff",
      }}
    >
      <Text
        size="xs"
        c="dimmed"
        tt="uppercase"
        fw={500}
        style={{ letterSpacing: "0.05em" }}
      >
        {label}
      </Text>
      <Text size="sm" fw={600} style={{ color: "#0f172a" }} lineClamp={1}>
        {name}
      </Text>
      <Text size="xs" c="dimmed">
        {formatAum(amount)} ({pct.toFixed(1)}% of portfolio)
      </Text>
    </Stack>
  );
}

interface ConcentrationBarProps {
  metrics: ConcentrationMetrics;
}

export function ConcentrationBar({ metrics }: ConcentrationBarProps) {
  return (
    <Group gap={10} mb={16} wrap="wrap">
      <ConcentrationCard
        label="Top fund exposure"
        name={metrics.topFund.label}
        amount={metrics.topFund.amount}
        pct={metrics.topFund.pctOfPortfolio}
      />
      <ConcentrationCard
        label="Top sector exposure"
        name={metrics.topSector.label}
        amount={metrics.topSector.amount}
        pct={metrics.topSector.pctOfPortfolio}
      />
      <ConcentrationCard
        label="Top country exposure"
        name={metrics.topCountry.label}
        amount={metrics.topCountry.amount}
        pct={metrics.topCountry.pctOfPortfolio}
      />
      <ConcentrationCard
        label="Top company exposure"
        name={metrics.topCompany.label}
        amount={metrics.topCompany.amount}
        pct={metrics.topCompany.pctOfPortfolio}
      />
    </Group>
  );
}
