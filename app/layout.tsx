import type { Metadata } from "next";
import { Bebas_Neue, DM_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

// Trim DM Sans to only the two weights actually used on the page
const bebasNeue = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  icons: { icon: [{ url: "/favicon.svg", type: "image/svg+xml" }, { url: "/og-image.png", type: "image/png" }] },
  title: "Huddyer | Become Consistently Profitable",
  description:
    "Hudson Shaffer's trading mentorship. The structured system serious traders use to become consistently profitable and pass funded evaluations.",
  openGraph: {
    title: "Huddyer | Become Consistently Profitable",
    description:
      "Hudson Shaffer's trading mentorship. The structured system serious traders use to become consistently profitable and pass funded evaluations.",
    images: [{ url: "/og-image.png", width: 1080, height: 1080 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Huddyer | Become Consistently Profitable",
    description:
      "Hudson Shaffer's trading mentorship. The structured system serious traders use to become consistently profitable and pass funded evaluations.",
    images: ["/og-image.png"],
  },
};

// Meta Pixel stub — sets up the fbq queue without calling init yet
const META_PIXEL_STUB = `
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
`.trim();

// Init call — reads URL params at runtime so Advanced Matching data is passed
// when Meta redirects back with em/ph/first/last in the query string.
// Only includes fields that are actually present (no empty strings).
const META_PIXEL_INIT = `
(function(){
  var p=new URLSearchParams(window.location.search);
  var ud={};
  if(p.get('email')) ud.em=p.get('email');
  if(p.get('phone')) ud.ph=p.get('phone');
  if(p.get('first')) ud.fn=p.get('first');
  if(p.get('last'))  ud.ln=p.get('last');
  fbq('init','3139300056416271',ud);
  fbq('track','PageView');
})();
`.trim();

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
      <head>
        {/*
          Preconnect to third-party origins so DNS/TCP/TLS are warmed up
          before the browser even asks for the scripts.
          Saves ~200-400ms on mobile cold connections.
        */}
        <link rel="preconnect" href="https://fast.wistia.com" />
        <link rel="preconnect" href="https://embedwistia-a.akamaihd.net" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://connect.facebook.net" />
        <link rel="dns-prefetch" href="https://fast.wistia.com" />
        <link rel="dns-prefetch" href="https://embedwistia-a.akamaihd.net" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />

        {/*
          Meta Pixel — inline script, no Next.js Script wrapper.
          Fires on first HTML parse, not after React hydration.
          This closes the gap between ad clicks and reported PageViews.
        */}
        {/* eslint-disable-next-line @next/next/no-before-interactive-script-outside-document */}
        <script dangerouslySetInnerHTML={{ __html: META_PIXEL_STUB }} />
        {/* eslint-disable-next-line @next/next/no-before-interactive-script-outside-document */}
        <script dangerouslySetInnerHTML={{ __html: META_PIXEL_INIT }} />
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=3139300056416271&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </head>
      <body
        className="min-h-full flex flex-col"
        style={{
          backgroundColor: "#0A0A0A",
          color: "#F2EDE6",
          fontFamily: "var(--font-dm-sans), sans-serif",
        }}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
