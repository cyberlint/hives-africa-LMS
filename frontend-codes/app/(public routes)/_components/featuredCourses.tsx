"use client";

import Image from "next/image";
import { Star, Users, BarChart, Clock, ArrowRight } from "lucide-react";
import { CourseListItem } from "@/services/courses";
import { constructUrl } from "@/lib/construct-url";
import { motion } from "framer-motion";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface FeaturedCoursesProps {
  courses: CourseListItem[];
}

const FeaturedCourses = ({ courses }: FeaturedCoursesProps) => {
  if (!courses || courses.length === 0) return null;

  return (
    <div className="space-y-12">
      
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <Badge variant="outline" className="bg-orange/5 text-orange border-orange/20 px-3 py-1 font-bold tracking-widest uppercase text-[10px]">
            Curated Excellence
          </Badge>
          <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">
            Featured Masterclasses
          </h2>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
            Discover our most highly-rated curricula, handpicked by industry experts to accelerate your tech career.
          </p>
        </div>
        <Link href="/course" className="hidden md:flex items-center gap-2 text-sm font-bold text-foreground hover:text-orange transition-colors">
          View All <ArrowRight className="size-4" />
        </Link>
      </div>

      {/* The Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {courses.slice(0, 4).map((course, i) => (
          <motion.article
            key={course.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="group flex flex-col sm:flex-row w-full overflow-hidden rounded-[2rem] border border-border/50 bg-card hover:bg-card/80 shadow-sm hover:shadow-xl hover:border-orange/30 transition-all duration-500 relative cursor-pointer"
          >
            {/* Subtle Hover Glow */}
            <div className="absolute -top-32 -right-32 size-64 bg-foreground/5 blur-[100px] rounded-full group-hover:bg-orange/10 transition-colors duration-700 pointer-events-none z-0" />

            {/* Image Container */}
            <div className="relative w-full sm:w-[35%] min-h-[220px] sm:min-h-full bg-muted/40 overflow-hidden shrink-0 z-10">
              <Image
                src={
                  course.thumbnail
                    ? constructUrl(course.thumbnail)
                    : "/assets/courses/course-img4.png"
                }
                alt={course.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 sm:from-black/20 to-transparent" />
              
              {/* Category tag overlay on mobile */}
              <div className="absolute bottom-4 left-4 sm:hidden">
                <Badge variant="secondary" className="bg-background/90 backdrop-blur text-foreground border-border/50 text-[10px] uppercase font-bold tracking-wider">
                  {course.category?.name || "General"}
                </Badge>
              </div>
            </div>

            {/* Content Container */}
            <div className="w-full sm:w-[65%] flex flex-col p-6 sm:p-8 relative z-10">
              
              {/* Top Meta (Desktop Category & Price) */}
              <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                <Badge variant="secondary" className="hidden sm:inline-flex bg-muted/50 text-muted-foreground border-border/50 text-[10px] uppercase font-bold tracking-wider">
                  {course.category?.name || "General"}
                </Badge>

                <div className="flex flex-col items-end text-sm">
                  <span className="font-bold text-orange text-base md:text-lg leading-none">
                    ₦{course.current_price.toLocaleString()}
                  </span>
                  {course.original_price && course.original_price > course.current_price && (
                    <span className="text-xs font-medium text-muted-foreground line-through mt-1">
                      ₦{course.original_price.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              {/* Title */}
              <h3 className="text-lg md:text-xl font-bold text-foreground leading-snug line-clamp-2 transition-colors group-hover:text-orange mb-4">
                {course.title}
              </h3>

              {/* Instructor & Rating */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="size-6 rounded-full bg-muted border border-border/50 flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">
                      {course.instructor?.first_name?.[0] || "I"}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground">
                    {course.instructor?.full_name || "Lead Instructor"}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs">
                  <span className="flex items-center gap-1 font-bold text-foreground">
                    <Star className="size-3.5 text-orange" fill="currentColor" />
                    {course.average_rating.toFixed(1)}
                  </span>
                  <span className="text-muted-foreground font-medium">
                    ({course.total_reviews.toLocaleString()})
                  </span>
                </div>
              </div>

              {/* Footer Stats */}
              <div className="mt-auto pt-4 border-t border-border/50 flex flex-wrap justify-between items-center gap-4 text-xs font-medium text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Users className="size-4 opacity-70" />
                  <span>
                    <strong className="text-foreground">{course.total_enrollments.toLocaleString()}</strong> Builders
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <BarChart className="size-4 opacity-70" />
                    <span className="capitalize">{course.difficulty || "All Levels"}</span>
                  </div>
                  
                  <div className="flex items-center gap-1.5">
                    <Clock className="size-4 opacity-70" />
                    <span>Self-paced</span>
                  </div>
                </div>
              </div>
              
            </div>
          </motion.article>
        ))}
      </div>

      {/* Mobile View All */}
      <div className="md:hidden flex justify-center pt-2">
        <Link href="/course" className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-orange transition-colors">
          View All <ArrowRight className="size-4" />
        </Link>
      </div>

    </div>
  );
};

export default FeaturedCourses;