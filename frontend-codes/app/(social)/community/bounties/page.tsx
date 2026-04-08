"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Search, Filter, Clock, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function BountiesPage() {
  const [activeTab, setActiveTab] = useState("open")

  return (
    <div className="h-[calc(100vh-4rem)] overflow-hidden flex flex-col md:flex-row gap-6">
      
      {/* ================= LEFT COLUMN (Filters & Stats) ================= */}
      <div className="w-full md:w-64 lg:w-80 shrink-0 h-full hidden md:flex flex-col gap-4">
        
        {/* User Bounty Stats */}
        <Card className="rounded-xl border-border shadow-sm bg-muted/10">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="size-10 rounded-full bg-yellow/20 flex items-center justify-center">
                <Trophy className="size-5 text-yellow fill-yellow" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Your Escrow</p>
                <p className="text-2xl font-black text-foreground">1,250 <span className="text-xs font-semibold text-muted-foreground uppercase">Rep</span></p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-background rounded-lg border border-border p-2">
                <p className="text-xl font-black text-blue-500">3</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Won</p>
              </div>
              <div className="bg-background rounded-lg border border-border p-2">
                <p className="text-xl font-black text-orange">1</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Pending</p>
              </div>
            </div>
            <Button className="w-full mt-4 font-bold bg-foreground text-background hover:bg-foreground/90 rounded-xl">
              Post a Bounty
            </Button>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="rounded-xl border-border shadow-sm flex-1 overflow-hidden flex flex-col">
          <CardHeader className="p-4 pb-2 border-b border-border">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Filter className="size-4" /> Filter by Skill (KSBs)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4 overflow-y-auto scrollbar-thin">
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="rounded border-border text-orange focus:ring-orange" defaultChecked />
                <span className="text-sm font-medium text-foreground group-hover:text-orange transition-colors">Python / Django</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="rounded border-border text-orange focus:ring-orange" defaultChecked />
                <span className="text-sm font-medium text-foreground group-hover:text-orange transition-colors">Data Engineering</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="rounded border-border text-orange focus:ring-orange" />
                <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">React / Next.js</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="rounded border-border text-orange focus:ring-orange" />
                <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">Cloud Architecture</span>
              </label>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ================= MAIN COLUMN (The Bounty Board) ================= */}
      <div className="flex-1 h-full flex flex-col overflow-hidden">
        
        {/* Top Search Bar */}
        <div className="relative mb-6 shrink-0">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
          <Input 
            placeholder="Search open bounties by keyword or error message..." 
            className="pl-12 h-14 bg-card border-border rounded-xl shadow-sm text-base focus-visible:ring-1 focus-visible:ring-orange/50"
          />
        </div>

        <Tabs defaultValue="open" className="flex-1 flex flex-col" onValueChange={setActiveTab}>
          <TabsList className="bg-transparent border-b border-border w-full justify-start rounded-none h-12 p-0 gap-6 shrink-0">
            <TabsTrigger value="open" className="data-[state=active]:border-b-2 data-[state=active]:border-foreground data-[state=active]:shadow-none rounded-none bg-transparent px-0 font-semibold h-full flex items-center gap-2">
              Open Market <Badge className="bg-orange/10 text-orange border-none ml-1">24</Badge>
            </TabsTrigger>
            <TabsTrigger value="inprogress" className="data-[state=active]:border-b-2 data-[state=active]:border-foreground data-[state=active]:shadow-none rounded-none bg-transparent px-0 font-semibold h-full text-muted-foreground">
              In Progress
            </TabsTrigger>
            <TabsTrigger value="completed" className="data-[state=active]:border-b-2 data-[state=active]:border-foreground data-[state=active]:shadow-none rounded-none bg-transparent px-0 font-semibold h-full text-muted-foreground">
              Resolved
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-muted pt-6 pb-20 md:pr-4 space-y-4">
            
            {/* BOUNTY CARD 1: High Value */}
            <Card className="rounded-xl border-orange/30 shadow-sm hover:border-orange/50 transition-colors cursor-pointer group bg-gradient-to-r from-orange/5 to-transparent">
              <CardContent className="p-5">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="bg-background border-border text-xs font-semibold text-muted-foreground">
                        Backend Architecture
                      </Badge>
                      <span className="flex items-center text-[10px] font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full">
                        <AlertCircle className="size-3 mr-1" /> URGENT
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-foreground group-hover:text-orange transition-colors">
                      Need help debugging a Prisma memory leak in production serverless environment
                    </h3>
                    
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {"I have an endpoint that queries a massive relation graph. In local development it's fine, but on Vercel edge it's hitting the 50MB memory limit and throwing 502s. Tried pagination but it didn't solve the core spike."}
                    </p>

                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center gap-2">
                        <Avatar className="size-6 border border-border"><AvatarImage src="https://i.pravatar.cc/100?img=3" /></Avatar>
                        <span className="text-xs font-semibold text-foreground">David O.</span>
                      </div>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="size-3" /> Posted 1h ago
                      </span>
                    </div>
                  </div>

                  {/* Escrow Value Column */}
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-4 md:gap-2 shrink-0 border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-4">
                    <div className="text-left md:text-right">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Bounty Escrow</p>
                      <div className="flex items-center gap-1.5 justify-start md:justify-end mt-1">
                        <Trophy className="size-5 text-yellow fill-yellow" />
                        <span className="text-2xl font-black text-foreground">500</span>
                      </div>
                    </div>
                    <Button className="font-bold bg-foreground text-background hover:bg-foreground/90 rounded-full h-8 px-6">
                      Claim
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* BOUNTY CARD 2: Standard Value */}
            <Card className="rounded-xl border-border shadow-sm hover:border-foreground/20 transition-colors cursor-pointer group">
              <CardContent className="p-5">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="bg-background border-border text-xs font-semibold text-muted-foreground">
                        Data Engineering
                      </Badge>
                      <Badge variant="outline" className="bg-background border-border text-xs font-semibold text-muted-foreground">
                        Airflow
                      </Badge>
                    </div>
                    
                    <h3 className="text-lg font-bold text-foreground group-hover:text-blue-500 transition-colors">
                      DAG failing silently on task retry. Looking for an Airflow expert to review my config.
                    </h3>
                    
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {"My daily ETL pipeline randomly stops processing. The logs don't show a direct failure, it just hangs on the Postgres ingestion node. Willing to jump on a quick 15-minute voice room to screen share."}
                    </p>

                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center gap-2">
                        <Avatar className="size-6 border border-border"><AvatarImage src="https://i.pravatar.cc/100?img=8" /></Avatar>
                        <span className="text-xs font-semibold text-foreground">Amina Y.</span>
                      </div>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="size-3" /> Posted 4h ago
                      </span>
                    </div>
                  </div>

                  {/* Escrow Value Column */}
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-4 md:gap-2 shrink-0 border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-4">
                    <div className="text-left md:text-right">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Bounty Escrow</p>
                      <div className="flex items-center gap-1.5 justify-start md:justify-end mt-1">
                        <Trophy className="size-4 text-yellow fill-yellow opacity-80" />
                        <span className="text-xl font-black text-foreground">150</span>
                      </div>
                    </div>
                    <Button variant="outline" className="font-bold border-border rounded-full h-8 px-6 group-hover:bg-muted">
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </Tabs>
      </div>
    </div>
  )
}