import { requireAuth } from "@/domains/auth/require-auth"
import SocialNavbar from "./_components/social-navbar"

export default async function CommunityLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAuth()

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col">
      <SocialNavbar />

      <main className="flex-1 max-w-[1280px] mx-auto px-4 py-6 pb-24 md:pb-6">
        {children}
      </main>
    </div>
  )
}