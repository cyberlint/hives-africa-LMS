import { requireAuth } from "@/lib/require-auth";
import ResponsiveLayout from "./responsive-layout";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();

  return <ResponsiveLayout>{children}</ResponsiveLayout>;
}
