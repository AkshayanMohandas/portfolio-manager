import { RiskLevel } from "../types";

export function getRiskLevel(score: number): RiskLevel {
  if (score < 3.5) return "low";
  if (score < 6.0) return "medium";
  if (score < 8.0) return "high";
  return "extreme";
}

export const RISK_LABEL: Record<RiskLevel, string> = {
  low: "LOW",
  medium: "MID",
  high: "HIGH",
  extreme: "EXTREME",
};

export const RISK_COLOR: Record<RiskLevel, string> = {
  low: "#16a34a",
  medium: "#d97706",
  high: "#dc2626",
  extreme: "#7f1d1d",
};

export const RISK_BG: Record<RiskLevel, string> = {
  low: "#dcfce7",
  medium: "#fef3c7",
  high: "#fee2e2",
  extreme: "#fecdd3",
};

export const RISK_BORDER: Record<RiskLevel, string> = {
  low: "#86efac",
  medium: "#fcd34d",
  high: "#fca5a5",
  extreme: "#fb7185",
};

export function formatAum(amount: number): string {
  if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}B`;
  return `$${amount}M`;
}

export function formatScore(score: number): string {
  return score.toFixed(1);
}

export function formatScoreFull(score: number): string {
  return `${score.toFixed(1)} / 10`;
}
