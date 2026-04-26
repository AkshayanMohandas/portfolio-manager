export type RiskLevel = "low" | "medium" | "high" | "extreme";
export type SortField =
  | "name"
  | "sector"
  | "country"
  | "investedAmount"
  | "riskScore";
export type SortDir = "asc" | "desc";

export interface AssetLocation {
  name: string;
  lat: number;
  lng: number;
}

export interface Company {
  id: string;
  name: string;
  sector: string;
  country: string;
  investedAmount: number;
  riskScore: number;
  physicalRisk: number;
  natureRisk: number;
  transitionRisk: number;
  assets: AssetLocation[];
  fundId: string;
}

export interface Fund {
  id: string;
  name: string;
  vintage: number;
  focus: string;
  targetSize: number;
}

export interface FundStats {
  totalAum: number;
  companyCount: number;
  avgRiskScore: number;
  avgPhysicalRisk: number;
  avgNatureRisk: number;
  avgTransitionRisk: number;
  weightedRiskScore: number;
  riskDistribution: Record<RiskLevel, number>;
  topSectors: Array<{ sector: string; count: number }>;
  countriesCount: number;
  highestRiskCompany: { name: string; score: number } | null;
}

export interface PortfolioSummary {
  totalAum: number;
  totalCompanies: number;
  avgRiskScore: number;
  avgPhysicalRisk: number;
  avgNatureRisk: number;
  avgTransitionRisk: number;
  atHighRisk: number;
  fundCount: number;
  riskDistribution: Record<RiskLevel, number>;
}

export interface FilterState {
  search: string;
  sectors: string[];
  countries: string[];
  riskLevels: RiskLevel[];
}

export interface SortState {
  field: SortField;
  dir: SortDir;
}
