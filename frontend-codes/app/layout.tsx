import type { Metadata } from "next";
import { Geist } from "next/font/google";
// Declared in a d.ts shim for CSS modules; Next.js allows global CSS here.
import "./globals.css";
import { QueryProvider } from "./providers/QueryProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/contexts/CartContext";
import { ThemeProvider } from "@/components/ui/theme-provider";
import FacebookPixel from "@/components/metadata/FacebookPixel";
// Site-wide chrome (Topbar, Navbar, Footer) moved into `(public routes)/layout.tsx` to avoid rendering inside private student dashboard.

const geist = Geist({
    subsets: ["latin"],
    variable: "--font-geist-sans",
    display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.hives.africa"),
  title: {
    template: "%s | NextHive",
    default: "NextHive | Innovation, Learning & Talent Development Ecosystem",
  },

  description:
    "NextHive helps organizations design, manage, and scale innovation challenges, fellowships, bootcamps, accelerators, workforce development initiatives, and learning programs. Manage applications, cohorts, activities, teams, submissions, reviews, and outcomes from a single platform.",

  keywords: [
    "innovation challenge platform",
    "program management software",
    "cohort management",
    "bootcamp platform",
    "accelerator management",
    "hackathon platform",
    "fellowship management",
    "talent development",
    "workforce development",
    "learning platform",
    "Africa innovation ecosystem",
    "NextHive",
  ],
  openGraph: {
    title:
      "NextHive | Innovation, Learning & Talent Development Ecosystem",

    description:
      "Run innovation challenges, fellowships, accelerators, bootcamps, workforce development initiatives, and learning programs from a single platform.",

    url: "https://www.hives.africa",
    siteName: "NextHive",
    type: "website",

    images: [
      {
        url: "https://nexthive-lms.t3.storage.dev/Brand%20Identity/NextHive%20Logo%20-%20Orange%20BG.png",
        width: 1200,
        height: 630,
        alt: "NextHive",
      },
    ],

  },

  twitter: {
    card: "summary_large_image",

    title:
      "NextHive | Innovation, Learning & Talent Development Ecosystem",

    description:
      "Manage innovation challenges, cohorts, learning programs, submissions, reviews, teams, and outcomes at scale.",

    images: [
      "https://nexthive-lms.t3.storage.dev/Brand%20Identity/NextHive%20Logo%20-%20Orange%20BG.png",
    ],

    site: "@nexthive_hq",

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
};

// Viewport settings for mobile responsiveness and theme color for mobile browsers
export const viewport = {
  themeColor: "#FDB606",
};

// Create a client

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning style={{ height: '100%' }}>
      <body className={`${geist.variable} font-sans bg-white dark:bg-darkBlue-300 text-gray-900 dark:text-gray-100 transition-colors duration-300`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <AuthProvider>
              <CartProvider>
                <Toaster
                  position="top-right"
                  toastOptions={{
                    style: {
                      background: "var(--background)",
                      color: "var(--foreground)",
                      border: "1px solid var(--border)",
                    },
                  }}
                />
                {children}
                <FacebookPixel />
              </CartProvider>
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}