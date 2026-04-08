"use client";

import { useEffect, useRef } from "react";

const items = [
  {
    num: "01",
    title: "Structured Video Curriculum",
    desc: "9+ hours of precision-built modules covering market structure, execution, and the complete funded account strategy. Learn it at your pace, apply it in real markets.",
  },
  {
    num: "02",
    title: "Live Direct Calls With Hudson",
    desc: "Twice-weekly live calls with Hudson — kept intentionally small so you actually get access. Real-time feedback on your setups, your mistakes, and your progress.",
  },
  {
    num: "03",
    title: "Risk & Capital Management",
    desc: "The exact framework Hudson uses to protect capital and maintain consistency across volatile market conditions. This is what separates funded traders from everyone else.",
  },
  {
    num: "04",
    title: "The 90-Day Guarantee",
    desc: "Do the work and don't hit profitability within 90 days? Hudson continues working with you at no extra cost. The guarantee exists because the system works — if you do.",
  },
];

export default function CurriculumSection() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.05 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="section-fade py-20 md:py-24 px-5 md:px-12"
      style={{
        backgroundColor: "#0D0D0D",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10 md:mb-14">
          <p
            className="font-body text-xs uppercase tracking-widest mb-3"
            style={{ color: "#999" }}
          >
            The Program
          </p>
          <h2
            className="font-display leading-none"
            style={{
              fontSize: "clamp(44px, 8vw, 96px)",
              color: "#F2EDE6",
              letterSpacing: "0.02em",
            }}
          >
            WHAT YOU&apos;RE GETTING
          </h2>
        </div>

        {/* Items */}
        <div className="flex flex-col">
          {items.map((item, i) => (
            <div
              key={item.num}
              className="flex flex-row gap-5 md:gap-10 py-7 md:py-10"
              style={{
                borderTop: i === 0 ? "1px solid rgba(255,255,255,0.07)" : "none",
                borderBottom: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              {/* Number */}
              <div
                className="font-display shrink-0"
                style={{
                  fontSize: "clamp(32px, 5vw, 48px)",
                  color: "rgba(201,168,76,0.25)",
                  letterSpacing: "0.02em",
                  lineHeight: 1,
                  minWidth: "44px",
                }}
              >
                {item.num}
              </div>

              {/* Content */}
              <div className="flex flex-col gap-2 justify-center">
                <h3
                  className="font-display"
                  style={{
                    fontSize: "clamp(18px, 2.5vw, 28px)",
                    color: "#F2EDE6",
                    letterSpacing: "0.03em",
                  }}
                >
                  {item.title.toUpperCase()}
                </h3>
                <p
                  className="font-body text-sm leading-relaxed"
                  style={{ color: "#777", maxWidth: "560px" }}
                >
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
