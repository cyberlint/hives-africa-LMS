"use client"

import { useState, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, CheckCircle2, AlertCircle, XCircle, Search, ArrowLeft, ArrowRight } from "lucide-react"
import { toast } from "sonner" // 1. ADD THIS IMPORT
import { submitInstructorReview } from "../[submissionId]/review-actions"

interface KSB {
  ksbId: string
  weight: number | null
  ksb: { title: string; type: string; description: string | null }
}

export function EvaluationPanel({ submissionId, reviewerId, ksbs }: { submissionId: string, reviewerId: string, ksbs: KSB[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  
  const [currentStep, setCurrentStep] = useState(0)
  const [rubricScores, setRubricScores] = useState<Record<string, number>>({})
  const [feedback, setFeedback] = useState("")

  const totalSteps = ksbs.length
  const isFinalStep = currentStep === totalSteps

  const handleScoreChange = (ksbId: string, score: number) => {
    setRubricScores(prev => ({ ...prev, [ksbId]: score }))
    setTimeout(() => setCurrentStep(prev => Math.min(prev + 1, totalSteps)), 350)
  }

  const handleSubmit = (status: "Approved" | "Revision_Required" | "Rejected") => {
    startTransition(async () => {
      try {
        const scores = Object.values(rubricScores)
        const overallScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0

        const result = await submitInstructorReview({
          submissionId, reviewerId, status, feedback, rubricScores, score: overallScore,
        })
        
        if (result.success) {
          toast.success("Review saved successfully!")
          const currentQuery = searchParams.toString()
          const returnUrl = `/admin/activities/submissions${currentQuery ? `?${currentQuery}` : ""}`
          router.push(returnUrl) 
        } else {
          // 2. ACTUALLY SHOW THE BACKEND ERROR
          toast.error(result.error || "Failed to save review.")
        }
      } catch (error) {
        // 3. CATCH NETWORK/BROWSER CRASHES
        toast.error("A critical network error occurred.")
        console.error(error)
      }
    })
  }

  const getEvidenceLabel = (score: number) => {
    switch (score) {
      case 1: return "No Evidence found"
      case 2: return "Weak Evidence"
      case 3: return "Partial Evidence"
      case 4: return "Strong Evidence"
      case 5: return "Very Strong Evidence"
      default: return ""
    }
  }

  // --- VIEW 1: COMPACT EVIDENCE WIZARD ---
  if (!isFinalStep && totalSteps > 0) {
    const item = ksbs[currentStep];
    const evidenceQuestion = item.ksb.description || `Did the learner demonstrate ability in ${item.ksb.title}?`;

    return (
      <div className="flex flex-col h-full bg-background relative">
        {/* FIXED HEADER */}
        <div className="shrink-0 p-4 border-b border-border/50 bg-muted/10">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold flex items-center gap-1.5 text-muted-foreground uppercase tracking-wider">
              <Search className="size-3.5 text-blue-500" /> Evidence Tracker
            </h2>
            <span className="text-[10px] font-bold bg-background border border-border px-2 py-0.5 rounded-full">
              {currentStep + 1} / {totalSteps}
            </span>
          </div>
          <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${((currentStep) / totalSteps) * 100}%` }} />
          </div>
        </div>

        {/* SCROLLABLE BODY (Minimized padding and spacing) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div>
            <span className="inline-block px-1.5 py-0.5 mb-1.5 rounded text-[9px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-600 border border-blue-200/50">
              {item.ksb.type}
            </span>
            <h3 className="text-base font-bold text-foreground leading-tight mb-3">
              {item.ksb.title}
            </h3>

            {/* The Direct Instructor Question */}
            <div className="p-3 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/50 rounded-lg">
              <p className="text-sm font-medium text-foreground leading-snug">
                {evidenceQuestion}
              </p>
            </div>
          </div>

          {/* Compact Scoring Buttons */}
          <div className="pt-2">
            <div className="grid grid-cols-1 gap-1.5">
              {[5, 4, 3, 2, 1].map((val) => {
                const isSelected = rubricScores[item.ksbId] === val;
                return (
                  <button
                    key={val}
                    onClick={() => handleScoreChange(item.ksbId, val)}
                    className={`flex items-center justify-between p-2 px-3 rounded-lg border transition-all duration-200 text-left ${isSelected
                        ? "bg-foreground text-background border-foreground shadow-sm"
                        : "bg-background text-foreground border-border hover:border-blue-500/50 hover:bg-muted/30"
                      }`}
                  >
                    <span className="font-medium text-xs">{getEvidenceLabel(val)}</span>
                    <span className={`flex items-center justify-center size-5 rounded-full text-[10px] font-bold ${isSelected ? 'bg-background text-foreground' : 'bg-muted text-muted-foreground'}`}>
                      {val}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* FIXED FOOTER */}
        <div className="shrink-0 p-3 bg-background border-t border-border flex justify-between items-center">
          <Button variant="ghost" size="sm" onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))} disabled={currentStep === 0} className="h-8 text-xs text-muted-foreground">
            <ArrowLeft className="size-3 mr-1.5" /> Previous
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setCurrentStep(prev => Math.min(prev + 1, totalSteps))} className="h-8 text-xs text-muted-foreground">
            Skip <ArrowRight className="size-3 ml-1.5" />
          </Button>
        </div>
      </div>
    )
  }

  // --- VIEW 2: FINAL FEEDBACK & DECISION ---
  const allScored = ksbs.length === 0 || ksbs.every(k => rubricScores[k.ksbId] !== undefined);

  return (
    <div className="flex flex-col h-full bg-background relative animate-in fade-in duration-300">

      {/* Scrollable Summary Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 pb-32">
        <div>
          <h2 className="text-base font-bold flex items-center gap-1.5">
            <CheckCircle2 className="size-5 text-green-500" /> Evidence Reviewed
          </h2>
          <p className="text-xs text-muted-foreground mt-1">Provide final, personalized feedback on this submission. Include notable strengths and provide actionable recommendations for future improvement. </p>
        </div>

        {ksbs.length > 0 && (
          <div className="p-3 bg-muted/20 border border-border rounded-lg space-y-2">
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Summary</h3>
              <button className="text-[10px] text-blue-500 font-semibold flex items-center hover:underline" onClick={() => setCurrentStep(0)}>
                <ArrowLeft className="size-3 mr-1" /> Edit
              </button>
            </div>

            {ksbs.map(item => (
              <div key={item.ksbId} className="flex items-center justify-between text-xs">
                <span className="truncate pr-3 font-medium text-foreground/80">{item.ksb.title}</span>
                {rubricScores[item.ksbId] ? (
                  <span className="shrink-0 font-bold bg-background px-1.5 py-0.5 rounded text-[10px] border border-border">
                    {rubricScores[item.ksbId]} - {getEvidenceLabel(rubricScores[item.ksbId])}
                  </span>
                ) : (
                  <span className="shrink-0 font-bold text-orange text-[10px] flex items-center">
                    <AlertCircle className="size-3 mr-1" /> Skipped
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        <div>
          <label className="text-xs font-bold text-foreground block mb-1.5">Constructive Feedback</label>
          <Textarea
            placeholder="Provide actionable next steps..."
            className="min-h-[140px] resize-none bg-background border-border text-sm leading-relaxed"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
        </div>
      </div>

      {/* FIXED BOTTOM DECISION BAR */}
      <div className="shrink-0 absolute bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-md border-t border-border shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)]">
        <div className="flex flex-col gap-2.5">
          <Button disabled={isPending || !feedback || !allScored} onClick={() => handleSubmit("Approved")} className="w-full bg-foreground text-background hover:bg-foreground/90 h-10 rounded-lg text-sm font-bold shadow-sm">
            {isPending ? <Loader2 className="size-4 animate-spin mr-2" /> : <CheckCircle2 className="size-4 mr-2" />} Approve & Publish
          </Button>

          <div className="grid grid-cols-2 gap-2.5">
            <Button disabled={isPending || !feedback} onClick={() => handleSubmit("Revision_Required")} variant="outline" className="h-9 rounded-lg text-xs font-semibold border-orange/30 text-orange hover:bg-orange/10 hover:border-orange">
              <AlertCircle className="size-3.5 mr-1.5" /> Request Revision
            </Button>
            <Button disabled={isPending || !feedback} onClick={() => handleSubmit("Rejected")} variant="outline" className="h-9 rounded-lg text-xs font-semibold border-red-500/30 text-red-500 hover:bg-red-500/10 hover:border-red-500">
              <XCircle className="size-3.5 mr-1.5" /> Reject
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}