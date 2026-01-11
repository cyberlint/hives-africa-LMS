import { ReactNode } from "react"
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/domains/auth/user";
import LearnerShell from "@/components/shells/LearnerShell";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  // This ensures that even if they are logged in, they must have one of your two recognized roles.
 if (!user || (user.role !== "user" && user.role !== "admin")) {
    redirect("/signin");
}

  if (user.role === "admin") {
    redirect("/admin");
  }

  return (
    <LearnerShell>
      {children}
    </LearnerShell>
  );
}
