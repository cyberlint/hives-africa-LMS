"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
    Users, CalendarPlus, Trophy, ArrowRight,
    MessageSquare, Zap, Search, Plus, Video,
    Headphones, Gamepad2, BrainCircuit, Coffee
} from "lucide-react"
import Link from "next/link"

export default function HiveCommunity() {
    const [searchQuery, setSearchQuery] = useState("")

    return (
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* 1. THE GREETING & SEARCH */}
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between bg-card/20 border border-border/50 rounded-[2rem] p-6 sm:p-8 backdrop-blur-md relative overflow-hidden">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

                <div className="space-y-2 relative z-10 w-full lg:w-auto">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                        </span>
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">142 Builders Online</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">The Hive</h1>
                    <p className="text-base text-muted-foreground max-w-lg">
                        Jump into a study room, host an event, or take a quick brain break. What are we doing today?
                    </p>
                </div>

                <div className="relative w-full lg:max-w-md z-10">
                    <div className="relative flex items-center">
                        <Search className="absolute left-4 size-5 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search people, rooms, or events..."
                            className="pl-12 pr-4 py-6 bg-background/50 border-border/50 rounded-full w-full focus-visible:ring-orange/30 text-base"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* 2. EMPOWERMENT ROW (Quick Actions) */}
            <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
                <Button variant="outline" className="rounded-full h-12 px-6 bg-card/40 backdrop-blur-sm border-border/50 hover:bg-orange/10 hover:text-orange hover:border-orange/30 transition-all font-medium text-foreground shrink-0 shadow-sm">
                    <Headphones className="mr-2 size-4" /> Start a Voice Room
                </Button>
                <Button asChild variant="outline" className="rounded-full h-12 px-6 bg-card/40 backdrop-blur-sm border-border/50 hover:bg-orange/10 hover:text-orange hover:border-orange/30 transition-all font-medium text-foreground shrink-0 shadow-sm">
                    <Link href="/community/events">
                        <CalendarPlus className="mr-2 size-4" /> Discover Events
                    </Link>
                </Button>

                <Button asChild variant="outline" className="rounded-full h-12 px-6 bg-card/40 backdrop-blur-sm border-border/50 hover:bg-orange/10 hover:text-orange hover:border-orange/30 transition-all font-medium text-foreground shrink-0 shadow-sm">
                    <Link href="/community/games">
                        <Gamepad2 className="mr-2 size-4" /> Play Daily Sudoku
                    </Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full h-12 px-6 bg-card/40 backdrop-blur-sm border-border/50 hover:bg-orange/10 hover:text-orange hover:border-orange/30 transition-all font-medium text-foreground shrink-0 shadow-sm">
                    <Link href="/community/network">
                        <Users className="mr-2 size-4" /> Find a Study Partner
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* LEFT COLUMN: Live Action & Artifacts (Span 8) */}
                <div className="lg:col-span-8 space-y-10">

                    {/* LIVE COLLABORATION ROOMS */}
                    <div className="space-y-5">
                        <h2 className="text-xl font-semibold text-foreground tracking-tight flex items-center gap-2">
                            <Video className="size-5 text-green-500" /> Live Co-Working Spaces
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                            {/* Room 1 */}
                            <div className="group p-5 rounded-[2rem] border border-green-500/20 bg-green-500/5 hover:bg-green-500/10 transition-all duration-300 backdrop-blur-sm cursor-pointer relative overflow-hidden">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <Badge variant="outline" className="bg-background/50 border-green-500/30 text-green-600 mb-2 font-semibold text-[10px] uppercase tracking-wider">Voice Room</Badge>
                                        <h3 className="font-semibold text-foreground">Silent Pomodoro Focus</h3>
                                    </div>
                                    <div className="flex -space-x-2">
                                        <Avatar className="size-8 border-2 border-background"><AvatarImage src="/ai.png" /><AvatarFallback>S</AvatarFallback></Avatar>
                                        <Avatar className="size-8 border-2 border-background"><AvatarFallback className="bg-orange/20 text-orange">K</AvatarFallback></Avatar>
                                        <Avatar className="size-8 border-2 border-background"><AvatarFallback className="bg-blue-500/20 text-blue-500">D</AvatarFallback></Avatar>
                                        <div className="size-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-bold">+8</div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-medium text-muted-foreground">Currently on a 25m focus block...</p>
                                    <Button size="sm" className="rounded-full bg-green-600 hover:bg-green-700 text-white font-semibold">Join</Button>
                                </div>
                            </div>

                            {/* Room 2 */}
                            <div className="group p-5 rounded-[2rem] border border-border/50 bg-card/30 hover:bg-card/60 transition-all duration-300 backdrop-blur-sm cursor-pointer">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <Badge variant="outline" className="bg-background/50 border-border/50 text-muted-foreground mb-2 font-semibold text-[10px] uppercase tracking-wider">Screen Share</Badge>
                                        <h3 className="font-semibold text-foreground">Debugging React Hooks</h3>
                                    </div>
                                    <div className="flex -space-x-2">
                                        <Avatar className="size-8 border-2 border-background"><AvatarFallback className="bg-purple-500/20 text-purple-500">M</AvatarFallback></Avatar>
                                        <Avatar className="size-8 border-2 border-background"><AvatarImage src="/ai.png" /><AvatarFallback>T</AvatarFallback></Avatar>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-medium text-muted-foreground">Marcus is sharing his screen.</p>
                                    <Button size="sm" variant="secondary" className="rounded-full font-semibold">Join</Button>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* COMMUNITY FEED (Artifacts & Discussions) */}
                    <div className="space-y-5">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-foreground tracking-tight flex items-center gap-2">
                                <MessageSquare className="size-5 text-orange" /> Community Feed
                            </h2>
                        </div>

                        <div className="space-y-6">
                            {/* Artifact Post */}
                            <div className="group p-6 rounded-[2rem] border border-border/40 bg-card/30 hover:bg-card/60 transition-all duration-300 backdrop-blur-sm shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="size-10 border border-border/50">
                                            <AvatarImage src="/ai.png" />
                                            <AvatarFallback>SJ</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-semibold text-foreground">Sarah Jenkins</p>
                                            <p className="text-xs text-muted-foreground">Shared a completed Capstone Project • 2 hrs ago</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <h3 className="text-lg font-medium text-foreground mb-2 group-hover:text-orange transition-colors cursor-pointer">
                                        Healthcare Predictive Model Pipeline
                                    </h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        Just wrapped up my final capstone! Would love some feedback on how I handled the null values in the clinical dataset. Anyone free to jump into a voice room later to review the code together?
                                    </p>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-border/40">
                                    <div className="flex items-center gap-6">
                                        <button className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-orange transition-colors">
                                            <Zap className="size-4" /> 24
                                        </button>
                                        <button className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-blue-500 transition-colors">
                                            <MessageSquare className="size-4" /> 5 Comments
                                        </button>
                                    </div>
                                    <Button variant="outline" className="rounded-full text-xs font-medium border-border/50 h-8">
                                        View Project
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* RIGHT COLUMN: The Lounge & Events (Span 4) */}
                <div className="lg:col-span-4 space-y-8">

                    {/* THE LOUNGE (Games & Brain Breaks) */}
                    <Card className="rounded-[2rem] border-border/50 shadow-sm bg-card/40 backdrop-blur-sm overflow-hidden relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange/10 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
                        <CardHeader className="pb-2 relative z-10 border-b border-border/40 bg-card/50">
                            <CardTitle className="text-lg font-semibold flex items-center gap-2 text-foreground">
                                <Coffee className="size-5 text-orange" /> The Lounge
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-5 relative z-10 space-y-4">
                            <p className="text-xs font-medium text-muted-foreground leading-relaxed">
                                Take a breather. Give your brain a break before your next deep-work session.
                            </p>

                            {/* Sudoku Module */}
                            <div className="p-4 rounded-[1.5rem] bg-background/60 border border-border/50 flex items-center justify-between hover:border-orange/30 transition-colors cursor-pointer group/game">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-xl bg-orange/10 flex items-center justify-center text-orange group-hover/game:scale-110 transition-transform">
                                        <Gamepad2 className="size-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-foreground">Daily Sudoku</h4>
                                        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mt-0.5">Medium Difficulty</p>
                                    </div>
                                </div>
                                <Button size="sm" variant="secondary" className="rounded-full text-xs font-semibold">Play</Button>
                            </div>

                            {/* Logic Puzzle Module */}
                            <div className="p-4 rounded-[1.5rem] bg-background/60 border border-border/50 flex items-center justify-between hover:border-blue-500/30 transition-colors cursor-pointer group/game">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover/game:scale-110 transition-transform">
                                        <BrainCircuit className="size-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-foreground">Logic Riddle</h4>
                                        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mt-0.5">New Daily</p>
                                    </div>
                                </div>
                                <Button size="sm" variant="secondary" className="rounded-full text-xs font-semibold">Solve</Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* COMMUNITY EVENTS (User Generated) */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-1">
                            <h3 className="text-lg font-semibold text-foreground tracking-tight flex items-center gap-2">
                                <CalendarPlus className="size-5 text-muted-foreground" /> Upcoming Events
                            </h3>
                            <Button variant="ghost" size="icon" className="size-8 rounded-full text-muted-foreground hover:text-foreground">
                                <Plus className="size-4" />
                            </Button>
                        </div>

                        <div className="space-y-3">
                            {/* Event 1 */}
                            <div className="group p-4 rounded-[1.5rem] border border-border/40 bg-card/30 hover:bg-card/80 transition-all backdrop-blur-sm cursor-pointer shadow-sm">
                                <div className="flex gap-4">
                                    <div className="flex flex-col items-center justify-center w-14 h-16 rounded-[1rem] bg-orange/10 text-orange shrink-0 border border-orange/20">
                                        <span className="text-[10px] font-bold uppercase tracking-wider">Mar</span>
                                        <span className="text-xl font-black leading-none mt-0.5">28</span>
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Hosted by Kenneth O.</p>
                                        <h4 className="text-sm font-semibold text-foreground leading-snug group-hover:text-orange transition-colors">72h BI Dashboard Sprint</h4>
                                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5 font-medium">
                                            <Video className="size-3" /> Voice Room • 12 attending
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Event 2 */}
                            <div className="group p-4 rounded-[1.5rem] border border-border/40 bg-card/30 hover:bg-card/80 transition-all backdrop-blur-sm cursor-pointer shadow-sm">
                                <div className="flex gap-4">
                                    <div className="flex flex-col items-center justify-center w-14 h-16 rounded-[1rem] bg-muted/50 text-muted-foreground shrink-0 border border-border/50">
                                        <span className="text-[10px] font-bold uppercase tracking-wider">Apr</span>
                                        <span className="text-xl font-black leading-none mt-0.5">02</span>
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Hosted by NextHive</p>
                                        <h4 className="text-sm font-semibold text-foreground leading-snug group-hover:text-blue-500 transition-colors">Guest AMA: Tech Careers</h4>
                                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5 font-medium">
                                            <Users className="size-3" /> Live Event • 40 spots left
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}