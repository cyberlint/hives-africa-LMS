"use client";

import { Star } from "lucide-react";
import Image from "next/image";
import { CourseListItem } from "@/services/courses";
import { constructUrl } from "@/lib/construct-url";
import Link from "next/link";
import { motion } from "framer-motion";

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
          <motion.article
            key={course.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
            className="group flex w-full h-full overflow-hidden rounded-xl
              border border-[#E9EAF0] dark:border-[#404854]
              bg-white dark:bg-[#2a2f3a]
              shadow-[0_8px_24px_rgba(0,0,0,0.04)]
              transition-all duration-300
              cursor-pointer"
          >
            {/* Image */}
            <div className="relative w-[30%] bg-muted/40 overflow-hidden">
              <Image
                src={
                  course.thumbnail
                    ? constructUrl(course.thumbnail)
                    : "/assets/courses/course-img4.png"
                }
                alt={course.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            {/* Content */}
            <div className="w-[70%] flex flex-col transition-colors duration-300">
              <div className="space-y-2 px-5 py-4">
                <div className="flex flex-wrap justify-between items-center gap-x-2 gap-y-1">
                  <p className="uppercase text-[8px] font-semibold p-1 rounded bg-[#E1F7E3] dark:bg-green-900/30 text-[#15711F] dark:text-green-400">
                    {course.category?.name || "General"}
                  </p>

                  <p className="text-[10px] sm:text-xs md:text-sm text-darkBlue-300 dark:text-gray-100">
                    ₦{course.current_price.toLocaleString()}{" "}
                    {course.original_price &&
                      course.original_price > course.current_price && (
                        <span className="ml-1 text-[10px] md:text-xs text-[#A1A5B3] dark:text-gray-500 line-through">
                          ₦{course.original_price.toLocaleString()}
                        </span>
                      )}
                  </p>
                </div>

                <p className="text-[10px] sm:text-xs font-semibold text-darkBlue-300 dark:text-gray-100 line-clamp-2 transition-colors group-hover:text-orange">
                  {course.title}
                </p>

                <div className="flex flex-wrap justify-between items-center gap-y-1 pt-2">
                  <div className="flex items-center gap-2">
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
                      <Star fill="#FD8E1F" strokeWidth={0} size={16} />
                      {course.average_rating.toFixed(1)}
                    </p>

                    <p className="text-[#A1A5B3] dark:text-gray-500">
                      ({course.total_reviews.toLocaleString()})
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div
                className="mt-auto flex flex-wrap justify-between items-center gap-y-1
                border-t border-[#E9EAF0] dark:border-[#404854]
                text-[#4E5566] dark:text-gray-400
                text-[10px] sm:text-xs px-5 py-3 w-full"
              >
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
                    <span className="font-normal text-[#8C94A3] dark:text-gray-500">
                      students
                    </span>
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
                  <p className="font-medium capitalize text-darkBlue-300 dark:text-gray-100">
                    {course.difficulty || "All Levels"}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <Image
                    src="/assets/courses/clock.png"
                    alt="Duration"
                    width={50}
                    height={50}
                    className="h-4 w-4"
                  />
                  <p className="font-medium text-darkBlue-300 dark:text-gray-100">
                    Self-paced
                  </p>
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
 
    </>
  );
};

export default FeaturedCourses;
