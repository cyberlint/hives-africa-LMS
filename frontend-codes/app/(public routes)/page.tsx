import Image from "next/image";
import FeaturedCourses from "./_components/featuredCourses";
import BestSellingCourses from "./_components/bestSellingCourses";
import RecentlyAddedCourses from "./_components/recentlyAddedCourses";
import Link from "next/link";
import { getBestSellingCourses, getFeaturedCourses, getRecentlyAddedCourses } from "./_components/HomeClients/fetchData";

interface Category {
  name: string;
  icon: string;
  color: string;
  numberOfCourses: string;
}

const Home = async () => {
  // Parallel data fetching on the server
  const [featuredCourses, bestSellingCourses, recentlyAddedCourses] = await Promise.all([
    getFeaturedCourses(),
    getBestSellingCourses(8),
    getRecentlyAddedCourses(8),
  ]);

  const categories: Category[] = [
    {
      name: "Agentic AI",
      icon: "/assets/categories/label-category.png",
      color: "#EBEBFF",
      numberOfCourses: "63,476",
    },
    {
      name: "Large Language Models (LLMs)",
      icon: "/assets/categories/business-category.png",
      color: "#E1F7E3",
      numberOfCourses: "52,822",
    },
    {
      name: "Business Intelligence",
      icon: "/assets/categories/finance-category.png",
      color: "#FFF2E5",
      numberOfCourses: "33,841",
    },
    {
      name: "Data Analytics",
      icon: "/assets/categories/personalDev-category.png",
      color: "#FFFFFF",
      numberOfCourses: "20,126",
    },
    {
      name: "Data Engineering",
      icon: "/assets/categories/officeProd-category.png",
      color: "#F5F7FA",
      numberOfCourses: "13,932",
    },
    {
      name: "Python Programming",
      icon: "/assets/categories/photography-category.png",
      color: "#F5F7FA",
      numberOfCourses: "6,196",
    },
  ];

  return (
    <main className="-mb-16">
      
        {/* HERO SECTION */}
      <section className="relative w-full  bg-white dark:bg-[#1a1d24]  overflow-hidden transition-colors duration-300">
        {/* Decorative Background Elements */}
        {/* <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-72 h-72 bg-yellow/5 dark:bg-yellow/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#FCAE1A]/5 dark:bg-[#FCAE1A]/10 rounded-full blur-3xl"></div>
        </div> */}

        {/* Content Container */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 md:pt-24 md:pb-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* ===== LEFT COLUMN: Text Content ===== */}
            <div className="space-y-8 text-center lg:text-left">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-yellow/10 dark:bg-yellow/15 px-4 py-2 rounded-full">
                <span className="w-2 h-2 bg-yellow rounded-full animate-pulse"></span>
                <span className="text-sm font-medium text-yellow dark:text-yellow">
                  #1 AI Learning Platform in Africa
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#0A0A2D] dark:text-white leading-tight">
                Real-World{" "}
                <span className="bg-gradient-to-r from-yellow to-yellow-500 bg-clip-text text-transparent">
                  AI Skills
                </span>
                , Made Simple
              </h1>
              
              {/* Subtitle */}
              <p className="text-lg md:text-xl text-[#4A5568] dark:text-gray-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Beginner-friendly AI learning designed for Africans. Master in-demand skills with hands-on projects, peer support, and real-world application.
              </p>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-2">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow to-[#FFC04D] border-2 border-white dark:border-[#1d2026] flex items-center justify-center text-white text-xs font-semibold"
                      >
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold text-[#0A0A2D] dark:text-white">10,000+</p>
                    <p className="text-xs text-[#6E7485] dark:text-gray-400">Active Learners</p>
                  </div>
                </div>

                <div className="h-8 w-px bg-gray-300 dark:bg-gray-600"></div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className="w-4 h-4 text-[#FCAE1A]"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold text-[#0A0A2D] dark:text-white">4.9/5</p>
                    <p className="text-xs text-[#6E7485] dark:text-gray-400">Average Rating</p>
                  </div>
                </div>
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <Link
                  href="/signup"
                  className="group relative bg-gradient-to-r from-[#FCAE1A] to-[#FFC04D] text-white text-base font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 w-full sm:w-auto text-center"
                >
                  <span className="relative z-10">Start Learning Now</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FFC04D] to-[#FCAE1A] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
                
                <Link
                  href="/course"
                  className="flex items-center justify-center gap-2 text-yellow dark:text-yellow text-base font-semibold px-8 py-4 rounded-lg border-2 border-yellow dark:border-yellow hover:bg-yellow/50 hover:text-white dark:hover:bg-yellow/50 transition-all duration-300 w-full sm:w-auto"
                >
                  Browse Courses
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              {/* Small Trust Text */}
              <p className="text-sm text-[#6E7485] dark:text-gray-400 flex items-center justify-center lg:justify-start gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Backed by industry mentors • Free trial available
              </p>
            </div>
            
            {/* ===== RIGHT COLUMN: Image Container ===== */}
            <div className="relative lg:h-[600px] flex items-center justify-center">
              <div className="relative w-full h-[400px] md:h-[500px] lg:h-full">
                <Image
                  src={"/assets/NextHive Hero.png"} 
                  alt="Hero Illustration: AI Learning Platform"
                  layout="fill"
                  objectFit="contain"
                  priority
                  className="transition-transform duration-700 hover:scale-105"
                  quality={95}
                />
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* END OF HERO SECTION */}

      <section className="space-y-12 px-4 md:px-16 xl:px-36 py-16 lg:py-12 xl:py-16 bg-white dark:bg-[#1d2026] transition-colors duration-300">
        <h4 className="text-center text-[32px] md:text-4xl leading-10 text-darkBlue-300 dark:text-gray-100 font-semibold">
          Browse Top Category
        </h4>
        
        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <div
              key={index}
              className={`flex justify-between items-center gap-2 px-2 py-5 cursor-pointer w-full transition-all duration-300 ${
                category.color === "#FFFFFF"
                  ? "shadow-[0px_11.12px_29.65px_0px_#1D20261A] dark:shadow-none"
                  : ""
              }`}
              style={{
                background: category.color,
              }}
            >
              <Link href={`/course?category=${encodeURIComponent(category.name)}`} className="w-full flex justify-between items-center gap-2">
                <div className="flex justify-center items-center w-[30%]">
                  <Image
                    src={category.icon}
                    alt="Category Icon"
                    width={60}
                    height={60}
                    className="object-cover"
                  />
                </div>

                <div className="flex flex-col gap-2 w-[70%]">
                  <p className="text-sm font-medium text-gray-900">{category.name}</p>
                  <p className="text-xs text-[#6E7485]">
                    {category.numberOfCourses} Courses
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>

        <p className="text-center text-xs md:text-sm text-[#6E7485] dark:text-gray-400 font-medium">
          We have more category & subcategory.{" "}
          <span className="text-yellow cursor-pointer hover:underline">
            <Link href="/course">
              Browse All →
            </Link>
          </span>
        </p>
      </section>

      {/* Only render Best Selling section if data exists */}
      {bestSellingCourses && bestSellingCourses.length > 0 && (
        <section className="space-y-12 bg-[#F5F7FA] dark:bg-[#2a2f3a] px-4 md:px-16 xl:px-36 pt-16 lg:pt-20 pb-68 transition-colors duration-300">
          <BestSellingCourses courses={bestSellingCourses} />
        </section>
      )}

      <section className="space-y-12 bg-white dark:bg-[#1d2026] px-4 md:px-16 xl:px-36 pt-16 lg:pt-20 pb-25 sm:pb-30 lg:pb-35 transition-colors duration-300">
        {/* Only render Featured section if data exists */}
        {featuredCourses && featuredCourses.length > 0 && (
          <div className="bg-white dark:bg-[#2a2f3a] space-y-8 border border-[#E9EAF0] dark:border-[#404854] rounded-2xl px-6 py-16 md:p-16 -mt-64 transition-colors duration-300">
            <FeaturedCourses courses={featuredCourses} />
          </div>
        )}

        {/* Only render Recently Added section if data exists */}
        {recentlyAddedCourses && recentlyAddedCourses.length > 0 && (
          <div className="flex flex-col items-center space-y-8 mx-auto w-full">
            <RecentlyAddedCourses courses={recentlyAddedCourses} />
          </div>
        )}
      </section>

      <section className="flex flex-col xl:flex-row justify-between items-stretch gap-8 bg-[#F5F7FA] dark:bg-[#2a2f3a] px-4 md:px-16 xl:px-36 pt-16 lg:pt-20 pb-20 w-full transition-colors duration-300">
        <div
          className="flex-1 px-8 pt-10 w-full xl:w-1/2"
          style={{
            background: "linear-gradient(90deg, #CC522B 0%, #FF6636 100%)",
          }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-white w-full md:w-[70%] space-y-4 md:space-y-2">
              <h2 className="text-xl md:text-2xl font-semibold">
                Become an instructor
              </h2>

              <p className="text-xs md:text-sm">
                Instructors from around the world teach millions of students on
                your platform. We provide the tools and skills to teach what you
                love.
              </p>

              <button className="bg-white cursor-pointer text-yellow font-semibold text-xs md:text-sm px-6 py-3 mt-2 mb-6 w-fit hover:bg-white/95 transition">
                Start Teaching →
              </button>
            </div>

            <div className="w-full md:w-[30%] hidden md:flex justify-center md:justify-end">
              <Image
                src={"/assets/Become_an_Instructor.png"}
                alt="Become an Instructor"
                width={500}
                height={500}
                className="w-full max-w-xs md:max-w-sm object-contain"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center flex-1 space-y-6 bg-white dark:bg-[#1d2026] p-8 w-full xl:w-1/2 transition-colors duration-300">
          <p className="text-darkBlue-300 dark:text-gray-100 text-xl md:text-2xl font-semibold">
            Your teaching & earning steps
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                num: 1,
                text: "Apply to become instructor",
                bg: "#EBEBFF",
                color: "#564FFD",
              },
              {
                num: 2,
                text: "Build & edit your profile",
                bg: "#FFF0F0",
                color: "#FF6636",
              },
              {
                num: 3,
                text: "Create your new course",
                bg: "#FFF0F0",
                color: "#E34444",
              },
              {
                num: 4,
                text: "Start teaching & earning",
                bg: "#E1F7E3",
                color: "#23BD33",
              },
            ].map((item) => (
              <div key={item.num} className="flex items-center gap-4">
                <span
                  className="text-xs md:text-base font-semibold w-8 h-8 flex items-center justify-center rounded-full"
                  style={{ backgroundColor: item.bg, color: item.color }}
                >
                  {item.num}
                </span>

                <p className="text-darkBlue-300 dark:text-gray-100 text-[10px] md:text-sm font-medium">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="flex flex-col lg:flex-row justify-between items-center gap-8 bg-white dark:bg-[#1d2026] px-4 md:px-16 xl:px-36 pt-16 lg:pt-20 pb-35 w-full transition-colors duration-300">
        <div className="space-y-4 w-full lg:w-[30%]">
          <p className="font-semibold text-2xl text-darkBlue-300 dark:text-gray-100">
            Level up in Tech with NextHive!
          </p>

          <p className="text-xs text-[#6E7485] dark:text-gray-400 w-4/5">
            NextHive is the leading pan-African, peer-driven tech school built for the AI era. If you&apos;ve ever felt stuck or bored navigating a new tech field alone, NextHive is where you belong. Learn at your own pace while tapping into the energy of community, so you can build real skills faster.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full lg:w-[70%]">
          {[
            {
              id: "1",
              image: "/assets/netflix-logo.png",
            },
            {
              id: "2",
              image: "/assets/youtube-logo.png",
            },
            {
              id: "3",
              image: "/assets/google-logo.png",
            },
            {
              id: "4",
              image: "/assets/lenovo-logo.png",
            },
            {
              id: "5",
              image: "/assets/slack-logo.png",
            },
            {
              id: "6",
              image: "/assets/verizon-logo.png",
            },
            {
              id: "7",
              image: "/assets/lexmark-logo.png",
            },
            {
              id: "8",
              image: "/assets/microsoft-logo.png",
            },
          ].map((logo) => (
            <div
              key={logo.id}
              className="flex justify-center items-center bg-white dark:bg-[#2a2f3a] shadow-[0px_0px_28.48px_0px_#091A4412] dark:shadow-[0px_0px_28.48px_0px_#000000] px-4 transition-colors duration-300"
            >
              <Image
                src={logo.image}
                alt="logo"
                width={100}
                height={100}
                className="h-20 w-20"
              />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Home;