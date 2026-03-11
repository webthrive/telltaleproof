"use client";

interface ScoreGaugeProps { score: number; size?: "sm" | "md" | "lg"; }

export default function ScoreGauge({ score, size = "md" }: ScoreGaugeProps) {
  const getColor = (s: number) => {
    if (s >= 75) return "#0a7373";
    if (s >= 50) return "#0a8a6a";
    if (s >= 25) return "#c47a00";
    return "#c43302";
  };
  const getVerdict = (s: number) => {
    if (s >= 75) return "Likely Human";
    if (s >= 50) return "Leans Human";
    if (s >= 25) return "Leans AI";
    return "Likely AI";
  };

  const color = getColor(score);
  const verdict = getVerdict(score);
  const pct = Math.max(score, 4); // min 4% so there's always a visible sliver

  const numSize =   { sm: "18px", md: "26px", lg: "46px" };
  const trackH =    { sm: "6px",  md: "8px",  lg: "12px" };
  const labelSize = { sm: "11px", md: "12px", lg: "14px" };
  const denomSize = { sm: "10px", md: "12px", lg: "15px" };
  const width =     { sm: "100px", md: "140px", lg: "100%" };

  return (
    <div style={{ width: width[size] }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "6px" }}>
        <div>
          <span style={{ fontSize: numSize[size], fontWeight: 700, fontFamily: "var(--font-mono)", color, lineHeight: 1 }}>{score}</span>
          <span style={{ fontSize: denomSize[size], color: "var(--text-muted)", marginLeft: "2px" }}>/ 100</span>
        </div>
        {size !== "sm" && (
          <span style={{ fontSize: labelSize[size], fontWeight: 600, color }}>{verdict}</span>
        )}
      </div>
      <div style={{ height: trackH[size], background: "var(--border)", borderRadius: "6px", overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: "6px" }} />
      </div>
    </div>
  );
}
