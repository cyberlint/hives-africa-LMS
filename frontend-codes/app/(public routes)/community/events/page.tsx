import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Zap,
  Users,
  PlusCircle,
} from "lucide-react";
import Image from "next/image";

import { getCurrentUser } from "@/domains/auth/user";
import { getEvents } from "./get-events";
import { EventCard } from "./_components/EventCard";
import { EventCategoryEnum } from "@/lib/zodSchemas";

/* ------------------------------ PAGE -------------------------------- */

export default async function EventsPage() {
  const user = await getCurrentUser();
  const events = await getEvents();

  return (
    <>
      {/* ----------------------------- HERO -------------------------------- */}
      <section className="bg-background py-28">
        <div className="mx-auto w-full max-w-[1280px] px-6 sm:px-8 lg:px-10 grid gap-14 md:grid-cols-2 items-center">
          <div className="flex flex-col gap-8">
            <span className="flex items-center gap-3 text-sm font-semibold uppercase tracking-widest text-[color:var(--color-orange)]">
              <Zap className="h-5 w-5" />
              Community Events
            </span>

            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
              Events and Webinars
            </h1>

            <p className="max-w-xl text-lg text-muted-foreground">
              Events are a great way to connect with mentors and fellow learners.
              Create, manage, and join events to enhance your learning experience.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Button
                size="lg"
                className="bg-[var(--color-yellow)] text-gray-900 font-bold hover:bg-[color:var(--color-yellow)]/90"
              >
                <Link href="#events-list">
                Explore Events
                </Link>
              </Button>

              {user && (
                <Button asChild variant="outline" size="lg">
                  <Link href="/community/events/create">
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Host Event
                  </Link>
                </Button>
              )}
            </div>
          </div>

          <div>
            <Image
              src="/assets/events-hero.png"
              alt="Events Hero"
              width={600}
              height={400}
              className="w-full h-auto rounded-lg"
              priority
            />
          </div>
        </div>
      </section>

      {/* -------------------------- FILTER BAR ------------------------------ */}
      <section className="relative z-10 mt-[-3.5rem]">
        <div className="mx-auto w-full max-w-[1280px] px-6 sm:px-8 lg:px-10">
          <div className="flex flex-col gap-4 rounded-2xl bg-card p-6 shadow-lg md:flex-row md:items-center">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input placeholder="Search events..." className="h-12 pl-12" />
            </div>

            <div className="flex w-full gap-4 md:w-auto">
              <Select defaultValue="all">
              <SelectTrigger className="h-12 w-full md:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {Object.values(EventCategoryEnum.enum)
                  .sort((a, b) => a.localeCompare(b)) // Alphabetical sort (ascending)
                  .map((category) => (
                    <SelectItem 
                      key={category} 
                      value={category}
                    >
                      {category}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

              <Select defaultValue="any">
                <SelectTrigger className="h-12 w-full md:w-40">
                  <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="in-person">In-Person</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------- EVENTS -------------------------------- */}
      <section className="py-28">
        <div className="mx-auto w-full max-w-[1280px] px-6 sm:px-8 lg:px-10" id="events-list">
          <div className="mb-14 flex items-end justify-between">
            <h2 className="text-4xl font-extrabold">
              Upcoming Events ({events.length})
            </h2>
          </div>

          {events.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
              No events available yet.
            </div>
          ) : (
            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <EventCard key={event.id} data={event} />
              ))}
            </div>
          )}

          <div className="mt-20 text-center">
            <Button variant="outline" size="lg">
              Load more events
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}