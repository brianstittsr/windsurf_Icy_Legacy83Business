import type { Metadata } from "next";
import { Manrope, DM_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { AccessibilityWidget } from "@/components/shared/accessibility-widget";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://legacy83business.com"),
  title: {
    default: "Legacy 83 Business | Build Wealth. Inspire Teams. Leave a Legacy.",
    template: "%s | Legacy 83 Business",
  },
  description:
    "Legacy 83 Business helps entrepreneurs and business owners build sustainable wealth, develop high-performing teams, and create lasting legacies through strategic coaching and the G.R.O.W.S. framework.",
  keywords: [
    "business coaching",
    "executive coaching",
    "leadership development",
    "strategic planning",
    "business succession",
    "legacy planning",
    "operational excellence",
    "team development",
    "business growth",
    "entrepreneur coaching",
    "wealth building",
    "business transformation",
  ],
  authors: [{ name: "Legacy 83 Business Inc", url: "https://legacy83business.com" }],
  creator: "Legacy 83 Business Inc",
  publisher: "Legacy 83 Business Inc",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://legacy83business.com",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://legacy83business.com",
    siteName: "Legacy 83 Business",
    title: "Legacy 83 Business | Build Wealth. Inspire Teams. Leave a Legacy.",
    description:
      "Legacy 83 Business helps entrepreneurs and business owners build sustainable wealth, develop high-performing teams, and create lasting legacies through strategic coaching and the G.R.O.W.S. framework.",
    images: [
      {
        url: "/legacy83Logo.webp",
        width: 1200,
        height: 630,
        alt: "Legacy 83 Business - Build Wealth. Inspire Teams. Leave a Legacy.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Legacy 83 Business | Build Wealth. Inspire Teams. Leave a Legacy.",
    description:
      "Legacy 83 Business helps entrepreneurs and business owners build sustainable wealth, develop high-performing teams, and create lasting legacies through strategic coaching and the G.R.O.W.S. framework.",
    images: ["/legacy83Logo.webp"],
    creator: "@legacy83business",
  },
  verification: {
    google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },
  category: "business",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Skip to main content link for keyboard users - WCAG 2.4.1 */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${manrope.variable} ${dmSans.variable} font-sans antialiased`}>
        {/* Skip to main content link - WCAG 2.4.1 Bypass Blocks */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
        >
          Skip to main content
        </a>
        {children}
        <Toaster />
        {/* UserWay Accessibility Widget */}
        <AccessibilityWidget />
      </body>
    </html>
  );
}
