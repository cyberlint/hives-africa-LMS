"use client";

import { MotionDiv } from "@/components/framer-motion/motion-components"; 
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Flame, Users, Timer, ArrowRight, Swords, 
  ShieldAlert, Crosshair, Terminal, Skull 
} from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export interface ArenaChallenge {
  id: string;
  title: string;
  type: string;
  difficulty: string;
  points: number;
  deadline: Date | null;
  participantCount: number;
  creatorName: string;
  tags: string[];
}

export default function TheArena({ challenges }: { challenges: ArenaChallenge[] }) {
  const hasChallenges = challenges && challenges.length > 0;

  return (
    <div className="w-full relative py-24 md:py-32 border-t border-border/50 bg-background overflow-hidden">
      
      {/* Background Ambience - The Colosseum Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-orange-500/10 via-red-500/5 to-transparent blur-[120px] rounded-full pointer-events-none -z-10" />
      
      {/* Tactical Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10" />

      <div className="px-6 md:px-12 max-w-7xl mx-auto">
        
        {/* ================= HEADER ================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 relative z-10">
          <MotionDiv 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center size-12 rounded-2xl bg-orange-500/10 border border-orange-500/30 shadow-[0_0_30px_rgba(249,115,22,0.15)] relative overflow-hidden">
                <div className="absolute inset-0 bg-orange-500/20 animate-pulse" />
                <Swords className="size-6 text-orange relative z-10" />
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">
                The Arena
              </h2>
            </div>
            <p className="text-muted-foreground text-lg max-w-2xl font-medium leading-relaxed">
              Global hackathons, high-stakes bounties, and architectural design sprints. Assemble your faction, build verifiable solutions to real-world problems, and dominate the leaderboard.
            </p>
          </MotionDiv>

          <MotionDiv initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <Button asChild className="rounded-full h-14 px-8 bg-orange hover:bg-orange/90 text-white font-black shadow-[0_0_40px_rgba(249,115,22,0.3)] transition-all active:scale-95 group border-none">
              <Link href="/activities" className="flex items-center gap-2 text-base uppercase tracking-wider">
                Enter the Arena <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </MotionDiv>
        </div>

        {/* ================= DYNAMIC CONTENT AREA ================= */}
        {!hasChallenges ? (
          
          /* THE PREMIUM EMPTY STATE - TACTICAL BRIEFING ROOM */
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center justify-center py-32 px-4 text-center rounded-[3rem] border border-border/40 bg-card/10 backdrop-blur-2xl relative overflow-hidden shadow-2xl"
          >
            {/* Radar Sweep Effect (CSS trick) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[500px] border border-orange-500/10 rounded-full pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[300px] border border-orange-500/20 rounded-full pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-full max-w-[600px] bg-gradient-to-t from-orange-500/5 to-transparent blur-[80px] pointer-events-none" />
            
            <div className="p-6 rounded-3xl bg-muted/30 border border-border/50 mb-8 relative z-10 shadow-inner backdrop-blur-md">
              <ShieldAlert className="size-12 text-muted-foreground" strokeWidth={1.5} />
            </div>
            
            <h3 className="text-3xl md:text-4xl font-black text-foreground mb-4 tracking-tight relative z-10 uppercase">
              Awaiting Deployment
            </h3>
            
            <p className="text-muted-foreground text-lg max-w-lg mx-auto mb-10 relative z-10 leading-relaxed font-medium">
              The Arena is currently being reset. The next season of global bounties and tactical missions is being forged. Train your squad in the meantime.
            </p>
            
            <Button asChild variant="outline" className="rounded-full bg-background/50 text-foreground hover:bg-muted font-black px-10 h-14 relative z-10 shadow-lg border-border/60 transition-all uppercase tracking-widest text-xs">
              <Link href="/course">
                <Terminal className="size-4 mr-2" /> Report to the Forge
              </Link>
            </Button>
          </MotionDiv>

        ) : (
          
          /* THE ACTIVE GRID - MISSION CARDS */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {challenges.map((challenge, i) => {
              const isClosingSoon = challenge.deadline && new Date(challenge.deadline).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000;

              return (
                <MotionDiv
                  key={challenge.id}
                  initial={{ opacity: 0, y: 40 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: true }} 
                  transition={{ delay: i * 0.1 }}
                  className="group relative flex flex-col p-8 rounded-[2.5rem] border border-border/40 bg-card/20 backdrop-blur-2xl hover:bg-card/40 hover:border-orange-500/40 transition-all duration-500 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgba(249,115,22,0.1)]"
                >
                  {/* Tactical Card Accents */}
                  <div className="absolute top-0 left-8 w-20 h-px bg-gradient-to-r from-orange-500/0 via-orange-500/50 to-orange-500/0" />
                  <Crosshair className="absolute top-6 right-6 size-24 text-foreground/[0.02] group-hover:text-orange-500/10 transition-colors duration-500 pointer-events-none -rotate-45 group-hover:rotate-0" strokeWidth={1} />

                  {/* Top Meta Row */}
                  <div className="flex justify-between items-start mb-8 relative z-10">
                    <Badge variant="outline" className="bg-background/40 backdrop-blur border-border/60 text-muted-foreground px-3 py-1 text-[9px] uppercase font-black tracking-widest">
                      {challenge.type.replace(/_/g, " ")}
                    </Badge>
                    
                    {/* The Bounty Escrow Tag */}
                    <div className="flex items-center gap-1.5 text-xs font-black text-orange bg-orange-500/10 px-3 py-1.5 rounded-xl border border-orange-500/20 shadow-inner">
                      <Flame className="size-4" fill="currentColor" />
                      <span className="text-sm tracking-tight">{challenge.points}</span>
                      <span className="text-[9px] uppercase tracking-widest opacity-80">Rep</span>
                    </div>
                  </div>

                  {/* Mission Title */}
                  <h3 className="text-2xl font-black text-foreground leading-tight mb-4 group-hover:text-orange-500 transition-colors relative z-10 tracking-tight">
                    {challenge.title}
                  </h3>

                  {/* Tactical Tags */}
                  <div className="flex flex-wrap gap-2 mb-10 relative z-10">
                    {challenge.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="text-[10px] font-bold text-muted-foreground bg-muted/50 px-2.5 py-1.5 rounded-lg border border-border/40 uppercase tracking-wider">
                        {tag}
                      </span>
                    ))}
                    <span className="text-[10px] font-black text-muted-foreground/50 px-2.5 py-1.5 uppercase tracking-wider border border-transparent">
                      LVL: {challenge.difficulty.substring(0,3)}
                    </span>
                  </div>

                  {/* Footer Stats & CTA */}
                  <div className="mt-auto pt-6 border-t border-border/40 relative z-10">
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                        <Users className="size-4 text-blue-500" />
                        <span>{challenge.participantCount} <span className="text-[10px] uppercase tracking-widest opacity-70">Active</span></span>
                      </div>
                      
                      {challenge.deadline && (
                        <div className={`flex items-center gap-2 font-black text-sm ${isClosingSoon ? "text-red-500 animate-pulse" : "text-muted-foreground"}`}>
                          {isClosingSoon ? <Skull className="size-4" /> : <Timer className="size-4" />}
                          <span className="font-mono tracking-tighter">
                            {formatDistanceToNow(new Date(challenge.deadline))} left
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Mission Accept Button */}
                    <Button asChild className="w-full rounded-2xl bg-foreground text-background hover:bg-orange hover:text-white font-black h-14 shadow-lg transition-all group/btn border-none overflow-hidden relative">
                      <Link href={`/dashboard/activities/${challenge.id}`}>
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out" />
                        <span className="relative z-10 flex items-center justify-center gap-2 uppercase tracking-widest text-xs">
                          Accept Bounty <ArrowRight className="size-4 group-hover/btn:translate-x-1 transition-transform" />
                        </span>
                      </Link>
                    </Button>
                  </div>
                </MotionDiv>
              )
            })}
          </div>
        )}
      </div>
    </div>
  );
}