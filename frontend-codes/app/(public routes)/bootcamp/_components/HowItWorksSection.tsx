"use client";

import Link from "next/link";
import { 
  User, 
  Users, 
  Activity, 
  FileCheck2, 
  ShieldCheck,
  CheckCircle2,
  Zap,
  ArrowRight,
  AlertTriangle
} from "lucide-react";
import { MotionDiv } from "@/components/framer-motion/motion-components";

// ==========================================
// DATA
// =========================================
const engineSteps = [
  {
    id: "01",
    title: "Minute 1: Your Profile Goes Live",
    desc: "No manual setup. You create an account, verify your identity, and instantly get your public portfolio link",
    icon: User,
    mockUI: (
      <div className="w-full max-w-[220px] space-y-3">
        <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-card p-3 shadow-sm">
          <div className="flex size-10 items-center justify-center rounded-full border border-border bg-muted">
            <User className="size-5 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <div className="mb-2 h-2 w-1/2 rounded-full bg-border" />
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="size-3 text-green-500" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-foreground">
                Anchored & Live
              </span>
            </div>
          </div>
        </div>
      </div>
    ),
  },

  {
    id: "02",
    title: "Join a Team (So You Don't Quit)",
    desc: "Learning alone is why you abandon courses. You will be placed in a 'Hive' with other serious builders. Shared execution, peer accountability, zero excuses.",
    icon: Users,
    mockUI: (
      <div className="w-full max-w-[220px] rounded-xl border border-border/60 bg-card p-4 shadow-sm">
        <div className="text-[10px] font-bold uppercase tracking-widest text-orange mb-3">
          Active Hive Assignment
        </div>
        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex size-7 items-center justify-center rounded-full border-2 border-card bg-muted"
              >
                <User className="size-3 text-muted-foreground" />
              </div>
            ))}
          </div>
          <div className="text-xs font-bold">Data Alpha</div>
        </div>
      </div>
    ),
  },

  {
    id: "03",
    title: "Build Employer-Ready Projects",
    desc: "Stop watching tutorials. You will execute structured tasks using real, messy datasets that mimic actual workplace demands.",
    bullets: [
      "Real business scenarios, no toy datasets",
      "Strict deadlines to force output",
      "Exact tools employers ask for (SQL, Power BI)"
    ],
    icon: Activity,
    mockUI: (
      <div className="w-full max-w-[240px] space-y-3 rounded-xl border border-border/60 bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-widest text-orange">
            Live Sprint
          </span>
          <Activity className="size-3 text-orange animate-pulse" />
        </div>
        <div>
          <div className="text-sm font-bold">Full EDA & Client QA</div>
          <div className="text-[11px] text-muted-foreground mt-1">
            Clean & profile dataset for client presentation
          </div>
        </div>
      </div>
    ),
  },

  {
    id: "04",
    title: "Get Brutally Honest Feedback",
    desc: "You can't cheat this. Your work is submitted, reviewed by peers and mentors, and scored. You get feedback that actually makes you better.",
    bullets: [
      "Structured submission portal",
      "Mandatory peer + mentor review",
      "Actionable feedback, not just 'good job'"
    ],
    closing: "No silent completion. No hiding.",
    icon: FileCheck2,
    mockUI: (
      <div className="w-full max-w-[240px] rounded-xl border border-border/60 bg-card p-4 shadow-sm">
        <div className="text-xs font-bold mb-3">Review Status</div>
        <div className="space-y-2 text-[11px]">
          <div className="flex justify-between items-center border-b border-border/40 pb-2">
            <span className="text-muted-foreground">Peer Review</span>
            <span className="text-green-500 font-bold bg-green-500/10 px-2 py-0.5 rounded">Approved</span>
          </div>
          <div className="flex justify-between items-center pt-1">
            <span className="text-muted-foreground">Mentor Review</span>
            <span className="text-green-500 font-bold bg-green-500/10 px-2 py-0.5 rounded">Approved</span>
          </div>
        </div>
      </div>
    ),
  },

  {
    id: "05",
    title: "Walk Away With Verifiable Proof",
    desc: "Once approved, your work is permanently added to your portfolio. This is the exact link you will send to recruiters to prove you can do the job.",
    bullets: [
      "Public portfolio asset minted automatically",
      "Reputation score increases globally",
      "Immediate proof of competence"
    ],
    closing: "This is how you get hired.",
    icon: ShieldCheck,
    mockUI: (
      <div className="w-full max-w-[240px] rounded-xl border border-border/60 bg-card p-4 shadow-sm">
        <div className="text-[10px] font-bold uppercase text-muted-foreground mb-2">
          Global Ledger Update
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-bold">Portfolio Updated</div>
            <div className="text-[10px] text-muted-foreground">Asset locked & public</div>
          </div>
          <div className="flex items-center gap-1 rounded-md bg-orange/10 px-2 py-1 text-orange">
            <Zap className="size-3" />
            <span className="text-xs font-black">+REP</span>
          </div>
        </div>
      </div>
    ),
  }
];

// ==========================================
// COMPONENT
// ==========================================
export default function EngineAndCTASection() {
  return (
    <section className="bg-background py-16 md:py-24 lg:py-32 border-t border-border/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* TOP: THE ENGINE */}
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">
          
          {/* LEFT HEADER: Total Transparency */}
          <div className="lg:w-1/3">
            <div className="lg:sticky lg:top-28">
              <MotionDiv
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="mb-5 inline-flex rounded-full border border-border bg-muted/30 px-4 py-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-foreground">
                    Total Transparency
                  </span>
                </div>

                <h2 className="text-3xl sm:text-5xl font-black leading-[1.05] tracking-tight">
                  The Exact <br className="hidden lg:block"/>
                  <span className="text-orange">Blueprint.</span>
                </h2>
                
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-sm">
                  Here is exactly what happens from the moment you register to the moment you get your portfolio.
                </p>
              </MotionDiv>
            </div>
          </div>

          {/* RIGHT STEPS */}
          <div className="lg:w-2/3 flex flex-col gap-6">
            {engineSteps.map((step, i) => (
              <MotionDiv
                key={step.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.05 }}
                className="
                  relative flex flex-col gap-6
                  rounded-2xl border border-border/60
                  bg-card p-5 sm:p-7 shadow-sm
                  lg:flex-row lg:items-center
                  hover:border-orange/30 transition-colors
                "
              >
                {/* BACKGROUND NUMBER */}
                <div className="absolute right-4 top-4 text-5xl font-black text-foreground/[0.03] lg:text-[7rem] lg:-bottom-8 lg:right-8 pointer-events-none select-none">
                  {step.id}
                </div>

                {/* TEXT CONTENT */}
                <div className="flex-1 space-y-4 z-10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-lg border border-border/50">
                      <step.icon className="size-5 text-foreground" />
                    </div>
                    <span className="text-base sm:text-lg font-bold">{step.title}</span>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.desc}
                  </p>

                  {step.bullets && (
                    <ul className="space-y-2 mt-2">
                      {step.bullets.map((b, idx) => (
                        <li key={idx} className="flex gap-2 text-sm font-medium text-foreground/80">
                          <CheckCircle2 className="size-4 text-green-500 shrink-0 mt-0.5" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}

                  {step.closing && (
                    <p className="text-xs font-bold uppercase tracking-widest pt-3 border-t border-border/40 text-orange">
                      {step.closing}
                    </p>
                  )}
                </div>

                {/* MOCK UI */}
                <div className="w-full lg:w-[260px] flex justify-center lg:justify-end z-10">
                  <div className="scale-95 sm:scale-100 w-full flex justify-center lg:justify-end">
                    {step.mockUI}
                  </div>
                </div>
              </MotionDiv>
            ))}
          </div>
        </div>

        {/* BOTTOM: THE HARD CTA (Directly attached to the engine logic) */}
        <MotionDiv
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-50px" }}
  transition={{ duration: 0.6 }}
  className="relative mt-20 lg:mt-32 overflow-hidden rounded-[2.5rem] bg-foreground px-6 py-16 text-center text-background sm:px-12"
>
  {/* Background glow */}
  <div className="pointer-events-none absolute inset-0 flex justify-center">
    <div className="h-full w-3/4 bg-orange/20 blur-[100px]" />
  </div>

  <div className="relative z-10 mx-auto max-w-3xl space-y-10">
    
    {/* Heading + Message */}
    <div className="space-y-5">
      <h2 className="text-3xl font-black leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
        If you've been saying "I'll start later" —{" "}
        <br className="hidden sm:block" />
        <span className="text-orange">this is it.</span>
      </h2>

      <div className="space-y-2 text-base font-medium text-background/80 sm:text-lg">
        <p>No more watching tutorials.</p>
        <p>No more saving courses you won't finish.</p>
        <p className="pt-1 text-white">This is where you actually build.</p>
      </div>
    </div>

    {/* CTA */}
    <div className="flex flex-col items-center gap-4 pt-2">
      <Link
        href="/register"
        className="group inline-flex items-center gap-2 rounded-full bg-orange px-8 py-4 text-base font-bold text-white shadow-xl shadow-orange/20 transition-all hover:scale-[1.02] sm:px-10 sm:py-5"
      >
        Secure Your Spot Now
        <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
      </Link>

      <div className="flex items-center gap-2 rounded-full bg-orange/10 px-4 py-2 text-xs font-bold text-orange sm:text-sm">
        <AlertTriangle className="size-4" />
        Limited seats for Cohort 001 • Next intake price increases
      </div>
    </div>

    {/* Footer note */}
    <p className="text-xs font-medium text-background/60">
      You can keep waiting… or you can finally have something to show.
    </p>
  </div>
</MotionDiv>

      </div>
    </section>
  );
}

// "use client";

// import { 
//   User, 
//   Users, 
//   Activity, 
//   FileCheck2, 
//   ShieldCheck,
//   CheckCircle2,
//   Zap
// } from "lucide-react";
// import { MotionDiv } from "@/components/framer-motion/motion-components";

// // ==========================================
// // DATA
// // ==========================================
// const engineSteps = [
//   {
//     id: "01",
//     title: "Enter NextHive",
//     desc: "Create your account. Verify it. Your identity is anchored. Your profile goes live.",
//     icon: User,
//     mockUI: (
//       <div className="w-full max-w-[220px] space-y-3">
//         <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-card p-3">
//           <div className="flex size-10 items-center justify-center rounded-full border border-border bg-muted">
//             <User className="size-5 text-muted-foreground" />
//           </div>
//           <div className="flex-1">
//             <div className="mb-2 h-2 w-1/2 rounded-full bg-border" />
//             <div className="flex items-center gap-1.5">
//               <CheckCircle2 className="size-3 text-green-500" />
//               <span className="text-[10px] font-bold uppercase tracking-widest">
//                 Anchored
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>
//     ),
//   },

//   {
//     id: "02",
//     title: "Join or Form a Hive",
//     desc: "You operate inside a team structure with defined participation and shared output.",
//     icon: Users,
//     mockUI: (
//       <div className="w-full max-w-[220px] rounded-xl border border-border/60 bg-card p-4">
//         <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
//           Active Hive
//         </div>
//         <div className="flex items-center justify-between">
//           <div className="flex -space-x-2">
//             {[1, 2, 3, 4].map((i) => (
//               <div
//                 key={i}
//                 className="flex size-7 items-center justify-center rounded-full border-2 border-card bg-muted"
//               >
//                 <User className="size-3 text-muted-foreground" />
//               </div>
//             ))}
//           </div>
//           <div className="text-xs font-bold">Data Alpha</div>
//         </div>
//       </div>
//     ),
//   },

//   {
//     id: "03",
//     title: "Execute Activities",
//     desc: "You complete structured tasks with real datasets, repos, and requirements.",
//     bullets: [
//       "Defined datasets, repos, reports",
//       "Clear deadlines & difficulty levels",
//       "Solo or team execution"
//     ],
//     icon: Activity,
//     mockUI: (
//       <div className="w-full max-w-[240px] space-y-3 rounded-xl border border-border/60 bg-card p-4">
//         <div className="flex items-center justify-between">
//           <span className="text-[10px] font-bold uppercase tracking-widest text-orange">
//             Activity
//           </span>
//           <Activity className="size-3 text-orange" />
//         </div>
//         <div>
//           <div className="text-sm font-bold">Full EDA & QA</div>
//           <div className="text-[11px] text-muted-foreground">
//             Clean & profile dataset
//           </div>
//         </div>
//       </div>
//     ),
//   },

//   {
//     id: "04",
//     title: "Submit → Get Reviewed",
//     desc: "Structured submission, peer review, and scoring.",
//     bullets: [
//       "Structured submission",
//       "Peer + mentor review",
//       "Scoring & feedback"
//     ],
//     closing: "No silent completion.",
//     icon: FileCheck2,
//     mockUI: (
//       <div className="w-full max-w-[240px] rounded-xl border border-border/60 bg-card p-4">
//         <div className="text-xs font-bold mb-3">Review Status</div>

//         <div className="space-y-2 text-[11px]">
//           <div className="flex justify-between">
//             <span className="text-muted-foreground">Peer</span>
//             <span className="text-green-500 font-bold">Approved</span>
//           </div>
//           <div className="flex justify-between">
//             <span className="text-muted-foreground">Mentor</span>
//             <span className="text-green-500 font-bold">Approved</span>
//           </div>
//         </div>
//       </div>
//     ),
//   },

//   {
//     id: "05",
//     title: "Earn Verified Proof",
//     desc: "Approved work becomes portfolio assets and updates your reputation.",
//     bullets: [
//       "Portfolio asset minted",
//       "Contribution validated",
//       "Reputation updated"
//     ],
//     closing: "Everything compounds.",
//     icon: ShieldCheck,
//     mockUI: (
//       <div className="w-full max-w-[240px] rounded-xl border border-border/60 bg-card p-4">
//         <div className="text-[10px] font-bold uppercase text-muted-foreground mb-2">
//           Ledger Update
//         </div>

//         <div className="flex items-center justify-between">
//           <div>
//             <div className="text-xs font-bold">Portfolio Minted</div>
//             <div className="text-[10px] text-muted-foreground">Immutable</div>
//           </div>

//           <div className="flex items-center gap-1 rounded-md bg-orange/10 px-2 py-1 text-orange">
//             <Zap className="size-3" />
//             <span className="text-xs font-black">+REP</span>
//           </div>
//         </div>
//       </div>
//     ),
//   }
// ];

// // ==========================================
// // COMPONENT
// // ==========================================
// export default function HowItWorksSection() {
//   return (
//     <section className="bg-background py-16 md:py-24 lg:py-32">
//       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

//         <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">

//           {/* LEFT HEADER */}
//           <div className="lg:w-1/3">
//             <div className="lg:sticky lg:top-24">
//               <MotionDiv
//                 initial={{ opacity: 0, y: 10 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//               >
//                 <div className="mb-5 inline-flex rounded-full border border-border px-4 py-1.5">
//                   <span className="text-[10px] font-bold uppercase tracking-widest">
//                     How it works
//                   </span>
//                 </div>

//                 <h2 className="text-3xl sm:text-5xl font-black leading-[1.05]">
//                   The Work <br />
//                   <span className="text-orange">Engine</span>
//                 </h2>
//               </MotionDiv>
//             </div>
//           </div>

//           {/* RIGHT STEPS */}
//           <div className="lg:w-2/3 flex flex-col gap-6">

//             {engineSteps.map((step, i) => (
//               <MotionDiv
//                 key={step.id}
//                 initial={{ opacity: 0, y: 16 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: i * 0.05 }}
//                 className="
//                   relative flex flex-col gap-6
//                   rounded-2xl border border-border/50
//                   bg-card p-5 sm:p-7
//                   lg:flex-row lg:items-center
//                 "
//               >

//                 {/* MOBILE-FRIENDLY NUMBER (reduced noise) */}
//                 <div className="absolute right-4 top-4 text-5xl font-black text-foreground/5 lg:text-[7rem] lg:-bottom-10 lg:right-10">
//                   {step.id}
//                 </div>

//                 {/* TEXT */}
//                 <div className="flex-1 space-y-4">
//                   <div className="flex items-center gap-3">
//                     <step.icon className="size-5 text-foreground" />
//                     <span className="text-sm font-bold">{step.title}</span>
//                   </div>

//                   <p className="text-sm text-muted-foreground leading-relaxed">
//                     {step.desc}
//                   </p>

//                   {step.bullets && (
//                     <ul className="space-y-2">
//                       {step.bullets.map((b, idx) => (
//                         <li key={idx} className="flex gap-2 text-sm">
//                           <CheckCircle2 className="size-4 text-orange shrink-0 mt-0.5" />
//                           {b}
//                         </li>
//                       ))}
//                     </ul>
//                   )}

//                   {step.closing && (
//                     <p className="text-xs font-bold uppercase tracking-widest pt-2 border-t border-border/40">
//                       {step.closing}
//                     </p>
//                   )}
//                 </div>

//                 {/* MOCK UI — MOBILE STACK FIX */}
//                 <div className="w-full lg:w-[260px] flex justify-center lg:justify-end">
//                   <div className="scale-95 sm:scale-100">
//                     {step.mockUI}
//                   </div>
//                 </div>

//               </MotionDiv>
//             ))}
//           </div>

//         </div>
//       </div>
//     </section>
//   );
// }