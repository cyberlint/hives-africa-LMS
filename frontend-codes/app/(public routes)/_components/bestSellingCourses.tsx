"use client";

import Image from "next/image";
import { Star, ArrowRight, Users, BookOpen } from "lucide-react";
import { CourseListItem } from "@/services/courses";
import { constructUrl } from "@/lib/construct-url";
import Link from "next/link";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface BestSellingCoursesProps {
  courses: CourseListItem[];
}

const BestSellingCourses = ({ courses }: BestSellingCoursesProps) => {
  if (!courses || courses.length === 0) return null;

  return (
    <div className="space-y-12">
      {/* Premium Header */}
      <div className="flex flex-col items-center justify-center text-center space-y-4 max-w-2xl mx-auto">
        <Badge variant="outline" className="bg-orange/5 text-orange border-orange/20 px-3 py-1 font-bold tracking-widest uppercase text-[10px]">
          Trending Curricula
        </Badge>
        <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">
          Best Selling Tracks
        </h2>
        <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
          The highest-rated paths chosen by the NextHive community to build their verified portfolios this month.
        </p>
      </div>

      {/* The Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {courses.slice(0, 8).map((course, i) => (
          <motion.article
            key={course.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="group flex flex-col overflow-hidden rounded-[2rem] border border-border/50 bg-card hover:bg-card/80 shadow-sm hover:shadow-xl hover:border-orange/30 transition-all duration-500 relative"
          >
            {/* Subtle Hover Glow */}
            <div className="absolute -top-24 -right-24 size-48 bg-foreground/5 blur-3xl rounded-full group-hover:bg-orange/10 transition-colors duration-500 pointer-events-none z-0" />

            {/* Image Container */}
            <div className="relative h-[220px] w-full overflow-hidden bg-muted/40 z-10">
              <Image
                src={
                  course.thumbnail
                    ? constructUrl(course.thumbnail)
                    : "/assets/courses/course-img1.png"
                }
                alt={course.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Gradient overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/20" />

              {/* Category Badge */}
              <span className="absolute bottom-4 left-4 rounded-xl bg-background/80 backdrop-blur-md border border-border/50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-foreground">
                {course.category?.name || "Foundations"}
              </span>

              {/* Price Badge */}
              <span className="absolute top-4 right-4 rounded-xl bg-orange text-white px-3 py-1.5 text-xs font-bold shadow-lg shadow-orange/20">
                ₦{course.current_price.toLocaleString()}
              </span>
            </div>

            {/* Content Container */}
            <div className="flex flex-col flex-1 p-6 relative z-10">
              <h3 className="text-lg font-bold leading-snug text-foreground transition-colors group-hover:text-orange line-clamp-2 mb-4">
                {course.title}
              </h3>

              {/* Meta Stats */}
              <div className="mt-auto flex flex-wrap items-center gap-4 text-xs font-medium text-muted-foreground mb-6">
                <span className="flex items-center gap-1.5 bg-orange/10 text-orange px-2 py-1 rounded-md border border-orange/20">
                  <Star fill="currentColor" size={12} />
                  <span className="font-bold">{course.average_rating.toFixed(1)}</span>
                </span>

                <span className="flex items-center gap-1.5">
                  <Users size={14} className="opacity-70" />
                  {course.total_enrollments.toLocaleString()} Builders
                </span>
              </div>

              {/* CTA Footer */}
              <div className="pt-4 border-t border-border/50">
                <Link
                  href={`/course/${course.id}`}
                  className="w-full flex items-center justify-between text-sm font-bold text-foreground group-hover:text-orange transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <BookOpen className="size-4" /> View Curriculum
                  </span>
                  <ArrowRight className="size-4 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                </Link>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
      
      {/* View All Button */}
      <div className="flex justify-center pt-4">
        <Link href="/course" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-orange transition-colors">
          Browse Entire Catalog <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
};

export default BestSellingCourses;