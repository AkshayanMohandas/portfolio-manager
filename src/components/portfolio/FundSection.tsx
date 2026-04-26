"use client";

import {
  Group,
  Text,
  Stack,
  Badge,
  ActionIcon,
  Collapse,
  Divider,
  Tooltip,
} from "@mantine/core";
import {
  IconChevronDown,
  IconChevronUp,
  IconAlertTriangle,
  IconBuildingSkyscraper,
  IconCurrencyDollar,
  IconGlobe,
  IconTarget,
} from "@tabler/icons-react";
import { Company, Fund, FundStats, SortField, SortState } from "../../types";
import {
  formatAum,
  formatScore,
  getRiskLevel,
  RISK_COLOR,
  RISK_LABEL,
} from "../../utils/riskUtils";
import { compareToBenchmark } from "../../utils/insightUtils";
import { RiskBadge } from "./RiskBadge";
import { RiskDistributionBar } from "./RiskDistributionBar";
import { CompanyTable } from "./CompanyTable";

interface FundSectionProps {
  fund: Fund;
  stats: FundStats;
  companies: Company[];
  portfolioAvgRisk: number;
  expanded: boolean;
  onToggle: () => void;
  sortState: SortState;
  onSort: (field: SortField) => void;
  onMoveClick: (company: Company) => void;
}

export function FundSection({
  fund,
  stats,
  companies,
  portfolioAvgRisk,
  expanded,
  onToggle,
  sortState,
  onSort,
  onMoveClick,
}: FundSectionProps) {
  const riskLevel = getRiskLevel(stats.weightedRiskScore);
  const benchmark = compareToBenchmark(
    stats.weightedRiskScore,
    portfolioAvgRisk,
  );
  const riskDrivers = [
    { label: "Physical", score: stats.avgPhysicalRisk },
    { label: "Nature", score: stats.avgNatureRisk },
    { label: "Transition", score: stats.avgTransitionRisk },
  ];
  const topDriver = [...riskDrivers].sort((a, b) => b.score - a.score)[0];
  const utilizationPct =
    stats.totalAum > 0
      ? Math.min((stats.totalAum / fund.targetSize) * 100, 100)
      : 0;

  return (
    <div
      style={{
        backgroundColor: "#fff",
        border: "1px solid #e2e8f0",
        borderRadius: 12,
        overflow: "hidden",
        transition: "box-shadow 0.15s",
      }}
    >
      {/* Fund header */}
      <div
        onClick={onToggle}
        style={{
          padding: "16px 20px",
          cursor: "pointer",
          backgroundColor: expanded ? "#fff" : "#fafbfc",
          transition: "background-color 0.1s",
          userSelect: "none",
        }}
      >
        <Group justify="space-between" align="flex-start" wrap="nowrap">
          <Stack gap={6} style={{ flex: 1, minWidth: 0 }}>
            <Group gap={10} align="center" wrap="nowrap">
              <Text fw={700} size="md" style={{ color: "#0f172a" }}>
                {fund.name}
              </Text>
              <Badge
                variant="outline"
                color="gray"
                size="xs"
                radius="sm"
                style={{ fontWeight: 500 }}
              >
                {fund.vintage}
              </Badge>
              {stats.highestRiskCompany &&
                getRiskLevel(stats.highestRiskCompany.score) === "extreme" && (
                  <Tooltip
                    label={`Highest risk: ${stats.highestRiskCompany.name} (${stats.highestRiskCompany.score.toFixed(1)})`}
                    withArrow
                  >
                    <span
                      style={{
                        color: "#dc2626",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <IconAlertTriangle size={14} />
                    </span>
                  </Tooltip>
                )}
            </Group>

            <Text size="xs" c="dimmed">
              {fund.focus}
            </Text>

            {/* Stats row */}
            <Group gap={20} mt={4} wrap="wrap">
              <Group gap={5}>
                <IconCurrencyDollar size={12} color="#94a3b8" />
                <Text size="xs" c="dimmed">
                  <strong style={{ color: "#374151" }}>
                    {formatAum(stats.totalAum)}
                  </strong>{" "}
                  deployed
                </Text>
                <Text size="xs" c="dimmed">
                  ({utilizationPct.toFixed(0)}% of {formatAum(fund.targetSize)}{" "}
                  target)
                </Text>
              </Group>

              <Group gap={5}>
                <IconBuildingSkyscraper size={12} color="#94a3b8" />
                <Text size="xs" c="dimmed">
                  <strong style={{ color: "#374151" }}>
                    {stats.companyCount}
                  </strong>{" "}
                  {stats.companyCount === 1 ? "company" : "companies"}
                </Text>
              </Group>

              <Group gap={5}>
                <IconGlobe size={12} color="#94a3b8" />
                <Text size="xs" c="dimmed">
                  <strong style={{ color: "#374151" }}>
                    {stats.countriesCount}
                  </strong>{" "}
                  {stats.countriesCount === 1 ? "country" : "countries"}
                </Text>
              </Group>

              {stats.topSectors.length > 0 && (
                <Group gap={5}>
                  <IconTarget size={12} color="#94a3b8" />
                  <Text size="xs" c="dimmed">
                    {stats.topSectors.map((s) => s.sector).join(", ")}
                  </Text>
                </Group>
              )}
            </Group>
          </Stack>

          {/* Right: risk score + distribution */}
          <Group gap={24} align="center" wrap="nowrap">
            {/* Weighted risk score */}
            <Stack gap={2} align="flex-end">
              <Text
                size="xs"
                c="dimmed"
                tt="uppercase"
                fw={500}
                style={{ letterSpacing: "0.05em" }}
              >
                Wtd. risk
              </Text>
              <Group gap={8} align="center">
                <Text
                  fw={800}
                  size="xl"
                  style={{ color: RISK_COLOR[riskLevel], lineHeight: 1 }}
                >
                  {formatScore(stats.weightedRiskScore)}
                </Text>
                <RiskBadge level={riskLevel} />
              </Group>
              <Text size="xs" c="dimmed">
                P {formatScore(stats.avgPhysicalRisk)} · N{" "}
                {formatScore(stats.avgNatureRisk)} · T{" "}
                {formatScore(stats.avgTransitionRisk)}
              </Text>
              <Text size="xs" style={{ color: benchmark.color }}>
                {benchmark.label} vs portfolio ({benchmark.delta > 0 ? "+" : ""}
                {formatScore(benchmark.delta)})
              </Text>
              <Text size="xs" c="dimmed">
                Driver: {topDriver.label}
              </Text>
            </Stack>

            {/* Risk distribution */}
            {stats.companyCount > 0 && (
              <Stack gap={4} style={{ minWidth: 140 }}>
                <Text
                  size="xs"
                  c="dimmed"
                  tt="uppercase"
                  fw={500}
                  style={{ letterSpacing: "0.05em" }}
                >
                  Distribution
                </Text>
                <RiskDistributionBar
                  distribution={stats.riskDistribution}
                  total={stats.companyCount}
                  height={8}
                />
                <Group gap={8} wrap="nowrap">
                  {(["extreme", "high", "medium", "low"] as const).map(
                    (level) => {
                      const count = stats.riskDistribution[level];
                      if (count === 0) return null;
                      return (
                        <Text key={level} size="xs" c="dimmed">
                          <span
                            style={{
                              color: RISK_COLOR[level],
                              fontWeight: 600,
                            }}
                          >
                            {count}
                          </span>{" "}
                          {RISK_LABEL[level]}
                        </Text>
                      );
                    },
                  )}
                </Group>
              </Stack>
            )}

            <ActionIcon
              variant="subtle"
              color="gray"
              onClick={(e) => {
                e.stopPropagation();
                onToggle();
              }}
              aria-label={expanded ? "Collapse" : "Expand"}
            >
              {expanded ? (
                <IconChevronUp size={16} />
              ) : (
                <IconChevronDown size={16} />
              )}
            </ActionIcon>
          </Group>
        </Group>
      </div>

      {/* Company table */}
      <Collapse in={expanded}>
        <Divider color="#f1f5f9" />
        <CompanyTable
          companies={companies}
          portfolioAvgRisk={portfolioAvgRisk}
          sortState={sortState}
          onSort={onSort}
          onMoveClick={onMoveClick}
        />
        {companies.length > 0 && (
          <div
            style={{
              padding: "8px 20px",
              backgroundColor: "#f8fafc",
              borderTop: "1px solid #f1f5f9",
            }}
          >
            <Text size="xs" c="dimmed">
              {companies.length} of {stats.companyCount}{" "}
              {stats.companyCount === 1 ? "company" : "companies"} shown
              {companies.length < stats.companyCount &&
                " — some are hidden by filters"}
            </Text>
          </div>
        )}
      </Collapse>
    </div>
  );
}
