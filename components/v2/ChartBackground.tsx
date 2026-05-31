export default function ChartBackground() {
  return (
    <div
      id="chart-bg"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
        pointerEvents: "none",
        background:
          "radial-gradient(ellipse 120% 100% at 52% 48%, rgba(201,168,76,0.13) 0%, rgba(201,168,76,0.05) 55%, transparent 100%)",
      }}
    />
  );
}
