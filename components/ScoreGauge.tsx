"use client";

interface ScoreGaugeProps {
  score: number;
  size?: "sm" | "md" | "lg";
}

export default function ScoreGauge({ score, size = "md" }: ScoreGaugeProps) {
  const getColor = (s: number) => {
    if (s <= 3.5) return "#4ade80";
    if (s <= 6.5) return "#fbbf24";
    return "#f87171";
  };

  const color = getColor(score);
  const pct = score / 10;

  const dims = { sm: 64, md: 96, lg: 140 };
  const strokes = { sm: 5, md: 7, lg: 10 };
  const dim = dims[size];
  const stroke = strokes[size];
  const r = (dim - stroke * 2) / 2;
  const cx = dim / 2;
  const cy = dim / 2;

  // Half-circle gauge (top half)
  const startAngle = -180;
  const endAngle = 0;
  const totalAngle = endAngle - startAngle;
  const currentAngle = startAngle + totalAngle * pct;

  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const startX = cx + r * Math.cos(toRad(startAngle));
  const startY = cy + r * Math.sin(toRad(startAngle));
  const endX = cx + r * Math.cos(toRad(currentAngle));
  const endY = cy + r * Math.sin(toRad(currentAngle));

  const largeArc = totalAngle * pct > 180 ? 1 : 0;

  const bgEndX = cx + r * Math.cos(toRad(endAngle));
  const bgEndY = cy + r * Math.sin(toRad(endAngle));

  const fontSize = { sm: "10px", md: "14px", lg: "22px" };
  const labelSize = { sm: "7px", md: "9px", lg: "11px" };

  return (
    <svg
      width={dim}
      height={dim / 2 + stroke}
      viewBox={`0 0 ${dim} ${dim / 2 + stroke}`}
      style={{ overflow: "visible" }}
    >
      {/* Background arc */}
      <path
        d={`M ${startX} ${startY} A ${r} ${r} 0 0 1 ${bgEndX} ${bgEndY}`}
        fill="none"
        stroke="#22222e"
        strokeWidth={stroke}
        strokeLinecap="round"
      />
      {/* Score arc */}
      {pct > 0 && (
        <path
          d={`M ${startX} ${startY} A ${r} ${r} 0 ${largeArc} 1 ${endX} ${endY}`}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          style={{
            filter: `drop-shadow(0 0 6px ${color}60)`,
            transition: "all 1s ease-out",
          }}
        />
      )}
      {/* Score text */}
      <text
        x={cx}
        y={cy - 2}
        textAnchor="middle"
        fill={color}
        fontSize={fontSize[size]}
        fontFamily="DM Mono, monospace"
        fontWeight="500"
      >
        {score.toFixed(1)}
      </text>
      <text
        x={cx}
        y={cy + 10}
        textAnchor="middle"
        fill="#55556a"
        fontSize={labelSize[size]}
        fontFamily="Inter, sans-serif"
      >
        / 10
      </text>
    </svg>
  );
}
