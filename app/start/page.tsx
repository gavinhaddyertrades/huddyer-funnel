"use client";

const CURRICULUM_URL = "https://www.fanbasis.com/agency-checkout/huddyer-trades/8EmYg";

const bullets = [
  { title: "9+ Hours of Video Modules", body: "The exact system Hudson uses — market structure, execution, entries, risk. All of it, on your schedule." },
  { title: "Built for Real Trading", body: "Not theory. Not recycled YouTube content. The actual mechanics behind consistent, profitable trading." },
  { title: "Foundation First", body: "Every trader Hudson coaches personally started here. This is the system before the system." },
  { title: "Lifetime Access", body: "Go at your own pace. Come back to any module whenever you need it. No expiry." },
  { title: "Hudson's Private Community", body: "You get added to Hudson's most exclusive group — his top clients and students only. This isn't a public Discord. It's where his serious people are." },
];

export default function StartPage() {
  return (
    <main style={{ backgroundColor: "#0A0A0A", minHeight: "100vh" }}>

      {/* Top bar */}
      <div
        className="flex items-center justify-center px-5 py-4"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
      >
        <span className="font-display text-base" style={{ color: "#F2EDE6", letterSpacing: "0.12em" }}>
          HUDDYERTRADES
        </span>
      </div>

      <div className="max-w-3xl mx-auto px-5 pt-20 pb-24">

        {/* Gold badge */}
        <div
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-10"
          style={{ border: "1px solid rgba(201,168,76,0.35)", background: "rgba(201,168,76,0.08)" }}
        >
          <span className="w-2 h-2 rounded-full" style={{ background: "#C9A84C", boxShadow: "0 0 6px #C9A84C" }} />
          <span className="font-body text-xs uppercase tracking-widest" style={{ color: "#C9A84C" }}>
            Step One
          </span>
        </div>

        {/* Headline */}
        <h1
          className="font-display leading-none mb-6"
          style={{ fontSize: "clamp(44px, 8vw, 96px)", color: "#F2EDE6", letterSpacing: "0.02em" }}
        >
          THIS IS WHERE{" "}
          <span className="gold-text-gradient">IT STARTS.</span>
        </h1>

        {/* Body */}
        <div
          className="font-body leading-relaxed mb-14 space-y-4"
          style={{ fontSize: "clamp(15px, 2vw, 17px)", color: "#999", maxWidth: "580px" }}
        >
          <p>
            Every trader Hudson works with personally went through this curriculum first. Not because it&apos;s a stepping stone — because it&apos;s the foundation everything else is built on.
          </p>
          <p>
            Most traders never get this right. They skip straight to strategies and setups without ever understanding why the market moves the way it does. This is where you fix that.
          </p>
        </div>

        {/* Stat strip */}
        <div
          className="grid grid-cols-3 gap-px mb-14 rounded-2xl overflow-hidden"
          style={{ border: "1px solid rgba(255,255,255,0.08)" }}
        >
          {[
            { value: "9+", label: "Hours of content" },
            { value: "Self-paced", label: "No schedule required" },
            { value: "Private", label: "Community access" },
          ].map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center justify-center py-6 px-4 text-center"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              <span
                className="font-display mb-1"
                style={{ fontSize: "clamp(22px, 3.5vw, 32px)", color: "#C9A84C", letterSpacing: "0.04em" }}
              >
                {s.value}
              </span>
              <span className="font-body text-xs" style={{ color: "#666" }}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* What's inside */}
        <p className="font-body text-xs uppercase tracking-widest mb-6" style={{ color: "#666" }}>
          What&apos;s Inside
        </p>

        <div className="flex flex-col mb-14">
          {bullets.map((b, i) => (
            <div
              key={b.title}
              className="flex gap-5 py-7"
              style={{
                borderTop: i === 0 ? "1px solid rgba(255,255,255,0.07)" : "none",
                borderBottom: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div
                className="font-display shrink-0"
                style={{ fontSize: "clamp(28px, 4vw, 40px)", color: "rgba(201,168,76,0.25)", lineHeight: 1, minWidth: 44 }}
              >
                0{i + 1}
              </div>
              <div className="flex flex-col gap-1.5 justify-center">
                <h3
                  className="font-display"
                  style={{ fontSize: "clamp(16px, 2.2vw, 22px)", color: "#F2EDE6", letterSpacing: "0.03em" }}
                >
                  {b.title.toUpperCase()}
                </h3>
                <p className="font-body text-sm leading-relaxed" style={{ color: "#777", maxWidth: 500 }}>
                  {b.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <a
            href={CURRICULUM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold"
            style={{ fontSize: "clamp(13px, 1.5vw, 15px)" }}
          >
            Get Instant Access →
          </a>
          <p className="font-body text-xs" style={{ color: "#555" }}>
            Instant access after payment. No waiting.
          </p>
        </div>

      </div>
    </main>
  );
}
