
import Footer from "@/components/shared/footer";
import Navbar from "@/components/shared/navbar";
import Topbar from "@/components/shared/topbar";

/**
 * Public routes layout: wraps only public marketing / browsing pages.
 * Student dashboard area has its own layout under (private routes)/(student).
 */
export default function PublicRoutesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
    <main className="overflow-x-hidden bg-white dark:bg-[#1d2026] transition-colors duration-300">
      <Topbar />
      <Navbar />
      {children}
      <Footer />
      </main>
    </>
  );
}
