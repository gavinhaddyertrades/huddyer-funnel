function TradingBarsLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2"  y="22" width="6" height="14" rx="1.5" fill="#C9A84C" />
      <rect x="12" y="14" width="6" height="22" rx="1.5" fill="#D4AF37" />
      <rect x="22" y="8"  width="6" height="28" rx="1.5" fill="#C9A84C" />
      <rect x="32" y="2"  width="6" height="34" rx="1.5" fill="#D4AF37" />
    </svg>
  );
}

export default function FooterV2() {
  return (
    /* Extra bottom padding on mobile so sticky CTA doesn't cover footer */
    <footer
      className="py-12 pb-24 md:pb-12 px-5 md:px-12"
      style={{
        backgroundColor: "#060606",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="max-w-5xl mx-auto flex flex-col items-center gap-7">
        {/* Logo — stacked on mobile */}
        <div className="flex flex-col items-center gap-1.5">
          <TradingBarsLogo />
          <span
            className="font-display text-sm tracking-widest"
            style={{ color: "#666", letterSpacing: "0.15em" }}
          >
            HUDDYERTRADES
          </span>
        </div>

        {/* Legal links — wrap gracefully */}
        <div
          className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-body text-xs"
          style={{ color: "#777" }}
        >
          <a href="#" style={{ color: "#777", minHeight: "44px", display: "inline-flex", alignItems: "center" }}>
            Privacy Policy
          </a>
          <a href="#" style={{ color: "#777", minHeight: "44px", display: "inline-flex", alignItems: "center" }}>
            Terms of Service
          </a>
          <a href="#" style={{ color: "#777", minHeight: "44px", display: "inline-flex", alignItems: "center" }}>
            Disclaimer
          </a>
        </div>

        {/* Risk disclaimer */}
        <p
          className="font-body text-xs leading-relaxed text-center"
          style={{ color: "#666", maxWidth: "520px" }}
        >
          Trading futures involves substantial risk of loss and is not appropriate for all investors.
          Past performance is not necessarily indicative of future results. All content on this page
          is for educational and informational purposes only and does not constitute financial or
          investment advice.
        </p>

        <p className="font-body text-xs" style={{ color: "#666" }}>
          © 2025 Huddyer. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
