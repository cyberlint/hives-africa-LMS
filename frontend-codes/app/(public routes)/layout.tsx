import Footer from "@/components/shared/footer";
import Navbar from "@/components/navigation/Navbar";

/**
 * Public routes layout: wraps only public marketing / browsing pages.
 * Student dashboard area has its own layout under (private routes)/(student).
 */
export default function PublicRoutesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
    <main className="overflow-x-hidden bg-white dark:bg-darkBlue-300 transition-colors duration-300">
      <Navbar />
      {children}

      <Footer />
      </main>
    </>
  );
}
