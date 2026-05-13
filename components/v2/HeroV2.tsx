"use client";

import Script from "next/script";
import { useUTMUrl } from "@/hooks/useUTMUrl";

const TYPEFORM_BASE = "https://form.typeform.com/to/AH6Qxmyu";
const WISTIA_ID = "ht3wh0gzng";

export default function HeroV2() {
  const typeformUrl = useUTMUrl(TYPEFORM_BASE);

  return (
    <>
      <Script src="https://fast.wistia.com/player.js" strategy="afterInteractive" />
      <Script
        src={`https://fast.wistia.com/embed/${WISTIA_ID}.js`}
        strategy="afterInteractive"
        type="module"
      />

      <section
        className="min-h-screen flex items-center justify-center px-5 py-12"
        style={{ backgroundColor: "#0A0A0A" }}
      >
        <div className="w-full flex flex-col items-center gap-6" style={{ maxWidth: 700 }}>

          {/* Headline */}
          <h1
            className="font-display leading-none text-center"
            style={{
              fontSize: "clamp(40px, 8vw, 80px)",
              color: "#F2EDE6",
              letterSpacing: "0.02em",
            }}
          >
            BECOME CONSISTENTLY{" "}
            <span className="gold-text-gradient">PROFITABLE.</span>
          </h1>

          {/* Subheadline */}
          <p
            className="font-body text-center leading-snug"
            style={{
              fontSize: "clamp(14px, 2vw, 17px)",
              color: "#777",
              maxWidth: 520,
            }}
          >
            The structured system Hudson uses to turn serious traders into
            consistently profitable, funded professionals.
          </p>

          {/* Video */}
          <div className="w-full rounded-xl overflow-hidden" style={{ border: "1px solid rgba(201,168,76,0.2)" }}>
            <style>{`
              wistia-player[media-id='${WISTIA_ID}']:not(:defined) {
                background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/${WISTIA_ID}/swatch');
                display: block;
                filter: blur(5px);
                padding-top: 56.25%;
              }
            `}</style>
            <div
              dangerouslySetInnerHTML={{
                __html: `<wistia-player media-id="${WISTIA_ID}" aspect="1.7777777777777777"></wistia-player>`,
              }}
            />
          </div>

          {/* CTA */}
          <div className="flex flex-col items-center gap-3 w-full">
            <a
              href={typeformUrl}
              className="btn-gold w-full sm:w-auto justify-center"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: "16px", padding: "18px 48px" }}
            >
              Apply Now
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M3.75 9h10.5M9.75 4.5L14.25 9l-4.5 4.5" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <p className="font-body text-xs" style={{ color: "#555" }}>
              Limited spots per cohort. Every application is reviewed.
            </p>
          </div>

        </div>
      </section>
    </>
  );
}
