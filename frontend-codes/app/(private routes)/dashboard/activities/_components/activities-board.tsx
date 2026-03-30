"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Search, Clock, Target, CheckCircle2, 
  AlertCircle, ArrowRight, Flame, FileText, 
  Users, Briefcase, LayoutGrid, Zap, SlidersHorizontal
} from "lucide-react"
import Link from "next/link"

export type ActivityStatus = "Pending" | "Submitted" | "Under_Review" | "Revision_Required" | "Approved" | "Rejected" | string;

export interface ActivityItem {
  id: string;
  title: string;
  type: string; 
  difficulty: string; 
  points: number;
  deadline: Date | null;
  status: ActivityStatus;
  ksbs: { title: string; type: string }[];
}

export function ActivitiesBoard({ initialActivities }: { initialActivities: ActivityItem[] }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeStatus, setActiveStatus] = useState<string>("Action_Needed")
  // 🚨 RESTORED: KSB Filter State
  const [activeKsb, setActiveKsb] = useState<string>("All")

  const filteredActivities = useMemo(() => {
    return initialActivities
      .filter((act) => {
        // 1. Search Filter
        if (searchQuery && !act.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        
        // 2. Status Filter
        if (activeStatus !== "All") {
          if (activeStatus === "Completed" && act.status !== "Approved") return false;
          if (activeStatus === "Action_Needed" && !["Pending", "Revision_Required", "Rejected"].includes(act.status)) return false;
          if (activeStatus === "In_Review" && !["Submitted", "Under_Review"].includes(act.status)) return false; 
        }

        // 3. 🚨 RESTORED: KSB Filter Logic
        if (activeKsb !== "All" && !act.ksbs.some(k => k.type === activeKsb)) return false;
        
        return true;
      })
      .sort((a, b) => {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      });
  }, [initialActivities, searchQuery, activeStatus, activeKsb]);

  const getStatusConfig = (status: ActivityStatus) => {
    switch(status) {
      case "Approved": return { color: "text-green-600 bg-green-500/10 border-green-500/20", label: "APPROVED" }
      case "Revision_Required": return { color: "text-orange bg-orange/10 border-orange/20", label: "REVISION NEEDED" }
      case "Rejected": return { color: "text-red-600 bg-red-500/10 border-red-500/20", label: "REJECTED" }
      case "Submitted": 
      case "Under_Review": return { color: "text-blue-500 bg-blue-500/10 border-blue-500/20", label: "IN REVIEW" }
      default: return { color: "text-muted-foreground bg-muted border-border/50", label: "PENDING" }
    }
  }

  const getTypeIcon = (type: string) => {
    if (type.includes("Peer")) return Users;
    if (type.includes("Capstone")) return Briefcase;
    if (type.includes("Project")) return FileText;
    return LayoutGrid;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-700">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Mission Board</h1>
          <p className="text-muted-foreground text-sm max-w-xl">
            Manage and track your assigned projects, peer reviews, and capstones.
          </p>
        </div>
      </div>

      {/* FILTER PANEL */}
      <div className="bg-card/40 backdrop-blur-xl border border-border/50 rounded-[2rem] p-4 sm:p-6 shadow-sm space-y-6">
        
        {/* Search */}
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground/50" />
          <Input 
            placeholder="Search activity title..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 h-12 bg-background/50 border-border/50 rounded-xl focus-visible:ring-orange/50 text-base shadow-sm"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-12 pt-2 border-t border-border/30">
          {/* Status Filters */}
          <div className="space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
              <SlidersHorizontal className="size-3" /> Status
            </span>
            <div className="flex flex-wrap gap-2">
              {["Action_Needed", "In_Review", "Completed", "All"].map((status) => (
                <Badge 
                  key={status} 
                  variant="outline" 
                  className={`cursor-pointer px-4 py-1.5 text-xs font-medium rounded-full transition-all border-none ${
                    activeStatus === status ? "bg-foreground text-background" : "bg-muted/50 text-muted-foreground hover:bg-muted"
                  }`}
                  onClick={() => setActiveStatus(status)}
                >
                  {status.replace("_", " ")}
                </Badge>
              ))}
            </div>
          </div>

          {/* 🚨 RESTORED: Target Competency Filters */}
          <div className="space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
              <Zap className="size-3" /> Target Competency
            </span>
            <div className="flex flex-wrap gap-2">
              {["All", "Knowledge", "Skill", "Behavior"].map((ksb) => (
                <Badge 
                  key={ksb} 
                  variant="outline" 
                  className={`cursor-pointer px-4 py-1.5 text-xs font-medium rounded-full transition-all border-none ${
                    activeKsb === ksb ? "bg-orange text-white" : "bg-muted/50 text-muted-foreground hover:bg-muted"
                  }`}
                  onClick={() => setActiveKsb(ksb)}
                >
                  {ksb}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MINIMAL LIST VIEW */}
      <div className="border border-border/50 rounded-2xl bg-card shadow-sm overflow-hidden">
        
        <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-border/50 bg-muted/20 text-xs font-bold text-muted-foreground uppercase tracking-wider">
          <div className="col-span-1 pl-2">Type</div>
          <div className="col-span-5">Activity Details</div>
          <div className="col-span-2 text-center">Reward</div>
          <div className="col-span-2 text-center">Status</div>
          <div className="col-span-2 text-right pr-4">Action</div>
        </div>

        {filteredActivities.length === 0 ? (
          <div className="text-center p-12">
            <Target className="size-10 text-muted-foreground/30 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-foreground">No activities found</h3>
            <p className="text-xs text-muted-foreground mt-1">Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {filteredActivities.map((activity) => {
              const statusConf = getStatusConfig(activity.status);
              const TypeIcon = getTypeIcon(activity.type);
              
              let timeString = "No deadline";
              if (activity.deadline) {
                const isPast = new Date(activity.deadline).getTime() < Date.now();
                timeString = `${isPast ? "Due" : "Due"} ${new Date(activity.deadline).toLocaleDateString()}`;
              }

              return (
                <div key={activity.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 items-center hover:bg-muted/30 transition-colors">
                  
                  <div className="col-span-1 hidden md:flex justify-center">
                    <div className="size-10 rounded-full bg-muted border border-border/50 flex items-center justify-center text-muted-foreground">
                      <TypeIcon className="size-4" />
                    </div>
                  </div>

                  <div className="col-span-12 md:col-span-5 flex flex-col">
                    <span className="font-semibold text-foreground text-sm line-clamp-1">{activity.title}</span>
                    <span className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
                      {activity.type.replace(/_/g, " ")} 
                      <span className="size-1 rounded-full bg-border" /> 
                      {activity.difficulty}
                    </span>
                  </div>

                  <div className="col-span-6 md:col-span-2 flex flex-col items-start md:items-center">
                    <span className="text-xs font-medium flex items-center gap-1 text-orange">
                      <Flame className="size-3" fill="currentColor" /> {activity.points} pts
                    </span>
                    <span className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                      <Clock className="size-3" /> {timeString}
                    </span>
                  </div>

                  <div className="col-span-6 md:col-span-2 flex justify-end md:justify-center items-center">
                    <Badge variant="outline" className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border-none ${statusConf.color}`}>
                      {statusConf.label}
                    </Badge>
                  </div>

                  <div className="col-span-12 md:col-span-2 flex justify-end mt-4 md:mt-0">
                    <Button asChild variant="secondary" className="rounded-full h-9 px-5 bg-muted/50 hover:bg-muted text-xs font-semibold text-foreground">
                      <Link href={`/dashboard/activities/${activity.id}`}>
                        View <ArrowRight className="ml-1.5 size-3" />
                      </Link>
                    </Button>
                  </div>

                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}