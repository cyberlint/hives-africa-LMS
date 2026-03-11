import Image from "next/image";
import FeaturedCourses from "./_components/featuredCourses";
import BestSellingCourses from "./_components/bestSellingCourses";
import RecentlyAddedCourses from "./_components/recentlyAddedCourses";
import TestimonialsCarousel from "@/components/shared/carousels";
import Link from "next/link";
import { getBestSellingCourses, getFeaturedCourses, getRecentlyAddedCourses } from "./_components/HomeClients/fetchData";
import { MotionDiv, MotionSection, MotionH1, MotionP } from "@/components/framer-motion/motion-components";
import { cn } from "@/lib/utils";
import { getCurrentUser } from "@/domains/auth/user";
import { get } from "http";

interface Category {
  name: string;
  icon: string;
  colorClass: string;
  numberOfCourses: string;
}

const Home = async () => {
  const user = await getCurrentUser();

  const [featuredCourses, bestSellingCourses, recentlyAddedCourses] = await Promise.all([
    getFeaturedCourses(),
    getBestSellingCourses(8),
    getRecentlyAddedCourses(8),
  ]);

  const categories: Category[] = [
    {
      name: "Agentic AI",
      icon: "/assets/categories/label-category.png",
      colorClass: "bg-indigo-500/10 hover:bg-indigo-500/20",
      numberOfCourses: "63,476",
    },
    {
      name: "Large Language Models (LLMs)",
      icon: "/assets/categories/business-category.png",
      colorClass: "bg-green-500/10 hover:bg-green-500/20",
      numberOfCourses: "52,822",
    },
    {
      name: "Business Intelligence",
      icon: "/assets/categories/finance-category.png",
      colorClass: "bg-orange/10 hover:bg-orange/20",
      numberOfCourses: "33,841",
    },
    {
      name: "Data Analytics",
      icon: "/assets/categories/personalDev-category.png",
      colorClass: "bg-blue-500/10 hover:bg-blue-500/20",
      numberOfCourses: "20,126",
    },
    {
      name: "Data Engineering",
      icon: "/assets/categories/officeProd-category.png",
      colorClass: "bg-purple-500/10 hover:bg-purple-500/20",
      numberOfCourses: "13,932",
    },
    {
      name: "Python Programming",
      icon: "/assets/categories/photography-category.png",
      colorClass: "bg-rose-500/10 hover:bg-rose-500/20",
      numberOfCourses: "6,196",
    },
  ];

  return (
    <main className="-mb-16 bg-background">
      {/* HERO SECTION */}
      <section className="relative w-full bg-background overflow-hidden transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 md:pt-20 md:pb-24">
          <div className="grid lg:grid-cols-2 gap-10 md:gap-16 items-center">

            <div className="space-y-6 md:space-y-8 text-center lg:text-left">
              <MotionDiv
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 bg-orange/10 px-4 py-2 rounded-full border border-orange/20"
              >
                <span className="w-2 h-2 bg-orange rounded-full animate-pulse"></span>
                <span className="text-xs md:text-sm font-medium text-orange">
                  #1 AI Learning Platform in Africa
                </span>
              </MotionDiv>

              <MotionH1
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight leading-[1.15] md:leading-[1.1]"
              >
                Real-World{" "}
                <span className="bg-gradient-to-r from-orange to-[#FFC04D] bg-clip-text text-transparent">
                  AI Skills,
                </span>
                <br className="hidden sm:block" />
                Made Simple
              </MotionH1>

              <MotionP
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
                className="text-base md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed"
              >
                Beginner-friendly AI learning designed for Africans. Master in-demand skills with hands-on projects, peer support, and real-world application.
              </MotionP>

              <MotionDiv
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-wrap items-center justify-center lg:justify-start gap-4 md:gap-6 pt-2"
              >
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-orange to-[#FFC04D] border-2 border-background flex items-center justify-center text-white text-xs font-semibold shadow-sm">
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                  </div>
                  <div className="text-sm">
                    <p className="font-bold text-foreground">10,000+</p>
                    <p className="text-xs text-muted-foreground font-medium">Active Learners</p>
                  </div>
                </div>

                <div className="h-8 w-px bg-border hidden sm:block"></div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="w-4 h-4 text-orange" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <div className="text-sm">
                    <p className="font-bold text-foreground">4.9/5</p>
                    <p className="text-xs text-muted-foreground font-medium">Average Rating</p>
                  </div>
                </div>
              </MotionDiv>

              <MotionDiv
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 md:gap-4 pt-4"
              >
                {user ? (
                  <Link href="/course" className="w-full sm:w-auto flex items-center justify-center gap-2 text-foreground text-base font-semibold px-8 py-3.5 md:py-4 rounded-full border-2 border-border hover:bg-muted transition-all duration-300">
                    Browse Courses
                    <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ) : (
                  <>
                    <Link href="/signup" className="w-full sm:w-auto bg-orange text-white text-base font-semibold px-8 py-3.5 md:py-4 rounded-full shadow-lg shadow-orange/20 hover:shadow-orange/40 transition-all duration-300 text-center">
                      Start Learning Now
                    </Link>
                    <Link href="/course" className="w-full sm:w-auto flex items-center justify-center gap-2 text-foreground text-base font-semibold px-8 py-3.5 md:py-4 rounded-full border-2 border-border hover:bg-muted transition-all duration-300">
                      Browse Courses
                      <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </>
                )}
              </MotionDiv>

              <MotionP
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.6 }}
                className="text-xs md:text-sm text-muted-foreground flex items-center justify-center lg:justify-start gap-2 font-medium"
              >
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Backed by industry mentors
              </MotionP>
            </div>

            <MotionDiv
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.2 }}
              className="relative h-[300px] sm:h-[400px] lg:h-[600px] flex items-center justify-center mt-8 lg:mt-0"
            >
              <Image
                src={"/assets/NextHive Hero.png"}
                alt="Hero Illustration: AI Learning Platform"
                fill
                style={{ objectFit: "contain" }}
                priority
                className="transition-transform duration-700 hover:scale-105"
              />
            </MotionDiv>
          </div>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <MotionSection
        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
        className="bg-background transition-colors duration-300 py-12 md:py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 md:space-y-12">
          <h4 className="text-center text-2xl md:text-4xl text-foreground font-bold tracking-tight">
            Browse Top Categories
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {categories.map((category, index) => (
              <MotionDiv key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}>
                <Link href={`/course?category=${encodeURIComponent(category.name)}`} className={cn("flex items-center gap-4 px-5 py-5 rounded-2xl border border-border transition-all duration-300", category.colorClass)}>
                  <div className="flex justify-center items-center shrink-0 bg-background rounded-xl p-2 shadow-sm border border-border/50">
                    <Image src={category.icon} alt={`${category.name} Icon`} width={40} height={40} className="object-cover" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm md:text-base font-bold text-foreground leading-tight">{category.name}</p>
                    <p className="text-xs md:text-sm text-muted-foreground font-medium">{category.numberOfCourses} Courses</p>
                  </div>
                </Link>
              </MotionDiv>
            ))}
          </div>

          <p className="text-center text-sm text-muted-foreground font-medium pt-2">
            We have more categories & subcategories.{" "}
            <Link href="/course" className="text-orange font-bold hover:underline underline-offset-4">Browse All →</Link>
          </p>
        </div>
      </MotionSection>

      {/* BEST SELLING SECTION */}
      {bestSellingCourses && bestSellingCourses.length > 0 && (
        <MotionSection
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
          className="bg-muted/30 transition-colors duration-300 border-y border-border py-12 md:py-20"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <BestSellingCourses courses={bestSellingCourses} />
          </div>
        </MotionSection>
      )}

      {/* FEATURED & RECENT SECTION */}
      <MotionSection
        initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
        className="bg-background transition-colors duration-300 pb-16 md:pb-24"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {featuredCourses && featuredCourses.length > 0 && (
            <MotionDiv className="bg-card space-y-6 md:space-y-8 border border-border shadow-sm rounded-3xl px-4 py-8 md:px-10 md:py-12 -mt-12 md:-mt-24 relative z-10 transition-colors duration-300">
              <FeaturedCourses courses={featuredCourses} />
            </MotionDiv>
          )}

          {recentlyAddedCourses && recentlyAddedCourses.length > 0 && (
            <div className="flex flex-col items-center space-y-8 mx-auto w-full pt-16 md:pt-20">
              <RecentlyAddedCourses courses={recentlyAddedCourses} />
            </div>
          )}
        </div>
      </MotionSection>

      {/* INSTRUCTOR SECTION */}
      <MotionSection
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
        className="bg-muted/30 transition-colors duration-300 border-t border-border py-12 md:py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-stretch w-full rounded-3xl shadow-sm border border-border overflow-hidden">

            <div className="flex-1 px-8 py-10 md:px-12 md:py-14 w-full lg:w-1/2 relative flex flex-col justify-center" style={{ background: "linear-gradient(135deg, #CC522B 0%, #FF6636 100%)" }}>
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 h-full">
                <div className="text-white w-full md:w-2/3 space-y-4 md:space-y-5 text-center md:text-left">
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Become an Instructor</h2>
                  <p className="text-white/90 leading-relaxed text-sm md:text-base">
                    Instructors from around the world teach millions of students on our platform. We provide the tools and skills to teach what you love.
                  </p>
                  <Link href="/posts/instructors" className="inline-block bg-white text-orange font-bold px-6 py-3 md:px-8 md:py-3.5 rounded-full hover:bg-white/90 hover:scale-105 transition-all shadow-md w-full sm:w-auto mt-2 text-center">
                    Start Teaching →
                  </Link>
                </div>
                <div className="w-full md:w-1/3 hidden md:flex justify-end">
                  <Image src={"/assets/Become_an_Instructor.png"} alt="Become an Instructor" width={250} height={250} className="w-full max-w-[180px] object-contain drop-shadow-xl" />
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center flex-1 space-y-6 md:space-y-8 bg-card p-8 md:p-12 w-full lg:w-1/2 transition-colors duration-300 border-t lg:border-t-0 lg:border-l border-border">
              <p className="text-foreground text-xl md:text-2xl font-bold tracking-tight text-center lg:text-left">
                Your teaching & earning steps
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
                {[
                  { num: 1, text: "Apply to become instructor", bg: "bg-indigo-500/10", color: "text-indigo-500" },
                  { num: 2, text: "Build & edit your profile", bg: "bg-orange/10", color: "text-orange" },
                  { num: 3, text: "Create your new course", bg: "bg-rose-500/10", color: "text-rose-500" },
                  { num: 4, text: "Start teaching & earning", bg: "bg-green-500/10", color: "text-green-500" },
                ].map((item) => (
                  <div key={item.num} className="flex items-center gap-3 md:gap-4">
                    <span className={cn("text-sm font-bold w-10 h-10 flex shrink-0 items-center justify-center rounded-full", item.bg, item.color)}>
                      {item.num}
                    </span>
                    <p className="text-foreground text-sm font-semibold">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </MotionSection>

      {/* PARTNERS / TRUST SECTION */}
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
              NextHive is the leading pan-African, peer-driven tech school built for the AI era. If you&apos;ve ever felt stuck or bored navigating a new tech field alone, NextHive is where you belong. Learn at your own pace while tapping into the energy of community.
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

      <TestimonialsCarousel />
    </main>
  );
};

export default Home;