export default function ChartBackground() {
  const viewW = 1400;
  const viewH = 700;
  const count = 42;
  const spacing = viewW / (count + 1);
  const bodyW = 11;

  const candles = Array.from({ length: count }, (_, i) => {
    const t = i / (count - 1);
    const trend = 530 - t * 370;
    const noise = Math.sin(i * 2.1) * 22 + Math.cos(i * 3.8) * 12 + Math.sin(i * 5.3) * 8;
    const mid = trend + noise;

    const bodyH = 10 + Math.abs(Math.sin(i * 1.7)) * 28;
    const wickT = 6 + Math.abs(Math.cos(i * 2.4)) * 18;
    const wickB = 6 + Math.abs(Math.sin(i * 3.1)) * 14;

    const closeY = Math.cos(i * 2.9) > 0 ? mid - bodyH / 2 : mid + bodyH / 2;
    const openY  = Math.cos(i * 2.9) > 0 ? mid + bodyH / 2 : mid - bodyH / 2;
    const highY  = Math.min(openY, closeY) - wickT;
    const lowY   = Math.max(openY, closeY) + wickB;

    return { x: spacing * (i + 1), openY, closeY, highY, lowY };
  });

  return (
    <div id="chart-bg" style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 0, pointerEvents: "none" }}>
      <style>{`
        @media (max-width: 767px) {
          #chart-bg { transform: translateY(-38%); }
        }
      `}</style>
      <svg
        width="100%" height="100%"
        viewBox={`0 0 ${viewW} ${viewH}`}
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="goldGlow" cx="52%" cy="48%" r="58%">
            <stop offset="0%"   stopColor="#C9A84C" stopOpacity="0.13" />
            <stop offset="55%"  stopColor="#C9A84C" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#C9A84C" stopOpacity="0"    />
          </radialGradient>
          <linearGradient id="fadeH" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="white" stopOpacity="0" />
            <stop offset="15%"  stopColor="white" stopOpacity="1" />
            <stop offset="85%"  stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <mask id="edgeFade">
            <rect width={viewW} height={viewH} fill="url(#fadeH)" />
          </mask>
        </defs>
        <rect width={viewW} height={viewH} fill="url(#goldGlow)" />
        <g mask="url(#edgeFade)" opacity="0.07">
          {candles.map((c, i) => (
            <g key={i} fill="#C9A84C" stroke="#C9A84C">
              <line x1={c.x} y1={c.highY} x2={c.x} y2={c.lowY} strokeWidth="1.5" />
              <rect
                x={c.x - bodyW / 2}
                y={Math.min(c.openY, c.closeY)}
                width={bodyW}
                height={Math.abs(c.closeY - c.openY) || 2}
                rx="1"
              />
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
