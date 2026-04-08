"use client";

import { useEffect, useRef } from "react";

export default function CaseStudySection() {
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
    <section
      ref={ref}
      className="section-fade py-24 px-4"
      style={{ backgroundColor: "#080808" }}
    >
      <div className="max-w-3xl mx-auto flex flex-col items-center gap-10">
        {/* Title */}
        <div className="text-center space-y-2">
          <p
            className="text-xs uppercase tracking-[0.3em] font-semibold"
            style={{ color: "#888" }}
          >
            Student Success Story
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight" style={{ color: "#f5f5f5" }}>
            HOW CARMINE GOT HIS
            <br />
            FIRST PAYOUT IN{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #C9A84C, #D4AF37)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              1 MONTH
            </span>
          </h2>
        </div>

        {/* YouTube Embed */}
        <div
          className="w-full rounded-2xl overflow-hidden"
          style={{
            border: "1px solid rgba(201,168,76,0.3)",
            boxShadow: "0 0 40px rgba(201,168,76,0.1)",
          }}
        >
          <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?controls=1&rel=0&modestbranding=1"
              title="How Carmine Got His First Payout In 1 Month"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ border: "none" }}
            />
          </div>
        </div>

        {/* Stats row */}
        <div className="flex flex-wrap justify-center gap-8">
          {[
            { value: "$30K+", label: "First Month Payout" },
            { value: "28 Days", label: "Time to First Win" },
            { value: "3x", label: "Account Growth" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1">
              <span
                className="text-3xl font-black"
                style={{
                  background: "linear-gradient(90deg, #C9A84C, #D4AF37)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {stat.value}
              </span>
              <span className="text-xs uppercase tracking-widest" style={{ color: "#888" }}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
