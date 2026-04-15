"use client";

import { 
  LayoutDashboard, 
  Database, 
  Trophy, 
  GitCommit, 
  Users, 
  CheckCircle2,
  BarChart3,
  Zap,
  ShieldCheck,
  User,
} from "lucide-react";
import { MotionDiv, MotionSection } from "@/components/framer-motion/motion-components";
import { cn } from "@/lib/utils";

export default function WalkawaySection() {
  return (
    <MotionSection
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className="relative border-y border-border/50 bg-muted/20 py-16 md:py-24 overflow-hidden"
    >
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none -z-10" />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* SECTION HEADER */}
        <div className="mb-12 max-w-2xl space-y-5 text-center md:text-left lg:mb-16">
          <MotionDiv
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 shadow-sm"
          >
            <ShieldCheck className="size-4 text-orange" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-foreground">
              Return on Investment
            </span>
          </MotionDiv>

          <h2 className="text-3xl font-black leading-[1.1] tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Assets That <span className="text-orange">Compound.</span>
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground md:text-lg max-w-xl mx-auto md:mx-0">
            Most programs end with a certificate. This one leaves you with algorithmic proof tied to action. By the end of 4 weeks, you walk away with:
          </p>
        </div>

        {/* BENTO GRID */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3 md:grid-rows-2">
          
          {/* CARD 1: Portfolio (Large Span) */}
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="group relative col-span-1 flex flex-col justify-between overflow-hidden rounded-[2rem] border border-border/60 bg-card pt-6 px-6 sm:p-8 sm:pb-0 shadow-sm transition-all duration-500 hover:border-orange/40 hover:shadow-xl md:col-span-2 md:row-span-1 min-h-[320px] sm:min-h-[380px]"
          >
            <div className="absolute -right-20 -top-20 size-64 rounded-full bg-orange/5 blur-3xl transition-colors duration-500 group-hover:bg-orange/10" />
            
            <div className="relative z-10 md:w-3/5 space-y-4 pb-8 sm:pb-12">
              <div className="flex size-10 sm:size-12 items-center justify-center rounded-xl sm:rounded-[1rem] border border-border/50 bg-background shadow-sm group-hover:border-orange/20 group-hover:text-orange transition-colors">
                <LayoutDashboard className="size-5" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground">A Live Public Portfolio</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Every submission you make is structured, reviewed, and published to your profile. Not uploaded. Not self-claimed. Verified.
              </p>
            </div>

            {/* Mock UI Element - Now responsive and visible on mobile */}
            <div className="relative mt-auto md:absolute md:-bottom-6 md:-right-6 w-full md:w-[360px] rounded-t-xl border border-border border-b-0 bg-muted/50 p-4 shadow-2xl transition-transform duration-500 group-hover:-translate-y-2 md:group-hover:-translate-x-2 md:group-hover:-translate-y-2">
               <div className="mb-3 flex gap-1.5">
                 <div className="size-2.5 rounded-full bg-border/80" />
                 <div className="size-2.5 rounded-full bg-border/80" />
                 <div className="size-2.5 rounded-full bg-border/80" />
               </div>
               <div className="space-y-3">
                 <div className="flex items-center gap-3">
                   <div className="size-8 sm:size-10 rounded-full bg-background border border-border" />
                   <div className="space-y-1.5">
                     <div className="h-2.5 sm:h-3 w-20 sm:w-24 rounded-md bg-background border border-border" />
                     <div className="h-1.5 sm:h-2 w-12 sm:w-16 rounded-md bg-orange/20" />
                   </div>
                 </div>
                 <div className="h-16 sm:h-20 w-full rounded-xl bg-background border border-border flex items-center justify-center">
                    <Database className="size-5 sm:size-6 text-muted-foreground/30" />
                 </div>
               </div>
            </div>
          </MotionDiv>

          {/* CARD 2: Dashboard (Square) */}
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="group relative col-span-1 flex flex-col justify-between overflow-hidden rounded-[2rem] border border-border/60 bg-card p-6 sm:p-8 shadow-sm transition-all duration-500 hover:border-orange/40 hover:shadow-xl min-h-[250px] sm:min-h-[300px]"
          >
            <div className="relative z-10 space-y-4 pb-12">
              <div className="flex size-10 sm:size-12 items-center justify-center rounded-xl sm:rounded-[1rem] border border-border/50 bg-background shadow-sm group-hover:border-orange/20 group-hover:text-orange transition-colors">
                <BarChart3 className="size-5" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-foreground">Production Dashboard</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Design and deploy a real Power BI solution evaluated by peers.
              </p>
            </div>
            {/* Abstract Graphic */}
            <div className="absolute -bottom-8 -right-8 opacity-[0.07] transition-transform duration-500 group-hover:scale-110 group-hover:opacity-15">
              <BarChart3 className="size-32 sm:size-40 text-orange" />
            </div>
          </MotionDiv>

          {/* CARD 3: Reputation (Square) */}
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="group relative col-span-1 flex flex-col justify-between overflow-hidden rounded-[2rem] border border-border/60 bg-card p-6 sm:p-8 shadow-sm transition-all duration-500 hover:border-orange/40 hover:shadow-xl min-h-[250px] sm:min-h-[300px]"
          >
            <div className="relative z-10 space-y-4 pb-12">
              <div className="flex size-10 sm:size-12 items-center justify-center rounded-xl sm:rounded-[1rem] border border-border/50 bg-background shadow-sm group-hover:border-orange/20 group-hover:text-orange transition-colors">
                <Trophy className="size-5" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-foreground">Your First 50 Rep</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Logged on an immutable ledger. Earned through participation. Spent to unlock collaboration.
              </p>
            </div>
            <div className="absolute -bottom-2 -right-2 sm:-bottom-4 sm:right-4 text-6xl sm:text-8xl font-black text-foreground/[0.03] transition-transform duration-500 group-hover:-translate-y-2 group-hover:text-orange/10 pointer-events-none select-none">
              50
            </div>
          </MotionDiv>

          {/* CARD 4: Work Record (Square) */}
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="group relative col-span-1 flex flex-col justify-between overflow-hidden rounded-[2rem] border border-border/60 bg-card p-6 sm:p-8 shadow-sm transition-all duration-500 hover:border-orange/40 hover:shadow-xl min-h-[250px] sm:min-h-[300px]"
          >
            <div className="relative z-10 space-y-4">
              <div className="flex size-10 sm:size-12 items-center justify-center rounded-xl sm:rounded-[1rem] border border-border/50 bg-background shadow-sm group-hover:border-orange/20 group-hover:text-orange transition-colors">
                <GitCommit className="size-5" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-foreground">Verifiable Work Record</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Contributions are tracked at submission level — including team projects and peer reviews.
              </p>
            </div>
          </MotionDiv>

          {/* CARD 5: Hive (Square) */}
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="group relative col-span-1 flex flex-col justify-between overflow-hidden rounded-[2rem] border border-border/60 bg-card p-6 sm:p-8 shadow-sm transition-all duration-500 hover:border-orange/40 hover:shadow-xl bg-orange/5 border-orange/20 min-h-[250px] sm:min-h-[300px]"
          >
            <div className="relative z-10 space-y-4 pb-12">
              <div className="flex size-10 sm:size-12 items-center justify-center rounded-xl sm:rounded-[1rem] border border-orange/30 bg-background shadow-sm text-orange">
                <Users className="size-5" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-foreground">Your Hive (Squad)</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {"A team you don't just meet — but build algorithmic equity with through shared work."}
              </p>
            </div>
            
            {/* Mock Avatars - Safely positioned for mobile */}
            <div className="absolute bottom-6 right-6 flex -space-x-3 opacity-60 transition-opacity duration-500 group-hover:opacity-100">
               {[1,2,3].map((i) => (
                 <div key={i} className="size-8 sm:size-10 rounded-full border-2 border-card bg-background/80 backdrop-blur-sm flex items-center justify-center shadow-sm">
                   <User className="size-3 sm:size-4 text-orange" />
                 </div>
               ))}
            </div>
          </MotionDiv>

        </div>

        {/* SECTION FOOTER (The Punchline) */}
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-3 sm:gap-4 lg:mt-16"
        >
          <div className="flex items-center gap-2 rounded-full border border-border/60 bg-card px-4 py-2 sm:px-5 shadow-sm w-full sm:w-auto justify-center">
            <CheckCircle2 className="size-4 text-orange" />
            <span className="text-xs sm:text-sm font-bold text-foreground uppercase tracking-widest">Not claims.</span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-border/60 bg-card px-4 py-2 sm:px-5 shadow-sm w-full sm:w-auto justify-center">
            <CheckCircle2 className="size-4 text-orange" />
            <span className="text-xs sm:text-sm font-bold text-foreground uppercase tracking-widest">Not certificates.</span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-orange/40 bg-orange/10 px-5 py-2 sm:px-6 shadow-sm w-full sm:w-auto justify-center">
            <Zap className="size-4 text-orange" />
            <span className="text-xs sm:text-sm font-bold text-orange uppercase tracking-widest">Proof tied to action.</span>
          </div>
        </MotionDiv>

      </div>
    </MotionSection>
  );
}