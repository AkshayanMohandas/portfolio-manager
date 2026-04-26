"use client";

import { Group, Stack, Text } from "@mantine/core";
import { TrendPoint } from "../../utils/insightUtils";
import { formatScore } from "../../utils/riskUtils";

interface SeriesConfig {
  key: "weightedRisk" | "highRiskAumPct" | "top3ExposurePct";
  label: string;
  color: string;
  suffix: string;
}

const SERIES: SeriesConfig[] = [
  { key: "weightedRisk", label: "Weighted risk", color: "#1d4ed8", suffix: "/10" },
  { key: "highRiskAumPct", label: "High-risk AUM", color: "#dc2626", suffix: "%" },
  { key: "top3ExposurePct", label: "Top-3 concentration", color: "#7c3aed", suffix: "%" },
];

function getY(value: number, min: number, max: number, height: number, pad: number) {
  if (max === min) return height / 2;
  const t = (value - min) / (max - min);
  return height - pad - t * (height - pad * 2);
}

function getPath(points: Array<{ x: number; y: number }>): string {
  return points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
}

interface PortfolioTrendChartProps {
  data: TrendPoint[];
}

export function PortfolioTrendChart({ data }: PortfolioTrendChartProps) {
  const width = 1040;
  const height = 260;
  const pad = 24;
  const stepX = (width - pad * 2) / Math.max(data.length - 1, 1);
  const firstForecastIndex = data.findIndex((d) => d.isForecast);

  const allValues = data.flatMap((d) => [
    d.weightedRisk,
    d.highRiskAumPct,
    d.top3ExposurePct,
  ]);
  const min = Math.min(...allValues);
  const max = Math.max(...allValues);

  const seriesPoints = SERIES.map((series) => {
    const points = data.map((row, idx) => ({
      x: pad + idx * stepX,
      y: getY(row[series.key], min, max, height, pad),
      isForecast: row.isForecast,
    }));
    const actualPoints =
      firstForecastIndex > 0 ? points.slice(0, firstForecastIndex) : points;
    const forecastPoints =
      firstForecastIndex > 0 ? points.slice(firstForecastIndex - 1) : [];
    return { series, actualPoints, forecastPoints };
  });

  return (
    <div
      style={{
        backgroundColor: "#fff",
        border: "1px solid #e2e8f0",
        borderRadius: 12,
        padding: "16px 18px",
        marginBottom: 16,
      }}
    >
      <Group justify="space-between" align="flex-start" mb={10}>
        <Stack gap={2}>
          <Text fw={700} size="sm" style={{ color: "#0f172a" }}>
            Portfolio risk trends
          </Text>
          <Text size="xs" c="dimmed">
            Last 12 months + 3-month forecast
          </Text>
        </Stack>
        <Group gap={12}>
          {SERIES.map((s) => {
            const latest = data[data.length - 1]?.[s.key] ?? 0;
            return (
              <Group key={s.key} gap={6}>
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 99,
                    backgroundColor: s.color,
                    display: "inline-block",
                  }}
                />
                <Text size="xs" c="dimmed">
                  {s.label}:{" "}
                  <strong style={{ color: "#0f172a" }}>
                    {formatScore(latest)}
                    {s.suffix}
                  </strong>
                </Text>
              </Group>
            );
          })}
        </Group>
      </Group>

      <svg width="100%" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Portfolio trend chart">
        <rect x={0} y={0} width={width} height={height} fill="#ffffff" />
        {[0, 1, 2, 3].map((i) => {
          const y = pad + (i * (height - pad * 2)) / 3;
          return (
            <line
              key={i}
              x1={pad}
              x2={width - pad}
              y1={y}
              y2={y}
              stroke="#e2e8f0"
              strokeWidth={1}
            />
          );
        })}

        {firstForecastIndex > 0 && (
          <line
            x1={pad + firstForecastIndex * stepX}
            x2={pad + firstForecastIndex * stepX}
            y1={pad}
            y2={height - pad}
            stroke="#94a3b8"
            strokeDasharray="4 4"
            strokeWidth={1}
          />
        )}

        {seriesPoints.map(({ series, actualPoints, forecastPoints }) => (
          <g key={series.key}>
            <path
              d={getPath(actualPoints)}
              fill="none"
              stroke={series.color}
              strokeWidth={2.5}
              strokeLinecap="round"
            />
            {forecastPoints.length > 1 && (
              <path
                d={getPath(forecastPoints)}
                fill="none"
                stroke={series.color}
                strokeWidth={2}
                strokeDasharray="6 4"
                strokeLinecap="round"
                opacity={0.95}
              />
            )}
          </g>
        ))}

        {data.map((d, i) => (
          <text
            key={`${d.month}-${i}`}
            x={pad + i * stepX}
            y={height - 6}
            textAnchor="middle"
            fontSize={10}
            fill={d.isForecast ? "#94a3b8" : "#64748b"}
          >
            {d.month}
          </text>
        ))}
      </svg>
    </div>
  );
}
