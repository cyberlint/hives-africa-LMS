import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/domains/auth/user";
import { AdminShell } from "@/components/shells/AdminShell";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();

  if (!user || (user.role !== "user" && user.role !== "admin")) {
    redirect("/signin");
  }

  if (user.role !== "admin") {
    redirect("/dashboard");
  }

  return <AdminShell>{children}</AdminShell>;
}
