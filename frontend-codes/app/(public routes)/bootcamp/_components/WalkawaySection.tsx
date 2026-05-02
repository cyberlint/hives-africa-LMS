"use client";

import {
  Database,
  Trophy,
  GitCommit,
  Users,
  CheckCircle2,
  BarChart3,
  Zap,
  ShieldCheck,
  User,
  Gift
} from "lucide-react";
import { MotionDiv, MotionSection } from "@/components/framer-motion/motion-components";

export default function WalkawaySection() {
  return (
    <MotionSection
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className="relative border-y border-border/50 bg-muted/20 py-16 md:py-24 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none -z-10" />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* HEADER: Direct Response Copy */}
        <div className="mb-12 md:mb-16 max-w-3xl space-y-5 text-center md:text-left mx-auto md:mx-0">
          <MotionDiv
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 shadow-sm"
          >
            <Gift className="size-4 text-orange" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-foreground">
              What You Actually Get
            </span>
          </MotionDiv>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black leading-[1.1] tracking-tight">
            This Is Not a Course. <br className="hidden sm:block" />
            <span className="text-orange">{"It's an Asset Factory."}</span>
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto md:mx-0">
            {"When you join, you're not paying for passive 'learning'. You are paying for a system that forces output. You leave with the exact assets you need to get hired."}
          </p>
        </div>

        {/* BENTO GRID: The Value Stack */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:auto-rows-[minmax(260px,auto)]">

          {/* CARD 1: The "Free Gift" Portfolio */}
          <div className="md:col-span-2 rounded-[2rem] border border-border/60 bg-card p-5 sm:p-7 md:p-8 overflow-hidden relative flex flex-col justify-between gap-6">
            <div className="absolute -right-24 -top-24 size-64 bg-orange/5 blur-3xl" />

            <div className="space-y-3 z-10 max-w-md">
              <div className="flex items-center gap-3 mb-2">
                <div className="inline-flex items-center gap-1.5 rounded-md bg-orange/10 px-2 py-1 text-xs font-bold text-orange">
                  <Gift className="size-3" />
                  FREE INCLUSION
                </div>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold">A Personal Portfolio Website</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Automatically built and hosted for you as you complete projects. <strong className="text-foreground">Ready to send directly to employers the day you finish.</strong>
              </p>
            </div>

            {/* MOCK UI */}
            <div className="w-full rounded-xl border border-border bg-muted/40 p-4 sm:p-5 mt-4">
              <div className="flex gap-2 mb-3">
                <div className="size-2 bg-border rounded-full" />
                <div className="size-2 bg-border rounded-full" />
                <div className="size-2 bg-border rounded-full" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="size-9 sm:size-10 rounded-full border bg-background" />
                  <div className="space-y-2">
                    <div className="h-2 w-24 bg-background border rounded" />
                    <div className="h-1.5 w-14 bg-orange/20 rounded" />
                  </div>
                </div>
                <div className="h-16 sm:h-20 rounded-xl border bg-background flex items-center justify-center">
                  <Database className="opacity-30" />
                </div>
              </div>
            </div>
          </div>

          {/* CARD 2: Real Tools */}
          <div className="rounded-[2rem] border border-border/60 bg-card p-5 sm:p-7 flex flex-col justify-between relative overflow-hidden min-h-[220px]">
            <div className="space-y-3">
              <BarChart3 className="size-6 text-indigo-500" />
              <h3 className="text-lg font-bold">Real Tools Experience</h3>
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Excel • SQL • Power BI</strong> <br />
                Stop doing tutorials. Build real dashboards that solve real business problems.
              </p>
            </div>
            <BarChart3 className="absolute -bottom-6 -right-6 size-32 opacity-5 text-indigo-500" />
          </div>

          {/* CARD 3: Reputation / Proof */}
          <div className="rounded-[2rem] border border-border/60 bg-card p-5 sm:p-7 flex flex-col justify-between relative overflow-hidden min-h-[220px]">
            <Trophy className="size-6 text-yellow-500" />
            <div className="z-10">
              <h3 className="text-lg font-bold">Reputation Score</h3>
              <p className="text-sm text-muted-foreground">
                Verifiable proof of work. Shows employers and clients exactly what you contributed, not just what you claimed.
              </p>
            </div>
            <div className="absolute bottom-2 right-3 text-7xl opacity-5 font-black">
              REP
            </div>
          </div>

          {/* CARD 4: Verified Projects */}
          <div className="rounded-[2rem] border border-border/60 bg-card p-5 sm:p-7 flex flex-col gap-3 min-h-[220px]">
            <GitCommit className="size-6 text-green-500" />
            <h3 className="text-lg font-bold">4 Verified Projects</h3>
            <p className="text-sm text-muted-foreground">
              Your work gets checked. Not ignored. Every project is reviewed and approved before it hits your portfolio.
            </p>
          </div>

          {/* CARD 5: The Hive */}
          <div className="rounded-[2rem] border border-orange/20 bg-orange/5 p-5 sm:p-7 flex flex-col gap-3 relative overflow-hidden min-h-[220px]">
            <Users className="size-6 text-orange" />
            <h3 className="text-lg font-bold">Team-Based Execution</h3>
            <p className="text-sm text-muted-foreground">
              {'You will be placed in a "Hive". Shared execution and peer accountability so'} <strong className="text-foreground">{"you don't get stuck or disappear."}</strong>
            </p>
            <div className="flex gap-2 mt-auto">
              {[1, 2, 3].map((i) => (
                <div key={i} className="size-8 rounded-full border bg-background flex items-center justify-center">
                  <User className="size-3 text-orange" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AGGRESSIVE GUARANTEE BOX */}
        <MotionDiv
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 md:mt-16 max-w-3xl mx-auto rounded-2xl border-2 border-green-500/20 bg-green-500/5 p-6 sm:p-8 text-center"
        >
          <ShieldCheck className="size-8 text-green-500 mx-auto mb-4" />
          <h4 className="text-lg sm:text-xl font-bold mb-2">{'The "No Stories" Guarantee'}</h4>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
            {"Complete the 4-week sprint. Submit your work. If you don't feel significantly closer to landing a role, or if you aren't proud of the portfolio you built"}—<strong className="text-foreground">we will refund your money immediately.</strong> No stress. No hidden conditions.
          </p>
        </MotionDiv>

        {/* FOOTER BADGES */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Badge text="Not a certificate mill" />
          <Badge text="No toy datasets" />
          <Badge text="Proof tied to action" highlight />
        </div>
      </div>
    </MotionSection>
  );
}

function Badge({
  text,
  highlight,
}: {
  text: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={[
        "flex items-center justify-center gap-2 rounded-full px-4 py-2 border text-xs font-bold uppercase tracking-widest",
        highlight
          ? "bg-orange/10 border-orange/30 text-orange"
          : "bg-card border-border/60 text-muted-foreground",
      ].join(" ")}
    >
      {highlight ? <Zap className="size-3" /> : <CheckCircle2 className="size-3" />}
      {text}
    </div>
  );
}

// "use client";

// import {
//   LayoutDashboard,
//   Database,
//   Trophy,
//   GitCommit,
//   Users,
//   CheckCircle2,
//   BarChart3,
//   Zap,
//   ShieldCheck,
//   User,
// } from "lucide-react";
// import { MotionDiv, MotionSection } from "@/components/framer-motion/motion-components";

// export default function WalkawaySection() {
//   return (
//     <MotionSection
//       initial={{ opacity: 0 }}
//       whileInView={{ opacity: 1 }}
//       viewport={{ once: true, margin: "-100px" }}
//       transition={{ duration: 0.8 }}
//       className="relative border-y border-border/50 bg-muted/20 py-14 md:py-24 overflow-hidden"
//     >
//       {/* Background */}
//       <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none -z-10" />

//       <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">

//         {/* HEADER */}
//         <div className="mb-10 md:mb-16 max-w-2xl space-y-5 text-center md:text-left">
//           <MotionDiv
//             initial={{ opacity: 0, y: 10 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 shadow-sm"
//           >
//             <ShieldCheck className="size-4 text-orange" />
//             <span className="text-[10px] font-bold uppercase tracking-widest text-foreground">
//               Return on Investment
//             </span>
//           </MotionDiv>

//           <h2 className="text-3xl sm:text-5xl md:text-6xl font-black leading-[1.1] tracking-tight">
//             Assets That <span className="text-orange">Compound.</span>
//           </h2>

//           <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto md:mx-0">
//             Most programs end with a certificate. This one leaves you with algorithmic proof tied to action.
//           </p>
//         </div>

//         {/* GRID */}
//         <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:auto-rows-[minmax(260px,auto)]">

//           {/* CARD 1 */}
//           <div className="md:col-span-2 rounded-[2rem] border border-border/60 bg-card p-5 sm:p-7 md:p-8 overflow-hidden relative flex flex-col gap-6">
//             <div className="absolute -right-24 -top-24 size-64 bg-orange/5 blur-3xl" />

//             <div className="space-y-3 z-10">
//               <div className="flex items-center gap-3">
//                 <div className="size-10 sm:size-12 rounded-xl border border-border bg-background flex items-center justify-center">
//                   <LayoutDashboard className="size-5" />
//                 </div>
//               </div>

//               <h3 className="text-xl sm:text-2xl font-bold">A Live Public Portfolio</h3>
//               <p className="text-sm text-muted-foreground leading-relaxed">
//                 Every submission is verified and published to your profile.
//               </p>
//             </div>

//             {/* MOCK (mobile-safe now) */}
//             <div className="w-full rounded-xl border border-border bg-muted/40 p-4 sm:p-5">
//               <div className="flex gap-2 mb-3">
//                 <div className="size-2 bg-border rounded-full" />
//                 <div className="size-2 bg-border rounded-full" />
//                 <div className="size-2 bg-border rounded-full" />
//               </div>

//               <div className="space-y-3">
//                 <div className="flex items-center gap-3">
//                   <div className="size-9 sm:size-10 rounded-full border bg-background" />
//                   <div className="space-y-2">
//                     <div className="h-2 w-24 bg-background border rounded" />
//                     <div className="h-1.5 w-14 bg-orange/20 rounded" />
//                   </div>
//                 </div>

//                 <div className="h-16 sm:h-20 rounded-xl border bg-background flex items-center justify-center">
//                   <Database className="opacity-30" />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* CARD 2 */}
//           <div className="rounded-[2rem] border border-border/60 bg-card p-5 sm:p-7 flex flex-col justify-between relative overflow-hidden min-h-[220px]">
//             <div className="space-y-3">
//               <BarChart3 className="size-6" />
//               <h3 className="text-lg font-bold">Production Dashboard</h3>
//               <p className="text-sm text-muted-foreground">
//                 Real Power BI execution.
//               </p>
//             </div>
//             <BarChart3 className="absolute -bottom-6 -right-6 size-32 opacity-10" />
//           </div>

//           {/* CARD 3 */}
//           <div className="rounded-[2rem] border border-border/60 bg-card p-5 sm:p-7 flex flex-col justify-between relative overflow-hidden min-h-[220px]">
//             <Trophy className="size-6" />
//             <div>
//               <h3 className="text-lg font-bold">Your First 50 Rep</h3>
//               <p className="text-sm text-muted-foreground">
//                 Earned, not given.
//               </p>
//             </div>
//             <div className="absolute bottom-2 right-3 text-6xl opacity-10 font-black">
//               50
//             </div>
//           </div>

//           {/* CARD 4 */}
//           <div className="rounded-[2rem] border border-border/60 bg-card p-5 sm:p-7 flex flex-col gap-3 min-h-[220px]">
//             <GitCommit className="size-6" />
//             <h3 className="text-lg font-bold">Verifiable Work</h3>
//             <p className="text-sm text-muted-foreground">
//               Every contribution tracked.
//             </p>
//           </div>

//           {/* CARD 5 */}
//           <div className="rounded-[2rem] border border-orange/20 bg-orange/5 p-5 sm:p-7 flex flex-col gap-3 relative overflow-hidden min-h-[220px]">
//             <Users className="size-6 text-orange" />
//             <h3 className="text-lg font-bold">Your Hive</h3>
//             <p className="text-sm text-muted-foreground">
//               Shared execution, not passive learning.
//             </p>

//             {/* avatars now safe */}
//             <div className="flex gap-2 mt-auto">
//               {[1, 2, 3].map((i) => (
//                 <div key={i} className="size-8 rounded-full border bg-background flex items-center justify-center">
//                   <User className="size-3 text-orange" />
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* FOOTER */}
//         <div className="mt-10 md:mt-16 flex flex-col sm:flex-row gap-3 justify-center">
//           <Badge text="Not certificates" />
//           <Badge text="Not claims" />
//           <Badge text="Proof tied to action" highlight />
//         </div>
//       </div>
//     </MotionSection>
//   );
// }

// function Badge({
//   text,
//   highlight,
// }: {
//   text: string;
//   highlight?: boolean;
// }) {
//   return (
//     <div
//       className={[
//         "flex items-center justify-center gap-2 rounded-full px-4 py-2 border text-xs font-bold uppercase tracking-widest",
//         highlight
//           ? "bg-orange/10 border-orange/30 text-orange"
//           : "bg-card border-border text-foreground",
//       ].join(" ")}
//     >
//       {highlight ? <Zap className="size-3" /> : <CheckCircle2 className="size-3" />}
//       {text}
//     </div>
//   );
// }