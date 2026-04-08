function TradingLogo() {
  return (
    <svg width="32" height="32" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="28" width="8" height="16" rx="2" fill="#C9A84C" />
      <rect x="16" y="18" width="8" height="26" rx="2" fill="#D4AF37" />
      <rect x="28" y="10" width="8" height="34" rx="2" fill="#C9A84C" />
      <rect x="40" y="4" width="8" height="40" rx="2" fill="#D4AF37" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer
      className="py-10 px-4"
      style={{
        backgroundColor: "#050505",
        borderTop: "1px solid rgba(201,168,76,0.1)",
      }}
    >
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-6">
        {/* Logo + Name */}
        <div className="flex items-center gap-3">
          <TradingLogo />
          <div>
            <div
              className="text-lg font-black tracking-tight"
              style={{ color: "#C9A84C" }}
            >
              HUDDYER
            </div>
            <div className="text-xs" style={{ color: "#555" }}>
              Trading Mentorship
            </div>
          </div>
        </div>

        {/* Divider */}
        <div
          className="w-32 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.3), transparent)" }}
        />

        {/* Links */}
        <div className="flex items-center gap-6 text-xs" style={{ color: "#555" }}>
          <a href="#" className="hover:text-gold transition-colors duration-150 cursor-pointer" style={{ color: "#555" }}>
            Privacy Policy
          </a>
          <a href="#" className="hover:text-gold transition-colors duration-150 cursor-pointer" style={{ color: "#555" }}>
            Terms of Service
          </a>
          <a href="#" className="hover:text-gold transition-colors duration-150 cursor-pointer" style={{ color: "#555" }}>
            Disclaimer
          </a>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-xs leading-relaxed max-w-xl" style={{ color: "#444" }}>
          Trading involves significant risk. Past results are not indicative of future performance.
          The information on this page is for educational purposes only and does not constitute financial advice.
        </p>

        {/* Copyright */}
        <p className="text-xs" style={{ color: "#444" }}>
          © 2025 Huddyer. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
