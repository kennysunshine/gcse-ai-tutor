import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LumenForge | Elite GCSE AI Socratic Tutor",
  description: "LumenForge is a next-generation AI Socratic Mentor for UK GCSE students. We don't give you answers; we build high-status thinkers through curriculum-aligned, interactive pedagogical frameworks.",
  keywords: ["GCSE", "AI Tutor", "Socratic Method", "AQA", "Edexcel", "OCR", "Revision", "UK Education"],
  authors: [{ name: "LumenForge Team" }],
  openGraph: {
    title: "LumenForge | Elite GCSE AI Socratic Tutor",
    description: "Never get the answer — learn to find it. Master your GCSEs with an AI companion that guides you step-by-step.",
    url: "https://lumenforge.co.uk",
    siteName: "LumenForge",
    locale: "en_GB",
    type: "website",
  }
};


import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { CookieBanner } from "@/components/cookie-banner"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "LumenForge",
    "url": "https://lumenforge.co.uk",
    "logo": "https://lumenforge.co.uk/logo.png",
    "description": "An elite AI Socratic Mentor designed for UK GCSE students, utilizing the Thermostat Rule and structured curriculum mastery frameworks.",
    "sameAs": [
      "https://twitter.com/LumenForge",
      "https://linkedin.com/company/lumenforge"
    ],
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "GBP",
      "lowPrice": "0.00",
      "highPrice": "24.99",
      "offerCount": "3"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://lumenforge.co.uk/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${lexend.variable} font-sans antialiased min-h-screen flex flex-col`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring font-bold shadow-lg">
            Skip to main content
          </a>
          <Navbar />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
