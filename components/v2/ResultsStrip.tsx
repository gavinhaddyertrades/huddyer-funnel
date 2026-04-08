"use client";

import { useEffect, useRef } from "react";

const stats = [
  { value: "200+", label: "Traders Mentored" },
  { value: "$30K", label: "Student's First Month" },
  { value: "90 Days", label: "Profitability Guarantee" },
];

export default function ResultsStrip() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="section-fade"
      style={{
        backgroundColor: "#111111",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div className="max-w-5xl mx-auto px-6 py-14 flex flex-col sm:flex-row items-center justify-between gap-10">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center gap-2 flex-1">
            <span
              className="font-display"
              style={{
                fontSize: "clamp(52px, 7vw, 80px)",
                color: "#F2EDE6",
                letterSpacing: "0.02em",
                lineHeight: 1,
              }}
            >
              {stat.value}
            </span>
            <span
              className="font-body text-xs uppercase tracking-widest text-center"
              style={{ color: "#999" }}
            >
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
