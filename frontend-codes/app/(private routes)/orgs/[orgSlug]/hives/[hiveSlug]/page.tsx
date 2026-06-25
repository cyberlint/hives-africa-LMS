import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { 
  Users, 
  Activity, 
  Calendar, 
  MessageSquare, 
  Settings, 
  Plus, 
  BookOpen,
  ChevronRight
} from "lucide-react";

import { HiveHeader } from "../_components/HiveHeader";
import { HiveTabs } from "../_components/HiveTabs";

interface HiveOverviewPageProps {
  params: Promise<{ orgSlug: string; hiveSlug: string }>;
}

export default async function HiveOverviewPage({ params }: HiveOverviewPageProps) {
  // FIX: Await params to resolve the logging bug and ensure compatibility
  const { orgSlug, hiveSlug } = await params;

  const organization = await prisma.organization.findUnique({
    where: { slug: orgSlug },
  });

  if (!organization) {
    notFound();
  }

  const hive = await prisma.hive.findFirst({
    where: {
      slug: hiveSlug,
      organizationId: organization.id,
    },
    include: {
      members: {
        take: 5, // Only grab a few for the avatar strip
        include: {
          user: true, 
        },
      },
      _count: {
        select: { members: true }
      }
    },
  });

  if (!hive) {
    notFound();
  }

  return (
    <section className="space-y-6 pb-24">
      {/* HEADER & TABS */}
      <HiveHeader
        orgSlug={organization.slug}
        hiveSlug={hive.slug}
        hiveName={hive.name}
        hiveDescription={hive.description}
        memberCount={hive._count.members}
      />
      <HiveTabs
        orgSlug={organization.slug}
        hiveSlug={hive.slug}
      />

      {/* TOP METRICS STRIP */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Users className="size-4" />
            <p className="text-sm font-medium">Total Members</p>
          </div>
          <p className="text-3xl font-bold">{hive._count.members}</p>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Activity className="size-4" />
            <p className="text-sm font-medium">Engagement</p>
          </div>
          <p className="text-3xl font-bold text-emerald-600">High</p>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Calendar className="size-4" />
            <p className="text-sm font-medium">Established</p>
          </div>
          <p className="text-3xl font-bold">
            {new Date(hive.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* MAIN COMMAND CENTER LAYOUT */}
      <div className="grid gap-6 lg:grid-cols-3 items-start">
        
        {/* LEFT COLUMN: The Timeline / Feed (Like a Chat Thread) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
            <div className="border-b px-6 py-4 flex items-center justify-between bg-muted/30">
              <h3 className="font-semibold flex items-center gap-2">
                <MessageSquare className="size-4 text-orange" />
                Recent Activity
              </h3>
              <Link href="#" className="text-sm text-orange font-medium hover:underline">
                View all
              </Link>
            </div>
            
            <div className="p-0">
              {/* Mock Feed Items - Replace with real database mapping */}
              <div className="group flex items-start gap-4 border-b p-5 hover:bg-muted/10 transition-colors cursor-pointer">
                <div className="size-10 rounded-full bg-orange/10 flex items-center justify-center shrink-0">
                  <Plus className="size-5 text-orange" />
                </div>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-semibold text-foreground">Sarah Jenkins</span> joined the hive.
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                </div>
              </div>

              <div className="group flex items-start gap-4 border-b p-5 hover:bg-muted/10 transition-colors cursor-pointer">
                <div className="size-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                  <BookOpen className="size-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm">
                    New module <span className="font-semibold text-foreground">{"Advanced React Patterns"}</span> was published.
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Yesterday at 4:30 PM</p>
                </div>
              </div>

              <div className="p-6 text-center">
                <p className="text-sm text-muted-foreground">End of recent activity.</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Quick Actions & Roll Call (Like Group Info) */}
        <div className="space-y-6">
          
          {/* QUICK ACTIONS GRID */}
          <div className="grid grid-cols-2 gap-3">
            <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border bg-card hover:border-orange hover:bg-orange/5 transition shadow-sm">
              <div className="size-10 rounded-full bg-orange/10 flex items-center justify-center">
                <Plus className="size-5 text-orange" />
              </div>
              <span className="text-sm font-medium">Add Member</span>
            </button>

            <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border bg-card hover:border-blue-500 hover:bg-blue-500/5 transition shadow-sm">
              <div className="size-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <BookOpen className="size-5 text-blue-600" />
              </div>
              <span className="text-sm font-medium">Assign Task</span>
            </button>

            <button className="col-span-2 flex items-center justify-between p-4 rounded-xl border bg-muted/30 hover:bg-muted transition">
              <div className="flex items-center gap-3">
                <Settings className="size-5 text-muted-foreground" />
                <span className="text-sm font-medium">Hive Settings</span>
              </div>
              <ChevronRight className="size-4 text-muted-foreground" />
            </button>
          </div>

          {/* MEMBER ROLL CALL STRIP */}
          <div className="rounded-2xl border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm">Hive Roster</h3>
              <span className="text-xs font-medium bg-muted px-2 py-1 rounded-md text-muted-foreground">
                {hive._count.members} Total
              </span>
            </div>
            
            <Link href={`/${orgSlug}/${hiveSlug}/members`} className="flex items-center justify-between group">
              <div className="flex -space-x-3 overflow-hidden">
                {hive.members.map((member) => (
                  <div key={member.id} className="relative size-10 rounded-full border-2 border-background bg-muted flex items-center justify-center overflow-hidden">
                    {member.user.image ? (
                      <Image 
                        src={member.user.image} 
                        alt={member.user.name || "User"} 
                        fill 
                        className="object-cover" 
                      />
                    ) : (
                      <span className="text-xs font-bold">{member.user.name?.charAt(0) || "U"}</span>
                    )}
                  </div>
                ))}
                {hive._count.members > 5 && (
                  <div className="relative size-10 rounded-full border-2 border-background bg-muted flex items-center justify-center z-10">
                    <span className="text-xs font-bold text-muted-foreground">+{hive._count.members - 5}</span>
                  </div>
                )}
              </div>
              <div className="size-8 rounded-full border flex items-center justify-center bg-background group-hover:border-foreground transition">
                <ChevronRight className="size-4" />
              </div>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}