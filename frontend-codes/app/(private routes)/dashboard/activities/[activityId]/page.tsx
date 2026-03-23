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
} from "lucide-react";
import Link from "next/link";
import { SubmissionEngine } from "./_components/submission-engine";

async function getActivityData(activityId: string, userId: string) {
  const activity = await prisma.activity.findUnique({
    where: { id: activityId },
    include: {
      requirements: true,
      ksbs: { include: { ksb: true } },
    },
  });

  const existingSubmission = await prisma.submission.findFirst({
    where: { activityId, userId },
  });

  return { activity, existingSubmission };
}

export default async function ActivityWorkspacePage({
  params,
}: {
  params: { activityId: string };
}) {
  const user = await requireAuth();
  const userId = user.id;

  const { activity, existingSubmission } = await getActivityData(
    params.activityId,
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
          {/* META */}
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

          {/* TITLE */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-foreground">
            {activity.title}
          </h1>

          {/* KSBs */}
          {activity.ksbs.length > 0 && (
            <div className="flex flex-col gap-3 p-4 rounded-2xl bg-card/50 border border-border/50 backdrop-blur shadow-sm">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Zap className="size-4 text-orange" fill="currentColor" />
                Unlocks
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
          
          {/* LEFT: TEXT & RULES (Now the smaller column) */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-10">
            {/* DESCRIPTION */}
            <section className="space-y-4">
              <h2 className="text-xs font-bold tracking-widest text-muted-foreground uppercase flex items-center gap-2">
                <FileText className="size-4" />
                Description
              </h2>

              <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none text-muted-foreground whitespace-pre-wrap">
                {activity.description || "No description/brief provided."}
              </div>
            </section>

            {/* RULES */}
            <section className="rounded-2xl border border-orange/20 bg-gradient-to-br from-orange/10 to-transparent p-5 sm:p-6">
              <h3 className="text-base font-semibold text-foreground flex items-center gap-2 mb-4">
                <ShieldCheck className="size-5 text-orange" />
                Rules of Engagement
              </h3>

              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <div className="mt-1 size-1.5 bg-orange rounded-full" />
                  <span>
                    <strong className="text-foreground">
                      Strict Alignment:
                    </strong>{" "}
                    Align with required competencies.
                  </span>
                </li>

                <li className="flex gap-2">
                  <div className="mt-1 size-1.5 bg-orange rounded-full" />
                  <span>
                    <strong className="text-foreground">
                      Peer Review Ready:
                    </strong>{" "}
                    Keep work clean and understandable.
                  </span>
                </li>

                <li className="flex gap-2">
                  <div className="mt-1 size-1.5 bg-orange rounded-full" />
                  <span>
                    <strong className="text-foreground">
                      Deadline Matters:
                    </strong>{" "}
                    Late = -20% points.
                  </span>
                </li>
              </ul>
            </section>
          </div>

          {/* RIGHT: SUBMISSION ENGINE (Now the larger column) */}
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="lg:sticky lg:top-20">
              <SubmissionEngine
                activityId={activity.id}
                requirements={activity.requirements}
                existingSubmission={existingSubmission}
              />
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}