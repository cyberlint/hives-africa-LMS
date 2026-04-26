"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  UploadCloud, Github, Link as LinkIcon, FileText,
  CheckCircle2, Lock, Rocket, Zap,
  Loader2, X, AlertCircle, Quote, RefreshCw, ArrowLeft, ShieldAlert, Scale, Percent
} from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { createActivitySubmission } from "../../actions/submit-activity"

interface ActivityData {
  id: string;
  title: string;
  description: string;
  type: string;
  difficulty: string;
  points: number;
  deadline: Date | null;
  ksbs: any[];
  requirements: any[];
}

interface SubmissionEngineProps {
  activity: ActivityData;
  existingSubmission: any;
  hiveId?: string | null;
  hiveSlug?: string | null;
  roster?: { userId: string; name: string; image: string | null }[];
}

export function SubmissionEngine({ 
  activity, 
  existingSubmission,
  hiveId = null,
  hiveSlug = null,
  roster = [] 
}: SubmissionEngineProps) {
  const [isRevising, setIsRevising] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadingReqId, setUploadingReqId] = useState<string | null>(null)
  const pathname = usePathname()

  // --- FORM DATA STATE ---
  const [formData, setFormData] = useState<Record<string, any>>(() => {
    if (existingSubmission?.content) {
      try {
        return typeof existingSubmission.content === "string"
          ? JSON.parse(existingSubmission.content)
          : existingSubmission.content;
      } catch (e) {
        return {};
      }
    }
    return {};
  })

  // --- CONTRIBUTION SPLIT STATE ---
  const [splits, setSplits] = useState<Record<string, number>>(() => {
    if (roster.length === 0) return {};
    
    // Default: Even share
    const evenShare = Math.floor(100 / roster.length);
    const initialSplits: Record<string, number> = {};
    roster.forEach(m => initialSplits[m.userId] = evenShare);
    
    // Adjust remainder to ensure 100% total
    const total = evenShare * roster.length;
    if (total < 100 && roster.length > 0) {
      initialSplits[roster[roster.length - 1].userId] += (100 - total);
    }
    
    return initialSplits;
  });

  // --- CALCULATED VALUES ---
  const requirements = activity.requirements;
  const filledCount = requirements.filter(req => {
    const data = formData[req.id];
    if (Array.isArray(data)) return data.length > 0;
    return data && typeof data === "string" && data.trim().length > 0;
  }).length;

  const progressPercent = requirements.length > 0 ? (filledCount / requirements.length) * 100 : 0;
  const isReady = progressPercent === 100;

  // Validation for splits (only required if it's a Hive submission)
  const totalSplit = Object.values(splits).reduce((a, b) => a + b, 0);
  const isSplitValid = hiveId ? (roster.length > 0 ? totalSplit === 100 : true) : true;

  const latestReview = existingSubmission?.reviews?.[0];
  const isGraded = ["Approved", "Revision_Required", "Rejected"].includes(existingSubmission?.status);

  const rubricScores = latestReview?.rubricScores
    ? (typeof latestReview.rubricScores === "string" ? JSON.parse(latestReview.rubricScores) : latestReview.rubricScores)
    : {};

  const getScoreLabel = (score: number) => {
    switch (score) {
      case 5: return { label: "Exceptional", color: "text-green-600 bg-green-500/10 border-green-200" }
      case 4: return { label: "Clear Evidence", color: "text-blue-600 bg-blue-500/10 border-blue-200" }
      case 3: return { label: "Partial Evidence", color: "text-yellow-600 bg-yellow-500/10 border-yellow-200" }
      case 2: return { label: "Weak Evidence", color: "text-orange bg-orange/10 border-orange/20" }
      case 1: return { label: "No Evidence", color: "text-red-600 bg-red-500/10 border-red-200" }
      default: return { label: "Unscored", color: "text-muted-foreground bg-muted border-border" }
    }
  }

  // --- HANDLERS ---
  const handleInputChange = (reqId: string, value: string) => setFormData(prev => ({ ...prev, [reqId]: value }))

  const handleSplitChange = (userId: string, value: string) => {
    const num = parseInt(value) || 0;
    setSplits(prev => ({ ...prev, [userId]: num }));
  }

  const handleRemoveFile = (reqId: string, indexToRemove: number) => {
    setFormData(prev => ({ ...prev, [reqId]: (prev[reqId] || []).filter((_: any, idx: number) => idx !== indexToRemove) }));
  }

  const handleFileUpload = async (reqId: string, files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadingReqId(reqId);
    const existingUrls = Array.isArray(formData[reqId]) ? [...formData[reqId]] : [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const authResponse = await fetch("/api/s3/upload-public", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileName: file.name, contentType: file.type, size: file.size, isImage: file.type.startsWith("image/") }),
        });
        if (!authResponse.ok) throw new Error("Failed to authorize upload");
        const { presignedUrl, key } = await authResponse.json();

        const uploadResponse = await fetch(presignedUrl, { method: "PUT", headers: { "Content-Type": file.type }, body: file });
        if (!uploadResponse.ok) throw new Error(`Failed to upload ${file.name}`);

        const bucketName = process.env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES;
        existingUrls.push(`https://${bucketName}.fly.storage.tigris.dev/${key}`);
      }
      setFormData(prev => ({ ...prev, [reqId]: existingUrls }));
      toast.success(`${files.length} file(s) uploaded!`);
    } catch (error: any) {
      toast.error(error.message || "Upload failed.");
    } finally {
      setUploadingReqId(null);
    }
  }

  const handleSubmit = async () => {
    if (!isReady) return toast.error("Missing required parameters.");
    if (!isSplitValid) return toast.error(`Split must equal 100% (Current: ${totalSplit}%)`);

    setIsSubmitting(true)
    try {
      // Updated to pass hiveId and splits to the server action
      const result = await createActivitySubmission(activity.id, formData, pathname, hiveId, splits)
      if (result.success) {
        toast.success(isRevising ? "Revision submitted!" : "Proof of work submitted!")
        setIsRevising(false)
      } else {
        toast.error(result.error || "Submission failed.")
      }
    } catch (error) {
      toast.error("A critical error occurred.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full space-y-6">

      {/* STATE 3: THE GROWTH ENGINE (REVIEWED & GRADED) */}
      {existingSubmission && isGraded && latestReview && !isRevising ? (
        <div className="rounded-[2rem] border border-border/50 bg-card/40 backdrop-blur-xl p-1 shadow-2xl">
          <div className="bg-background/60 rounded-[1.8rem] p-6 sm:p-8 relative overflow-hidden">
            <div className={`absolute -top-32 -right-32 size-64 rounded-full blur-[80px] opacity-20 pointer-events-none ${existingSubmission.status === "Approved" ? "bg-green-500" :
                existingSubmission.status === "Revision_Required" ? "bg-orange" : "bg-red-500"
              }`} />

            <div className="relative z-10 space-y-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/50 pb-6">
                <div>
                  <Badge className={`mb-3 px-3 py-1 border-none shadow-none ${existingSubmission.status === "Approved" ? "bg-green-500/10 text-green-600" :
                      existingSubmission.status === "Revision_Required" ? "bg-orange/10 text-orange" : "bg-red-500/10 text-red-600"
                    }`}>
                    {existingSubmission.status === "Approved" ? <CheckCircle2 className="size-3 mr-1.5" /> :
                      existingSubmission.status === "Revision_Required" ? <RefreshCw className="size-3 mr-1.5" /> :
                        <ShieldAlert className="size-3 mr-1.5" />}
                    {existingSubmission.status.replace(/_/g, " ")}
                  </Badge>
                  <h3 className="text-2xl font-bold text-foreground tracking-tight">Instructor Evaluation</h3>
                  <p className="text-sm text-muted-foreground mt-1">Reviewed on {new Date(latestReview.createdAt).toLocaleDateString()}</p>
                </div>

                {latestReview.reviewer && (
                  <div className="flex items-center gap-3 bg-card/50 p-2 pr-4 rounded-full border border-border/50 backdrop-blur-sm">
                    <Avatar className="size-8">
                      <AvatarImage src={latestReview.reviewer.image || ""} />
                      <AvatarFallback className="text-xs bg-muted text-foreground">{latestReview.reviewer.name?.charAt(0) || "I"}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-foreground leading-none">{latestReview.reviewer.name || "Instructor"}</span>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">Reviewer</span>
                    </div>
                  </div>
                )}
              </div>

              {latestReview.feedback && (
                <div className="relative">
                  <Quote className="absolute -top-3 -left-3 size-8 text-muted-foreground/10 rotate-180" />
                  <div className="bg-muted/30 border border-border/40 rounded-2xl p-6 text-sm sm:text-base leading-relaxed text-foreground/90 whitespace-pre-wrap relative z-10">
                    {latestReview.feedback}
                  </div>
                </div>
              )}

              {activity.ksbs.length > 0 && Object.keys(rubricScores).length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Competency Rubric</h4>
                  <div className="grid grid-cols-1 gap-3">
                    {activity.ksbs.map((mapping) => {
                      const score = rubricScores[mapping.ksbId];
                      const { label, color } = getScoreLabel(score);
                      const isFailing = score <= 2;
                      return (
                        <div key={mapping.ksbId} className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border gap-3 transition-colors ${isFailing ? "bg-red-500/5 border-red-500/20" : "bg-card/30 border-border/40"}`}>
                          <div className="flex items-center gap-3">
                            <span className={`flex items-center justify-center size-6 rounded text-[10px] font-bold uppercase ${isFailing ? "bg-red-500/20 text-red-600" : "bg-muted text-muted-foreground"}`}>
                              {mapping.ksb.type.charAt(0)}
                            </span>
                            <div className="flex flex-col">
                              <span className={`text-sm font-semibold leading-snug ${isFailing ? "text-red-600" : "text-foreground"}`}>
                                {mapping.ksb.description || mapping.ksb.title}
                              </span>
                            </div>
                          </div>
                          {score ? <Badge variant="outline" className={`px-2.5 py-1 text-xs font-semibold ${color}`}>{score}/5 - {label}</Badge> : <span className="text-xs font-medium text-muted-foreground">Not Evaluated</span>}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              <div className="pt-6 border-t border-border/50">
                {existingSubmission.status === "Approved" ? (
                  <Button asChild className="w-full rounded-full py-6 font-semibold bg-foreground text-background hover:bg-foreground/90 shadow-md">
                    <Link href="/dashboard">Return to Dashboard <ArrowLeft className="ml-2 size-4" /></Link>
                  </Button>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button onClick={() => setIsRevising(true)} className="flex-1 rounded-full py-6 font-semibold bg-orange text-white hover:bg-orange/90 shadow-md">
                      {existingSubmission.status === "Rejected" ? "Retry Submission" : "Start Revision"} <RefreshCw className="ml-2 size-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : existingSubmission && !isGraded && !isRevising ? (

        /* STATE 1: ALREADY DEPLOYED (PENDING) */
        <div className="rounded-[2rem] border border-border/50 bg-card/40 backdrop-blur-xl p-1 shadow-2xl">
          <div className="bg-background/60 rounded-[1.8rem] p-8 flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-blue-500/5" />
            <div className="relative mb-6 z-10">
              <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 rounded-full animate-pulse" />
              <div className="size-16 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <Lock className="size-7 text-blue-500" />
              </div>
            </div>
            <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 mb-3 px-3 py-1 relative z-10">Immutable Record</Badge>
            <h3 className="text-2xl font-bold text-foreground tracking-tight mb-2 relative z-10">Awaiting Review</h3>
            <p className="text-sm text-muted-foreground mb-8 relative z-10 max-w-sm mx-auto">Your proof of work is locked in the registry and is currently queued for grading.</p>
          </div>
        </div>
      ) : (

        /* STATE 2: THE EXECUTION ENGINE (FORM) */
        <div className="rounded-[2rem] border border-border/50 bg-card/40 backdrop-blur-xl p-1 shadow-2xl">
          <div className="bg-background/60 rounded-[1.8rem] p-6 sm:p-8">

            {isRevising && (
              <Button onClick={() => setIsRevising(false)} variant="ghost" size="sm" className="mb-6 -ml-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full">
                <ArrowLeft className="mr-2 size-4" /> Cancel Revision
              </Button>
            )}

            <div className="flex items-center justify-between mb-8">
              <div className="space-y-1.5">
                <h3 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
                  <Rocket className="size-5 text-orange" /> {isRevising ? "Revise Submission" : "Self-Reporting Form"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {isRevising ? "Make corrections based on feedback." : "Submit your evidence and proof of work below."}
                </p>
              </div>
              <div className="flex items-center justify-center size-12 rounded-full bg-card border border-border/50 shrink-0 shadow-sm">
                <span className="text-sm font-bold text-foreground">{filledCount}/{requirements.length}</span>
              </div>
            </div>

            <div className="space-y-6">
              {requirements.map((req) => {
                const data = formData[req.id];
                const hasValue = Array.isArray(data) ? data.length > 0 : (data && typeof data === "string" && data.trim().length > 0);

                return (
                  <div key={req.id} className={`group relative space-y-3 p-1 rounded-2xl transition-all duration-500 ${hasValue ? 'bg-orange/5' : 'bg-transparent'}`}>
                    <div className={`absolute inset-0 rounded-2xl border transition-colors duration-300 ${hasValue ? 'border-orange/30' : 'border-border/50 group-focus-within:border-orange/50'}`} />
                    <div className="relative bg-card/50 backdrop-blur-md rounded-[15px] p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div className="space-y-1">
                          <Label className="text-sm font-semibold text-foreground flex items-center gap-2 uppercase tracking-wider text-xs">
                            {req.type === "GitHub_Repo" && <Github className="size-4 text-muted-foreground" />}
                            {req.type === "Video_Link" && <LinkIcon className="size-4 text-muted-foreground" />}
                            {req.type === "File_Upload" && <UploadCloud className="size-4 text-muted-foreground" />}
                            {req.type === "Text_Report" && <FileText className="size-4 text-muted-foreground" />}
                            {req.title || req.type.replace("_", " ")}
                          </Label>
                          {req.description && <p className="text-xs text-muted-foreground leading-snug">{req.description}</p>}
                        </div>
                        {hasValue && <CheckCircle2 className="size-4 text-orange shrink-0 ml-4 mt-0.5" />}
                      </div>

                      {req.type === "Text_Report" ? (
                        <Textarea value={data || ""} placeholder="Draft your summary..." className="min-h-[120px] resize-none bg-background/80 border-border/50 rounded-xl focus-visible:ring-orange/50 transition-all text-sm mt-3" onChange={(e) => handleInputChange(req.id, e.target.value)} />
                      ) : req.type === "File_Upload" ? (
                        <div className="space-y-3 mt-3">
                          <div className="relative group/dropzone cursor-pointer flex flex-col items-center justify-center w-full h-32 rounded-xl border-2 border-dashed border-border/50 bg-background/50 hover:bg-orange/5 transition-all overflow-hidden">
                            <input type="file" multiple disabled={uploadingReqId === req.id} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed" onChange={(e) => handleFileUpload(req.id, e.target.files)} />
                            <div className="flex flex-col items-center text-center p-4">
                              {uploadingReqId === req.id ? <Loader2 className="size-8 text-orange animate-spin mb-2" /> : <UploadCloud className="size-8 text-muted-foreground group-hover/dropzone:text-orange transition-colors mb-2" />}
                              <span className="text-sm font-medium text-foreground">{uploadingReqId === req.id ? "Uploading..." : "Click or drag to attach files"}</span>
                            </div>
                          </div>
                          {Array.isArray(formData[req.id]) && formData[req.id].length > 0 && (
                            <div className="flex flex-col gap-2 mt-3">
                              {formData[req.id].map((url: string, idx: number) => (
                                <div key={idx} className="flex items-center justify-between p-2 px-3 bg-card rounded-lg border border-border/50 text-sm shadow-sm group/file">
                                  <span className="flex items-center gap-2 text-foreground truncate pr-4"><FileText className="size-4 text-orange shrink-0" /><span className="truncate">Evidence {idx + 1}</span></span>
                                  <Button variant="ghost" size="icon" className="size-6 hover:text-red-500" onClick={() => handleRemoveFile(req.id, idx)}><X className="size-3" /></Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <Input type="url" value={data || ""} placeholder={`https://...`} className="bg-background/80 border-border/50 rounded-xl h-12 text-sm mt-3" onChange={(e) => handleInputChange(req.id, e.target.value)} />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* CONTRIBUTION SPLIT - ONLY FOR HIVE SUBMISSIONS */}
            {hiveId && roster.length > 0 && (
              <div className="mt-10 pt-8 border-t border-border/50 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold flex items-center gap-2 uppercase tracking-wider text-foreground">
                      <Scale className="size-4 text-orange" /> Contribution Split
                    </h4>
                    <p className="text-xs text-muted-foreground">Propose how points/equity should be shared for this task.</p>
                  </div>
                  <Badge variant={isSplitValid ? "outline" : "destructive"} className="font-mono">Total: {totalSplit}%</Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {roster.map((member) => (
                    <div key={member.userId} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/50">
                      <Avatar className="size-8">
                        <AvatarImage src={member.image || ""} />
                        <AvatarFallback className="text-[10px]">{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold truncate text-foreground">{member.name}</p>
                      </div>
                      <div className="relative w-20">
                        <Input 
                          type="number" 
                          max="100" min="0"
                          value={splits[member.userId] || 0}
                          onChange={(e) => handleSplitChange(member.userId, e.target.value)}
                          className="h-8 pr-6 text-right text-xs font-bold font-mono bg-background/50"
                        />
                        <Percent className="absolute right-2 top-2.5 size-3 text-muted-foreground" />
                      </div>
                    </div>
                  ))}
                </div>
                {!isSplitValid && <p className="text-[10px] text-red-500 font-medium flex items-center gap-1"><AlertCircle className="size-3" /> Split must equal 100%.</p>}
              </div>
            )}

            <div className="mt-8 relative">
              {(isReady && isSplitValid) && <div className="absolute inset-0 bg-orange blur-xl opacity-20 rounded-full animate-pulse pointer-events-none" />}
              <Button onClick={handleSubmit} disabled={!isReady || !isSplitValid || isSubmitting || uploadingReqId !== null} className={`w-full rounded-full py-7 text-base font-semibold shadow-xl transition-all duration-300 relative z-10 ${(isReady && isSplitValid) ? 'bg-foreground text-background hover:scale-[1.01]' : 'bg-muted text-muted-foreground'}`}>
                {isSubmitting ? <><Loader2 className="mr-2 size-5 animate-spin" /> Transmitting...</> : <><Zap className={`mr-2 size-5 ${(isReady && isSplitValid) ? 'text-orange' : ''}`} fill={(isReady && isSplitValid) ? "currentColor" : "none"} /> {(isReady && isSplitValid) ? (isRevising ? "Submit Revision" : "Submit Proof of Work") : "Complete Form & Split to Submit"}</>}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}