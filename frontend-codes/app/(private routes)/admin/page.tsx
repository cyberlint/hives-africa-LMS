import "server-only";

import { adminGetEnrolmentStats } from "@/app/data/admin/admin-get-enrollmentstats";
import { ChartAreaInteractive } from "@/components/lms/admin-sidebar/chart-area-interactive";
import { SectionCards } from "@/components/lms/admin-sidebar/section-cards";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { adminGetRecentCourses } from "@/app/data/admin/admin-get-recent-courses";
import { AdminCourseCard } from "./courses/_components/AdminCourseCard";
import { Plus } from "lucide-react";
import { Suspense } from "react";
import { EmptyState } from "@/components/shared/EmptyState";

export default async function AdminIndexPage() {
  const enrollmentData = await adminGetEnrolmentStats();

  return (
    <>
    <SectionCards />
    <ChartAreaInteractive data={enrollmentData}/>

    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Recent Courses</h2>
        <Link className={buttonVariants({variant: "outline"})} 
        href="/admin/courses">View All Courses
        </Link>
      </div>
      <Suspense fallback={<div>Loading recent courses...</div>}>
        <RenderRecentCourses />
      </Suspense>
    </div>
    </>
  );
}


async function RenderRecentCourses() {
  const data = await adminGetRecentCourses();

  if (data.length === 0) {
    return (
      <EmptyState
        title="No courses yet"
        description="You haven't created any courses yet."
        action={
          <Link
            href="/admin/courses/create"
            className={buttonVariants()}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create your first course
          </Link>
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {data.map((course) => (
        <AdminCourseCard key={course.id} data={course} />
      ))}
    </div>
  );
}