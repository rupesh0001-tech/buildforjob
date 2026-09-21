import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://buildforjob.com"),
  title: {
    default: "BuildForJob | #1 AI Resume Builder, ATS Checker & Portfolio Generator",
    template: "%s | BuildForJob",
  },
  description: "Reverse-engineer Applicant Tracking Systems (ATS) and land 3x more interviews. Build ATS-friendly resumes, tailored cover letters, and 1-click GitHub developer portfolios.",
  keywords: [
    "ATS resume checker",
    "free ATS score checker",
    "AI resume builder",
    "best resume builder 2026",
    "tailored cover letter generator",
    "GitHub portfolio builder",
    "pass ATS screening",
    "resume score optimizer",
    "developer portfolio generator",
    "ATS friendly resume templates",
  ],
  authors: [{ name: "BuildForJob Team" }],
  creator: "BuildForJob",
  publisher: "BuildForJob Inc.",
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
  alternates: {
    canonical: "https://buildforjob.com",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://buildforjob.com",
    title: "BuildForJob | #1 AI Resume Builder & ATS Score Checker",
    description: "Build ATS-optimized resumes, tailored cover letters, and GitHub sync portfolios. Land 3x more interviews.",
    siteName: "BuildForJob",
    images: [
      {
        url: "/main-dashboard.png",
        width: 1200,
        height: 630,
        alt: "BuildForJob AI Resume & Portfolio Builder Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BuildForJob | #1 AI Resume Builder & ATS Score Checker",
    description: "Reverse-engineer ATS screeners and land 3x more interviews with BuildForJob AI.",
    images: ["/main-dashboard.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

import Script from "next/script";
import { ThemeProvider } from "@/components/theme-provider"
import { ReduxProvider } from "@/components/providers/redux-provider"
import { ApiLoadingProvider } from "@/components/providers/api-loading-provider"
import { Toaster } from "sonner"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://buildforjob.com/#website",
        "url": "https://buildforjob.com",
        "name": "BuildForJob",
        "description": "AI Resume & Portfolio Builder with real-time ATS Score Checker",
        "publisher": {
          "@id": "https://buildforjob.com/#organization"
        }
      },
      {
        "@type": "SoftwareApplication",
        "name": "BuildForJob AI Resume Builder",
        "operatingSystem": "All",
        "applicationCategory": "BusinessApplication",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "INR"
        }
      }
    ]
  };

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="h-full antialiased"
    >
      <head>
        <script
          id="website-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className={`${jakartaSans.variable} ${jetbrainsMono.variable} min-h-full flex flex-col font-sans`} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light" disableTransitionOnChange>
          <ReduxProvider>
            <ApiLoadingProvider>
              {children}
            </ApiLoadingProvider>
            <Toaster position="top-right" />
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
