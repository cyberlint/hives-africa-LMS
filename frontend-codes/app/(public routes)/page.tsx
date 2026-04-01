import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Components
import { MotionDiv, MotionSection, MotionH1, MotionP } from "@/components/framer-motion/motion-components";
import { cn } from "@/lib/utils";
import TestimonialsCarousel from "@/components/shared/carousels";

// Page Sections
import { LivePulseFeed } from "./_components/live-pulse-feed";
import PanAfricanVision from "./_components/pan-african-vision";
import FeaturedCourses from "./_components/featuredCourses";
import BestSellingCourses from "./_components/bestSellingCourses";
import TheArena from "./_components/the-arena";
import TheHives from "./_components/the-hives";
import TheVanguard from "./_components/the-vanguard";

// Data Fetching
import { getCurrentUser } from "@/domains/auth/user";
import {
  getBestSellingCourses,
  getFeaturedCourses,
  getLivePulseData,
  getArenaChallenges,
  getActiveHives,
  getTheVanguard
} from "./_components/HomeClients/fetchData";

const Home = async () => {
  const user = await getCurrentUser();

  const [featuredCourses, bestSellingCourses, arenaChallenges, livePulseData, activeHives, vanguardLeaders] = await Promise.all([
    getFeaturedCourses(),
    getBestSellingCourses(8),
    getArenaChallenges(),
    getLivePulseData(),
    getActiveHives(),
    getTheVanguard(),
  ]);

  return (
    <main className="-mb-16 bg-background">

      {/* 1. THE HOOK: Hero & Live Pulse */}
      <section className="relative w-full bg-background overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-14 sm:pt-14 sm:pb-16 md:pt-20 md:pb-24">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-14 lg:gap-16 items-center">

            {/* LEFT CONTENT */}
            <div className="space-y-6 sm:space-y-7 md:space-y-8 text-center lg:text-left">

              {/* BADGE */}
              <MotionDiv
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 bg-orange/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-orange/20 shadow-sm"
              >
                <span className="w-2 h-2 bg-orange rounded-full animate-pulse"></span>
                <span className="text-[10px] sm:text-xs md:text-sm font-bold tracking-wide text-orange">
                  #1 AI Learning Ecosystem in Africa
                </span>
              </MotionDiv>

              {/* HEADLINE */}
              <MotionH1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-[2rem] leading-[1.2] sm:text-4xl md:text-5xl lg:text-[4rem] font-black text-foreground tracking-tight text-balance"
              >
                Learn.{" "}
                <span className="bg-gradient-to-r from-orange to-amber-500 bg-clip-text text-transparent">
                  Build.
                </span>{" "}
                <br className="hidden sm:block" />
                Get Recognized.
              </MotionH1>

              {/* DESCRIPTION */}
              <MotionP
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed text-balance"
              >
                Join live challenges, collaborate with peers, earn reputation, and build verifiable skills — not just certificates.
              </MotionP>

              {/* SOCIAL PROOF */}
              <MotionDiv
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5 sm:gap-6 pt-2"
              >
                {/* AVATARS */}
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="size-7 sm:size-8 md:size-10 rounded-full border-2 border-background overflow-hidden bg-muted shadow-sm"
                      >
                        <img
                          src={`https://i.pravatar.cc/100?img=${i + 10}`}
                          alt="Builder"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="text-xs sm:text-sm">
                    <p className="font-black text-foreground">10,000+</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground font-medium">
                      Active Builders
                    </p>
                  </div>
                </div>

                {/* DIVIDER */}
                <div className="hidden sm:block h-10 w-px bg-border"></div>

                {/* RATING */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <div className="text-xs sm:text-sm">
                    <p className="font-black text-foreground">4.9/5</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground font-medium">
                      Platform Rating
                    </p>
                  </div>
                </div>
              </MotionDiv>

              {/* CTA */}
              <MotionDiv
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-4 sm:pt-6"
              >
                {user ? (
                  <Link
                    href="/dashboard"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 text-background bg-yellow text-sm sm:text-base font-bold px-6 sm:px-8 py-3.5 sm:py-4 rounded-full hover:scale-[1.02] transition-transform shadow-xl"
                  >
                    Enter Ecosystem
                    <ArrowRight className="size-4 sm:size-5" />
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/signup"
                      className="w-full sm:w-auto bg-orange text-white text-sm sm:text-base font-bold px-6 sm:px-8 py-3.5 sm:py-4 rounded-full shadow-lg shadow-orange/20 hover:shadow-orange/40 hover:scale-[1.02] transition-all text-center"
                    >
                      Start Building Now
                    </Link>
                    <Link
                      href="/course"
                      className="w-full sm:w-auto flex items-center justify-center gap-2 text-foreground text-sm sm:text-base font-bold px-6 sm:px-8 py-3.5 sm:py-4 rounded-full border-2 border-border/50 hover:bg-muted transition-colors"
                    >
                      Explore Tracks
                    </Link>
                  </>
                )}
              </MotionDiv>
            </div>

            {/* RIGHT: LIVE FEED */}
            <MotionDiv
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative mt-6 sm:mt-10 lg:mt-0 flex items-center justify-center lg:justify-end w-full"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[260px] sm:size-[320px] md:size-[400px] bg-orange/10 blur-[80px] md:blur-[100px] rounded-full pointer-events-none -z-10" />

              <div className="w-full max-w-[420px] md:max-w-[480px] lg:max-w-[520px]">
                <LivePulseFeed initialData={livePulseData} />
              </div>
            </MotionDiv>
          </div>
        </div>
      </section>

      {/* 2. THE IDENTITY: Pan-African Vision */}
      <PanAfricanVision />

      {/* 3. THE PHILOSOPHY: Competency Loop (KSBs) */}
      <MotionSection
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
        className="bg-muted/30 transition-colors duration-300 border-y border-border py-16 md:py-24"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-stretch w-full rounded-[2.5rem] shadow-sm border border-border overflow-hidden bg-card">

            <div className="flex-1 px-8 py-12 md:px-12 md:py-16 w-full lg:w-1/2 relative flex flex-col justify-center overflow-hidden" style={{ background: "linear-gradient(135deg, #18181b 0%, #09090b 100%)" }}>
              <div className="absolute top-0 right-0 size-64 bg-orange/10 blur-[80px] rounded-full pointer-events-none" />
              <div className="absolute bottom-0 left-0 size-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />

              <div className="relative z-10 flex flex-col h-full justify-center space-y-8">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-orange font-bold text-xs uppercase tracking-widest">
                    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                    Beyond Certificates
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white leading-tight">
                    {"We don't just teach tech."} <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange to-amber-400">We build professionals.</span>
                  </h2>
                  <p className="text-zinc-400 leading-relaxed text-base md:text-lg max-w-md">
                    {"Employers don't hire paper certificates; they hire proven problem solvers. Every project you complete on NextHive builds a cryptographically verified portfolio mapped across three critical dimensions."}
                  </p>
                </div>

                <div className="flex items-center gap-6 pt-4">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center size-8 rounded-full bg-blue-500/20 text-blue-400 font-bold text-xs">K</div>
                      <span className="text-sm font-semibold text-white">Knowledge <span className="text-zinc-500 font-normal">(Theory)</span></span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center size-8 rounded-full bg-orange/20 text-orange font-bold text-xs">S</div>
                      <span className="text-sm font-semibold text-white">Skill <span className="text-zinc-500 font-normal">(Execution)</span></span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center size-8 rounded-full bg-green-500/20 text-green-400 font-bold text-xs">B</div>
                      <span className="text-sm font-semibold text-white">Behavior <span className="text-zinc-500 font-normal">(Teamwork)</span></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center flex-1 space-y-8 bg-card p-8 md:p-12 lg:p-16 w-full lg:w-1/2 transition-colors duration-300 border-t lg:border-t-0 lg:border-l border-border">
              <div className="space-y-2">
                <h3 className="text-foreground text-2xl font-bold tracking-tight">
                  The Competency Loop
                </h3>
                <p className="text-muted-foreground text-sm">How you build your immutable professional record.</p>
              </div>

              <div className="space-y-6">
                {[
                  {
                    icon: <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
                    title: "1. Absorb Knowledge",
                    desc: "Master the underlying theory through our world-class, localized curricula.",
                    bg: "bg-blue-500/10", color: "text-blue-500"
                  },
                  {
                    icon: <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>,
                    title: "2. Execute Skills",
                    desc: "Apply your knowledge by building solutions to real-world African challenges.",
                    bg: "bg-orange/10", color: "text-orange"
                  },
                  {
                    icon: <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
                    title: "3. Prove Behavior",
                    desc: "Lead hives, collaborate in teams, and provide technical peer reviews.",
                    bg: "bg-green-500/10", color: "text-green-500"
                  },
                  {
                    icon: <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
                    title: "4. Mint Your Portfolio",
                    desc: "Unlock an immutable, verified dossier of your competency to share with employers.",
                    bg: "bg-purple-500/10", color: "text-purple-500"
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <span className={cn("mt-1 flex shrink-0 items-center justify-center size-10 rounded-xl", item.bg, item.color)}>
                      {item.icon}
                    </span>
                    <div className="flex flex-col">
                      <p className="text-foreground font-bold text-base">{item.title}</p>
                      <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Link href={user ? "/dashboard" : "/signup"} className="inline-flex items-center justify-center w-full sm:w-auto bg-orange text-white font-bold px-8 py-4 rounded-full hover:scale-[1.02] transition-transform shadow-lg shadow-orange/20">
                  Start Building Your Record →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </MotionSection>

      {/* 4. THE FOUNDATION: Tech Tracks */}
      <MotionSection
        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
        className="bg-background transition-colors duration-300 py-16 md:py-24 relative"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 md:space-y-14">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <h2 className="text-3xl md:text-4xl text-foreground font-black tracking-tight">
                Specialized Tech Tracks
              </h2>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                Choose a track, master the core stack, and start building verified projects immediately.
              </p>
            </div>
            <Link href="/course" className="hidden md:flex items-center gap-2 text-sm font-bold text-foreground hover:text-orange transition-colors">
              Explore All Disciplines <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Agentic AI Engineering",
                description: "Build autonomous AI agents and production-ready RAG systems.",
                icon: <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" /></svg>,
                skills: ["LangChain", "Python", "Vector DBs"],
                colorClass: "text-indigo-500",
                bgClass: "bg-indigo-500/10 border-indigo-500/20",
              },
              {
                name: "Data Engineering",
                description: "Architect scalable data pipelines and robust infrastructure.",
                icon: <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" /></svg>,
                skills: ["SQL", "Apache Spark", "Airflow"],
                colorClass: "text-purple-500",
                bgClass: "bg-purple-500/10 border-purple-500/20",
              },
              {
                name: "Business Intelligence",
                description: "Transform raw data into strategic decision-making dashboards.",
                icon: <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>,
                skills: ["Power BI", "Tableau", "DAX"],
                colorClass: "text-orange",
                bgClass: "bg-orange/10 border-orange/20",
              },
            ].map((track, index) => (
              <MotionDiv
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={`/course?category=${encodeURIComponent(track.name)}`} className="group flex flex-col h-full p-6 sm:p-8 rounded-[2rem] bg-card border border-border/50 shadow-sm hover:shadow-xl hover:border-orange/30 transition-all duration-300 relative overflow-hidden">
                  <div className="absolute -top-24 -right-24 size-48 bg-foreground/5 blur-3xl rounded-full group-hover:bg-orange/10 transition-colors duration-500 pointer-events-none" />
                  <div className="flex items-center justify-between mb-6 relative z-10">
                    <div className={cn("flex justify-center items-center shrink-0 rounded-2xl p-3 shadow-sm border", track.bgClass, track.colorClass)}>
                      {track.icon}
                    </div>
                    <ArrowRight className="size-5 text-muted-foreground/30 group-hover:text-orange group-hover:-rotate-45 transition-all duration-300" />
                  </div>
                  <div className="space-y-2 mb-8 relative z-10 flex-1">
                    <h3 className="text-xl font-bold text-foreground leading-tight group-hover:text-orange transition-colors">{track.name}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{track.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-auto relative z-10 pt-4 border-t border-border/50">
                    {track.skills.map((skill, i) => (
                      <span key={i} className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-md border border-border/50">
                        {skill}
                      </span>
                    ))}
                  </div>
                </Link>
              </MotionDiv>
            ))}
          </div>
        </div>
      </MotionSection>

      {/* 5. THE CURRICULUM: Featured & Best Selling Courses */}
      <section className="bg-muted/30 transition-colors duration-300 border-t border-border py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          {featuredCourses && featuredCourses.length > 0 && (
            <FeaturedCourses courses={featuredCourses} />
          )}
          {bestSellingCourses && bestSellingCourses.length > 0 && (
            <BestSellingCourses courses={bestSellingCourses} />
          )}
        </div>
      </section>

      {/* 6. THE APPLICATION: The Arena */}
      <section className="bg-background transition-colors duration-300">
        <TheArena challenges={arenaChallenges || []} />
      </section>

      {/* 7. THE COMMUNITY: The Hives */}
      <TheHives hives={activeHives || []} />

      {/* 8. THE GLORY: The Vanguard */}
      <TheVanguard leaders={vanguardLeaders || []} />

      {/* 9. THE TRUST: Partners */}
      <MotionSection
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
        className="bg-background transition-colors duration-300 py-16 md:py-24"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row justify-between items-center gap-10 md:gap-12">
          <div className="space-y-4 w-full lg:w-[40%] text-center lg:text-left">
            <h3 className="font-bold text-2xl md:text-3xl text-foreground tracking-tight">
              Level up in Tech with NextHive!
            </h3>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              NextHive is the leading pan-African, peer-driven tech school built for the AI era. If you&apos;ve ever felt stuck or bored navigating a new tech field alone, NextHive is where you belong.
            </p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 md:gap-4 w-full lg:w-[60%]">
            {[
              { id: "1", image: "/assets/netflix-logo.png" },
              { id: "2", image: "/assets/youtube-logo.png" },
              { id: "3", image: "/assets/google-logo.png" },
              { id: "4", image: "/assets/lenovo-logo.png" },
              { id: "5", image: "/assets/slack-logo.png" },
              { id: "6", image: "/assets/verizon-logo.png" },
              { id: "7", image: "/assets/lexmark-logo.png" },
              { id: "8", image: "/assets/microsoft-logo.png" },
            ].map((logo, index) => (
              <MotionDiv key={logo.id} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.05 }}
                className="flex justify-center items-center bg-card border border-border/50 rounded-xl py-4 px-2 md:py-6 md:px-4 shadow-sm"
              >
                <Image src={logo.image} alt="Partner logo" width={80} height={80} className="h-8 md:h-10 w-auto object-contain opacity-70 dark:invert" />
              </MotionDiv>
            ))}
          </div>
        </div>
      </MotionSection>

      {/* 10. THE VALIDATION: Testimonials */}
      <TestimonialsCarousel />

    </main>
  );
};

export default Home;