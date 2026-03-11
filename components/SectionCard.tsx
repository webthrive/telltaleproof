"use client";
import { useState } from "react";
import { SectionScore } from "@/types/analysis";
import FactorRow from "./FactorRow";
import { ChevronDown, ChevronUp } from "lucide-react";

interface SectionCardProps { section: SectionScore; index: number; }

function getColor(s: number) {
  if (s >= 75) return "#0a7373";
  if (s >= 50) return "#0a8a6a";
  if (s >= 25) return "#c47a00";
  return "#c43302";
}

export default function SectionCard({ section }: SectionCardProps) {
  const [open, setOpen] = useState(false);
  const color = getColor(section.score);
  const pct = Math.max(section.score, 4);

  return (
    <div style={{ border: "1px solid var(--border)", borderRadius: "12px", background: "var(--bg-card)", overflow: "hidden", marginBottom: "10px" }}>
      <div onClick={() => setOpen(!open)} style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: "14px", cursor: "pointer" }}>
        {/* Mini bar */}
        <div style={{ width: "70px", flexShrink: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "4px" }}>
            <span style={{ fontSize: "14px", fontWeight: 700, color, fontFamily: "var(--font-mono)" }}>{section.score}</span>
            <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>/100</span>
          </div>
          <div style={{ height: "5px", background: "var(--border)", borderRadius: "3px", overflow: "hidden" }}>
            <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: "3px" }} />
          </div>
        </div>
        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-primary)" }}>{section.name}</div>
          <div style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "2px" }}>{section.name}</div>
        </div>
        {/* Chevron */}
        <div style={{ color: "var(--text-muted)", fontSize: "13px", display: "flex", alignItems: "center", gap: "4px", flexShrink: 0 }}>
          <span style={{ fontSize: "12px" }}>{section.factors.length} factors</span>
          {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </div>
      </div>
      {open && (
        <div style={{ borderTop: "1px solid var(--border)", padding: "12px 20px", display: "flex", flexDirection: "column", gap: "4px" }}>
          {section.factors.map((f) => <FactorRow key={f.name} factor={f} />)}
        </div>
      )}
    </div>
  );
}
