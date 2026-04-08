import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import SocialNavbar from "../../community/_components/social-navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function ProfileLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      reputationLedger: { select: { points: true } },
    },
  });

  if (!user) return notFound();

  // Calculate Tier for the Profile Sub-header
  const totalPoints = user.reputationLedger.reduce((acc, tx) => acc + tx.points, 0);
  const getTier = (pts: number) => {
    if (pts > 3000) return "Elite Builder";
    if (pts > 1500) return "Gold Builder";
    if (pts > 500) return "Silver Builder";
    return "Bronze Builder";
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* 1. THE CONSISTENT NAVBAR */}
      <SocialNavbar />

      {/* 2. CONTEXTUAL IDENTITY BAR (The "Profile Anchor") 
             This appears right below the main navbar to provide context without 
             breaking the global navigation experience.
      */}
      <div className="sticky top-16 z-40 border-b border-border/40 bg-background/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/community" 
              className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="size-3" />
              <span className="hidden sm:inline">Back to Community</span>
            </Link>
            
            <div className="h-4 w-px bg-border mx-1" />

            <div className="flex items-center gap-2">
              <Avatar className="size-6 border border-border">
                <AvatarImage src={user.image || undefined} />
                <AvatarFallback className="text-[10px]">{user.name?.[0]}</AvatarFallback>
              </Avatar>
              <span className="text-xs font-black tracking-tight">{user.name}</span>
              <Badge variant="outline" className="text-[9px] py-0 px-1.5 h-4 border-orange/30 text-orange uppercase font-black">
                {getTier(totalPoints)}
              </Badge>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-4">
             <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
               Verifiable Profile
             </p>
          </div>
        </div>
      </div>

      {/* 3. MAIN CONTENT */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 md:pb-10 pt-6">
        {children}
      </main>
    </div>
  );
}