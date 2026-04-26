"use client";

import { useState } from "react";
import { Modal, Select, Button, Group, Text, Stack } from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import { Company, Fund } from "../../types";
import { formatAum, formatScore } from "../../utils/riskUtils";
import { simulateMoveImpact } from "../../utils/insightUtils";

interface MoveCompanyModalProps {
  company: Company | null;
  companies: Company[];
  funds: Fund[];
  onMove: (companyId: string, targetFundId: string) => void;
  onClose: () => void;
}

export function MoveCompanyModal({
  company,
  companies,
  funds,
  onMove,
  onClose,
}: MoveCompanyModalProps) {
  const [targetFundId, setTargetFundId] = useState<string | null>(null);

  if (!company) return null;

  const currentFund = funds.find((f) => f.id === company.fundId);
  const targetFund = funds.find((f) => f.id === targetFundId);
  const moveImpact =
    company && targetFundId
      ? simulateMoveImpact(companies, company.id, targetFundId)
      : null;

  const fundOptions = funds
    .filter((f) => f.id !== company.fundId)
    .map((f) => ({
      value: f.id,
      label: `${f.name} (${f.vintage})`,
    }));

  function handleConfirm() {
    if (!targetFundId || !company) return;
    onMove(company.id, targetFundId);
    setTargetFundId(null);
    onClose();
  }

  function handleClose() {
    setTargetFundId(null);
    onClose();
  }

  return (
    <Modal
      opened={company !== null}
      onClose={handleClose}
      title={
        <Text fw={600} size="md">
          Move company
        </Text>
      }
      centered
      size="sm"
      radius="md"
    >
      <Stack gap="lg">
        <div
          style={{
            padding: "12px 16px",
            backgroundColor: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: 8,
          }}
        >
          <Text fw={600} size="sm">
            {company.name}
          </Text>
          <Group gap={8} mt={4}>
            <Text size="xs" c="dimmed">
              {company.sector}
            </Text>
            <Text size="xs" c="dimmed">
              ·
            </Text>
            <Text size="xs" c="dimmed">
              {company.country}
            </Text>
            <Text size="xs" c="dimmed">
              ·
            </Text>
            <Text size="xs" c="dimmed">
              {formatAum(company.investedAmount)}
            </Text>
          </Group>
        </div>

        <Stack gap="xs">
          <Text size="sm" c="dimmed">
            Currently in
          </Text>
          <div
            style={{
              padding: "8px 12px",
              border: "1px solid #e2e8f0",
              borderRadius: 6,
              backgroundColor: "#fff",
            }}
          >
            <Text size="sm" fw={500}>
              {currentFund?.name}
            </Text>
            <Text size="xs" c="dimmed">
              {currentFund?.focus} · {currentFund?.vintage}
            </Text>
          </div>
        </Stack>

        <Select
          label="Move to fund"
          placeholder="Select destination fund…"
          data={fundOptions}
          value={targetFundId}
          onChange={setTargetFundId}
          radius="md"
        />

        {targetFund && (
          <div
            style={{
              padding: "8px 12px",
              backgroundColor: "#f0fdf4",
              border: "1px solid #86efac",
              borderRadius: 6,
            }}
          >
            <Text size="xs" c="green.7">
              Will be moved to{" "}
              <strong>
                {targetFund.name} ({targetFund.vintage})
              </strong>
            </Text>
          </div>
        )}

        {moveImpact && (
          <div
            style={{
              padding: "10px 12px",
              backgroundColor: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: 6,
            }}
          >
            <Text
              size="xs"
              fw={600}
              style={{ color: "#334155", marginBottom: 6 }}
            >
              Move impact preview
            </Text>
            <Text size="xs" c="dimmed">
              Source weighted risk:{" "}
              {formatScore(moveImpact.sourceWeightedBefore)} -&gt;{" "}
              {formatScore(moveImpact.sourceWeightedAfter)}
            </Text>
            <Text size="xs" c="dimmed">
              Target weighted risk:{" "}
              {formatScore(moveImpact.targetWeightedBefore)} -&gt;{" "}
              {formatScore(moveImpact.targetWeightedAfter)}
            </Text>
            <Text size="xs" c="dimmed">
              High-risk (&gt;=7): source {moveImpact.sourceHighRiskBefore} -&gt;{" "}
              {moveImpact.sourceHighRiskAfter}, target{" "}
              {moveImpact.targetHighRiskBefore} -&gt;{" "}
              {moveImpact.targetHighRiskAfter}
            </Text>
          </div>
        )}

        <Group justify="flex-end" gap="sm" mt="xs">
          <Button variant="subtle" color="gray" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            disabled={!targetFundId}
            onClick={handleConfirm}
            leftSection={<IconArrowRight size={14} />}
            style={{ backgroundColor: "#1e3a5f" }}
          >
            Confirm move
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
