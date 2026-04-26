"use client";

import { Group, Text, Stack, Divider } from "@mantine/core";
import {
  IconBuildingSkyscraper,
  IconAlertTriangle,
  IconChartBar,
  IconCurrencyDollar,
} from "@tabler/icons-react";
import { PortfolioSummary } from "../../types";
import {
  formatAum,
  formatScoreFull,
  getRiskLevel,
  RISK_COLOR,
} from "../../utils/riskUtils";

interface KpiCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  valueColor?: string;
}

function KpiCard({ icon, label, value, sub, valueColor }: KpiCardProps) {
  return (
    <Stack gap={2} style={{ minWidth: 130 }}>
      <Group gap={6} align="center">
        <span style={{ color: "#94a3b8", display: "flex" }}>{icon}</span>
        <Text
          size="xs"
          c="dimmed"
          tt="uppercase"
          fw={500}
          style={{ letterSpacing: "0.05em" }}
        >
          {label}
        </Text>
      </Group>
      <Text
        fw={700}
        size="xl"
        style={{ color: valueColor ?? "#0f172a", lineHeight: 1.1 }}
      >
        {value}
      </Text>
      {sub && (
        <Text size="xs" c="dimmed">
          {sub}
        </Text>
      )}
    </Stack>
  );
}

interface PortfolioSummaryBarProps {
  summary: PortfolioSummary;
}

export function PortfolioSummaryBar({ summary }: PortfolioSummaryBarProps) {
  const riskLevel = getRiskLevel(summary.avgRiskScore);

  return (
    <div
      style={{
        backgroundColor: "#fff",
        border: "1px solid #e2e8f0",
        borderRadius: 12,
        padding: "20px 28px",
        marginBottom: 20,
      }}
    >
      <Group gap={0} wrap="nowrap" align="flex-start">
        <KpiCard
          icon={<IconCurrencyDollar size={14} />}
          label="Total AUM"
          value={formatAum(summary.totalAum)}
          sub={`Across ${summary.fundCount} funds`}
        />

        <Divider orientation="vertical" mx={28} />

        <KpiCard
          icon={<IconBuildingSkyscraper size={14} />}
          label="Companies"
          value={String(summary.totalCompanies)}
          sub={`${summary.fundCount} funds`}
        />

        <Divider orientation="vertical" mx={28} />

        <KpiCard
          icon={<IconChartBar size={14} />}
          label="Avg Risk Score"
          value={formatScoreFull(summary.avgRiskScore)}
          sub="Unweighted average"
          valueColor={RISK_COLOR[riskLevel]}
        />

        <Divider orientation="vertical" mx={28} />

        <KpiCard
          icon={<IconAlertTriangle size={14} />}
          label="At High+ Risk"
          value={String(summary.atHighRisk)}
          sub={`of ${summary.totalCompanies} companies`}
          valueColor={summary.atHighRisk > 0 ? "#dc2626" : undefined}
        />

        <Divider orientation="vertical" mx={28} />

        <Stack gap={4} style={{ minWidth: 180 }}>
          <Text
            size="xs"
            c="dimmed"
            tt="uppercase"
            fw={500}
            style={{ letterSpacing: "0.05em" }}
          >
            Dimensional risk
          </Text>
          <Text size="sm" c="dimmed">
            Physical:{" "}
            <strong style={{ color: "#0f172a" }}>
              {formatScoreFull(summary.avgPhysicalRisk)}
            </strong>
          </Text>
          <Text size="sm" c="dimmed">
            Nature:{" "}
            <strong style={{ color: "#0f172a" }}>
              {formatScoreFull(summary.avgNatureRisk)}
            </strong>
          </Text>
          <Text size="sm" c="dimmed">
            Transition:{" "}
            <strong style={{ color: "#0f172a" }}>
              {formatScoreFull(summary.avgTransitionRisk)}
            </strong>
          </Text>
        </Stack>

        <div style={{ marginLeft: "auto", minWidth: 200 }}>
          <Text
            size="xs"
            c="dimmed"
            tt="uppercase"
            fw={500}
            mb={8}
            style={{ letterSpacing: "0.05em" }}
          >
            Risk breakdown
          </Text>
          <Stack gap={4}>
            {(
              [
                ["extreme", "Extreme", "#7f1d1d"],
                ["high", "High", "#dc2626"],
                ["medium", "Mid", "#d97706"],
                ["low", "Low", "#16a34a"],
              ] as const
            ).map(([level, label, color]) => {
              const count = summary.riskDistribution[level];
              const pct =
                summary.totalCompanies > 0
                  ? (count / summary.totalCompanies) * 100
                  : 0;
              return (
                <Group key={level} gap={8} align="center" wrap="nowrap">
                  <Text size="xs" c="dimmed" style={{ width: 42 }}>
                    {label}
                  </Text>
                  <div
                    style={{
                      flex: 1,
                      height: 6,
                      borderRadius: 100,
                      backgroundColor: "#f1f5f9",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${pct}%`,
                        height: "100%",
                        backgroundColor: color,
                        borderRadius: 100,
                        transition: "width 0.3s ease",
                      }}
                    />
                  </div>
                  <Text
                    size="xs"
                    c="dimmed"
                    style={{ width: 16, textAlign: "right" }}
                  >
                    {count}
                  </Text>
                </Group>
              );
            })}
          </Stack>
        </div>
      </Group>
    </div>
  );
}
