import { Company, Fund } from "../types";

interface ExposureMetric {
  label: string;
  amount: number;
  pctOfPortfolio: number;
}

export interface ConcentrationMetrics {
  topFund: ExposureMetric;
  topSector: ExposureMetric;
  topCountry: ExposureMetric;
  topCompany: ExposureMetric;
}

export interface BenchmarkComparison {
  delta: number;
  label: "Above avg" | "Below avg" | "At avg";
  color: string;
}

export interface MoveImpact {
  sourceFundId: string;
  targetFundId: string;
  sourceWeightedBefore: number;
  sourceWeightedAfter: number;
  targetWeightedBefore: number;
  targetWeightedAfter: number;
  sourceHighRiskBefore: number;
  sourceHighRiskAfter: number;
  targetHighRiskBefore: number;
  targetHighRiskAfter: number;
}

export interface TrendPoint {
  month: string;
  weightedRisk: number;
  highRiskAumPct: number;
  top3ExposurePct: number;
  isForecast: boolean;
}

function getPortfolioAum(companies: Company[]): number {
  return companies.reduce((sum, c) => sum + c.investedAmount, 0);
}

function toExposureMetric(
  label: string,
  amount: number,
  portfolioAum: number
): ExposureMetric {
  return {
    label,
    amount,
    pctOfPortfolio: portfolioAum > 0 ? (amount / portfolioAum) * 100 : 0,
  };
}

function computeWeightedRisk(companies: Company[]): number {
  const totalAum = companies.reduce((sum, c) => sum + c.investedAmount, 0);
  if (totalAum === 0) return 0;
  return (
    companies.reduce((sum, c) => sum + c.riskScore * c.investedAmount, 0) / totalAum
  );
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function getMonthLabel(date: Date): string {
  return date.toLocaleString("en", { month: "short" });
}

export function buildPortfolioTrendSeries(companies: Company[]): TrendPoint[] {
  const totalAum = getPortfolioAum(companies);
  const weightedRisk = computeWeightedRisk(companies);
  const highRiskAum =
    totalAum > 0
      ? companies
          .filter((c) => c.riskScore >= 7)
          .reduce((sum, c) => sum + c.investedAmount, 0)
      : 0;
  const highRiskAumPct = totalAum > 0 ? (highRiskAum / totalAum) * 100 : 0;
  const top3Aum = [...companies]
    .sort((a, b) => b.investedAmount - a.investedAmount)
    .slice(0, 3)
    .reduce((sum, c) => sum + c.investedAmount, 0);
  const top3ExposurePct = totalAum > 0 ? (top3Aum / totalAum) * 100 : 0;

  const weightedRiskFactors = [1.12, 1.1, 1.07, 1.05, 1.02, 1.0, 0.99, 0.97, 0.96, 0.95, 0.94, 1.0];
  const highRiskFactors = [1.2, 1.16, 1.12, 1.1, 1.06, 1.03, 1.01, 0.99, 0.96, 0.95, 0.93, 1.0];
  const concentrationFactors = [1.08, 1.07, 1.05, 1.04, 1.03, 1.01, 1.0, 0.99, 0.98, 0.97, 0.96, 1.0];

  const now = new Date();
  const actual: TrendPoint[] = [];

  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const idx = 11 - i;
    actual.push({
      month: getMonthLabel(date),
      weightedRisk: clamp(weightedRisk * weightedRiskFactors[idx], 0, 10),
      highRiskAumPct: clamp(highRiskAumPct * highRiskFactors[idx], 0, 100),
      top3ExposurePct: clamp(top3ExposurePct * concentrationFactors[idx], 0, 100),
      isForecast: false,
    });
  }

  const last = actual[actual.length - 1];
  const prev = actual[actual.length - 2];
  const weightedStep = (last.weightedRisk - prev.weightedRisk) * 0.65;
  const highRiskStep = (last.highRiskAumPct - prev.highRiskAumPct) * 0.7;
  const concentrationStep = (last.top3ExposurePct - prev.top3ExposurePct) * 0.8;

  const forecast: TrendPoint[] = [];
  for (let i = 1; i <= 3; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() + i, 1);
    forecast.push({
      month: getMonthLabel(date),
      weightedRisk: clamp(last.weightedRisk + weightedStep * i, 0, 10),
      highRiskAumPct: clamp(last.highRiskAumPct + highRiskStep * i, 0, 100),
      top3ExposurePct: clamp(last.top3ExposurePct + concentrationStep * i, 0, 100),
      isForecast: true,
    });
  }

  return [...actual, ...forecast];
}

export function getConcentrationMetrics(
  companies: Company[],
  funds: Fund[]
): ConcentrationMetrics {
  const portfolioAum = getPortfolioAum(companies);
  const fundNameById = new Map(funds.map((f) => [f.id, f.name]));

  const fundAum: Record<string, number> = {};
  const sectorAum: Record<string, number> = {};
  const countryAum: Record<string, number> = {};

  for (const company of companies) {
    fundAum[company.fundId] = (fundAum[company.fundId] ?? 0) + company.investedAmount;
    sectorAum[company.sector] =
      (sectorAum[company.sector] ?? 0) + company.investedAmount;
    countryAum[company.country] =
      (countryAum[company.country] ?? 0) + company.investedAmount;
  }

  const [topFundId = ""] = Object.entries(fundAum).sort((a, b) => b[1] - a[1])[0] ?? [];
  const topFundAmount = fundAum[topFundId] ?? 0;

  const [topSector = ""] =
    Object.entries(sectorAum).sort((a, b) => b[1] - a[1])[0] ?? [];
  const topSectorAmount = sectorAum[topSector] ?? 0;

  const [topCountry = ""] =
    Object.entries(countryAum).sort((a, b) => b[1] - a[1])[0] ?? [];
  const topCountryAmount = countryAum[topCountry] ?? 0;

  const topCompany = [...companies].sort(
    (a, b) => b.investedAmount - a.investedAmount
  )[0];

  return {
    topFund: toExposureMetric(
      fundNameById.get(topFundId) ?? "N/A",
      topFundAmount,
      portfolioAum
    ),
    topSector: toExposureMetric(topSector || "N/A", topSectorAmount, portfolioAum),
    topCountry: toExposureMetric(topCountry || "N/A", topCountryAmount, portfolioAum),
    topCompany: toExposureMetric(
      topCompany?.name ?? "N/A",
      topCompany?.investedAmount ?? 0,
      portfolioAum
    ),
  };
}

export function compareToBenchmark(
  score: number,
  baseline: number,
  epsilon = 0.05
): BenchmarkComparison {
  const delta = score - baseline;
  if (Math.abs(delta) <= epsilon) {
    return { delta, label: "At avg", color: "#64748b" };
  }
  if (delta > 0) {
    return { delta, label: "Above avg", color: "#dc2626" };
  }
  return { delta, label: "Below avg", color: "#16a34a" };
}

export function simulateMoveImpact(
  companies: Company[],
  companyId: string,
  targetFundId: string
): MoveImpact | null {
  const companyToMove = companies.find((c) => c.id === companyId);
  if (!companyToMove || companyToMove.fundId === targetFundId) return null;

  const sourceFundId = companyToMove.fundId;

  const sourceBefore = companies.filter((c) => c.fundId === sourceFundId);
  const targetBefore = companies.filter((c) => c.fundId === targetFundId);

  const sourceAfter = sourceBefore.filter((c) => c.id !== companyId);
  const targetAfter = [...targetBefore, { ...companyToMove, fundId: targetFundId }];

  const highRiskCount = (arr: Company[]) => arr.filter((c) => c.riskScore >= 7).length;

  return {
    sourceFundId,
    targetFundId,
    sourceWeightedBefore: computeWeightedRisk(sourceBefore),
    sourceWeightedAfter: computeWeightedRisk(sourceAfter),
    targetWeightedBefore: computeWeightedRisk(targetBefore),
    targetWeightedAfter: computeWeightedRisk(targetAfter),
    sourceHighRiskBefore: highRiskCount(sourceBefore),
    sourceHighRiskAfter: highRiskCount(sourceAfter),
    targetHighRiskBefore: highRiskCount(targetBefore),
    targetHighRiskAfter: highRiskCount(targetAfter),
  };
}
