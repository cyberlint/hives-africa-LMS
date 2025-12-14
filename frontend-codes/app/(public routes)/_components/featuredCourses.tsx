"use client";

import { Star } from "lucide-react";
import Image from "next/image";
import { CourseListItem } from "@/services/courses";
import { constructUrl } from "@/lib/construct-url";

interface FeaturedCoursesProps {
  courses: CourseListItem[];
}

const FeaturedCourses = ({ courses }: FeaturedCoursesProps) => {
  return (
    <>
      <div className="flex flex-wrap justify-between items-center gap-x-8 gap-y-2">
        <h4 className="text-3xl md:text-[32px] text-darkBlue-300 dark:text-gray-100 font-semibold w-full xl:w-1/2">
          Our Featured Courses
        </h4>

        <p className="text-xs text-[#4E5566] dark:text-gray-400 w-full xl:w-[35%]">
          Discover our most popular and highly-rated courses, handpicked for you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {courses.slice(0, 4).map((course) => (
            <div
              key={course.id}
              className="flex border border-[#E9EAF0] dark:border-[#404854] shadow-[0px_11.12px_29.65px_0px_#1D20261A] dark:shadow-[0px_11.12px_29.65px_0px_#000000] h-full w-full cursor-pointer hover:shadow-xl dark:hover:shadow-lg/30 transition-shadow"
            >
              <div className="h-full w-[30%]">
                <Image
                  src={course?.thumbnail ? constructUrl(course?.thumbnail) : "/assets/courses/course-img4.png"}
                  alt={course.title}
                  width={250}
                  height={300}
                  className="object-cover h-full w-full"
                />
              </div>

              <div className="bg-white dark:bg-[#2a2f3a] w-[70%] transition-colors duration-300">
                <div className="space-y-2 px-5 py-3">
                  <div className="flex flex-wrap justify-between items-center gap-x-2 gap-y-1">
                    <p
                      className="uppercase text-[8px] font-semibold p-1 bg-[#E1F7E3] dark:bg-green-900/30 text-[#15711F] dark:text-green-400"
                    >
                      {course.category?.name || "General"}
                    </p>

                    <p className="text-[10px] sm:text-xs md:text-sm text-darkBlue-300 dark:text-gray-100">
                      ₦{course.current_price.toLocaleString()}{" "}
                      {course.original_price && course.original_price > course.current_price && (
                        <span className="text-[10px] md:text-xs text-[#A1A5B3] dark:text-gray-500 line-through">
                          ₦{course.original_price.toLocaleString()}
                        </span>
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] sm:text-xs font-semibold text-darkBlue-300 dark:text-gray-100 line-clamp-2">
                      {course.title}
                    </p>
                  </div>

                  <div className="flex flex-wrap justify-between items-center gap-y-1 pt-2">
                    <div className="flex justify-center items-center gap-2">
                      <div className="h-4 sm:h-6 w-4 sm:w-6 rounded-full bg-gray-200 dark:bg-[#404854] flex items-center justify-center">
                        <span className="text-[8px] font-semibold text-gray-600 dark:text-gray-300">
                          {course.instructor?.first_name?.[0] || "I"}
                        </span>
                      </div>

                      <p className="text-[10px] sm:text-xs text-[#4E5566] dark:text-gray-400 font-medium">
                        {course.instructor?.full_name || "Instructor"}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 text-[10px] sm:text-xs">
                      <p className="flex items-center gap-1 font-semibold text-darkBlue-300 dark:text-gray-100">
                        <span>
                          <Star fill="#FD8E1F" strokeWidth={0} size={16} />
                        </span>
                        {course.average_rating.toFixed(1)}
                      </p>

                      <p className="text-[#A1A5B3] dark:text-gray-500">({course.total_reviews.toLocaleString()})</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap justify-between items-center gap-y-1 border-t border-[#E9EAF0] dark:border-[#404854] text-[#4E5566] dark:text-gray-400 text-[10px] sm:text-xs px-5 py-3 w-full">
                  <div className="flex items-center gap-1">
                    <Image
                      src="/assets/courses/user.png"
                      alt="User"
                      width={50}
                      height={50}
                      className="h-4 w-4"
                    />

                    <p className="font-semibold text-darkBlue-300 dark:text-gray-100">
                      {course.total_enrollments.toLocaleString()}{" "}
                      <span className="font-normal text-[#8C94A3] dark:text-gray-500">students</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <Image
                      src="/assets/courses/level.png"
                      alt="Level"
                      width={50}
                      height={50}
                      className="h-4 w-4"
                    />

                    <p className="font-medium capitalize text-darkBlue-300 dark:text-gray-100">{course.difficulty || "All Levels"}</p>
                  </div>

                  <div className="flex items-center gap-1">
                    <Image
                      src="/assets/courses/clock.png"
                      alt="Duration"
                      width={50}
                      height={50}
                      className="h-4 w-4"
                    />

                    <p className="font-medium text-darkBlue-300 dark:text-gray-100">Self-paced</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </>
  );
};

export default FeaturedCourses;
