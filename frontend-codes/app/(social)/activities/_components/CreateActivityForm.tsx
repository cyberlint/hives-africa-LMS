"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { 
  Zap, Users, User, Trophy, Calendar, 
  Settings2, ArrowRight, Loader2, ShieldCheck, 
  ChevronLeft, ListChecks, Plus, Trash2, CheckCircle2
} from "lucide-react"
import { createActivity } from "../actions.activity-create"

interface KSB {
  id: string
  title: string
  type: string
}

interface CreateActivityFormProps {
  activityTypes: string[]
  availableKSBs: KSB[] // NEW: Pass global KSBs from the server
}

const formatLabel = (str: string) => 
  str.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())

export default function CreateActivityForm({ activityTypes, availableKSBs = [] }: CreateActivityFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  
  // WIZARD STATE
  const [step, setStep] = useState(1)
  const totalSteps = 4

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: activityTypes[0] || "",
    difficulty: "Intermediate",
    points: "500",
    deadline: "",
    allowSolo: true,
    allowHive: false,
    minHiveSize: "2",
    maxHiveSize: "5",
    ksbIds: [] as string[],
    requirements: [] as string[], // NEW: Array of text-based checklist items
  })

  // DYNAMIC REQUIREMENTS HANDLERS
  const addRequirement = () => {
    setFormData(prev => ({ ...prev, requirements: [...prev.requirements, ""] }))
  }

  const updateRequirement = (index: number, value: string) => {
    const newReqs = [...formData.requirements]
    newReqs[index] = value
    setFormData(prev => ({ ...prev, requirements: newReqs }))
  }

  const removeRequirement = (index: number) => {
    const newReqs = formData.requirements.filter((_, i) => i !== index)
    setFormData(prev => ({ ...prev, requirements: newReqs }))
  }

  // KSB TOGGLE HANDLER
  const toggleKsb = (ksbId: string) => {
    setFormData(prev => {
      const current = prev.ksbIds
      if (current.includes(ksbId)) return { ...prev, ksbIds: current.filter(id => id !== ksbId) }
      return { ...prev, ksbIds: [...current, ksbId] }
    })
  }

  // STEP NAVIGATION
  const nextStep = () => {
    if (step === 1 && !formData.title) return toast.error("Please provide a title before continuing.")
    if (step < totalSteps) setStep(s => s + 1)
  }
  const prevStep = () => {
    if (step > 1) setStep(s => s - 1)
  }

  const handleSubmit = () => {
    // Filter out empty requirements before sending
    const payload = {
      ...formData,
      requirements: formData.requirements.filter(r => r.trim() !== "")
    }

    startTransition(async () => {
      const res = await createActivity(payload)
      if (res.success) {
        toast.success("Activity launched successfully!")
        router.push(`/activities/${res.slug}`)
      } else {
        toast.error(res.error || "Failed to create activity.")
      }
    })
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-6 pb-32">
      
      {/* HEADER & PROGRESS BAR */}
      <div className="mb-10 space-y-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight">Host a Challenge</h1>
          <p className="text-muted-foreground mt-2">Configure the rules, parameters, and rewards for the Arena.</p>
        </div>

        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex-1 h-2 rounded-full bg-muted/30 overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ease-in-out ${step >= i ? 'bg-orange' : 'bg-transparent'}`} 
                style={{ width: step >= i ? '100%' : '0%' }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-8">
        
        {/* ================= STEP 1: IDENTITY ================= */}
        {step === 1 && (
          <section className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center gap-2 text-orange font-bold uppercase tracking-widest text-[10px]">
              <Settings2 className="size-4" /> 01. Activity Identity
            </div>
            <Card className="rounded-2xl border-border/60 shadow-sm">
              <CardContent className="p-6 space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold">Challenge Title</label>
                  <Input 
                    placeholder="e.g. Innoson Automotive Design Sprint" 
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    className="h-12 bg-muted/20 border-border/50 font-medium focus-visible:ring-orange/30"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold">Brief / Description</label>
                  <Textarea 
                    placeholder="Describe the technical requirements and mission objective..." 
                    className="min-h-[160px] bg-muted/20 border-border/50 resize-none focus-visible:ring-orange/30"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold">Activity Type</label>
                    <select 
                      className="w-full h-12 px-3 rounded-xl bg-muted/20 border border-border/50 text-sm outline-none cursor-pointer focus:ring-2 focus:ring-orange/30 font-medium"
                      value={formData.type}
                      onChange={e => setFormData({...formData, type: e.target.value})}
                    >
                      {activityTypes.map((type) => (
                        <option key={type} value={type}>{formatLabel(type)}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold">Complexity Level</label>
                    <select 
                      className="w-full h-12 px-3 rounded-xl bg-muted/20 border border-border/50 text-sm outline-none cursor-pointer focus:ring-2 focus:ring-orange/30 font-medium"
                      value={formData.difficulty}
                      onChange={e => setFormData({...formData, difficulty: e.target.value})}
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Expert">Expert</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* ================= STEP 2: RULES OF ENGAGEMENT ================= */}
        {step === 2 && (
          <section className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center gap-2 text-blue-500 font-bold uppercase tracking-widest text-[10px]">
              <ShieldCheck className="size-4" /> 02. Rules of Engagement
            </div>
            <Card className="rounded-2xl border-border/60 shadow-sm">
              <CardContent className="p-6 space-y-4">
                
                <label className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer ${formData.allowSolo ? "border-blue-500 bg-blue-500/5" : "border-border/50 bg-muted/5 hover:bg-muted/10"}`}>
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg border ${formData.allowSolo ? "bg-blue-500 text-white border-blue-600" : "bg-background border-border text-blue-500"}`}>
                      <User className="size-5" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Allow Solo Contenders</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">Individuals can join the arena solo.</p>
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={formData.allowSolo} 
                    onChange={e => setFormData({...formData, allowSolo: e.target.checked})}
                    className="size-5 accent-blue-500" 
                  />
                </label>

                <label className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer ${formData.allowHive ? "border-orange bg-orange/5" : "border-border/50 bg-muted/5 hover:bg-muted/10"}`}>
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg border ${formData.allowHive ? "bg-orange text-white border-orange/80" : "bg-background border-border text-orange"}`}>
                      <Users className="size-5" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Allow Squad Participation</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">Registered Hives can compete as a unit.</p>
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={formData.allowHive} 
                    onChange={e => setFormData({...formData, allowHive: e.target.checked})}
                    className="size-5 accent-orange" 
                  />
                </label>

                {formData.allowHive && (
                  <div className="grid grid-cols-2 gap-4 pt-4 animate-in slide-in-from-top-2 border-t border-border/50">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Min Squad Size</label>
                      <Input 
                        type="number" 
                        value={formData.minHiveSize} 
                        onChange={e => setFormData({...formData, minHiveSize: e.target.value})}
                        className="h-11 bg-background border-border/50 font-bold" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Max Squad Size</label>
                      <Input 
                        type="number" 
                        value={formData.maxHiveSize} 
                        onChange={e => setFormData({...formData, maxHiveSize: e.target.value})}
                        className="h-11 bg-background border-border/50 font-bold" 
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
        )}

        {/* ================= STEP 3: KSB & REQUIREMENTS ================= */}
        {step === 3 && (
          <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            
            {/* COMPETENCIES */}
            <div>
              <div className="flex items-center gap-2 mb-3 text-purple-500 font-bold uppercase tracking-widest text-[10px]">
                <Zap className="size-4" /> 03. Target Competencies (KSBs)
              </div>
              <Card className="rounded-2xl border-border/60 shadow-sm">
                <CardContent className="p-6">
                  <p className="text-sm font-medium text-muted-foreground mb-4">Select the specific skills this activity validates.</p>
                  <div className="flex flex-wrap gap-2">
                    {availableKSBs.map((ksb) => {
                      const isSelected = formData.ksbIds.includes(ksb.id)
                      return (
                        <button
                          key={ksb.id}
                          type="button"
                          onClick={() => toggleKsb(ksb.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                            isSelected 
                              ? "bg-purple-500/10 border-purple-500/30 text-purple-600" 
                              : "bg-muted/20 border-border/50 text-muted-foreground hover:border-foreground/30"
                          }`}
                        >
                          {isSelected && <CheckCircle2 className="size-3 inline mr-1.5" />}
                          {ksb.title}
                        </button>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* CHECKLIST */}
            <div>
              <div className="flex items-center gap-2 mb-3 text-green-600 font-bold uppercase tracking-widest text-[10px]">
                <ListChecks className="size-4" /> 04. Assessment Checklist
              </div>
              <Card className="rounded-2xl border-border/60 shadow-sm">
                <CardContent className="p-6 space-y-4">
                  <p className="text-sm font-medium text-muted-foreground">Add specific deliverables or criteria the reviewers should check for.</p>
                  
                  {formData.requirements.map((req, index) => (
                    <div key={index} className="flex items-start gap-3 animate-in fade-in slide-in-from-left-4">
                      <div className="mt-2.5 size-2 rounded-full bg-green-500 shrink-0" />
                      <Input
                        value={req}
                        onChange={(e) => updateRequirement(index, e.target.value)}
                        placeholder={`e.g. "Includes a working Dockerfile"`}
                        className="h-11 bg-background border-border/50"
                      />
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeRequirement(index)} className="h-11 w-11 shrink-0 text-muted-foreground hover:text-red-500">
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  ))}

                  <Button type="button" variant="outline" onClick={addRequirement} className="w-full h-11 border-dashed font-bold mt-2">
                    <Plus className="size-4 mr-2" /> Add Checklist Item
                  </Button>
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {/* ================= STEP 4: REWARDS ================= */}
        {step === 4 && (
          <section className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center gap-2 text-yellow-600 font-bold uppercase tracking-widest text-[10px]">
              <Trophy className="size-4" /> 05. Incentives & Timeline
            </div>
            <Card className="rounded-2xl border-border/60 shadow-sm">
              <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold flex items-center gap-2">
                    <Trophy className="size-4 text-yellow-500" /> Reputation Bounty
                  </label>
                  <div className="relative">
                    <Input 
                      type="number" 
                      value={formData.points}
                      onChange={e => setFormData({...formData, points: e.target.value})}
                      className="h-12 bg-muted/20 border-border/50 font-black text-xl pl-4 pr-12 rounded-xl"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-muted-foreground uppercase">Rep</span>
                  </div>
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Base reward upon approval</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold flex items-center gap-2">
                    <Calendar className="size-4 text-blue-500" /> Challenge Deadline
                  </label>
                  <Input 
                    type="date" 
                    value={formData.deadline}
                    onChange={e => setFormData({...formData, deadline: e.target.value})}
                    className="h-12 bg-muted/20 border-border/50 rounded-xl font-medium"
                  />
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Leave empty for rolling admission</p>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

      </div>

      {/* ================= FIXED ACTION FOOTER ================= */}
      <div className="fixed bottom-0 left-0 right-0 p-4 border-t border-border/50 bg-background/80 backdrop-blur-xl z-50">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          
          <Button 
            type="button" 
            variant="ghost" 
            onClick={step === 1 ? () => router.back() : prevStep} 
            className="font-bold h-12 px-6"
          >
            {step === 1 ? "Cancel" : <><ChevronLeft className="size-4 mr-2" /> Back</>}
          </Button>

          {step < totalSteps ? (
            <Button 
              type="button"
              onClick={nextStep}
              className="bg-foreground text-background hover:bg-foreground/90 font-black px-10 h-12 rounded-xl shadow-md transition-all active:scale-95"
            >
              Continue <ArrowRight className="size-4 ml-2" />
            </Button>
          ) : (
            <Button 
              type="button"
              onClick={handleSubmit}
              disabled={isPending}
              className="bg-orange text-white hover:bg-orange/90 font-black px-10 h-12 rounded-xl shadow-xl shadow-orange/20 transition-all active:scale-95"
            >
              {isPending ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  Launch Challenge <Zap className="size-4" />
                </span>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}