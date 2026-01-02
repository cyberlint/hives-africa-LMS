import { adminGetEnrolmentStats } from "@/app/data/admin/admin-get-enrollmentstats";
import { ChartAreaInteractive } from "@/components/lms/admin-sidebar/chart-area-interactive";
import { SectionCards } from "@/components/lms/admin-sidebar/section-cards";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";


export default async function AdminIndexPage() {
  const enrollmentData = await adminGetEnrolmentStats();

  return (
    <>
    <SectionCards />
    <ChartAreaInteractive data={enrollmentData}/>

    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Recent Courses</h2>
        <Link className={buttonVariants({variant: "outline"})} href="/admin/courses">View All Courses</Link>
      </div>


    </div>
    </>
  );
}