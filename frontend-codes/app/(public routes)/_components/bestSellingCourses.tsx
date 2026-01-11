"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { CourseListItem } from "@/services/courses";
import { constructUrl } from "@/lib/construct-url";
import Link from "next/link";
import { motion } from "framer-motion";

interface BestSellingCoursesProps {
  courses: CourseListItem[];
}

const BestSellingCourses = ({ courses }: BestSellingCoursesProps) => {
  return (
    <>
      <h4 className="text-center text-[32px] leading-10 font-semibold text-darkBlue-300 dark:text-gray-100">
        Best Selling Courses
      </h4>

      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.slice(0, 8).map((course) => (
          <motion.article
            key={course.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
            className="group flex flex-col overflow-hidden rounded-xl bg-white dark:bg-[#2a2f3a]
              shadow-[0_8px_24px_rgba(0,0,0,0.04)]
              transition-all duration-300"
          >
            {/* Image */}
            <div className="relative h-50 bg-muted/40">
              <Image
                src={
                  course.thumbnail
                    ? constructUrl(course.thumbnail)
                    : "/assets/courses/course-img1.png"
                }
                alt={course.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />

              {/* Category badge */}
              <span className="absolute top-3 left-3 rounded-full bg-white/90 dark:bg-black/60 px-3 py-1 text-[10px] font-semibold backdrop-blur">
                {course.category?.name || "General"}
              </span>

              {/* Price badge */}
              <span className="absolute top-3 right-3 rounded-full bg-white/90 dark:bg-black/60 px-3 py-1 text-xs font-semibold text-orange backdrop-blur">
                ₦{course.current_price.toLocaleString()}
              </span>
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col gap-3 p-5">
              <h3 className="text-sm font-semibold leading-snug text-darkBlue-300 dark:text-gray-100 transition-colors group-hover:text-orange line-clamp-2">
                {course.title}
              </h3>

              {/* Meta */}
              <div className="mt-auto flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 font-semibold text-darkBlue-300 dark:text-gray-100">
                  <Star fill="#FD8E1F" strokeWidth={0} size={14} />
                  {course.average_rating.toFixed(1)}
                </span>

                <span className="text-[#8C94A3] dark:text-gray-400">
                  {course.total_enrollments.toLocaleString()} students
                </span>
              </div>

              {/* CTA */}
              <Link
                href={`/course/${course.id}`}
                className="pt-3 text-sm font-semibold text-orange inline-flex items-center gap-1"
              >
                View course →
              </Link>
            </div>
          </motion.article>
        ))}
      </div>
    </>
  );
};

export default BestSellingCourses;
