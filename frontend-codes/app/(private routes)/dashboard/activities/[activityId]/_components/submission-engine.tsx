// "use client"

// import { useState } from "react"
// import { usePathname } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Label } from "@/components/ui/label"
// import { 
//   UploadCloud, Github, Link as LinkIcon, FileText, 
//   CheckCircle2, Lock, Rocket, Zap, 
//   Badge,
//   ExternalLink
// } from "lucide-react"
// import { toast } from "sonner"
// // Make sure to create this file in the same folder (or adjust the path if you placed it in an _actions folder)
// import { createActivitySubmission } from "../../../actions/submit-activity"

// interface SubmissionEngineProps {
//   activityId: string;
//   requirements: any[];
//   existingSubmission: any | null;
// }

// export function SubmissionEngine({ activityId, requirements, existingSubmission }: SubmissionEngineProps) {
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [formData, setFormData] = useState<Record<string, string>>({})
//   const pathname = usePathname()

//   // Calculate deployment readiness
//   const filledCount = requirements.filter(req => formData[req.id]?.trim().length > 0).length;
//   const progressPercent = requirements.length > 0 ? (filledCount / requirements.length) * 100 : 0;
//   const isReady = progressPercent === 100;

//   // --- STATE 1: ALREADY DEPLOYED (The Immutable Receipt) ---
//   if (existingSubmission) {
//     return (
//       <div className="sticky top-24">
//         <div className="relative overflow-hidden rounded-[2rem] border border-green-500/20 bg-gradient-to-b from-green-500/10 to-transparent p-1 shadow-lg">
//           <div className="bg-card/80 backdrop-blur-2xl rounded-[1.8rem] p-8 flex flex-col items-center text-center relative z-10">
            
//             {/* Glowing Icon */}
//             <div className="relative mb-6">
//               <div className="absolute inset-0 bg-green-500 blur-xl opacity-20 rounded-full animate-pulse" />
//               <div className="size-16 rounded-full bg-gradient-to-br from-green-500/20 to-green-500/5 border border-green-500/30 flex items-center justify-center relative z-10">
//                 <CheckCircle2 className="size-8 text-green-500" />
//               </div>
//             </div>

//             <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-none mb-3 px-3 py-1">
//               <Lock className="size-3 mr-1.5" /> Immutable Record
//             </Badge>

//             <h3 className="text-2xl font-bold text-foreground tracking-tight mb-2">Submitted Successfully</h3>
            
//             <p className="text-sm text-muted-foreground mb-8">
//               Your proof of work is locked in the registry. Current status: 
//               <span className="font-semibold text-foreground ml-1">{existingSubmission.status.replace("_", " ")}</span>
//             </p>

//             {/* Simulated Receipt Details */}
//             <div className="w-full bg-background/50 rounded-2xl p-4 border border-border/50 space-y-3 text-sm mb-6 text-left">
//               <div className="flex justify-between border-b border-border/50 pb-2">
//                 <span className="text-muted-foreground">Activity ID</span>
//                 <span className="font-mono text-foreground">{activityId.split('-')[0]}...</span>
//               </div>
//               <div className="flex justify-between border-b border-border/50 pb-2">
//                 <span className="text-muted-foreground">Timestamp</span>
//                 <span className="font-mono text-foreground">{new Date(existingSubmission.submittedAt || existingSubmission.createdAt).toLocaleDateString()}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-muted-foreground">Data Signatures</span>
//                 <span className="font-mono text-foreground">{requirements.length} Validated</span>
//               </div>
//             </div>

//             {existingSubmission.status === "Approved" && (
//               <Button className="rounded-full w-full py-6 font-medium bg-foreground text-background hover:bg-foreground/90 transition-transform hover:scale-105 shadow-xl">
//                 View on Public Portfolio <ExternalLink className="ml-2 size-4" />
//               </Button>
//             )}
//           </div>
//         </div>
//       </div>
//     )
//   }

//   // --- STATE 2: THE EXECUTION ENGINE ---
//   const handleInputChange = (reqId: string, value: string) => {
//     setFormData(prev => ({ ...prev, [reqId]: value }))
//   }

//   // 🔥 THE FIX: Actual Database Submission Logic
//   const handleSubmit = async () => {
//     if (!isReady) {
//       toast.error("Submission rejected. Missing required parameters.")
//       return;
//     }

//     setIsSubmitting(true)
    
//     try {
//       // Send the data to the server!
//       const result = await createActivitySubmission(activityId, formData, pathname)
      
//       if (result.success) {
//         toast.success("Proof of work submitted to the network!")
//         // The page will automatically refresh and trigger State 1 (Receipt) 
//         // because the Server Action calls revalidatePath(pathname).
//       } else {
//         toast.error(result.error || "Submission failed.")
//       }
//     } catch (error) {
//       toast.error("A critical error occurred.")
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   return (
//     <div className="sticky top-24 space-y-6">
      
//       {/* Engine Header */}
//       <div className="rounded-[2rem] border border-border/50 bg-card/40 backdrop-blur-xl p-1 shadow-2xl">
//         <div className="bg-background/40 rounded-[1.8rem] p-6 sm:p-8">
          
//           <div className="flex items-center justify-between mb-8">
//             <div className="space-y-1">
//               <h3 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
//                 <Rocket className="size-5 text-orange" /> Self-Reporting Form
//               </h3>
//               <p className="text-sm text-muted-foreground">Review activity brief and submit your proof of work here.</p>
//             </div>
            
//             {/* Circular Progress Indicator */}
//             <div className="flex items-center justify-center size-12 rounded-full bg-muted/50 border border-border/50 shrink-0">
//               <span className="text-sm font-bold text-foreground">{filledCount}/{requirements.length}</span>
//             </div>
//           </div>

//           <div className="space-y-6">
//             {requirements.map((req) => {
//               const hasValue = formData[req.id]?.trim().length > 0;
              
//               return (
//                 <div 
//                   key={req.id} 
//                   className={`group relative space-y-3 p-1 rounded-2xl transition-all duration-500 ${hasValue ? 'bg-gradient-to-br from-orange/20 to-transparent' : 'bg-transparent'}`}
//                 >
//                   {/* Subtle glowing border wrap */}
//                   <div className={`absolute inset-0 rounded-2xl border transition-colors duration-300 ${hasValue ? 'border-orange/30' : 'border-border/50 group-focus-within:border-orange/50'}`} />
                  
//                   <div className="relative bg-card/80 backdrop-blur-md rounded-[15px] p-5">
//                     <div className="flex items-center justify-between mb-3">
//                       <Label className="text-sm font-semibold text-foreground flex items-center gap-2 uppercase tracking-wider text-xs">
//                         {req.type === "GitHub_Repo" && <Github className="size-4 text-muted-foreground" />}
//                         {req.type === "Video_Link" && <LinkIcon className="size-4 text-muted-foreground" />}
//                         {req.type === "File_Upload" && <UploadCloud className="size-4 text-muted-foreground" />}
//                         {req.type === "Text_Report" && <FileText className="size-4 text-muted-foreground" />}
//                         {req.type.replace("_", " ")}
//                       </Label>
//                       {hasValue && <CheckCircle2 className="size-4 text-orange" />}
//                     </div>
                    
//                     {/* The Premium Inputs */}
//                     {req.type === "Text_Report" ? (
//                       <Textarea 
//                         placeholder="Draft your executive summary or paste methodology..."
//                         className="min-h-[120px] resize-none bg-background/50 border-border/50 rounded-xl focus-visible:ring-1 focus-visible:ring-orange/50 focus-visible:border-orange/50 transition-all text-sm"
//                         onChange={(e) => handleInputChange(req.id, e.target.value)}
//                       />
//                     ) : req.type === "File_Upload" ? (
//                       // Custom Dropzone styling hiding the ugly default file input
//                       <div className="relative group/dropzone cursor-pointer flex flex-col items-center justify-center w-full h-32 rounded-xl border-2 border-dashed border-border/50 bg-background/50 hover:bg-orange/5 hover:border-orange/30 transition-all overflow-hidden">
//                         <input 
//                           type="file" 
//                           className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
//                           onChange={(e) => handleInputChange(req.id, e.target.value)}
//                         />
//                         <div className="flex flex-col items-center text-center p-4 transition-transform group-hover/dropzone:-translate-y-1">
//                           <UploadCloud className="size-8 text-muted-foreground group-hover/dropzone:text-orange transition-colors mb-2" />
//                           <span className="text-sm font-medium text-foreground">Drag and drop or click to browse</span>
//                           <span className="text-xs text-muted-foreground mt-1 truncate max-w-[200px]">
//                             {formData[req.id] ? formData[req.id].split('\\').pop() : "PDF, ZIP, or Image up to 50MB"}
//                           </span>
//                         </div>
//                       </div>
//                     ) : (
//                       <Input 
//                         type="url" 
//                         placeholder={`https://...`}
//                         className="bg-background/50 border-border/50 rounded-xl h-12 focus-visible:ring-1 focus-visible:ring-orange/50 focus-visible:border-orange/50 transition-all font-mono text-sm"
//                         onChange={(e) => handleInputChange(req.id, e.target.value)}
//                       />
//                     )}
//                   </div>
//                 </div>
//               )
//             })}
//           </div>

//           {/* Deployment Button */}
//           <div className="mt-8 relative bg-primary-foreground">
//             {/* Glowing aura when ready */}
//             {isReady && <div className="absolute inset-0 bg-orange blur-xl opacity-20 rounded-full animate-pulse" />}
            
//             <Button 
//               onClick={handleSubmit} 
//               disabled={!isReady || isSubmitting}
//               className={`w-full rounded-full py-7 text-base font-semibold shadow-xl transition-all duration-300 relative z-10 ${
//                 isReady 
//                   ? 'bg-foreground text-background hover:bg-foreground/90 hover:scale-[1.02]' 
//                   : 'bg-muted text-muted-foreground'
//               }`}
//             >
//               {isSubmitting ? (
//                 "Submitting..."
//               ) : (
//                 <><Zap className={`mr-2 size-5 text-orange ${isReady ? 'text-orange' : ''}`} fill={isReady ? "currentColor" : "none"} /> {isReady ? "Submit Proof of Work" : "Complete requirements to Submit"}</>
//               )}
//             </Button>
//           </div>

//         </div>
//       </div>
//     </div>
//   )
// }

"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  UploadCloud, Github, Link as LinkIcon, FileText, 
  CheckCircle2, Lock, Rocket, Zap, 
  Badge,
  ExternalLink,
  Loader2
} from "lucide-react"
import { toast } from "sonner"
// Adjust this import path to match where you saved the server action
import { createActivitySubmission } from "../../../actions/submit-activity" 

interface SubmissionEngineProps {
  activityId: string;
  requirements: any[];
  existingSubmission: any | null;
}

export function SubmissionEngine({ activityId, requirements, existingSubmission }: SubmissionEngineProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  // UPDATED: Now supports Record<string, any> so we can store arrays of URLs
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [uploadingReqId, setUploadingReqId] = useState<string | null>(null)
  const pathname = usePathname()

  // UPDATED: Progress calculation now checks for both strings and arrays
  const filledCount = requirements.filter(req => {
    const data = formData[req.id];
    if (Array.isArray(data)) return data.length > 0;
    return data && typeof data === "string" && data.trim().length > 0;
  }).length;
  
  const progressPercent = requirements.length > 0 ? (filledCount / requirements.length) * 100 : 0;
  const isReady = progressPercent === 100;

  // --- STATE 1: ALREADY DEPLOYED (The Immutable Receipt) ---
  if (existingSubmission) {
    return (
      <div className="sticky top-24">
        <div className="relative overflow-hidden rounded-[2rem] border border-green-500/20 bg-gradient-to-b from-green-500/10 to-transparent p-1 shadow-lg">
          <div className="bg-card/80 backdrop-blur-2xl rounded-[1.8rem] p-8 flex flex-col items-center text-center relative z-10">
            
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-green-500 blur-xl opacity-20 rounded-full animate-pulse" />
              <div className="size-16 rounded-full bg-gradient-to-br from-green-500/20 to-green-500/5 border border-green-500/30 flex items-center justify-center relative z-10">
                <CheckCircle2 className="size-8 text-green-500" />
              </div>
            </div>

            <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-none mb-3 px-3 py-1">
              <Lock className="size-3 mr-1.5" /> Immutable Record
            </Badge>

            <h3 className="text-2xl font-bold text-foreground tracking-tight mb-2">Submitted Successfully</h3>
            
            <p className="text-sm text-muted-foreground mb-8">
              Your proof of work is locked in the registry. Current status: 
              <span className="font-semibold text-foreground ml-1">{existingSubmission.status.replace(/_/g, " ")}</span>
            </p>

            <div className="w-full bg-background/50 rounded-2xl p-4 border border-border/50 space-y-3 text-sm mb-6 text-left">
              <div className="flex justify-between border-b border-border/50 pb-2">
                <span className="text-muted-foreground">Activity ID</span>
                <span className="font-mono text-foreground">{activityId.split('-')[0]}...</span>
              </div>
              <div className="flex justify-between border-b border-border/50 pb-2">
                <span className="text-muted-foreground">Timestamp</span>
                <span className="font-mono text-foreground">
                  {new Date(existingSubmission.submittedAt || existingSubmission.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Data Signatures</span>
                <span className="font-mono text-foreground">{requirements.length} Validated</span>
              </div>
            </div>

            {existingSubmission.status === "Approved" && (
              <Button className="rounded-full w-full py-6 font-medium bg-foreground text-background hover:bg-foreground/90 transition-transform hover:scale-105 shadow-xl">
                View on Public Portfolio <ExternalLink className="ml-2 size-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // --- STATE 2: THE EXECUTION ENGINE ---
  const handleInputChange = (reqId: string, value: string) => {
    setFormData(prev => ({ ...prev, [reqId]: value }))
  }

  // UPDATED: Now handles multiple files per requirement
  const handleFileUpload = async (reqId: string, files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploadingReqId(reqId);
    // Grab existing files if they uploaded some previously, or start a new array
    const existingUrls = Array.isArray(formData[reqId]) ? [...formData[reqId]] : [];
    
    try {
      // Loop through all selected files
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // 1. Get the Pre-signed URL
        const authResponse = await fetch("/api/s3/upload-public", { 
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: file.name,
            contentType: file.type,
            size: file.size,
            isImage: file.type.startsWith("image/"),
          }),
        });

        if (!authResponse.ok) {
          const errorData = await authResponse.json();
          throw new Error(errorData.error || `Failed to authorize upload for ${file.name}`);
        }

        const { presignedUrl, key } = await authResponse.json();

        // 2. Upload directly to Tigris/S3
        const uploadResponse = await fetch(presignedUrl, {
          method: "PUT",
          headers: { "Content-Type": file.type },
          body: file,
        });

        if (!uploadResponse.ok) throw new Error(`Failed to upload ${file.name} to CDN.`);

        // 3. Construct Public URL
        const bucketName = process.env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES;
        const publicUrl = `https://${bucketName}.fly.storage.tigris.dev/${key}`; 

        existingUrls.push(publicUrl);
      }

      // 4. Save the array of URLs into state
      setFormData(prev => ({ ...prev, [reqId]: existingUrls }));
      toast.success(`${files.length} file(s) securely uploaded!`);

    } catch (error: any) {
      toast.error(error.message || "Failed to upload files. Please try again.");
      console.error(error);
    } finally {
      setUploadingReqId(null);
    }
  }

  const handleSubmit = async () => {
    if (!isReady) {
      toast.error("Submission rejected. Missing required parameters.")
      return;
    }

    setIsSubmitting(true)
    
    try {
      const result = await createActivitySubmission(activityId, formData, pathname)
      
      if (result.success) {
        toast.success("Proof of work submitted to the network!")
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
    <div className="sticky top-24 space-y-6">
      <div className="rounded-[2rem] border border-border/50 bg-card/40 backdrop-blur-xl p-1 shadow-2xl">
        <div className="bg-background/40 rounded-[1.8rem] p-6 sm:p-8">
          
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
                <Rocket className="size-5 text-orange" /> Self-Reporting Form
              </h3>
              <p className="text-sm text-muted-foreground">Review activity brief and submit your proof of work here.</p>
            </div>
            
            <div className="flex items-center justify-center size-12 rounded-full bg-muted/50 border border-border/50 shrink-0">
              <span className="text-sm font-bold text-foreground">{filledCount}/{requirements.length}</span>
            </div>
          </div>

          <div className="space-y-6">
            {requirements.map((req) => {
              const data = formData[req.id];
              const hasValue = Array.isArray(data) ? data.length > 0 : (data && typeof data === "string" && data.trim().length > 0);
              
              return (
                <div 
                  key={req.id} 
                  className={`group relative space-y-3 p-1 rounded-2xl transition-all duration-500 ${hasValue ? 'bg-gradient-to-br from-orange/20 to-transparent' : 'bg-transparent'}`}
                >
                  <div className={`absolute inset-0 rounded-2xl border transition-colors duration-300 ${hasValue ? 'border-orange/30' : 'border-border/50 group-focus-within:border-orange/50'}`} />
                  
                  <div className="relative bg-card/80 backdrop-blur-md rounded-[15px] p-5">
                    <div className="flex items-center justify-between mb-3">
                      <Label className="text-sm font-semibold text-foreground flex items-center gap-2 uppercase tracking-wider text-xs">
                        {req.type === "GitHub_Repo" && <Github className="size-4 text-muted-foreground" />}
                        {req.type === "Video_Link" && <LinkIcon className="size-4 text-muted-foreground" />}
                        {req.type === "File_Upload" && <UploadCloud className="size-4 text-muted-foreground" />}
                        {req.type === "Text_Report" && <FileText className="size-4 text-muted-foreground" />}
                        {req.type.replace("_", " ")}
                      </Label>
                      {hasValue && <CheckCircle2 className="size-4 text-orange" />}
                    </div>
                    
                    {req.type === "Text_Report" ? (
                      <Textarea 
                        placeholder="Draft your executive summary or paste methodology..."
                        className="min-h-[120px] resize-none bg-background/50 border-border/50 rounded-xl focus-visible:ring-1 focus-visible:ring-orange/50 focus-visible:border-orange/50 transition-all text-sm"
                        onChange={(e) => handleInputChange(req.id, e.target.value)}
                      />
                    ) : req.type === "File_Upload" ? (
                      <div className="space-y-3">
                        {/* Dropzone */}
                        <div className="relative group/dropzone cursor-pointer flex flex-col items-center justify-center w-full h-32 rounded-xl border-2 border-dashed border-border/50 bg-background/50 hover:bg-orange/5 hover:border-orange/30 transition-all overflow-hidden">
                          {/* UPDATED: Added `multiple` attribute */}
                          <input 
                            type="file" 
                            multiple
                            disabled={uploadingReqId === req.id}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
                            onChange={(e) => handleFileUpload(req.id, e.target.files)}
                          />
                          <div className="flex flex-col items-center text-center p-4 transition-transform group-hover/dropzone:-translate-y-1">
                            {uploadingReqId === req.id ? (
                              <Loader2 className="size-8 text-orange animate-spin mb-2" />
                            ) : (
                              <UploadCloud className="size-8 text-muted-foreground group-hover/dropzone:text-orange transition-colors mb-2" />
                            )}
                            <span className="text-sm font-medium text-foreground">
                              {uploadingReqId === req.id ? "Uploading to vault..." : "Drag and drop or click to upload files"}
                            </span>
                          </div>
                        </div>

                        {/* Display list of uploaded files */}
                        {Array.isArray(formData[req.id]) && formData[req.id].length > 0 && (
                          <div className="flex flex-col gap-2 mt-2">
                            {formData[req.id].map((url: string, idx: number) => (
                              <div key={idx} className="flex items-center justify-between p-2 px-3 bg-muted/50 rounded-lg border border-border/50 text-sm">
                                <span className="flex items-center gap-2 text-foreground">
                                  <FileText className="size-4 text-muted-foreground" />
                                  Attached File {idx + 1}
                                </span>
                                <CheckCircle2 className="size-4 text-green-500" />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <Input 
                        type="url" 
                        placeholder={`https://...`}
                        className="bg-background/50 border-border/50 rounded-xl h-12 focus-visible:ring-1 focus-visible:ring-orange/50 focus-visible:border-orange/50 transition-all font-mono text-sm"
                        onChange={(e) => handleInputChange(req.id, e.target.value)}
                      />
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-8 relative bg-primary-foreground">
            {isReady && <div className="absolute inset-0 bg-orange blur-xl opacity-20 rounded-full animate-pulse" />}
            
            <Button 
              onClick={handleSubmit} 
              disabled={!isReady || isSubmitting}
              className={`w-full rounded-full py-7 text-base font-semibold shadow-xl transition-all duration-300 relative z-10 ${
                isReady 
                  ? 'bg-foreground text-background hover:bg-foreground/90 hover:scale-[1.02]' 
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {isSubmitting ? (
                <><Loader2 className="mr-2 size-5 animate-spin" /> Submitting...</>
              ) : (
                <><Zap className={`mr-2 size-5 text-orange ${isReady ? 'text-orange' : ''}`} fill={isReady ? "currentColor" : "none"} /> {isReady ? "Submit Proof of Work" : "Complete requirements to Submit"}</>
              )}
            </Button>
          </div>

        </div>
      </div>
    </div>
  )
}