"use client"

import { ExternalLink, FileText, Video, Github, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SubmissionContentProps {
  content: any 
  requirements: any[] 
}

export function SubmissionContent({ content, requirements }: SubmissionContentProps) {
  // 1. Check if the required data exists
  if (!content || !requirements || requirements.length === 0) {
    return <p className="text-muted-foreground p-4 bg-muted/20 rounded-xl border border-dashed">No evidence provided or activity has no requirements.</p>
  }

  // 2. BULLETPROOFING: If Prisma returned the JSON as a string, parse it into a real object!
  let parsedContent = content;
  if (typeof content === "string") {
    try {
      parsedContent = JSON.parse(content);
    } catch (e) {
      console.error("Failed to parse submission content JSON:", e);
      return <p className="text-destructive">Error reading submission data.</p>
    }
  }

  return (
    <div className="space-y-8">
      {requirements.map((req) => {
        // 3. Look up the data safely from the parsed object
        const submittedData = parsedContent[req.id];
        
        // Handle missing data for this specific requirement
        if (!submittedData || (Array.isArray(submittedData) && submittedData.length === 0)) {
           return (
             <div key={req.id} className="space-y-3">
               <h3 className="text-sm font-bold text-foreground flex items-center gap-2 border-b border-border/50 pb-2">
                 <CheckCircle2 className="size-4 text-muted-foreground" />
                 {req.type.replace(/_/g, " ")} Requirement
               </h3>
               <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/20 text-sm text-destructive">
                 Learner did not provide evidence for this requirement.
               </div>
             </div>
           )
        }

        // Helper to render asset cards (Files/Links/GitHub)
        const renderAssetCard = (url: string, index?: number) => {
           const isUrl = url.startsWith('http');
           const titleSuffix = index !== undefined ? ` ${index + 1}` : "";

           return (
             <div key={url} className="p-4 rounded-xl bg-muted/20 border border-border flex items-center justify-between mt-2 hover:bg-muted/40 transition-colors">
               <div className="flex items-center gap-3 overflow-hidden pr-4">
                 <div className="p-2 bg-background rounded-lg border border-border shadow-sm text-muted-foreground">
                   {req.type === "GitHub_Repo" ? <Github className="size-5" /> : 
                    req.type === "Video_Link" ? <Video className="size-5" /> : 
                    <FileText className="size-5" />}
                 </div>
                 <div className="min-w-0">
                   <p className="text-sm font-semibold text-foreground truncate">
                     Attached {req.type.replace(/_/g, " ")}{titleSuffix}
                   </p>
                   {isUrl && (
                     <a href={url} target="_blank" rel="noopener noreferrer" className="text-[11px] text-blue-500 hover:text-blue-600 hover:underline truncate block max-w-[300px] mt-0.5">
                       {url}
                     </a>
                   )}
                 </div>
               </div>
               
               {isUrl && (
                 <Button asChild variant="outline" size="sm" className="shrink-0 font-medium">
                   <a href={url} target="_blank" rel="noopener noreferrer">
                     View Evidence <ExternalLink className="size-3 ml-2 text-muted-foreground" />
                   </a>
                 </Button>
               )}
             </div>
           )
        }

        return (
          <div key={req.id} className="space-y-3">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2 border-b border-border/50 pb-2">
              <CheckCircle2 className="size-4 text-green-500" />
              {req.type.replace(/_/g, " ")} Requirement
            </h3>

            {req.type === "Text_Report" ? (
              <div className="prose prose-sm dark:prose-invert max-w-none bg-background p-6 rounded-xl border border-border whitespace-pre-wrap text-sm leading-relaxed shadow-sm">
                {submittedData}
              </div>
            ) : Array.isArray(submittedData) ? (
              // If the CDN returned an array of multiple files
              <div className="flex flex-col gap-2">
                {submittedData.map((url, idx) => renderAssetCard(url, idx))}
              </div>
            ) : (
              // Single string fallback (e.g., Video link or Github link)
              renderAssetCard(submittedData)
            )}
          </div>
        )
      })}
    </div>
  )
}