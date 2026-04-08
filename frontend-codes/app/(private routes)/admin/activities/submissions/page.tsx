import { PrismaClient, Prisma, SubmissionStatus } from "@prisma/client"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Clock, Users, CheckCircle2, Search, ArrowRight } from "lucide-react"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SubmissionsFilterBar } from "./_components/SubmissionsFilterBar"

const prisma = new PrismaClient()

const getStatusBadge = (status: SubmissionStatus) => {
    switch (status) {
        case "Approved":
            return <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-200/50 shadow-none font-semibold text-[10px] uppercase">Approved</Badge>
        case "Under_Review":
            return <Badge className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 border-yellow-200/50 shadow-none font-semibold text-[10px] uppercase">In Review</Badge>
        case "Submitted":
            return <Badge className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-blue-200/50 shadow-none font-semibold text-[10px] uppercase">Pending</Badge>
        case "Rejected":
            return <Badge className="bg-red-500/10 text-red-600 hover:bg-red-500/20 border-red-200/50 shadow-none font-semibold text-[10px] uppercase">Rejected</Badge>
        default:
            return <Badge className="bg-muted text-muted-foreground shadow-none font-semibold text-[10px] uppercase">{status}</Badge>
    }
}

export default async function SubmissionsDashboard({
    searchParams,
}: {
    // 1. UPDATE: searchParams is a Promise in Next.js 15
    searchParams: Promise<{ courseId?: string; programId?: string; search?: string }>
}) {
    // 2. UPDATE: Await the searchParams
    const resolvedSearchParams = await searchParams;

    // 3. UPDATE: Clean out undefined values to prevent "undefined=undefined" in the URL
    const validParams = Object.entries(resolvedSearchParams).reduce((acc, [key, value]) => {
        if (value) acc[key] = value;
        return acc;
    }, {} as Record<string, string>);

    const searchParamsString = new URLSearchParams(validParams).toString()
    const queryString = searchParamsString ? `?${searchParamsString}` : ""
    
    const whereClause: Prisma.SubmissionWhereInput = {
        status: { not: "Draft" },
        activity: {
            ...(resolvedSearchParams.courseId ? { courseId: resolvedSearchParams.courseId } : {}),
            ...(resolvedSearchParams.programId ? { programId: resolvedSearchParams.programId } : {}),
            ...(resolvedSearchParams.search ? { title: { contains: resolvedSearchParams.search, mode: "insensitive" } } : {}),
        }
    }

    const [submissions, courses, programs] = await Promise.all([
        prisma.submission.findMany({
            where: whereClause,
            include: {
                user: true,
                hive: true,
                activity: {
                    select: { title: true, type: true, course: { select: { title: true } }, program: { select: { title: true } } }
                }
            },
            orderBy: { submittedAt: 'desc' }
        }),
        prisma.course.findMany({ select: { id: true, title: true }, orderBy: { title: 'asc' } }),
        prisma.program.findMany({ select: { id: true, title: true }, orderBy: { title: 'asc' } })
    ])

    const pendingCount = submissions.filter(s => s.status === "Submitted").length
    const reviewCount = submissions.filter(s => s.status === "Under_Review").length
    const approvedCount = submissions.filter(s => s.status === "Approved").length

    return (
        <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 space-y-8">

            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold tracking-tight">Triage Dashboard</h1>
                <p className="text-sm text-muted-foreground">Manage and review learner submissions across all your courses.</p>
            </div>

            {/* COMPACT STATS CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="p-4 flex items-center justify-between border-blue-100 dark:border-blue-900/30 bg-blue-50/30 dark:bg-blue-900/10 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-600"><Clock className="size-5" /></div>
                        <div>
                            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Awaiting Review</p>
                            <p className="text-2xl font-bold leading-none mt-1">{pendingCount}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-yellow-500/10 rounded-xl text-yellow-600"><Users className="size-5" /></div>
                        <div>
                            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">In Progress</p>
                            <p className="text-2xl font-bold leading-none mt-1">{reviewCount}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-green-500/10 rounded-xl text-green-600"><CheckCircle2 className="size-5" /></div>
                        <div>
                            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Approved</p>
                            <p className="text-2xl font-bold leading-none mt-1">{approvedCount}</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* FILTER BAR */}
            <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md pb-2 pt-1 border-b border-border mb-6">
                <SubmissionsFilterBar courses={courses} programs={programs} />
            </div>

            {/* HIGH DENSITY SUBMISSIONS LIST */}
            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                <div className="hidden md:grid grid-cols-[2fr_3fr_1fr_auto] gap-4 p-3 px-5 bg-muted/40 border-b border-border text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    <div>Submitter</div>
                    <div>Artifact Details</div>
                    <div>Status</div>
                    <div className="text-right">Action</div>
                </div>

                <div className="divide-y divide-border">
                    {submissions.length === 0 ? (
                        <div className="p-12 text-center flex flex-col items-center">
                            <div className="size-12 rounded-full bg-muted flex items-center justify-center mb-3">
                                <Search className="size-5 text-muted-foreground" />
                            </div>
                            <h3 className="font-semibold text-foreground">No submissions found</h3>
                            <p className="text-sm text-muted-foreground mt-1">Adjust your filters or check back later.</p>
                        </div>
                    ) : (
                        submissions.map((sub) => {
                            const entityName = sub.user?.name || sub.hive?.name || "Unknown"
                            const isHive = !!sub.hiveId
                            const contextLabel = sub.activity.program?.title || sub.activity.course?.title || "Standalone"

                            return (
                                <div key={sub.id} className="grid grid-cols-1 md:grid-cols-[2fr_3fr_1fr_auto] gap-4 p-4 px-5 items-center hover:bg-muted/30 transition-colors group">
                                    
                                    {/* Submitter */}
                                    <div className="flex items-center gap-3 min-w-0">
                                        <Avatar className="size-9 shadow-sm border border-border/50">
                                            <AvatarImage src={sub.user?.image || ""} />
                                            <AvatarFallback className="text-xs bg-muted text-foreground">{entityName[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0">
                                            <p className="font-semibold text-sm text-foreground truncate">{entityName}</p>
                                            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">{isHive ? "Hive" : "Learner"}</p>
                                        </div>
                                    </div>

                                    {/* Artifact Details */}
                                    <div className="min-w-0 flex flex-col gap-1">
                                        <p className="font-medium text-sm text-foreground truncate pr-4">{sub.activity.title}</p>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <span className="truncate max-w-[140px]">{contextLabel}</span>
                                            <span className="text-border">•</span>
                                            <span className="truncate">{sub.activity.type.replace(/_/g, " ")}</span>
                                        </div>
                                    </div>

                                    {/* Status */}
                                    <div>
                                        {getStatusBadge(sub.status)}
                                    </div>

                                    {/* Action */}
                                    <div className="flex items-center justify-between md:justify-end gap-5">
                                        <p className="text-[11px] text-muted-foreground whitespace-nowrap hidden lg:block font-medium">
                                            {sub.submittedAt ? `${formatDistanceToNow(new Date(sub.submittedAt))} ago` : ""}
                                        </p>
                                        
                                        <Link href={`/admin/activities/submissions/${sub.id}${queryString}`}>
                                            <Button 
                                                size="sm" 
                                                variant={sub.status === "Submitted" ? "default" : "secondary"} 
                                                className={`h-8 px-4 text-xs font-semibold rounded-full transition-all ${sub.status === "Submitted" ? 'shadow-sm' : 'opacity-80 hover:opacity-100'}`}
                                            >
                                                {sub.status === "Submitted" ? "Grade Now" : "View"}
                                                {sub.status !== "Submitted" && <ArrowRight className="size-3 ml-1.5 opacity-50 transition-transform group-hover:translate-x-0.5" />}
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            </div>
        </div>
    )
}