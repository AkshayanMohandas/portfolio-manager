"use client";

import {
  Group,
  TextInput,
  MultiSelect,
  Button,
  Badge,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import {
  IconSearch,
  IconFilter,
  IconX,
  IconChevronDown,
  IconChevronUp,
} from "@tabler/icons-react";
import { FilterState, RiskLevel } from "../../types";

interface PortfolioFiltersProps {
  filters: FilterState;
  onUpdate: (partial: Partial<FilterState>) => void;
  onClear: () => void;
  activeCount: number;
  availableSectors: string[];
  availableCountries: string[];
  expandedCount: number;
  totalFunds: number;
  onExpandAll: () => void;
  onCollapseAll: () => void;
}

const RISK_LEVEL_OPTIONS: { value: RiskLevel; label: string }[] = [
  { value: "extreme", label: "Extreme" },
  { value: "high", label: "High" },
  { value: "medium", label: "Mid" },
  { value: "low", label: "Low" },
];

export function PortfolioFilters({
  filters,
  onUpdate,
  onClear,
  activeCount,
  availableSectors,
  availableCountries,
  expandedCount,
  totalFunds,
  onExpandAll,
  onCollapseAll,
}: PortfolioFiltersProps) {
  const allExpanded = expandedCount === totalFunds;

  return (
    <Group
      gap="sm"
      mb={16}
      wrap="wrap"
      align="center"
      style={{
        padding: "12px 16px",
        backgroundColor: "#fff",
        border: "1px solid #e2e8f0",
        borderRadius: 10,
      }}
    >
      <TextInput
        placeholder="Search companies, sectors, countries…"
        leftSection={<IconSearch size={14} color="#94a3b8" />}
        value={filters.search}
        onChange={(e) => onUpdate({ search: e.currentTarget.value })}
        style={{ flex: "1 1 220px", minWidth: 180 }}
        radius="md"
        size="sm"
        rightSection={
          filters.search ? (
            <ActionIcon
              size="xs"
              variant="subtle"
              color="gray"
              onClick={() => onUpdate({ search: "" })}
            >
              <IconX size={12} />
            </ActionIcon>
          ) : null
        }
      />

      <MultiSelect
        placeholder="Sector"
        data={availableSectors}
        value={filters.sectors}
        onChange={(v) => onUpdate({ sectors: v })}
        style={{ minWidth: 140, flex: "0 0 auto" }}
        radius="md"
        size="sm"
        clearable
        searchable
        maxDropdownHeight={200}
        leftSection={<IconFilter size={12} color="#94a3b8" />}
        comboboxProps={{ withinPortal: true }}
      />

      <MultiSelect
        placeholder="Country"
        data={availableCountries}
        value={filters.countries}
        onChange={(v) => onUpdate({ countries: v })}
        style={{ minWidth: 140, flex: "0 0 auto" }}
        radius="md"
        size="sm"
        clearable
        searchable
        maxDropdownHeight={200}
        comboboxProps={{ withinPortal: true }}
      />

      <MultiSelect
        placeholder="Risk level"
        data={RISK_LEVEL_OPTIONS.map((r) => ({
          value: r.value,
          label: r.label,
        }))}
        value={filters.riskLevels}
        onChange={(v) => onUpdate({ riskLevels: v as RiskLevel[] })}
        style={{ minWidth: 130, flex: "0 0 auto" }}
        radius="md"
        size="sm"
        clearable
        comboboxProps={{ withinPortal: true }}
      />

      {activeCount > 0 && (
        <Button
          variant="subtle"
          color="red"
          size="sm"
          leftSection={<IconX size={12} />}
          onClick={onClear}
          style={{ fontWeight: 500 }}
        >
          Clear{" "}
          <Badge size="xs" color="red" circle ml={4}>
            {activeCount}
          </Badge>
        </Button>
      )}

      <div style={{ marginLeft: "auto" }}>
        <Tooltip
          label={allExpanded ? "Collapse all funds" : "Expand all funds"}
          withArrow
        >
          <Button
            variant="subtle"
            color="gray"
            size="sm"
            leftSection={
              allExpanded ? (
                <IconChevronUp size={14} />
              ) : (
                <IconChevronDown size={14} />
              )
            }
            onClick={allExpanded ? onCollapseAll : onExpandAll}
          >
            {allExpanded ? "Collapse all" : "Expand all"}
          </Button>
        </Tooltip>
      </div>
    </Group>
  );
}
