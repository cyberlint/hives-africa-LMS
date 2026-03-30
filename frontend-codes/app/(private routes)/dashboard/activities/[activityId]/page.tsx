import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { requireAuth } from "@/domains/auth/require-auth";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Target,
  Clock,
  Flame,
  ShieldCheck,
  FileText,
  Zap,
  ListChecks,   // <-- NEW IMPORT
  ChevronDown   // <-- NEW IMPORT
} from "lucide-react";
import Link from "next/link";
import { SubmissionEngine } from "../_components/submission-engine";

async function getActivityData(activityId: string, userId: string) {
  const activity = await prisma.activity.findUnique({
    where: { id: activityId },
    include: {
      requirements: true,
      ksbs: {
        include: { ksb: true } 
      }
    }
  })

  const existingSubmission = await prisma.submission.findFirst({
    where: { activityId, userId },
    include: {
      reviews: {
        orderBy: { createdAt: 'desc' },
        take: 1,
        include: {
          reviewer: { select: { name: true, image: true } }
        }
      }
    }
  });

  return { activity, existingSubmission };
}

export default async function ActivityWorkspacePage({
  params,
}: {
  params: Promise<{ activityId: string }>;
}) {
  const resolvedParams = await params;
  
  const user = await requireAuth();
  const userId = user.id;

  const { activity, existingSubmission } = await getActivityData(
    resolvedParams.activityId,
    userId
  );

  if (!activity) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background pb-20 selection:bg-orange/20 selection:text-orange relative">
      {/* NAV */}
      <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/70 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center">
          <Link
            href="/dashboard"
            className="group flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition"
          >
            <div className="flex items-center justify-center size-8 rounded-full bg-muted/60 group-hover:bg-muted transition mr-2">
              <ArrowLeft className="size-4 group-hover:-translate-x-0.5 transition-transform" />
            </div>
            <span className="hidden sm:inline">Back</span>
          </Link>
        </div>
      </nav>

      {/* BACKGROUND GLOW */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[300px] bg-gradient-to-b from-orange/10 via-transparent to-transparent -z-10" />

      <main className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
        {/* HERO */}
        <header className="space-y-6 mb-10">
          <div className="flex flex-wrap items-center gap-3">
            <Badge className="rounded-full px-3 py-1 text-[10px] text-amber-600 tracking-widest uppercase bg-background/60 border border-border/50 backdrop-blur">
              {activity.type.replace(/_/g, " ")}
            </Badge>

            <div className="flex items-center gap-3 text-xs sm:text-sm">
              <span className="flex items-center gap-1 text-muted-foreground">
                <Target className="size-3.5" />
                {activity.difficulty}
              </span>

              <span className="flex items-center gap-1 text-orange bg-orange/10 px-2 py-0.5 rounded-md border border-orange/20">
                <Flame className="size-3.5" fill="currentColor" />
                +{activity.points}
              </span>
            </div>

            {activity.deadline && (
              <span className="ml-auto text-[11px] sm:text-xs text-destructive bg-destructive/10 border border-destructive/20 px-2 py-0.5 rounded-md flex items-center gap-1">
                <Clock className="size-3.5" />
                {new Date(activity.deadline).toLocaleDateString()}
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-foreground">
            {activity.title}
          </h1>

          {/* KSB Ticker */}
          {activity.ksbs.length > 0 && (
            <div className="flex flex-col gap-3 p-4 rounded-2xl bg-card/50 border border-border/50 backdrop-blur shadow-sm">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Zap className="size-4 text-orange" fill="currentColor" />
                Unlocks the following competencies
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {activity.ksbs.map((mapping) => (
                  <span
                    key={mapping.ksbId}
                    className="whitespace-nowrap px-3 py-1 text-xs rounded-lg bg-background border border-border/50 text-muted-foreground"
                  >
                    {mapping.ksb.title}
                  </span>
                ))}
              </div>
            </div>
          )}
        </header>

        {/* CONTENT LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

          {/* LEFT: TEXT, CHECKLIST & RULES */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-8">
            
            {/* 1. DESCRIPTION */}
            <section className="space-y-4">
              <h2 className="text-xs font-bold tracking-widest text-muted-foreground uppercase flex items-center gap-2">
                <FileText className="size-4" />
                Description
              </h2>
              <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none text-muted-foreground whitespace-pre-wrap">
                {activity.description || "No description/brief provided."}
              </div>
            </section>

            {/* 2. 🚨 THE NEW ASSESSMENT CHECKLIST 🚨 */}
            {activity.ksbs.length > 0 && (
              <section>
                {/* Native HTML details/summary creates a JS-free accordion! */}
                <details className="group rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-transparent p-5 sm:p-6 transition-all hover:border-blue-500/30" open>
                  <summary className="flex cursor-pointer items-center justify-between font-semibold text-foreground list-none [&::-webkit-details-marker]:hidden outline-none">
                    <div className="flex items-center gap-2">
                      <ListChecks className="size-5 text-blue-500" />
                      Assessment Checklist
                    </div>
                    {/* The chevron rotates based on the parent 'group' open state */}
                    <ChevronDown className="size-4 text-muted-foreground transition-transform duration-300 group-open:rotate-180" />
                  </summary>
                  
                  <div className="mt-5 space-y-5 pt-5 border-t border-border/50">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Reviewers will grade your submission against these specific criteria. Ensure your work explicitly demonstrates them.
                    </p>
                    
                    <ul className="space-y-4">
                      {activity.ksbs.map((mapping) => (
                        <li key={mapping.ksbId} className="flex gap-3 items-start group/item">
                          {/* Empty checkbox that lights up on hover */}
                          <div className="mt-0.5 shrink-0 size-4 rounded-[4px] border border-border flex items-center justify-center bg-background group-hover/item:border-blue-500 group-hover/item:bg-blue-500/10 transition-colors" />
                          
                          <div className="space-y-1.5 w-full">
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] uppercase tracking-wider font-bold text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded">
                                {mapping.ksb.type.charAt(0)}
                              </span>
                              <span className="text-sm font-medium text-foreground leading-tight">
                                {mapping.ksb.title}
                              </span>
                            </div>
                            
                            {/* The all-important description is now visible before submission! */}
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              {mapping.ksb.description || "Demonstrate proficiency and practical application of this competency."}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </details>
              </section>
            )}

            {/* 3. RULES */}
            <section className="rounded-2xl border border-orange/20 bg-gradient-to-br from-orange/10 to-transparent p-5 sm:p-6">
              <h3 className="text-base font-semibold text-foreground flex items-center gap-2 mb-4">
                <ShieldCheck className="size-5 text-orange" />
                Rules of Engagement
              </h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <div className="mt-1 size-1.5 bg-orange rounded-full shrink-0" />
                  <span>
                    <strong className="text-foreground">Strict Alignment:</strong> Verify against the checklist above.
                  </span>
                </li>
                <li className="flex gap-2">
                  <div className="mt-1 size-1.5 bg-orange rounded-full shrink-0" />
                  <span>
                    <strong className="text-foreground">Peer Review Ready:</strong> Keep work clean and understandable.
                  </span>
                </li>
                <li className="flex gap-2">
                  <div className="mt-1 size-1.5 bg-orange rounded-full shrink-0" />
                  <span>
                    <strong className="text-foreground">Deadline Matters:</strong> Late submissions might attract a penalty.
                  </span>
                </li>
              </ul>
            </section>
          </div>

          {/* RIGHT: SUBMISSION ENGINE */}
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="lg:sticky lg:top-20">
              <SubmissionEngine
                activity={{
                  ...activity,
                  description: activity.description || "",
                }}
                // 3. FIX: Match the exact variable name
                existingSubmission={existingSubmission}
              />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}