
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
// Declared in a d.ts shim for CSS modules; Next.js allows global CSS here.
import "./globals.css";
import { QueryProvider } from "./providers/QueryProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/contexts/CartContext";
import { ThemeProvider } from "@/components/ui/theme-provider";
import FacebookPixel from "@/components/metadata/FacebookPixel";
// Site-wide chrome (Topbar, Navbar, Footer) moved into `(public routes)/layout.tsx` to avoid rendering inside private student dashboard.

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "NextHive | Pan-African AI School",
  description: "Empowering Africa's Future with AI Education",

  // Favicon / Icons
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon-32x32.png", // optional
    apple: "/apple-touch-icon.png",  // optional
  },

  // Open Graph (Facebook, LinkedIn, etc.)
  openGraph: {
    title: "NextHive | Pan-African AI School",
    description: "Empowering Africa's Future with AI Education",
    url: "https://www.hives.africa/",
    siteName: "NextHive",
    type: "website",
    images: [
      {
        url: "https://nexthive-lms.t3.storage.dev/Brand%20Identity/NextHive%20Logo%20-%20Orange%20BG.png", // your actual logo
        width: 1200,
        height: 630,
        alt: "NextHive Logo",
        type: "image/png",
      },
      // Optional: if you have a dynamic OG route
      {
        url: "https://www.hives.africa/api/og",
        width: 1200,
        height: 630,
        alt: "NextHive Dynamic OG Image",
        type: "image/png",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "NextHive | Pan-African AI School",
    description: "Empowering Africa's Future with AI Education",
    images: [
      "https://nexthive-lms.t3.storage.dev/Brand%20Identity/NextHive%20Logo%20-%20Orange%20BG.png",
    ],
    site: "@YourTwitterHandle", // replace with your Twitter handle if you have one
  },

  // Optional SEO helpers
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },

  themeColor: "#FDB606", // your orange brand color
};

// Create a client

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning style={{ height: '100%' }}>
      <body className={`${montserrat.className} bg-white dark:bg-darkBlue-300 text-gray-900 dark:text-gray-100 transition-colors duration-300`} style={{ height: '100%' }}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
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
