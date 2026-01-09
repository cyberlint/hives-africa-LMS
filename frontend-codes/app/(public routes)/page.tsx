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
      <section 
  className="relative w-full min-h-162.5 md:min-h-195 overflow-hidden pb-8 md:pb-0"
>
  
  {/* Content Wrapper (Two Columns: Text on Left, Image on Right) */}
  <div 
    className="relative z-10 w-full mx-auto px-4 md:px-16 pt-16 md:pt-20 lg:flex lg:flex-row lg:items-start lg:justify-between h-full"
  >
    
    {/* ===== LEFT COLUMN: Text Content Container ===== */}
    <div className="lg:w-6/12 space-y-5 md:space-y-6 text-center lg:text-left pt-8 md:pt-0">
      
      {/* Title: Real-World AI Skills, Made Simple */}
      <h1 className="text-[40px] md:text-[48px] text-[#0A0A2D] dark:text-white font-bold leading-tight md:leading-tight pt-10">
        Real-World <span className="text-[#3273DC]">AI</span> Skills, <br className="hidden md:inline"/>Made Simple
      </h1>
      
      {/* Subtitle */}
      <p className="text-base md:text-lg text-[#323232] dark:text-gray-300 mx-auto lg:mx-0 max-w-xl">
        Beginner-friendly AI learning designed for Africans. Hands-on projects, peer support, and real-world application.
      </p>
      
      {/* CTA Button */}
      <div className="flex flex-col items-center lg:items-start space-y-3 pt-4">
        <Link
          href="/signup"
          className="bg-[#FCAE1A] text-white text-base font-semibold px-12 py-4 cursor-pointer hover:bg-[#FCAE1A]/90 transition inline-block rounded-lg shadow-xl hover:shadow-2xl"
        >
          Start Learning Now
        </Link>
        <p className="text-xs text-[#7B7B7B] dark:text-gray-400 font-medium">
          Backed by industry mentors
        </p>
      </div>
    </div>
    
    {/* ===== RIGHT COLUMN: Image Container ===== */}
    <div className="lg:w-6/12 mt-5 lg:mt-0 flex justify-center items-start lg:justify-end"> 
      
      <div className="relative w-full h-[25rem] md:h-[31.25rem] lg:h-[37.5rem] animate-bounce-slow">
        <Image
          src={"/assets/NextHive Hero.png"} 
          alt="Hero Illustration: Concentric circles and feature blocks"
          layout="fill"
          objectFit="contain"
          priority
          className="transition-opacity duration-500"
          quality={90}
        />
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
            NextHive is the leading pan-African, peer-driven tech school built for the AI era. If you've ever felt stuck or bored navigating a new tech field alone, NextHive is where you belong. Learn at your own pace while tapping into the energy of community, so you can build real skills faster.
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