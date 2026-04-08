import { requireAuth } from "@/domains/auth/require-auth"
import SocialNavbar from "./_components/social-navbar"

export default async function CommunityLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAuth()

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col">
      {/* Navbar stays on top */}
      <SocialNavbar />

      {/* Main content */}
      <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 py-6 pb-24 md:pb-6">
        {children}
      </main>
    </div>
  )
}