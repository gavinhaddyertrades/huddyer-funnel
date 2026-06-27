import Link from "next/link";

export default function ThankYouPage() {
  return (
    <div style={{ backgroundColor: "#1a1810", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>

      {/* Icon */}
      <div style={{
        width: 72, height: 72, borderRadius: "50%",
        backgroundColor: "rgba(201,168,76,0.12)",
        border: "2px solid #D4AF37",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 32, marginBottom: 32, color: "#D4AF37",
      }}>
        ✓
      </div>

      {/* Heading */}
      <h1 style={{
        fontFamily: "var(--font-display)",
        fontSize: "clamp(36px, 6vw, 64px)",
        color: "#F2EDE6",
        letterSpacing: "0.02em",
        lineHeight: 1,
        textAlign: "center",
        marginBottom: 16,
      }}>
        YOU&apos;RE <span style={{ color: "#D4AF37" }}>IN.</span>
      </h1>

      {/* Subheading */}
      <p style={{
        fontFamily: "var(--font-body)",
        fontSize: 18,
        color: "#c8c2b8",
        textAlign: "center",
        lineHeight: 1.7,
        maxWidth: 480,
        marginBottom: 48,
      }}>
        Welcome to the Trading Room. Check your email for your login details and next steps.
      </p>

      {/* Card */}
      <div style={{
        backgroundColor: "#111008",
        border: "1px solid rgba(201,168,76,0.25)",
        borderRadius: 16,
        padding: "32px 36px",
        maxWidth: 480,
        width: "100%",
        marginBottom: 40,
      }}>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#888", marginBottom: 20 }}>
          What happens next
        </p>
        {[
          { icon: "📧", text: "Check your email for your Whop login link" },
          { icon: "⚡", text: "Access the full curriculum from day one" },
          { icon: "📈", text: "Join Hudson live at 9:30am EST every trading morning" },
        ].map(({ icon, text }) => (
          <div key={text} style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 18 }}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>{icon}</span>
            <span style={{ fontFamily: "var(--font-body)", color: "#c8c2b8", fontSize: 15, lineHeight: 1.6 }}>{text}</span>
          </div>
        ))}
      </div>

      {/* Back link */}
      <Link href="/" style={{
        fontFamily: "var(--font-body)",
        color: "#C9A84C",
        fontSize: 14,
        textDecoration: "none",
        borderBottom: "1px solid rgba(201,168,76,0.3)",
        paddingBottom: 2,
      }}>
        ← Back to huddyertrades.biz
      </Link>

    </div>
  );
}
