import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, DM_Serif_Display, Plus_Jakarta_Sans, Lora } from "next/font/google";
import "./globals.css";

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const dmSerifDisplay = DM_Serif_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-accent",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "unsent — say it. someone hears it.",
  description:
    "Anonymous venting app for students. Type how you feel, post anonymously, and get a reply from a stranger. 100% anonymous. 100% safe. 🌸",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "unsent",
  },
  openGraph: {
    title: "unsent — anonymous venting for students",
    description: "Say what you feel. Someone hears it. You'll never know if they're human or AI.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#f56393",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorantGaramond.variable} ${dmSerifDisplay.variable} ${plusJakartaSans.variable} ${lora.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Prevent Dark Reader from overriding our baby pink theme */}
        <meta name="darkreader-lock" />
        <meta name="color-scheme" content="light only" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="unsent" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
