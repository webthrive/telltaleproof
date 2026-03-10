"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { FactorScore } from "@/types/analysis";

interface FactorRowProps {
  factor: FactorScore;
  delay?: number;
}

export default function FactorRow({ factor, delay = 0 }: FactorRowProps) {
  const [expanded, setExpanded] = useState(false);

  const getColor = (s: number) => {
    if (s <= 3.5) return { bar: "#4ade80", bg: "rgba(74,222,128,0.12)", text: "#4ade80" };
    if (s <= 6.5) return { bar: "#fbbf24", bg: "rgba(251,191,36,0.12)", text: "#fbbf24" };
    return { bar: "#f87171", bg: "rgba(248,113,113,0.12)", text: "#f87171" };
  };

  const colors = getColor(factor.score);
  const pct = (factor.score / 10) * 100;

  const getLabel = (s: number) => {
    if (s <= 2) return "Strongly Human";
    if (s <= 3.5) return "Likely Human";
    if (s <= 5) return "Slight AI";
    if (s <= 6.5) return "Mixed";
    if (s <= 8) return "Likely AI";
    return "Strongly AI";
  };

  return (
    <div
      className="fade-in"
      style={{
        animationDelay: `${delay}ms`,
        opacity: 0,
        border: "1px solid var(--border)",
        borderRadius: "8px",
        background: "var(--bg-card)",
        overflow: "hidden",
        marginBottom: "6px",
      }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: "100%",
          padding: "12px 14px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        {/* Factor name */}
        <span
          style={{
            flex: 1,
            fontSize: "13px",
            color: "var(--text-secondary)",
            fontFamily: "Inter, sans-serif",
            minWidth: 0,
          }}
        >
          {factor.name}
        </span>

        {/* Score bar */}
        <div
          style={{
            width: "80px",
            height: "4px",
            background: "var(--border)",
            borderRadius: "2px",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: `${pct}%`,
              height: "100%",
              background: colors.bar,
              borderRadius: "2px",
              boxShadow: `0 0 6px ${colors.bar}60`,
              transition: "width 0.8s ease-out",
            }}
          />
        </div>

        {/* Score number */}
        <span
          style={{
            fontSize: "13px",
            fontFamily: "DM Mono, monospace",
            color: colors.text,
            fontWeight: 500,
            width: "28px",
            textAlign: "right",
            flexShrink: 0,
          }}
        >
          {factor.score}
        </span>

        {/* Label */}
        <span
          style={{
            fontSize: "11px",
            padding: "2px 7px",
            borderRadius: "4px",
            background: colors.bg,
            color: colors.text,
            flexShrink: 0,
            display: "none",
          }}
          className="label-badge"
        >
          {getLabel(factor.score)}
        </span>

        {/* Expand icon */}
        <span style={{ color: "var(--text-muted)", flexShrink: 0 }}>
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </span>
      </button>

      {/* Expanded explanations */}
      {expanded && (
        <div
          style={{
            padding: "0 14px 12px 14px",
            borderTop: "1px solid var(--border)",
          }}
        >
          <ul style={{ listStyle: "none", paddingTop: "10px" }}>
            {factor.explanation.map((point, i) => (
              <li
                key={i}
                style={{
                  display: "flex",
                  gap: "8px",
                  marginBottom: "6px",
                  fontSize: "12px",
                  color: "var(--text-secondary)",
                  lineHeight: "1.5",
                }}
              >
                <span style={{ color: colors.text, flexShrink: 0, marginTop: "1px" }}>
                  ›
                </span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
