import { PrismaClient } from "@prisma/client"
import { notFound } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, GraduationCap, Users } from "lucide-react"
import Link from "next/link"

import { requireAdmin } from "@/domains/auth/require-role"
import { SubmissionContent } from "../_components/SubmissionContent"
import { EvaluationPanel } from "../_components/EvaluationPanel"

const prisma = new PrismaClient()

export default async function SubmissionReviewPage({ 
  params,
  searchParams // 1. ADD searchParams to the props
}: { 
  params: Promise<{ submissionId: string }>,
  searchParams: Promise<{ [key: string]: string | undefined }> // 2. Add Type
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams; // 3. Await searchParams

  // 4. Clean out undefined values and build the query string
  const validParams = Object.entries(resolvedSearchParams).reduce((acc, [key, value]) => {
      if (value) acc[key] = value;
      return acc;
  }, {} as Record<string, string>);

  const searchParamsString = new URLSearchParams(validParams).toString()
  const queryString = searchParamsString ? `?${searchParamsString}` : ""

  const submission = await prisma.submission.findUnique({
    where: { id: resolvedParams.submissionId },
    include: {
      user: true,
      team: true,
      activity: {
        include: {
          ksbs: { include: { ksb: true } },
          requirements: true
        }
      }
    }
  })

if (!submission) notFound()

  // FETCH THE REAL LOGGED-IN INSTRUCTOR
  const currentUser = await requireAdmin();
  
  if (!currentUser || !currentUser.id) {
    return <div>Unauthorized: You must be logged in to review submissions.</div>
  }
  
  const currentInstructorId = currentUser.id;
  const isTeam = !!submission.teamId
  const entityName = submission.user?.name || submission.team?.name || "Unknown Learner"

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] w-full overflow-hidden bg-background">
      
      {/* HEADER */}
      <header className="shrink-0 border-b border-border bg-card px-6 py-4 flex items-center justify-between z-10 w-full">
        <div className="flex items-center gap-4">
          
          {/* 5. UPDATE THE LINK HREF with the queryString */}
          <Link 
            href={`/admin/activities/submissions${queryString}`} 
            className="p-2 border border-border rounded-full hover:bg-muted text-muted-foreground transition-colors"
          >
            <ArrowLeft className="size-4" />
          </Link>
          
          <div className="h-8 w-px bg-border hidden sm:block"></div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-bold tracking-tight leading-none">{submission.activity.title}</h1>
              <Badge variant="secondary" className="uppercase text-[10px] tracking-wider font-semibold">{submission.status.replace(/_/g, " ")}</Badge>
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1.5 font-medium">
              <Clock className="size-3" /> Submitted {new Date(submission.submittedAt || submission.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Learner Chip */}
        <div className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-full bg-muted/50 border border-border">
          <Avatar className="size-6 border border-border">
            {isTeam ? (
              <AvatarFallback className="bg-orange/10 text-orange"><Users className="size-3"/></AvatarFallback>
            ) : (
              <>
                <AvatarImage src={submission.user?.image || undefined} />
                <AvatarFallback className="text-[10px]">{entityName.charAt(0)}</AvatarFallback>
              </>
            )}
          </Avatar>
          <span className="text-sm font-semibold pr-2">{entityName}</span>
        </div>
      </header>

      {/* SPLIT WORKSPACE */}
      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row w-full">
        
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 bg-muted/10 relative">
          <div className="max-w-4xl mx-auto space-y-8 pb-20">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-4">
              <GraduationCap className="size-4" />
              <span>Learner Evidence & Artifacts</span>
            </div>
            <SubmissionContent content={submission.content} requirements={submission.activity.requirements} />
          </div>
        </div>

        <div className="w-full lg:w-[450px] shrink-0 border-l border-border bg-card shadow-[-4px_0_24px_-16px_rgba(0,0,0,0.1)] z-20 flex flex-col">
          <EvaluationPanel 
            submissionId={submission.id} 
            reviewerId={currentInstructorId} 
            ksbs={submission.activity.ksbs} 
          />
        </div>

      </div>
    </div>
  )
}