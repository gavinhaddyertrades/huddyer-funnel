"use client";

const CURRICULUM_URL = "https://www.fanbasis.com/agency-checkout/huddyer-trades/8EmYg";

const bullets = [
  "9+ hours of structured video modules",
  "Self-paced — go through it on your schedule",
  "The exact foundational strategy Hudson trades with",
  "Market structure, execution, and risk management — step by step",
  "Lifetime access — revisit any module at any time",
];

export default function StartPage() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-5 py-20"
      style={{ backgroundColor: "#0A0A0A" }}
    >
      <div className="w-full max-w-2xl mx-auto">

        {/* Label */}
        <p
          className="font-body text-xs uppercase tracking-widest mb-5"
          style={{ color: "#888" }}
        >
          The Right Starting Point
        </p>

        {/* Headline */}
        <h1
          className="font-display leading-none mb-8"
          style={{
            fontSize: "clamp(40px, 7vw, 84px)",
            color: "#F2EDE6",
            letterSpacing: "0.02em",
          }}
        >
          START WITH THE{" "}
          <span className="gold-text-gradient">CURRICULUM.</span>
        </h1>

        {/* Body copy */}
        <div
          className="font-body leading-relaxed mb-10 space-y-4"
          style={{ fontSize: "clamp(15px, 2vw, 17px)", color: "#999", maxWidth: "560px" }}
        >
          <p>
            Before you go all in, you need the foundation. That&apos;s not a knock — that&apos;s how it actually works. The video curriculum is where I&apos;d tell anyone to start who wants to build this the right way.
          </p>
          <p>
            Get the system down first. When you&apos;re ready to add live coaching and accountability on top of it, I&apos;ll be here.
          </p>
        </div>

        {/* Divider */}
        <div
          className="mb-10"
          style={{
            height: 1,
            background: "linear-gradient(90deg, rgba(201,168,76,0.35), transparent)",
          }}
        />

        {/* Bullets */}
        <ul className="space-y-4 mb-12">
          {bullets.map((b) => (
            <li key={b} className="flex items-start gap-3">
              <span
                className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full"
                style={{ background: "#C9A84C", boxShadow: "0 0 6px rgba(201,168,76,0.5)", marginTop: 7 }}
              />
              <span
                className="font-body"
                style={{ fontSize: "clamp(14px, 1.8vw, 16px)", color: "#BBBBBB" }}
              >
                {b}
              </span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <a
          href={CURRICULUM_URL}
          className="btn-gold inline-flex"
          style={{ fontSize: "clamp(13px, 1.5vw, 15px)" }}
        >
          Get Instant Access →
        </a>

      </div>
    </main>
  );
}
