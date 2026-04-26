"use client"

import { useState, cloneElement, ReactElement, useEffect, useMemo } from "react"
import Link from "next/link"
import {
    MessageSquare, FileCode2, ShieldAlert, Users, CheckCircle2,
    ChevronRight, AlertTriangle, LucideProps, Scale, Percent, Info
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import HiveChat from "./HiveChat"
import WorkspaceProposalCard from "./WorkspaceProposalCard"
import { handleSplitDecision } from "../../actions.resolve-split"

const TABS = {
    CHAT: "chat",
    WORK: "work",
    DECISIONS: "decisions",
    MEMBERS: "members",
} as const

type Tab = typeof TABS[keyof typeof TABS]

const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()

interface WorkspaceShellProps {
    hive: any
    session: any
    currentMember: any
    hiveMissions: any
    equityPercentage: string
    activeSplit: any
    optedInActivityIds: string[]
}

export default function WorkspaceShell({
    hive,
    session,
    currentMember,
    hiveMissions,
    equityPercentage,
    activeSplit,
    optedInActivityIds = []
}: WorkspaceShellProps) {
    const [tab, setTab] = useState<Tab>(TABS.CHAT)
    const [isReviewing, setIsReviewing] = useState(false)
    const [rationale, setRationale] = useState("")
    const [isProcessing, setIsProcessing] = useState(false)
    const [counterSplits, setCounterSplits] = useState<Record<string, number>>({})

    // Initialize counterSplits for Review mode
    useEffect(() => {
        if (isReviewing && activeSplit?.submission?.roster) {
            const initial: Record<string, number> = {}
            activeSplit.submission.roster.forEach((r: any) => {
                initial[r.userId] = Math.round(r.claimedShare * 100)
            })
            setCounterSplits(initial)
        }
    }, [isReviewing, activeSplit])

    // --- GOVERNANCE LOGIC ---
    const submissionDate = useMemo(() =>
        activeSplit?.submission?.createdAt ? new Date(activeSplit.submission.createdAt) : null
        , [activeSplit])

    const isDeadlocked = useMemo(() => {
        if (!submissionDate) return false
        return (Date.now() - submissionDate.getTime()) > (48 * 60 * 60 * 1000)
    }, [submissionDate])

    const isAdmin = currentMember?.role === "ADMIN" || currentMember?.role === "FOUNDER"
    const disputeEntry = activeSplit?.submission?.roster?.find((r: any) => r.approvalStatus === "DISPUTED")
    const isGlobalDispute = !!disputeEntry
    const totalCounterSplit = Object.values(counterSplits).reduce((a, b) => a + b, 0)
    const isCounterSplitValid = totalCounterSplit === 100

    const handleDecision = async (decision: 'ACCEPT' | 'DISPUTE' | 'ADMIN_OVERRIDE') => {
        setIsProcessing(true)
        const toastId = toast.loading("Syncing decision...")
        try {
            const result = await handleSplitDecision({
                rosterId: activeSplit.id,
                decision,
                rationale: decision === 'DISPUTE' ? rationale : undefined,
                counterSplits: decision === 'DISPUTE' ? counterSplits : undefined,
                pathname: window.location.pathname
            })
            if (result.success) {
                toast.success(decision === 'ACCEPT' ? "Split Approved" : "Dispute Transmitted", { id: toastId })
                setIsReviewing(false); setRationale("");
            } else {
                toast.error((result as any).error || "Action failed", { id: toastId })
            }
        } catch (e) {
            toast.error("Network error", { id: toastId })
        } finally { setIsProcessing(false) }
    }

    // Sidebar mapping
    const sidebarContent = {
        work: (
            <div className="space-y-4">

                {hiveMissions?.length ? (
                    hiveMissions.map((hm: any) => {
                        const latestSubmission = hm.activity.submissions?.[0]
                        const isOptedIn = optedInActivityIds.includes(hm.activityId)

                        return (
                            <div
                                key={hm.activityId}
                                className="p-4 rounded-xl bg-muted/30 border border-border/50 space-y-3"
                            >
                                <p className="text-sm font-semibold leading-tight">
                                    {hm.activity.title}
                                </p>

                                {latestSubmission ? (
                                    <Badge
                                        variant="outline"
                                        className="text-green-600 bg-green-500/5 border-green-500/10 text-[10px]"
                                    >
                                        Submitted
                                    </Badge>
                                ) : isOptedIn ? (
                                    <Button asChild size="sm" className="w-full h-8 text-xs bg-orange text-white">
                                        <Link href={`/dashboard/activities/${hm.activity.id}?hiveId=${hive.id}`}>
                                            Submit Work
                                        </Link>
                                    </Button>
                                ) : (
                                    <Button asChild size="sm" variant="outline" className="w-full h-8 text-xs border-orange/50 text-orange">
                                        <Link href={`/activities/${hm.activity.slug}`}>
                                            Join Team
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        )
                    })
                ) : (
                    <div className="p-5 text-center border border-dashed rounded-xl bg-muted/5 space-y-3">

                        <p className="text-sm font-medium text-foreground">
                            No active work yet
                        </p>

                        <p className="text-xs text-muted-foreground leading-relaxed">
                            New projects and hackathons are where contributors earn reputation and build proof of work.
                            Check open opportunities to get started.
                        </p>

                        <div className="flex flex-col gap-2 pt-2">
                            <Button asChild size="sm" variant="outline">
                                <Link href="/activities">
                                    Explore open projects
                                </Link>
                            </Button>
                        </div>

                    </div>
                )}

            </div>
        ),
        decisions: (
            <div className="space-y-4">

                {hive.proposals?.length ? (
                    hive.proposals.map((p: any) => (
                        <WorkspaceProposalCard
                            key={p.id}
                            proposal={p}
                            currentUserId={session.id}
                            userEquity={parseFloat(equityPercentage)}
                        />
                    ))
                ) : (
                    <div className="p-5 text-center border border-dashed rounded-xl bg-muted/5 space-y-3">

                        <p className="text-sm font-medium text-foreground">
                            No active decisions
                        </p>

                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Governance happens through motions. Contributors vote and system enforces automatic enforcement when applicable.
                        </p>

                        <p className="text-xs text-muted-foreground">
                            Start the first motion to define direction and unlock coordinated execution.
                        </p>

                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white w-full mt-2">
                            Create motion
                        </Button>

                    </div>
                )}

            </div>
        ),
        members: (
  <div className="space-y-1">

    {hive.members?.map((m: any) => {
      const joinedDate = new Date(m.createdAt || m.joinedAt)
      const daysSinceJoined = Math.max(
        1,
        Math.floor((Date.now() - joinedDate.getTime()) / (1000 * 60 * 60 * 24))
      )

      return (
        <div
          key={m.id}
          className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-3 min-w-0">

            <div className="size-8 rounded-full bg-orange/10 flex items-center justify-center text-[10px] font-bold text-orange shrink-0">
              {getInitials(m.user.name)}
            </div>

            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium truncate">
                {m.user.name}
              </span>

              <div className="flex items-center gap-2 text-[9px] text-muted-foreground uppercase font-bold">
                <span>{m.role}</span>
                <span>•</span>
                <span>{daysSinceJoined}d in hive</span>
              </div>
            </div>

          </div>

          <Badge variant="outline" className="text-[10px] shrink-0">
            {(m.equityShare * 100).toFixed(1)}%
          </Badge>
        </div>
      )
    })}

  </div>
),
    }

    return (
        <div className="flex flex-col md:flex-row h-[calc(100vh-8rem)] md:h-[calc(100vh-4rem)] bg-background overflow-hidden">

            {/* DESKTOP LEFT RAIL */}
            <div className="hidden md:flex w-14 border-r flex-col items-center py-6 gap-6 shrink-0 bg-muted/5">
                <NavButton icon={<MessageSquare />} active={tab === "chat"} onClick={() => setTab("chat")} />
                <NavButton icon={<FileCode2 />} active={tab === "work"} onClick={() => setTab("work")} />
                <NavButton icon={<ShieldAlert />} active={tab === "decisions"} onClick={() => setTab("decisions")} />
                <NavButton icon={<Users />} active={tab === "members"} onClick={() => setTab("members")} />
            </div>

            {/* CENTER PANEL */}
            <div className="flex-1 flex flex-col min-w-0 bg-background relative">

                {/* MOBILE SUB-NAV TABS */}
                <div className="md:hidden flex items-center border-b bg-background/50 backdrop-blur-md sticky top-0 z-20 overflow-x-auto no-scrollbar">
                    <MobileTab active={tab === "chat"} onClick={() => setTab("chat")} label="Chat" icon={<MessageSquare className="size-3.5" />} />
                    <MobileTab active={tab === "work"} onClick={() => setTab("work")} label="Work" icon={<FileCode2 className="size-3.5" />} />
                    <MobileTab active={tab === "decisions"} onClick={() => setTab("decisions")} label="Votes" icon={<ShieldAlert className="size-3.5" />} />
                    <MobileTab active={tab === "members"} onClick={() => setTab("members")} label="Team" icon={<Users className="size-3.5" />} />
                </div>

                {/* WORKSPACE HEADER (Desktop Only or shared) */}
                <header className="h-12 border-b hidden md:flex items-center justify-between px-6 shrink-0 bg-white/50 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <div className="size-7 bg-orange text-white rounded-lg flex items-center justify-center text-[10px] font-bold shadow-sm">
                            {getInitials(hive.name)}
                        </div>
                        <div className="text-sm font-bold truncate">{hive.name}</div>
                    </div>
                    <Badge variant="secondary" className="text-[10px] font-bold">{hive.members.length} Members</Badge>
                </header>

                {/* DYNAMIC SPLIT NOTICE */}
                {activeSplit && (
                    <div className={`border-b px-4 md:px-6 py-3 animate-in slide-in-from-top shrink-0 transition-colors z-10 ${isGlobalDispute ? "bg-red-50 border-red-100" : "bg-orange/5 border-orange/10"
                        }`}>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex gap-4">
                                <div className={`size-9 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${isGlobalDispute ? "bg-red-100" : "bg-orange/20"
                                    }`}>
                                    {isGlobalDispute ? <AlertTriangle className="size-4 text-red-600" /> : <Scale className="size-4 text-orange" />}
                                </div>
                                <div className="space-y-0.5">
                                    <h4 className={`text-[10px] font-black uppercase tracking-widest ${isGlobalDispute ? "text-red-900" : "text-orange-900"}`}>
                                        {isGlobalDispute ? "Consensus Blocked" : "Split Review"}
                                    </h4>
                                    <p className={`text-[10px] leading-relaxed max-w-lg ${isGlobalDispute ? "text-red-800/80" : "text-orange-800/80"}`}>
                                        {isGlobalDispute
                                            ? `${disputeEntry.user.name} disputed the proposed percentages.`
                                            : activeSplit.approvalStatus === "APPROVED"
                                                ? "Vouched. Waiting for other team members."
                                                : `Confirm your ${(activeSplit.claimedShare * 100).toFixed(0)}% share.`}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                {activeSplit.approvalStatus === "PENDING" && !isReviewing && (
                                    <>
                                        <Button disabled={isProcessing} onClick={() => handleDecision('ACCEPT')} size="sm" className="flex-1 sm:flex-none h-8 bg-orange text-white text-[10px] font-bold px-4">Accept</Button>
                                        <Button disabled={isProcessing} onClick={() => setIsReviewing(true)} variant="outline" size="sm" className="flex-1 sm:flex-none h-8 text-[10px] font-bold px-4 border-orange/20 text-orange">Review</Button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* EDITABLE REVIEW FORM */}
                        {isReviewing && (
                            <div className="mt-4 pt-4 border-t border-orange/10 space-y-4 bg-white/40 p-4 rounded-xl border border-white/60 shadow-sm">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-orange-900 flex items-center gap-2"><Percent className="size-3" /> Correction</label>
                                        <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                                            {activeSplit.submission.roster.map((member: any) => (
                                                <div key={member.userId} className="flex items-center gap-3 bg-white/80 p-2 rounded-xl border border-orange/5">
                                                    <Avatar className="size-6 border-2 border-orange/10"><AvatarFallback className="text-[8px] font-bold">{member.user.name[0]}</AvatarFallback></Avatar>
                                                    <span className="text-[10px] flex-1 truncate font-semibold">{member.user.name}</span>
                                                    <Input type="number" className="w-14 h-7 text-right text-[10px] font-bold rounded-lg border-orange/10" value={counterSplits[member.userId] || 0} onChange={(e) => setCounterSplits(prev => ({ ...prev, [member.userId]: parseInt(e.target.value) || 0 }))} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-orange-900 flex items-center gap-2"><Info className="size-3" /> Rationale</label>
                                        <Textarea placeholder="Why is this split inaccurate?" className="text-[11px] bg-white border-orange/10 min-h-[100px] rounded-xl resize-none" value={rationale} onChange={(e) => setRationale(e.target.value)} />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 pt-2">
                                    <Button onClick={() => setIsReviewing(false)} variant="ghost" className="text-[10px] h-8 font-bold">Cancel</Button>
                                    <Button disabled={!rationale || !isCounterSplitValid || isProcessing} onClick={() => handleDecision('DISPUTE')} className="h-8 bg-orange text-white text-[10px] font-black px-6 rounded-lg">
                                        {isProcessing ? "Transmitting..." : `Submit Dispute (${totalCounterSplit}%)`}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <main className="flex-1 overflow-hidden relative">
                    {/* Only show chat if 'chat' tab is active on mobile, or always on desktop */}
                    <div className={`h-full ${tab !== "chat" ? "hidden md:block" : "block"}`}>
                        <HiveChat hiveId={hive.id} hiveName={hive.name} currentUserId={session.id} disabled={!currentMember} initialMessages={hive.messages} />
                    </div>

                    {/* Show Sidebar Content in main area on Mobile if not chat tab */}
                    <div className={`h-full md:hidden p-4 overflow-y-auto ${tab === "chat" ? "hidden" : "block"}`}>
                        {(sidebarContent as any)[tab]}
                    </div>
                </main>
            </div>

            {/* RIGHT PANEL (Desktop Only) */}
            <aside className="w-[320px] border-l hidden lg:flex flex-col bg-muted/2">
                <header className="h-12 border-b flex items-center px-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">{tab}</header>
                <ScrollArea className="flex-1 p-6">
                    {(sidebarContent as any)[tab]}
                </ScrollArea>
            </aside>
        </div>
    )
}

function NavButton({ icon, active, onClick }: { icon: ReactElement<LucideProps>; active: boolean; onClick: () => void }) {
    return (
        <button onClick={onClick} className={`p-3 rounded-2xl transition-all duration-300 ${active ? "bg-orange text-white shadow-xl shadow-orange/20 scale-110" : "text-muted-foreground hover:bg-muted"}`}>
            {cloneElement(icon, { size: 18, strokeWidth: active ? 2.5 : 2 } as LucideProps)}
        </button>
    )
}

function MobileTab({ active, onClick, label, icon }: { active: boolean; onClick: () => void; label: string; icon: ReactElement }) {
    return (
        <button onClick={onClick} className={`flex-1 flex items-center justify-center gap-2 py-3.5 border-b-2 transition-all ${active ? "border-orange text-orange bg-orange/5 font-bold" : "border-transparent text-muted-foreground"}`}>
            {icon}
            <span className="text-[10px] tracking-wider">{label}</span>
        </button>
    )
}