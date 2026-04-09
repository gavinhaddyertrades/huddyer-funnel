import type { Metadata } from "next";
import { Bebas_Neue, DM_Sans } from "next/font/google";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: "400",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Huddyer | Become Consistently Profitable",
  description:
    "Hudson Shaffer's trading mentorship. The structured system serious traders use to become consistently profitable and pass funded evaluations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} ${dmSans.variable} h-full antialiased`}
      style={{ backgroundColor: "#0A0A0A" }}
    >
      <body
        className="min-h-full flex flex-col"
        style={{
          backgroundColor: "#0A0A0A",
          color: "#F2EDE6",
          fontFamily: "var(--font-dm-sans), sans-serif",
        }}
      >
        {children}
      </body>
    </html>
  );
}
