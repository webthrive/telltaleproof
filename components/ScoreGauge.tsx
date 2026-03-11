"use client";

interface ScoreGaugeProps { score: number; size?: "sm" | "md" | "lg"; }

export default function ScoreGauge({ score, size = "md" }: ScoreGaugeProps) {
  const getColor = (s: number) => {
    if (s >= 75) return "#0a7373";
    if (s >= 50) return "#0a8a6a";
    if (s >= 25) return "#c47a00";
    return "#c43302";
  };

  const color = getColor(score);
  const pct = Math.min(Math.max(score, 0), 100) / 100;

  // Dimensions per size
  const W =      { sm: 80,  md: 110, lg: 160 };
  const STROKE = { sm: 7,   md: 9,   lg: 13  };
  const w = W[size];
  const sw = STROKE[size];

  // The semicircle: center at (w/2, w/2), radius r
  // Arc goes from left (180°) to right (0°) — top half only
  const cx = w / 2;
  const cy = w / 2;
  const r = w / 2 - sw;

  // Fixed endpoints — left and right of diameter, at cy
  const lx = cx - r;   // left  (start)
  const rx = cx + r;   // right (end of full arc)
  const y  = cy;       // both sit at vertical center

  // Progress endpoint — sweep from left, clockwise
  // At pct=0: stays at left. At pct=1: reaches right.
  // Angle: starts at 180° (left), ends at 0° (right)
  const angleDeg = 180 - pct * 180;
  const angleRad = (angleDeg * Math.PI) / 180;
  const px = cx + r * Math.cos(angleRad);
  const py = cy - r * Math.sin(angleRad);   // SVG y flipped
  const largeArc = pct > 0.5 ? 1 : 0;

  // SVG height = top half of circle + stroke + text space
  const textH = { sm: 22, md: 28, lg: 38 };
  const svgH = cy + sw / 2 + textH[size];

  const scoreFS = { sm: "14px", md: "20px", lg: "30px" };
  const labelFS = { sm: "9px",  md: "11px", lg: "14px" };
  const scoreY  = { sm: cy + 14, md: cy + 18, lg: cy + 26 };
  const labelY  = { sm: cy + 24, md: cy + 30, lg: cy + 42 };

  return (
    <svg
      width={w}
      height={svgH}
      viewBox={`0 0 ${w} ${svgH}`}
      style={{ display: "block", overflow: "visible" }}
    >
      {/* Grey background track — full semicircle left→right */}
      <path
        d={`M ${lx} ${y} A ${r} ${r} 0 0 1 ${rx} ${y}`}
        fill="none"
        stroke="var(--border)"
        strokeWidth={sw}
        strokeLinecap="round"
      />
      {/* Colored progress — left → progress point */}
      {pct > 0.01 && (
        <path
          d={`M ${lx} ${y} A ${r} ${r} 0 ${largeArc} 1 ${px} ${py}`}
          fill="none"
          stroke={color}
          strokeWidth={sw}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 3px ${color}55)` }}
        />
      )}
      {/* Score number */}
      <text
        x={cx} y={scoreY[size]}
        textAnchor="middle"
        fill={color}
        fontSize={scoreFS[size]}
        fontFamily="DM Mono, monospace"
        fontWeight="600"
      >
        {score}
      </text>
      {/* /100 label */}
      <text
        x={cx} y={labelY[size]}
        textAnchor="middle"
        fill="var(--text-muted)"
        fontSize={labelFS[size]}
        fontFamily="Rubik, sans-serif"
      >
        / 100
      </text>
    </svg>
  );
}
