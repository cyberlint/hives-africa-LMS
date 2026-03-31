"use client";

import { MotionDiv } from "@/components/framer-motion/motion-components"; 
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Medal, TrendingUp, Crown, Zap, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export interface VanguardUser {
  id: string;
  name: string;
  image: string | null;
  role: string;
  points: number;
  rank: number;
}

export default function TheVanguard({ leaders }: { leaders: VanguardUser[] }) {
  const hasLeaders = leaders && leaders.length > 0;

  // Split leaders into Podium (Top 3) and Runners Up (4-5)
  const podium = leaders.slice(0, 3);
  const runnersUp = leaders.slice(3, 5);

  // Reorder podium for visual layout: [Rank 2, Rank 1, Rank 3]
  const visualPodium = [
    podium[1] || null,
    podium[0] || null,
    podium[2] || null,
  ];

  return (
    <div className="w-full relative py-16 md:py-24 border-t border-border/50 bg-muted/10 dark:bg-background/50">
      
      {/* Background Ambience - Purple/Gold glow for prestige */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-indigo-500/5 dark:bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="px-6 md:px-12 max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-4 mb-16">
          <MotionDiv 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="space-y-4 flex flex-col items-center"
          >
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest">
              <Crown className="size-4" /> The Vanguard
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">
              Top Builders This Month
            </h2>
            <p className="text-muted-foreground text-sm md:text-base max-w-xl">
              Recognizing the most active ecosystem contributors. Earn reputation by completing capstones, hosting hives, and auditing peer code.
            </p>
          </MotionDiv>
        </div>

        {!hasLeaders ? (
          /* EMPTY STATE */
          <MotionDiv
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex flex-col items-center justify-center py-20 px-4 text-center rounded-[2.5rem] border border-border/50 bg-card/30 backdrop-blur-md shadow-sm"
          >
            <div className="p-5 rounded-full bg-muted border border-border/50 mb-6">
              <Trophy className="size-10 text-muted-foreground/50" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">The Board is Reset</h3>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-6">
              A new month has begun. Be the first to claim your spot on the Vanguard by completing an activity today.
            </p>
            <Button asChild className="rounded-full font-bold">
              <Link href="/dashboard/activities">Earn Reputation</Link>
            </Button>
          </MotionDiv>
        ) : (
          <div className="space-y-12">
            
            {/* 1. THE PODIUM (Top 3) */}
            <div className="flex flex-col sm:flex-row items-end justify-center gap-4 sm:gap-6 h-auto sm:h-[350px]">
              {visualPodium.map((leader, index) => {
                if (!leader) return <div key={index} className="hidden sm:block w-full max-w-[200px]" />; // Spacer

                const isFirst = leader.rank === 1;
                const isSecond = leader.rank === 2;
                const isThird = leader.rank === 3;

                // Dynamic styling based on rank
                const height = isFirst ? "h-[220px]" : isSecond ? "h-[180px]" : "h-[150px]";
                const color = isFirst 
                  ? "bg-gradient-to-t from-orange/20 to-orange/5 border-orange/30" 
                  : isSecond 
                  ? "bg-gradient-to-t from-slate-400/20 to-slate-400/5 border-slate-400/30" 
                  : "bg-gradient-to-t from-amber-700/20 to-amber-700/5 border-amber-700/30";
                
                const badgeColor = isFirst ? "bg-orange text-white" : isSecond ? "bg-slate-300 text-slate-800" : "bg-amber-700 text-white";

                return (
                  <MotionDiv
                    key={leader.id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: isFirst ? 0 : isSecond ? 0.2 : 0.4, type: "spring", bounce: 0.4 }}
                    className={`relative flex flex-col items-center w-full sm:w-[220px] order-${isFirst ? 1 : isSecond ? 0 : 2} sm:order-none mt-8 sm:mt-0`}
                  >
                    {/* Avatar & Crown */}
                    <div className="relative z-10 flex flex-col items-center mb-[-20px] sm:mb-[-30px]">
                      {isFirst && <Crown className="size-8 text-orange mb-2 animate-bounce" />}
                      <div className={`relative p-1 rounded-full bg-background ${isFirst ? 'bg-orange/20' : ''}`}>
                        <Avatar className={`${isFirst ? 'size-24 sm:size-32' : 'size-20 sm:size-24'} border-4 border-background shadow-xl`}>
                          <AvatarImage src={leader.image || undefined} />
                          <AvatarFallback className="text-2xl font-bold bg-muted text-muted-foreground">{leader.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-2 sm:-bottom-4 left-1/2 -translate-x-1/2 flex items-center justify-center size-8 sm:size-10 rounded-full border-4 border-background shadow-md font-black text-sm sm:text-base ${badgeColor}`}>
                          {leader.rank}
                        </div>
                      </div>
                    </div>

                    {/* The Pedestal */}
                    <div className={`w-full flex flex-col items-center justify-end p-6 rounded-t-3xl border-t border-x backdrop-blur-md ${height} ${color}`}>
                      <Link href={`/p/${leader.id}`} className="text-foreground font-bold text-lg text-center hover:text-orange transition-colors line-clamp-1">
                        {leader.name}
                      </Link>
                      <span className="text-xs text-muted-foreground mt-1 mb-3 line-clamp-1 text-center">
                        {leader.role}
                      </span>
                      <div className="flex items-center gap-1.5 text-sm font-black text-foreground bg-background/50 px-3 py-1.5 rounded-full shadow-sm border border-border/50">
                        <TrendingUp className="size-4 text-green-500" />
                        {leader.points} pts
                      </div>
                    </div>
                  </MotionDiv>
                );
              })}
            </div>

            {/* 2. RUNNERS UP LIST (Ranks 4-5) */}
            {runnersUp.length > 0 && (
              <MotionDiv 
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.6 }}
                className="max-w-2xl mx-auto space-y-3"
              >
                {runnersUp.map((leader) => (
                  <div key={leader.id} className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center size-8 rounded-full bg-muted font-bold text-muted-foreground text-sm">
                        {leader.rank}
                      </div>
                      <Avatar className="size-12 border border-border/50">
                        <AvatarImage src={leader.image || undefined} />
                        <AvatarFallback className="font-bold">{leader.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <Link href={`/p/${leader.id}`} className="font-bold text-foreground text-sm sm:text-base hover:text-orange transition-colors">
                          {leader.name}
                        </Link>
                        <span className="text-[10px] sm:text-xs text-muted-foreground">{leader.role}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm font-bold text-foreground bg-muted/50 px-3 py-1.5 rounded-full border border-border/50">
                      <Star className="size-4 text-orange" fill="currentColor" />
                      {leader.points} pts
                    </div>
                  </div>
                ))}
              </MotionDiv>
            )}

          </div>
        )}
      </div>
    </div>
  );
}