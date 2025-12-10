"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { CourseListItem } from "@/services/courses";

interface BestSellingCoursesProps {
  courses: CourseListItem[];
}

const BestSellingCourses = ({ courses }: BestSellingCoursesProps) => {
  return (
    <>
      <h4 className="text-center text-[32px] leading-10 text-darkBlue-300 font-semibold">
        Best Selling Courses
      </h4>

      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-6">
        {courses.slice(0, 8).map((course) => (
            <div key={course.id} className="w-full cursor-pointer hover:shadow-lg transition-shadow">
              <div className="w-full">
                <Image
                  src={course.thumbnail || "/assets/courses/course-img1.png"}
                  alt={course.title}
                  width={400}
                  height={300}
                  className="object-cover w-full h-48"
                />
              </div>

              <div className="bg-white w-full">
                <div className="space-y-4 p-3">
                  <div className="flex flex-wrap justify-between items-center gap-1">
                    <p
                      className="uppercase text-[8px] font-semibold p-1 bg-[#FFEEE8] text-[#993D20]"
                    >
                      {course.category?.name || "General"}
                    </p>

                    <p className="text-xs md:text-sm font-semibold text-orange">
                      ₦{course.current_price.toLocaleString()}
                    </p>
                  </div>

                  <p className="text-[10px] sm:text-xs font-semibold text-darkBlue-300 line-clamp-2">
                    {course.title}
                  </p>
                </div>

                <div className="flex flex-wrap justify-between items-center gap-y-1 border-t border-[#E9EAF0] text-[#4E5566] text-[10px] sm:text-xs p-3 w-full">
                  <p className="flex items-center gap-1 font-semibold">
                    <span>
                      <Star fill="#FD8E1F" strokeWidth={0} size={16} />
                    </span>
                    {course.average_rating.toFixed(1)}
                  </p>

                  <p className="font-semibold">
                    {course.total_enrollments.toLocaleString()}{" "}
                    <span className="font-normal text-[#8C94A3]">students</span>
                  </p>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </>
  );
};

export default BestSellingCourses;
