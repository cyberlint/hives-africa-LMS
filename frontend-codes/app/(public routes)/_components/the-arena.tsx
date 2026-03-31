"use client";

import { MotionDiv } from "@/components/framer-motion/motion-components"; 
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Flame, Users, Timer, ArrowRight, Swords, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

interface ArenaChallenge {
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
    <div className="w-full relative py-16">
      {/* Background Ambience - Now Adaptive */}
      <div className="absolute inset-0 bg-muted/30 dark:bg-background rounded-[3rem] overflow-hidden -z-10 shadow-sm border border-border/50">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[300px] bg-orange/10 dark:bg-orange/20 blur-[100px] rounded-full pointer-events-none" />
      </div>

      <div className="px-6 md:px-12 py-12">
        {/* Header - Now Adaptive */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <MotionDiv 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center size-8 rounded-full bg-orange/10 border border-orange/20">
                <Swords className="size-4 text-orange" />
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">
                The Arena
              </h2>
            </div>
            <p className="text-muted-foreground text-sm md:text-base max-w-xl">
              Platform-wide bounties and competitive hackathons. Form a team, build solutions to real African problems, and claim your reputation points.
            </p>
          </MotionDiv>

          <MotionDiv initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <Button asChild variant="outline" className="rounded-full bg-background/50 border-border/50 text-foreground hover:bg-muted transition-all shadow-sm">
              <Link href="/dashboard/activities">
                Enter the Arena <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </MotionDiv>
        </div>

        {/* Dynamic Content Area */}
        {!hasChallenges ? (
          
          /* THE PREMIUM EMPTY STATE - ADAPTIVE */
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center justify-center py-24 px-4 text-center rounded-[2.5rem] border border-border/50 bg-card/30 backdrop-blur-md relative overflow-hidden"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-64 bg-orange/5 blur-[80px] rounded-full pointer-events-none" />
            
            <div className="p-5 rounded-full bg-muted/50 border border-border/50 mb-6 relative z-10 shadow-sm">
              <ShieldAlert className="size-10 text-muted-foreground" strokeWidth={1.5} />
            </div>
            
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3 tracking-tight relative z-10">
              The Arena is currently resting
            </h3>
            
            <p className="text-muted-foreground text-sm md:text-base max-w-md mx-auto mb-8 relative z-10 leading-relaxed">
              The next season of global hackathons and high-stakes bounties is currently being forged. Sharpen your skills and assemble your team in preparation.
            </p>
            
            <Button asChild className="rounded-full bg-foreground text-background hover:bg-foreground/90 font-bold px-8 h-12 relative z-10 shadow-md transition-all">
              <Link href="/course">
                Train in the Meantime
              </Link>
            </Button>
          </MotionDiv>

        ) : (
          
          /* THE ACTIVE GRID - ADAPTIVE */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((challenge, i) => {
              const isClosingSoon = challenge.deadline && new Date(challenge.deadline).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000;

              return (
                <MotionDiv
                  key={challenge.id}
                  initial={{ opacity: 0, y: 30 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: true }} 
                  transition={{ delay: i * 0.1 }}
                  className="group relative flex flex-col p-6 rounded-[2rem] border border-border/50 bg-card/40 backdrop-blur-md hover:bg-card/80 hover:border-orange/40 transition-all duration-500 overflow-hidden shadow-sm hover:shadow-xl"
                >
                  <div className="absolute -top-24 -right-24 size-48 bg-orange/0 group-hover:bg-orange/10 blur-3xl rounded-full transition-colors duration-500 pointer-events-none" />

                  <div className="flex justify-between items-start mb-6 relative z-10">
                    <Badge variant="secondary" className="bg-background/80 text-muted-foreground border-border/50 px-3 py-1 text-[10px] uppercase font-bold tracking-wider">
                      {challenge.type.replace(/_/g, " ")}
                    </Badge>
                    <span className="flex items-center gap-1.5 text-xs font-bold text-orange bg-orange/10 px-2.5 py-1 rounded-full border border-orange/20">
                      <Flame className="size-3.5" fill="currentColor" />
                      {challenge.points} PTS
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-foreground leading-snug mb-3 group-hover:text-orange transition-colors relative z-10">
                    {challenge.title}
                  </h3>

                  <div className="flex flex-wrap gap-2 mb-8 relative z-10">
                    {challenge.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="text-[10px] font-semibold text-muted-foreground bg-background/60 px-2 py-1 rounded-md border border-border/50">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto space-y-4 pt-4 border-t border-border/50 relative z-10">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Users className="size-4" />
                        <span className="font-medium">{challenge.participantCount} Enrolled</span>
                      </div>
                      {challenge.deadline && (
                        <div className={`flex items-center gap-1.5 font-medium ${isClosingSoon ? "text-red-500" : "text-muted-foreground"}`}>
                          <Timer className="size-4" />
                          <span>Closes {formatDistanceToNow(new Date(challenge.deadline), { addSuffix: true })}</span>
                        </div>
                      )}
                    </div>
                    
                    <Button asChild className="w-full rounded-xl bg-foreground text-background hover:bg-foreground/90 font-bold h-12 shadow-sm">
                      <Link href={`/dashboard/activities/${challenge.id}`}>
                        Join Challenge
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