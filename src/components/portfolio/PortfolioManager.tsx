"use client";

import { useMemo, useState } from "react";
import { Stack, Text, Notification } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import { Company, Fund } from "../../types";
import { usePortfolio } from "../../hooks/usePortfolio";
import { PortfolioSummaryBar } from "./PortfolioSummaryBar";
import { ConcentrationBar } from "./ConcentrationBar";
import { PortfolioTrendChart } from "./PortfolioTrendChart";
import { PortfolioFilters } from "./PortfolioFilters";
import { FundSection } from "./FundSection";
import { MoveCompanyModal } from "./MoveCompanyModal";
import {
  buildPortfolioTrendSeries,
  getConcentrationMetrics,
} from "../../utils/insightUtils";

interface PortfolioManagerProps {
  initialCompanies: Company[];
  funds: Fund[];
}

export function PortfolioManager({
  initialCompanies,
  funds,
}: PortfolioManagerProps) {
  const {
    companies,
    sortedCompaniesForFund,
    fundStats,
    portfolioSummary,
    availableSectors,
    availableCountries,
    filters,
    updateFilters,
    clearFilters,
    activeFilterCount,
    sortState,
    setSort,
    moveCompany,
    expandedFunds,
    toggleFund,
    expandAll,
    collapseAll,
  } = usePortfolio(initialCompanies, funds);
  const concentrationMetrics = useMemo(
    () => getConcentrationMetrics(companies, funds),
    [companies, funds],
  );
  const trendSeries = useMemo(
    () => buildPortfolioTrendSeries(companies),
    [companies],
  );

  const [movingCompany, setMovingCompany] = useState<Company | null>(null);
  const [recentMove, setRecentMove] = useState<{
    companyName: string;
    fundName: string;
  } | null>(null);

  function handleMove(companyId: string, targetFundId: string) {
    const targetFund = funds.find((f) => f.id === targetFundId);
    const company = movingCompany;

    moveCompany(companyId, targetFundId);

    if (company && targetFund) {
      setRecentMove({ companyName: company.name, fundName: targetFund.name });
      setTimeout(() => setRecentMove(null), 3500);
    }
  }

  return (
    <div style={{ position: "relative" }}>
      <PortfolioSummaryBar summary={portfolioSummary} />
      <ConcentrationBar metrics={concentrationMetrics} />
      <PortfolioTrendChart data={trendSeries} />

      <PortfolioFilters
        filters={filters}
        onUpdate={updateFilters}
        onClear={clearFilters}
        activeCount={activeFilterCount}
        availableSectors={availableSectors}
        availableCountries={availableCountries}
        expandedCount={expandedFunds.length}
        totalFunds={funds.length}
        onExpandAll={expandAll}
        onCollapseAll={collapseAll}
      />

      <Stack gap={12}>
        {funds.map((fund) => {
          const stats = fundStats[fund.id];
          const fundCompanies = sortedCompaniesForFund(fund.id);

          return (
            <FundSection
              key={fund.id}
              fund={fund}
              stats={stats}
              companies={fundCompanies}
              portfolioAvgRisk={portfolioSummary.avgRiskScore}
              expanded={expandedFunds.includes(fund.id)}
              onToggle={() => toggleFund(fund.id)}
              sortState={sortState}
              onSort={setSort}
              onMoveClick={setMovingCompany}
            />
          );
        })}
      </Stack>

      <MoveCompanyModal
        company={movingCompany}
        companies={companies}
        funds={funds}
        onMove={handleMove}
        onClose={() => setMovingCompany(null)}
      />

      {recentMove && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 1000,
          }}
        >
          <Notification
            icon={<IconCheck size={16} />}
            color="green"
            title="Company moved"
            onClose={() => setRecentMove(null)}
          >
            <Text size="sm">
              <strong>{recentMove.companyName}</strong> moved to{" "}
              <strong>{recentMove.fundName}</strong>
            </Text>
          </Notification>
        </div>
      )}
    </div>
  );
}
