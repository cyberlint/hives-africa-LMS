import ArenaNavbar from "./_components/arena-navbar"

export default function ArenaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-muted/20 flex flex-col">

      {/* Navbar */}
      <ArenaNavbar />

      {/* Content */}
      <main className="flex-1 w-full">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {children}
        </div>
      </main>
    </div>
  )
}