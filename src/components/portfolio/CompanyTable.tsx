"use client";

import { Table, Text, ActionIcon, Tooltip, Group } from "@mantine/core";
import { IconArrowsTransferUp, IconMapPin } from "@tabler/icons-react";
import { Company, SortField, SortState } from "../../types";
import {
  getRiskLevel,
  RISK_COLOR,
  formatAum,
  formatScore,
} from "../../utils/riskUtils";
import { compareToBenchmark } from "../../utils/insightUtils";
import { RiskBadge } from "./RiskBadge";
import { RiskScoreCell } from "./RiskScoreCell";

interface SortHeaderProps {
  field: SortField;
  label: string;
  sortState: SortState;
  onSort: (field: SortField) => void;
  align?: "left" | "right";
}

function SortHeader({
  field,
  label,
  sortState,
  onSort,
  align = "left",
}: SortHeaderProps) {
  const active = sortState.field === field;
  return (
    <Table.Th
      style={{
        textAlign: align,
        cursor: "pointer",
        userSelect: "none",
        whiteSpace: "nowrap",
        color: active ? "#1e3a5f" : "#64748b",
        fontWeight: 600,
        fontSize: 11,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        padding: "10px 12px",
      }}
      onClick={() => onSort(field)}
    >
      <Group
        gap={4}
        justify={align === "right" ? "flex-end" : "flex-start"}
        wrap="nowrap"
      >
        {label}
        <span style={{ opacity: active ? 1 : 0.4, fontSize: 12 }}>
          {active ? (sortState.dir === "desc" ? "↓" : "↑") : "↕"}
        </span>
      </Group>
    </Table.Th>
  );
}

interface CompanyTableProps {
  companies: Company[];
  portfolioAvgRisk: number;
  sortState: SortState;
  onSort: (field: SortField) => void;
  onMoveClick: (company: Company) => void;
}

export function CompanyTable({
  companies,
  portfolioAvgRisk,
  sortState,
  onSort,
  onMoveClick,
}: CompanyTableProps) {
  if (companies.length === 0) {
    return (
      <div
        style={{
          padding: "32px 24px",
          textAlign: "center",
          color: "#94a3b8",
        }}
      >
        <Text size="sm">No companies match the current filters.</Text>
      </div>
    );
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <Table
        striped
        highlightOnHover
        style={{ minWidth: 860 }}
        styles={{
          td: { padding: "10px 12px", verticalAlign: "middle" },
          tr: { borderBottom: "1px solid #f1f5f9" },
        }}
      >
        <Table.Thead style={{ backgroundColor: "#f8fafc" }}>
          <Table.Tr>
            <SortHeader
              field="name"
              label="Company"
              sortState={sortState}
              onSort={onSort}
            />
            <SortHeader
              field="sector"
              label="Sector"
              sortState={sortState}
              onSort={onSort}
            />
            <SortHeader
              field="country"
              label="Country"
              sortState={sortState}
              onSort={onSort}
            />
            <SortHeader
              field="investedAmount"
              label="Invested"
              sortState={sortState}
              onSort={onSort}
              align="right"
            />
            <SortHeader
              field="riskScore"
              label="Risk score"
              sortState={sortState}
              onSort={onSort}
              align="right"
            />
            <Table.Th
              style={{
                fontSize: 11,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "#64748b",
                fontWeight: 600,
                padding: "10px 12px",
              }}
            >
              P · N · T
            </Table.Th>
            <Table.Th
              style={{
                fontSize: 11,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "#64748b",
                fontWeight: 600,
                padding: "10px 12px",
                textAlign: "center",
              }}
            >
              Assets
            </Table.Th>
            <Table.Th style={{ width: 48, padding: "10px 12px" }} />
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {companies.map((company) => {
            const level = getRiskLevel(company.riskScore);
            const benchmark = compareToBenchmark(
              company.riskScore,
              portfolioAvgRisk,
              0.1,
            );
            return (
              <Table.Tr key={company.id}>
                {/* Name */}
                <Table.Td>
                  <Text size="sm" fw={500} style={{ color: "#0f172a" }}>
                    {company.name}
                  </Text>
                </Table.Td>

                {/* Sector */}
                <Table.Td>
                  <Text size="sm" c="dimmed">
                    {company.sector}
                  </Text>
                </Table.Td>

                {/* Country */}
                <Table.Td>
                  <Text size="sm" c="dimmed">
                    {company.country}
                  </Text>
                </Table.Td>

                {/* Invested */}
                <Table.Td style={{ textAlign: "right" }}>
                  <Text size="sm" fw={500}>
                    {formatAum(company.investedAmount)}
                  </Text>
                </Table.Td>

                {/* Risk score */}
                <Table.Td style={{ textAlign: "right" }}>
                  <div>
                    <Group gap={8} justify="flex-end" wrap="nowrap">
                      <Text
                        size="sm"
                        fw={700}
                        style={{ color: RISK_COLOR[level] }}
                      >
                        {formatScore(company.riskScore)}
                      </Text>
                      <RiskBadge level={level} size="sm" />
                    </Group>
                    <Text size="xs" style={{ color: benchmark.color }}>
                      {benchmark.delta > 0 ? "+" : ""}
                      {formatScore(benchmark.delta)} vs avg
                    </Text>
                  </div>
                </Table.Td>

                {/* Sub-scores */}
                <Table.Td>
                  <RiskScoreCell
                    physicalRisk={company.physicalRisk}
                    natureRisk={company.natureRisk}
                    transitionRisk={company.transitionRisk}
                  />
                </Table.Td>

                {/* Asset count */}
                <Table.Td style={{ textAlign: "center" }}>
                  <Tooltip
                    label={company.assets.map((a) => a.name).join(", ")}
                    withArrow
                    multiline
                    maw={200}
                    disabled={company.assets.length === 0}
                  >
                    <Group
                      gap={4}
                      justify="center"
                      style={{ cursor: "default" }}
                    >
                      <IconMapPin size={12} color="#94a3b8" />
                      <Text size="xs" c="dimmed">
                        {company.assets.length}
                      </Text>
                    </Group>
                  </Tooltip>
                </Table.Td>

                {/* Move action */}
                <Table.Td style={{ textAlign: "right" }}>
                  <Tooltip label="Move to another fund" withArrow>
                    <ActionIcon
                      variant="subtle"
                      color="gray"
                      size="sm"
                      onClick={() => onMoveClick(company)}
                      aria-label={`Move ${company.name} to another fund`}
                    >
                      <IconArrowsTransferUp size={14} />
                    </ActionIcon>
                  </Tooltip>
                </Table.Td>
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>
    </div>
  );
}
