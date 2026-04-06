import { requireAuth } from "@/domains/auth/require-auth"
import SocialNavbar from "./_components/social-navbar"

export default async function CommunityLayout({ children }: { children: React.ReactNode }) {
  // Ensure user is authenticated. Redirects to login if not.
  const session = await requireAuth() 

  return (
    <div className="min-h-screen bg-muted/20">
      <SocialNavbar />

      <main className="max-w-[1280px] mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  )
}