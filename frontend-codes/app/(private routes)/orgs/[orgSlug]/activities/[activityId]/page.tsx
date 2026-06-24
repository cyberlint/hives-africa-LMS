import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { EditorSidebar } from "./_components/activity-sidebar";
import { OverviewSection } from "./_components/overview-section";
import { RequirementsSection } from "./_components/requirements-section";
import { SettingsSection } from "./_components/settings-section";
import { KSBSection } from "./_components/ksb-section";
import { ActivityActions } from "./_components/activity-actions";

export default async function ActivityEditorPage({
  params,
  searchParams,
}: {
  params: Promise<{ activityId: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  const activityId = resolvedParams.activityId;
  const currentTab = resolvedSearchParams.tab || "overview";

  // 1. ADDED: Fetch the global KSBs simultaneously for speed
  const [activity, programs, courses, globalKSBs] = await Promise.all([
    prisma.activity.findUnique({
      where: { id: activityId },
      include: { requirements: true, ksbs: true }
    }),
    prisma.program.findMany({ select: { id: true, title: true } }),
    prisma.course.findMany({ select: { id: true, title: true } }),
    prisma.kSB.findMany({ 
      select: { id: true, title: true, type: true }, 
      orderBy: { title: 'asc' } 
    })
  ]);

  if (!activity) {
    notFound();
  }

  // 2. ADDED: Format the existing KSBs so the React Hook Form can read them properly
  const formattedKSBs = activity.ksbs.map(k => ({
    ksbId: k.ksbId,
    weight: k.weight || 1.0
  }));

  return (
    <div className="flex flex-col h-full space-y-6 p-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/activities" className="p-2 hover:bg-muted rounded-md transition">
            <ArrowLeft className="size-5 text-muted-foreground" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{activity.title}</h1>
            <p className="text-sm text-muted-foreground">
              {activity.type.replace(/_/g, " ")} • Status:{" "}
              <span className="font-medium text-yellow-600">{activity.status}</span>
            </p>
          </div>
        </div>
        
        {/* Publish/Delete buttons */}
        <ActivityActions activityId={activity.id} currentStatus={activity.status} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
        <EditorSidebar activityId={activity.id} />

        <main className="max-w-3xl">
          {currentTab === "overview" && (
            <OverviewSection 
              initialData={activity} 
              activityId={activity.id} 
              programs={programs} 
              courses={courses} 
            />
          )}
          
          {currentTab === "requirements" && (
            <RequirementsSection 
              initialData={activity.requirements} 
              activityId={activity.id} 
            />
          )}

          {currentTab === "settings" && (
            <SettingsSection 
              initialData={activity} 
              activityId={activity.id} 
            />
          )}

          {currentTab === "ksb" && (
            <KSBSection 
              initialData={formattedKSBs} // Updated to pass the formatted data
              activityId={activity.id} 
              availableKSBs={globalKSBs}  // Passing the global library to the dropdown
            />
          )}
        </main>
      </div>
    </div>
  );
}