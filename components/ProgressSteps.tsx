"use client";

import { useEffect, useRef } from "react";

function ShieldIcon({ active }: { active?: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ color: active ? "#080808" : "#C9A84C" }}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  );
}

function CrownIcon({ active }: { active?: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ color: active ? "#080808" : "#C9A84C" }}>
      <path d="M2 20h20"/>
      <path d="M5 20l2-8 5 4 5-4 2 8"/>
      <circle cx="12" cy="7" r="2" fill="currentColor"/>
    </svg>
  );
}

function BrainIcon({ active }: { active?: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ color: active ? "#080808" : "#C9A84C" }}>
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/>
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/>
    </svg>
  );
}

const steps = [
  {
    icon: (active?: boolean) => <ShieldIcon active={active} />,
    label: "BUILD",
    sub: "CONSISTENCY",
    active: false,
  },
  {
    icon: (active?: boolean) => <CrownIcon active={active} />,
    label: "TRADE",
    sub: "WITH CONFIDENCE",
    active: true,
  },
  {
    icon: (active?: boolean) => <BrainIcon active={active} />,
    label: "MASTER YOUR",
    sub: "LEARNING",
    active: false,
  },
];

function ArrowIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0 hidden sm:block">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="rgba(201,168,76,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function ProgressSteps() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="section-fade py-10 px-4" style={{ backgroundColor: "#080808" }}>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          {steps.map((step, i) => (
            <div key={step.label} className="flex items-center gap-4 sm:gap-6">
              <div
                className="flex items-center gap-3 px-6 py-4 rounded-full cursor-default transition-all duration-200"
                style={
                  step.active
                    ? {
                        background: "linear-gradient(135deg, #C9A84C, #D4AF37)",
                        boxShadow: "0 4px 20px rgba(201,168,76,0.35)",
                      }
                    : {
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }
                }
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                  style={
                    step.active
                      ? { background: "rgba(8,8,8,0.2)" }
                      : { background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)" }
                  }
                >
                  {step.icon(step.active)}
                </div>
                <div>
                  <div
                    className="text-xs font-bold tracking-widest"
                    style={{ color: step.active ? "rgba(8,8,8,0.7)" : "#666" }}
                  >
                    {step.label}
                  </div>
                  <div
                    className="text-sm font-black tracking-wider"
                    style={{ color: step.active ? "#080808" : "#f5f5f5" }}
                  >
                    {step.sub}
                  </div>
                </div>
              </div>
              {i < steps.length - 1 && <ArrowIcon />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
