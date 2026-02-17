
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
  title: "NextHive | Courses",
  description: "The Pan-African AI School",
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: 'NextHive | Pan-African AI School',
    description: 'Empowering Africa\'s Future with AI Education',
    url: 'https://hives.africa',
    siteName: 'NextHive',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://hives.africa/api/og', // your OG image route
        width: 1200,
        height: 630,
        alt: 'NextHive Logo',
        type: 'image/png',
      },
    ],
  },
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
