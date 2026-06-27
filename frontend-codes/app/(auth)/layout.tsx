import { redirectIfAuthenticated } from "@/lib/redirect-auth";


export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await redirectIfAuthenticated(); // server-side auth

  return <>{children}</>;
}