import { useState, useMemo, useCallback } from "react";
import {
  Company,
  Fund,
  FundStats,
  FilterState,
  PortfolioSummary,
  RiskLevel,
  SortField,
  SortState,
} from "../types";
import { getRiskLevel } from "../utils/riskUtils";

interface UsePortfolioReturn {
  // Data
  companies: Company[];
  sortedCompaniesForFund: (fundId: string) => Company[];
  fundStats: Record<string, FundStats>;
  portfolioSummary: PortfolioSummary;
  availableSectors: string[];
  availableCountries: string[];

  // Filters & sort
  filters: FilterState;
  updateFilters: (partial: Partial<FilterState>) => void;
  clearFilters: () => void;
  activeFilterCount: number;
  sortState: SortState;
  setSort: (field: SortField) => void;

  // Actions
  moveCompany: (companyId: string, targetFundId: string) => void;

  // Accordion
  expandedFunds: string[];
  toggleFund: (fundId: string) => void;
  expandAll: () => void;
  collapseAll: () => void;
}

const DEFAULT_FILTERS: FilterState = {
  search: "",
  sectors: [],
  countries: [],
  riskLevels: [],
};

export function usePortfolio(
  initialCompanies: Company[],
  funds: Fund[],
): UsePortfolioReturn {
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [sortState, setSortState] = useState<SortState>({
    field: "riskScore",
    dir: "desc",
  });
  const [expandedFunds, setExpandedFunds] = useState<string[]>(
    funds.map((f) => f.id),
  );

  // Actions

  const moveCompany = useCallback((companyId: string, targetFundId: string) => {
    setCompanies((prev) =>
      prev.map((c) =>
        c.id === companyId ? { ...c, fundId: targetFundId } : c,
      ),
    );
  }, []);

  const updateFilters = useCallback((partial: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...partial }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const setSort = useCallback((field: SortField) => {
    setSortState((prev) => ({
      field,
      dir: prev.field === field && prev.dir === "desc" ? "asc" : "desc",
    }));
  }, []);

  const toggleFund = useCallback((fundId: string) => {
    setExpandedFunds((prev) =>
      prev.includes(fundId)
        ? prev.filter((id) => id !== fundId)
        : [...prev, fundId],
    );
  }, []);

  const expandAll = useCallback(() => {
    setExpandedFunds(funds.map((f) => f.id));
  }, [funds]);

  const collapseAll = useCallback(() => {
    setExpandedFunds([]);
  }, []);

  // Filtered companies

  const filteredCompanies = useMemo(() => {
    let result = companies;

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.sector.toLowerCase().includes(q) ||
          c.country.toLowerCase().includes(q),
      );
    }

    if (filters.sectors.length > 0) {
      result = result.filter((c) => filters.sectors.includes(c.sector));
    }

    if (filters.countries.length > 0) {
      result = result.filter((c) => filters.countries.includes(c.country));
    }

    if (filters.riskLevels.length > 0) {
      result = result.filter((c) =>
        filters.riskLevels.includes(getRiskLevel(c.riskScore)),
      );
    }

    return result;
  }, [companies, filters]);

  // Sorted companies per fund

  const sortedCompaniesForFund = useCallback(
    (fundId: string): Company[] => {
      const fundCompanies = filteredCompanies.filter(
        (c) => c.fundId === fundId,
      );

      return [...fundCompanies].sort((a, b) => {
        const { field, dir } = sortState;
        let cmp = 0;

        switch (field) {
          case "name":
            cmp = a.name.localeCompare(b.name);
            break;
          case "sector":
            cmp = a.sector.localeCompare(b.sector);
            break;
          case "country":
            cmp = a.country.localeCompare(b.country);
            break;
          case "investedAmount":
            cmp = a.investedAmount - b.investedAmount;
            break;
          case "riskScore":
            cmp = a.riskScore - b.riskScore;
            break;
        }

        return dir === "asc" ? cmp : -cmp;
      });
    },
    [filteredCompanies, sortState],
  );

  // Fund-level statistics

  const fundStats = useMemo((): Record<string, FundStats> => {
    const stats: Record<string, FundStats> = {};

    for (const fund of funds) {
      const all = companies.filter((c) => c.fundId === fund.id);

      if (all.length === 0) {
        stats[fund.id] = {
          totalAum: 0,
          companyCount: 0,
          avgRiskScore: 0,
          avgPhysicalRisk: 0,
          avgNatureRisk: 0,
          avgTransitionRisk: 0,
          weightedRiskScore: 0,
          riskDistribution: { low: 0, medium: 0, high: 0, extreme: 0 },
          topSectors: [],
          countriesCount: 0,
          highestRiskCompany: null,
        };
        continue;
      }

      const totalAum = all.reduce((s, c) => s + c.investedAmount, 0);
      const avgRiskScore =
        all.reduce((s, c) => s + c.riskScore, 0) / all.length;
      const avgPhysicalRisk =
        all.reduce((s, c) => s + c.physicalRisk, 0) / all.length;
      const avgNatureRisk =
        all.reduce((s, c) => s + c.natureRisk, 0) / all.length;
      const avgTransitionRisk =
        all.reduce((s, c) => s + c.transitionRisk, 0) / all.length;
      const weightedRiskScore =
        all.reduce((s, c) => s + c.riskScore * c.investedAmount, 0) / totalAum;

      const riskDistribution: Record<RiskLevel, number> = {
        low: 0,
        medium: 0,
        high: 0,
        extreme: 0,
      };
      for (const c of all) {
        riskDistribution[getRiskLevel(c.riskScore)]++;
      }

      const sectorCounts: Record<string, number> = {};
      for (const c of all) {
        sectorCounts[c.sector] = (sectorCounts[c.sector] ?? 0) + 1;
      }
      const topSectors = Object.entries(sectorCounts)
        .map(([sector, count]) => ({ sector, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);

      const highestRisk = [...all].sort((a, b) => b.riskScore - a.riskScore)[0];

      stats[fund.id] = {
        totalAum,
        companyCount: all.length,
        avgRiskScore,
        avgPhysicalRisk,
        avgNatureRisk,
        avgTransitionRisk,
        weightedRiskScore,
        riskDistribution,
        topSectors,
        countriesCount: new Set(all.map((c) => c.country)).size,
        highestRiskCompany: {
          name: highestRisk.name,
          score: highestRisk.riskScore,
        },
      };
    }

    return stats;
  }, [companies, funds]);

  // Portfolio-level summary

  const portfolioSummary = useMemo((): PortfolioSummary => {
    const totalAum = companies.reduce((s, c) => s + c.investedAmount, 0);
    const avgRiskScore =
      companies.length > 0
        ? companies.reduce((s, c) => s + c.riskScore, 0) / companies.length
        : 0;
    const avgPhysicalRisk =
      companies.length > 0
        ? companies.reduce((s, c) => s + c.physicalRisk, 0) / companies.length
        : 0;
    const avgNatureRisk =
      companies.length > 0
        ? companies.reduce((s, c) => s + c.natureRisk, 0) / companies.length
        : 0;
    const avgTransitionRisk =
      companies.length > 0
        ? companies.reduce((s, c) => s + c.transitionRisk, 0) / companies.length
        : 0;
    const atHighRisk = companies.filter((c) => c.riskScore >= 7).length;

    const riskDistribution: Record<RiskLevel, number> = {
      low: 0,
      medium: 0,
      high: 0,
      extreme: 0,
    };
    for (const c of companies) {
      riskDistribution[getRiskLevel(c.riskScore)]++;
    }

    return {
      totalAum,
      totalCompanies: companies.length,
      avgRiskScore,
      avgPhysicalRisk,
      avgNatureRisk,
      avgTransitionRisk,
      atHighRisk,
      fundCount: funds.length,
      riskDistribution,
    };
  }, [companies, funds]);

  // Filter options

  const availableSectors = useMemo(
    () => [...new Set(companies.map((c) => c.sector))].sort(),
    [companies],
  );

  const availableCountries = useMemo(
    () => [...new Set(companies.map((c) => c.country))].sort(),
    [companies],
  );

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.sectors.length > 0) count++;
    if (filters.countries.length > 0) count++;
    if (filters.riskLevels.length > 0) count++;
    return count;
  }, [filters]);

  return {
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
  };
}
