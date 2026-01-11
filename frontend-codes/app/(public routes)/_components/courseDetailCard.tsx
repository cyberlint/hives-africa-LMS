"use client";

import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { CheckoutButton } from "@/components/lms/checkout-button";
import { CourseListItem } from "@/services/courses";
import { useEnrolledCourses } from "@/hooks/useEnrolledCourses";

const CourseDetailCard = ({ course }: { course: CourseListItem }) => {
  const { courses: enrolledCourses } = useEnrolledCourses();
  const isEnrolled = enrolledCourses?.some(c => c.courseId === course.id);

  const discountPercentage = course.original_price && course.original_price > course.current_price
    ? Math.round(((course.original_price - course.current_price) / course.original_price) * 100)
    : 0;

  return (
    <>
      <div className="flex px-0 md:px-4">
        <p className="uppercase text-[8px] font-semibold p-1 bg-[#E1F7E3] text-[#15711F]">
          {course.category?.name || "General"}
        </p>
      </div>

      <p className="text-[10px] sm:text-xs font-semibold text-darkBlue-300 dark:text-gray-100 line-clamp-2 px-0 md:px-4">
        {course.title}
      </p>

      <div className="flex justify-between items-center gap-2 px-0 md:px-4">
        <div className="flex justify-center items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-[#2a2f3a] flex items-center justify-center">
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
              {course.instructor?.first_name?.[0] || "I"}
            </span>
          </div>

          <p className="flex flex-col text-[10px] text-[#4E5566] dark:text-gray-400 font-medium">
            <span className="text-[#8C94A3] dark:text-gray-500 font-normal">Course by</span>
            {course.instructor?.full_name || "Instructor"}
          </p>
        </div>

        <div className="flex items-center gap-1 text-[10px]">
          <p className="flex items-center gap-1 font-semibold text-darkBlue-300 dark:text-gray-100">
            <span>
              <Star fill="#FD8E1F" strokeWidth={0} size={12} />
            </span>
            {course.average_rating.toFixed(1)}
          </p>

          <p className="text-[#A1A5B3] dark:text-gray-500">({course.total_reviews.toLocaleString()})</p>
        </div>
      </div>

      <div className="flex flex-wrap justify-between items-center gap-y-1 text-[#4E5566] dark:text-gray-400 text-[10px] px-0 md:px-4 w-full">
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

        <div className="flex items-center gap-1">
          <Image
            src="/assets/courses/level.png"
            alt="Level"
            width={50}
            height={50}
            className="h-4 w-4"
          />

          <p className="font-medium capitalize">{course.difficulty || "All Levels"}</p>
        </div>

        <div className="flex items-center gap-1">
          <Image
            src="/assets/courses/clock.png"
            alt="Duration"
            width={50}
            height={50}
            className="h-4 w-4"
          />

          <p className="font-medium">Self-paced</p>
        </div>
      </div>

      <div className="flex flex-wrap justify-between items-center px-0 md:px-4">
        <div className="flex justify-between items-center gap-2">
          <p className="flex items-center gap-1 text-sm text-darkBlue-300 dark:text-gray-100 font-medium">
            ₦{course.current_price.toLocaleString()}{" "}
            {course.original_price && course.original_price > course.current_price && (
              <span className="text-[10px] text-[#A1A5B3] dark:text-gray-500 line-through">
                ₦{course.original_price.toLocaleString()}
              </span>
            )}
          </p>

          {discountPercentage > 0 && (
            <div className="flex">
              <p className="uppercase text-[8px] bg-[#FFEEE8] dark:bg-orange/20 text-orange dark:text-orange font-semibold p-1">
                {discountPercentage}% OFF
              </p>
            </div>
          )}
        </div>

        <div className="bg-[#FFEEE8] dark:bg-orange/20 p-1">
          <Image
            src="/assets/courses/heart.png"
            alt="heart"
            width={50}
            height={50}
            className="h-4 w-4"
          />
        </div>
      </div>

      {course.short_description && (
        <div className="space-y-2 text-[10px] border-y border-[#E9EAF0] dark:border-[#404854] px-0 md:px-4 py-3">
          <p className="text-darkBlue-300 dark:text-gray-100 font-medium">ABOUT THIS COURSE</p>
          <p className="text-[#6E7485] dark:text-gray-400 line-clamp-3">{course.short_description}</p>
        </div>
      )}

      <div className="space-y-2 px-0 md:px-4">
        <CheckoutButton
          courseId={course.id}
          price={course.current_price.toString()}
          title={course.title}
          thumbnail={course.thumbnail}
          instructor={course.instructor?.full_name}
          size="sm"
          className="w-full rounded-none"
          variant="primary"
          label={isEnrolled ? "Enrolled" : "Add to Cart"}
          autoNavigate={true}
          isEnrolled={isEnrolled}
        />

        <Link
          href={`/course/${course.id}`}
          className="block text-center bg-[#fffce8] dark:bg-yellow/20 hover:bg-[#FFEEE8CC] dark:hover:bg-yellow/30 text-yellow dark:text-yellow text-xs font-semibold px-4 py-2 w-full transition-colors duration-300"
        >
          Course Detail
        </Link>
      </div>
    </>
  );
};

export default CourseDetailCard;
