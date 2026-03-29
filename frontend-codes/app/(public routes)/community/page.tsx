"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  Zap, MessageSquare, Video, CalendarPlus, 
  Gamepad2, Users, Coffee, ImageIcon, Send, Settings, Hash, Bookmark
} from "lucide-react"
import Link from "next/link"

import PostComposerModal from "./_components/PostComposerModal"

export default function CommunityPage() {
  const [openComposer, setOpenComposer] = useState(false)

  return (
    <div className="space-y-6">

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

        {/* ================= LEFT COLUMN (Identity & Management) ================= */}
        <div className="md:col-span-4 lg:col-span-3 space-y-4">

          {/* Identity Card */}
          <Card className="rounded-xl border-border shadow-sm overflow-hidden">
            <div className="h-16 bg-muted border-b border-border" />
            <CardContent className="p-4 pt-0 relative flex flex-col items-center text-center">
              <Avatar className="size-16 border-4 border-card -mt-8 mb-2">
                <AvatarImage src="/ai.png" />
                <AvatarFallback>KO</AvatarFallback>
              </Avatar>
              <h3 className="font-semibold text-foreground leading-tight">Kenneth O.</h3>
              <p className="text-xs text-muted-foreground mt-1">Data Engineer</p>
              
              <div className="w-full flex justify-between text-xs py-3 mt-4 border-t border-border">
                <span className="text-muted-foreground font-medium">Profile viewers</span>
                <span className="font-semibold text-blue-500">42</span>
              </div>
              <div className="w-full flex justify-between text-xs pb-1">
                <span className="text-muted-foreground font-medium">Post impressions</span>
                <span className="font-semibold text-blue-500">128</span>
              </div>
            </CardContent>
            <CardFooter className="p-3 border-t border-border bg-muted/10">
              <Link href="/community/saved" className="flex items-center gap-2 text-xs font-semibold text-foreground hover:text-orange transition-colors w-full">
                <Bookmark className="size-4 text-muted-foreground" /> Saved items
              </Link>
            </CardFooter>
          </Card>

          {/* Squads Management */}
          <Card className="rounded-xl border-border shadow-sm">
            <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold text-foreground">Your Squads</CardTitle>
              <Button variant="ghost" size="icon" className="size-6 text-muted-foreground hover:text-foreground rounded-full">
                <Settings className="size-3.5" />
              </Button>
            </CardHeader>
            <CardContent className="p-2 pt-0 space-y-1">
              <Link href="/community/groups/1" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors group">
                <div className="size-6 rounded bg-orange/10 text-orange flex items-center justify-center font-bold text-xs">DE</div>
                <span className="text-sm font-medium text-foreground group-hover:text-orange transition-colors">Data Eng Guild</span>
              </Link>
              <Link href="/community/groups/2" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors group">
                <div className="size-6 rounded bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold text-xs">BI</div>
                <span className="text-sm font-medium text-foreground group-hover:text-blue-500 transition-colors">BI Analysts Cohort</span>
              </Link>
              <Button asChild variant="ghost" className="w-full mt-2 text-xs font-semibold text-muted-foreground justify-center h-8">
                <Link href="/community/groups">Discover more</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* ================= CENTER COLUMN (Creation & Feed) ================= */}
        <div className="md:col-span-8 lg:col-span-6 space-y-4">

          {/* The Post Composer Trigger */}
          <Card className="rounded-xl border-border shadow-sm">
            <CardContent className="p-4 sm:p-5">
              <div className="flex gap-3 mb-3">
                <Avatar className="size-12">
                  <AvatarImage src="/ai.png" />
                  <AvatarFallback>KO</AvatarFallback>
                </Avatar>
                <button
                  onClick={() => setOpenComposer(true)}
                  className="flex-1 text-left px-5 h-12 rounded-full border border-border/60 bg-muted/20 hover:bg-muted/50 transition-colors text-sm text-muted-foreground font-medium"
                >
                  Start a post, ask a question, or share an artifact...
                </button>
              </div>
              <div className="flex justify-between items-center px-1 sm:px-2 pt-1">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg" onClick={() => setOpenComposer(true)}>
                  <ImageIcon className="mr-2 size-4 text-blue-500" /> Media
                </Button>
                <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg">
                  <Link href="/community/events/create">
                    <CalendarPlus className="mr-2 size-4 text-orange" /> Event
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" className="hidden sm:flex text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg">
                  <Video className="mr-2 size-4 text-green-500" /> Voice Room
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center gap-2 px-1 py-1">
            <Separator className="flex-1" />
            <span className="text-xs font-semibold text-muted-foreground">Sort by: <span className="text-foreground">Top</span></span>
          </div>

          {/* Feed Post with Media Example */}
          <Card className="rounded-xl border-border shadow-sm overflow-hidden">
            <CardHeader className="p-4 pb-2 flex flex-row items-start gap-3">
              <Avatar className="size-10">
                <AvatarImage src="https://i.pravatar.cc/100?img=10" />
                <AvatarFallback>SJ</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground leading-none hover:underline cursor-pointer">Sarah Jenkins</p>
                <p className="text-xs text-muted-foreground mt-1">Data Scientist • 2h</p>
              </div>
              <Button variant="ghost" size="icon" className="size-8 text-muted-foreground -mt-1 rounded-full">
                <Settings className="size-4" />
              </Button>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-3">
              <p className="text-sm text-foreground leading-relaxed">
                Just wrapped up my final capstone! I built a random forest classifier to predict patient readmission rates. Handled a ton of nulls in the clinical dataset using a custom imputation pipeline. 
              </p>
              
              {/* Attached Media / Artifact */}
              <div className="rounded-lg border border-border bg-muted/20 aspect-video relative overflow-hidden flex items-center justify-center">
                 <span className="text-muted-foreground text-sm font-medium">Attached Dashboard Image</span>
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-1.5">
                  <div className="size-5 rounded-full bg-orange/20 flex items-center justify-center"><Zap className="size-3 text-orange fill-orange" /></div>
                  <span className="text-xs text-muted-foreground hover:text-orange cursor-pointer">24</span>
                </div>
                <span className="text-xs text-muted-foreground hover:text-blue-500 cursor-pointer">5 comments</span>
              </div>
            </CardContent>
            <CardFooter className="p-2 border-t border-border flex gap-1">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground font-semibold rounded-lg flex-1">
                <Zap className="size-4 mr-2" /> Endorse
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground font-semibold rounded-lg flex-1">
                <MessageSquare className="size-4 mr-2" /> Comment
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground font-semibold rounded-lg flex-1">
                <Send className="size-4 mr-2" /> Share
              </Button>
            </CardFooter>
          </Card>

        </div>

        {/* ================= RIGHT COLUMN (Discovery & Live Action) ================= */}
        <div className="hidden lg:block lg:col-span-3 space-y-4">

          {/* Live Action */}
          <Card className="rounded-xl border-border shadow-sm">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <span className="relative flex size-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full size-2 bg-green-500"></span>
                </span>
                Live Voice Rooms
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-2 space-y-3">
              <div className="p-3 rounded-xl border border-border bg-muted/20 hover:bg-muted/50 transition-colors cursor-pointer group">
                <h4 className="text-sm font-semibold text-foreground group-hover:text-green-600 transition-colors mb-2">Silent Pomodoro Focus</h4>
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-1.5">
                    <Avatar className="size-6 border-2 border-card"><AvatarFallback className="text-[10px]">S</AvatarFallback></Avatar>
                    <Avatar className="size-6 border-2 border-card"><AvatarFallback className="text-[10px]">K</AvatarFallback></Avatar>
                    <div className="size-6 rounded-full border-2 border-card bg-muted flex items-center justify-center text-[10px] font-bold">+8</div>
                  </div>
                  <span className="text-[10px] font-semibold text-green-600 bg-green-500/10 px-2 py-0.5 rounded-full">25m left</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* The Lounge */}
          <Card className="rounded-xl border-border shadow-sm">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Coffee className="size-4 text-orange" /> The Lounge
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-2 space-y-3">
              <div className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-lg bg-orange/10 flex items-center justify-center text-orange group-hover:scale-105 transition-transform">
                    <Gamepad2 className="size-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">Daily Sudoku</h4>
                  </div>
                </div>
                <Button size="sm" variant="secondary" className="h-7 text-xs rounded-full">Play</Button>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>

      <PostComposerModal open={openComposer} onOpenChange={setOpenComposer} />
    </div>
  )
}