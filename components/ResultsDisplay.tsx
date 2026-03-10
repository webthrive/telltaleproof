"use client";

import { AnalysisResult } from "@/types/analysis";
import ScoreGauge from "./ScoreGauge";
import SectionCard from "./SectionCard";
import { AlertTriangle, CheckCircle, HelpCircle, Zap } from "lucide-react";

interface ResultsDisplayProps {
  result: AnalysisResult;
}

export default function ResultsDisplay({ result }: ResultsDisplayProps) {
  const getVerdictStyle = () => {
    if (result.verdictColor === "green")
      return { color: "#4ade80", bg: "rgba(74,222,128,0.08)", border: "rgba(74,222,128,0.2)", icon: <CheckCircle size={20} /> };
    if (result.verdictColor === "yellow")
      return { color: "#fbbf24", bg: "rgba(251,191,36,0.08)", border: "rgba(251,191,36,0.2)", icon: <HelpCircle size={20} /> };
    return { color: "#f87171", bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.2)", icon: <AlertTriangle size={20} /> };
  };

  const vstyle = getVerdictStyle();

  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      {/* Aggregate score hero */}
      <div
        className="fade-in"
        style={{
          border: `1px solid ${vstyle.border}`,
          borderRadius: "16px",
          background: vstyle.bg,
          padding: "28px 24px",
          marginBottom: "24px",
          display: "flex",
          alignItems: "center",
          gap: "24px",
          flexWrap: "wrap",
        }}
      >
        {/* Big gauge */}
        <div style={{ flexShrink: 0 }}>
          <ScoreGauge score={result.aggregateScore} size="lg" />
        </div>

        {/* Verdict text */}
        <div style={{ flex: 1, minWidth: "200px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: vstyle.color,
              marginBottom: "6px",
            }}
          >
            {vstyle.icon}
            <span
              style={{
                fontSize: "22px",
                fontFamily: "DM Serif Display, serif",
                fontWeight: 400,
              }}
            >
              {result.verdict}
            </span>
          </div>
          <div
            style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "12px" }}
          >
            Aggregate score across {result.sections.length} sections and{" "}
            {result.sections.reduce((sum, s) => sum + s.factors.length, 0)} individual factors
          </div>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <Stat label="Word Count" value={result.wordCount.toString()} />
            <Stat
              label="Confidence"
              value={result.confidence}
              note={
                result.confidence === "Low"
                  ? "Short text — more may improve accuracy"
                  : undefined
              }
            />
            <Stat
              label="Perplexity"
              value="Phase 2"
              note="Statistical scoring coming soon"
              muted
            />
          </div>
        </div>
      </div>

      {/* Section scores */}
      <div style={{ marginBottom: "16px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "16px",
          }}
        >
          <Zap size={14} style={{ color: "var(--accent)" }} />
          <span
            style={{
              fontSize: "11px",
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              fontWeight: 600,
            }}
          >
            Section Breakdown — click any section to expand factors
          </span>
        </div>

        {result.sections.map((section, i) => (
          <SectionCard key={section.name} section={section} index={i} />
        ))}
      </div>

      {/* Disclaimer */}
      <div
        style={{
          border: "1px solid var(--border)",
          borderRadius: "8px",
          padding: "12px 16px",
          fontSize: "11px",
          color: "var(--text-muted)",
          lineHeight: "1.5",
        }}
      >
        <strong style={{ color: "var(--text-secondary)" }}>Note:</strong> These scores are probabilistic,
        not definitive. Short texts (&lt;100 words) produce lower confidence results. Heavily edited AI text
        or highly structured human writing may score unexpectedly. Phase 2 will add true statistical
        perplexity scoring via open-source language models.
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  note,
  muted,
}: {
  label: string;
  value: string;
  note?: string;
  muted?: boolean;
}) {
  return (
    <div>
      <div
        style={{
          fontSize: "10px",
          color: "var(--text-muted)",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          marginBottom: "2px",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: "14px",
          fontFamily: "DM Mono, monospace",
          color: muted ? "var(--text-muted)" : "var(--text-primary)",
        }}
      >
        {value}
      </div>
      {note && (
        <div style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "1px" }}>
          {note}
        </div>
      )}
    </div>
  );
}
