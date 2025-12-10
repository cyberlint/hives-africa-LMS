"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Star } from "lucide-react";
import { CourseListItem } from "@/services/courses";
import CourseDetailCard from "./courseDetailCard";
import Link from "next/link";

interface RecentlyAddedCoursesProps {
  courses: CourseListItem[];
}

const RecentlyAddedCourses = ({ courses }: RecentlyAddedCoursesProps) => {
  const [hoveredCourse, setHoveredCourse] = useState<CourseListItem | null>(null);
  const [detailCardDirection, setDetailCardDirection] = useState<"left" | "right">("right");
  const [isMobile, setIsMobile] = useState(false);

  const detailCardRef = useRef<HTMLDivElement | null>(null);
  const courseRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const updateScreenType = () => {
      const hasHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      setIsMobile(!hasHover);
    };

    updateScreenType();
    window.addEventListener("resize", updateScreenType);

    return () => window.removeEventListener("resize", updateScreenType);
  }, []);

  const handleCardHover = (course: CourseListItem) => {
    const card = courseRefs.current[course.id];

    if (card) {
      const rect = card.getBoundingClientRect();
      const spaceRight = window.innerWidth - rect.right;
      const spaceLeft = rect.left;

      if (spaceRight < 350 && spaceLeft > spaceRight) {
        setDetailCardDirection("left");
      } else {
        setDetailCardDirection("right");
      }
    }

    setHoveredCourse(course);
  };

  return (
    <>
      <h4 className="text-center text-3xl md:text-[32px] text-darkBlue-300 font-semibold w-full">
        Recently Added Courses
      </h4>

      <div className="relative z-0 overflow-visible flex flex-col lg:flex-row justify-between gap-6 w-full">
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-6 lg:ml-16">
          {courses.slice(0, 8).map((course) => (
              <div
                key={course.id}
                className="relative"
                ref={(el) => {
                  courseRefs.current[course.id] = el;
                }}
                onMouseEnter={() => {
                  if (isMobile) return;
                  if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
                  handleCardHover(course);
                }}
                onMouseLeave={() => {
                  if (isMobile) return;
                  if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
                  closeTimerRef.current = setTimeout(() => {
                    setHoveredCourse((prev) => (prev?.id === course.id ? null : prev));
                  }, 120);
                }}
              >
                {/* Course Card */}
                <div className="cursor-pointer border border-[#E9EAF0] w-full hover:shadow-lg transition-shadow">
                  <Image
                    src={course.thumbnail || "/assets/courses/course-img11.png"}
                    alt={course.title}
                    width={400}
                    height={300}
                    className="object-cover w-full h-48"
                  />

                  {/* Text content */}
                  <div className="bg-white w-full">
                    <div className="space-y-4 p-3">
                      <div className="flex flex-wrap justify-between items-center gap-1">
                        <p className="uppercase text-[8px] font-semibold p-1 bg-[#FFEEE8] text-[#993D20]">
                          {course.category?.name || "General"}
                        </p>
                        <p className="text-xs md:text-sm font-semibold text-yellow">
                          ₦{course.current_price.toLocaleString()}
                        </p>
                      </div>

                      <p className="text-[10px] sm:text-xs font-semibold text-darkBlue-300 line-clamp-2">
                        {course.title}
                      </p>
                    </div>

                    <div className="flex flex-wrap justify-between items-center gap-y-1 border-t border-[#E9EAF0] text-[#4E5566] text-[10px] sm:text-xs p-3 w-full">
                      <p className="flex items-center gap-1 font-semibold">
                        <Star fill="#FD8E1F" strokeWidth={0} size={16} />
                        {course.average_rating.toFixed(1)}
                      </p>
                      <div className="flex items-center gap-1">
                        <Image
                          src="/assets/courses/user.png"
                          alt="User"
                          width={50}
                          height={50}
                          className="h-4 w-4"
                        />
                        <p className="font-semibold">
                          {course.total_enrollments.toLocaleString()}{" "}
                          <span className="font-normal text-[#8C94A3]">students</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hover Detail Card (Desktop Only) */}
                {!isMobile && (
                  (() => {
                    const isActive = hoveredCourse?.id === course.id;
                    const basePos =
                      detailCardDirection === "left"
                        ? isActive
                          ? "right-full translate-x-0"
                          : "right-full translate-x-16"
                        : "left-full translate-x-0";
                    return (
                      <div
                        ref={detailCardRef}
                        onMouseEnter={() => {
                          if (isMobile) return;
                          if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
                          if (hoveredCourse?.id !== course.id) handleCardHover(course);
                        }}
                        onMouseLeave={() => {
                          if (isMobile) return;
                          if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
                          closeTimerRef.current = setTimeout(() => {
                            setHoveredCourse((prev) => (prev?.id === course.id ? null : prev));
                          }, 120);
                        }}
                        className={`absolute -top-1/4 ${basePos} -ml-16 py-6 w-84 space-y-4 border rounded shadow-[0px_11.12px_29.65px_0px_#1D20261A] bg-white z-50 transition-all duration-200 ease-in-out ${
                          isActive
                            ? "opacity-100 scale-100 pointer-events-auto"
                            : "opacity-0 scale-95 pointer-events-none"
                        }`}
                      >
                        {hoveredCourse && <CourseDetailCard course={hoveredCourse} />}
                      </div>
                    );
                  })()
                )}
              </div>
            ))
          }
        </div>
      </div>

      <button className="cursor-pointer bg-[#fffce8] hover:bg-[#FFEEE8CA] text-yellow text-xs font-semibold px-6 py-3">
        <Link href="/course">Browse All Courses →</Link>
      </button>
    </>
  );
};

export default RecentlyAddedCourses;
