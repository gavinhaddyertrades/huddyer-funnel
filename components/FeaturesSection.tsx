"use client";

import { useEffect, useRef } from "react";

function ShieldIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <path d="M9 12l2 2 4-4"/>
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18"/>
      <path d="M7 16l4-4 4 4 4-4"/>
    </svg>
  );
}

function UserCheckIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="7" r="4"/>
      <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>
      <path d="M16 11l2 2 4-4"/>
    </svg>
  );
}

function CheckItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2.5 text-sm" style={{ color: "#ccc" }}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mt-0.5 shrink-0">
        <path d="M3 8l3.5 3.5L13 4" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      {text}
    </li>
  );
}

const cards = [
  {
    icon: <ShieldIcon />,
    title: "Execution & Risk Management",
    items: [
      "Defined entry and exit criteria",
      "Position sizing based on risk parameters",
      "Capital preservation rules",
      "Consistency-first trade management",
    ],
    active: false,
  },
  {
    icon: <ChartIcon />,
    title: "Structured Trading Framework",
    items: [
      "Clear market structure identification",
      "Rule-based trade setups",
      "Defined invalidation and target levels",
      "Focus on repeatable, high-quality trades",
    ],
    active: true,
  },
  {
    icon: <UserCheckIcon />,
    title: "Coaching & Performance Review",
    items: [
      "Weekly trade reviews",
      "Execution feedback and refinement",
      "Live coaching and Q&A sessions",
      "Accountability and progress tracking",
    ],
    active: false,
  },
];

export default function FeaturesSection() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="section-fade py-24 px-4"
      style={{ backgroundColor: "#080808" }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight" style={{ color: "#f5f5f5" }}>
            A{" "}
            <span
              className="italic font-bold"
              style={{
                background: "linear-gradient(90deg, #C9A84C, #D4AF37)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Structured Approach
            </span>{" "}
            to
            <br />
            Consistent Trading
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <div
              key={i}
              className="rounded-2xl p-7 flex flex-col gap-6 cursor-default transition-all duration-300 hover:scale-[1.02]"
              style={
                card.active
                  ? {
                      background: "linear-gradient(135deg, #141408 0%, #1a1a0a 100%)",
                      border: "1px solid rgba(201,168,76,0.5)",
                      boxShadow: "0 0 40px rgba(201,168,76,0.12), inset 0 0 30px rgba(201,168,76,0.03)",
                    }
                  : {
                      background: "#111111",
                      border: "1px solid rgba(201,168,76,0.12)",
                    }
              }
            >
              {/* Icon circle */}
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{
                  background: card.active
                    ? "linear-gradient(135deg, rgba(201,168,76,0.25), rgba(201,168,76,0.1))"
                    : "rgba(201,168,76,0.08)",
                  border: "1px solid rgba(201,168,76,0.3)",
                  color: "#C9A84C",
                }}
              >
                {card.icon}
              </div>

              <h3
                className="text-xl font-bold leading-tight"
                style={{ color: card.active ? "#D4AF37" : "#f5f5f5" }}
              >
                {card.title}
              </h3>

              <ul className="space-y-3">
                {card.items.map((item, j) => (
                  <CheckItem key={j} text={item} />
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
