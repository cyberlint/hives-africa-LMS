import type { ReactNode } from "react";

import EventsNavbar from "./_components/EventsNavbar";
import Footer from "@/components/shared/footer";

interface Props {
  children: ReactNode;
}

export default function EventsLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-background">
      <EventsNavbar />

      <main>{children}</main>

      <Footer />
    </div>
  );
}