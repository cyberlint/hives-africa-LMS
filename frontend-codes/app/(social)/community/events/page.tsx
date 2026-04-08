import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Zap, Users, PlusCircle, CalendarSearch } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { getCurrentUser } from "@/domains/auth/user";
import { getEvents } from "./get-events";
import { EventCard } from "./_components/EventCard";
import { EventCategoryEnum } from "@/lib/zodSchemas";

export default async function EventsPage() {
  const user = await getCurrentUser();
  const events = await getEvents();

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-6 md:py-8 space-y-10 pb-24">
      
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden rounded-3xl border border-border/50 bg-card p-6 md:p-10 flex flex-col lg:flex-row items-center gap-8">
        
        {/* subtle glow */}
        <div className="absolute -top-32 -right-32 w-[400px] h-[400px] bg-orange/10 rounded-full blur-[100px] pointer-events-none" />

        {/* TEXT */}
        <div className="flex-1 space-y-5 relative z-10 text-center lg:text-left">
          <Badge className="w-fit mx-auto lg:mx-0 bg-orange/10 text-orange border-none text-xs font-semibold flex items-center gap-2">
            <Zap className="size-3.5 fill-current" />
            Events
          </Badge>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Connect, learn,
            <br className="hidden md:block" />
            and build together.
          </h1>

          <p className="text-muted-foreground max-w-xl mx-auto lg:mx-0 text-sm md:text-base">
            Join workshops, attend meetups, or host your own sessions to grow faster with the community.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-2">
            <Button asChild className="rounded-full px-6 h-11 font-semibold">
              <Link href="#events-list">Explore Events</Link>
            </Button>

            {user && (
              <Button asChild variant="outline" className="rounded-full px-6 h-11 font-semibold">
                <Link href="/community/events/create">
                  <PlusCircle className="mr-2 size-4" />
                  Host Event
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* IMAGE */}
        <div className="flex-1 w-full max-w-md lg:max-w-none">
          <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden border border-border/40">
            <Image
              src="/assets/events-hero.png"
              alt="Events"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
        </div>
      </section>

      {/* ================= FILTER BAR ================= */}
      <section className="sticky top-16 z-30">
        <div className="bg-background/80 backdrop-blur border border-border/50 rounded-2xl p-3 shadow-sm">
          
          <div className="flex flex-col md:flex-row gap-3">
            
            {/* SEARCH */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                className="pl-10 h-11 rounded-xl"
              />
            </div>

            {/* FILTERS */}
            <div className="flex gap-2 w-full md:w-auto">
              <Select defaultValue="all">
                <SelectTrigger className="h-11 w-full md:w-44 rounded-xl">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {Object.values(EventCategoryEnum.enum)
                    .sort((a, b) => a.localeCompare(b))
                    .map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

              <Select defaultValue="any">
                <SelectTrigger className="h-11 w-full md:w-36 rounded-xl">
                  <Users className="mr-2 size-4" />
                  <SelectValue placeholder="Format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="in-person">In-person</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* ================= EVENTS ================= */}
      <section id="events-list" className="space-y-6 scroll-mt-24">
        
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
            Upcoming Events
            <span className="text-xs px-2 py-0.5 rounded-full bg-muted border">
              {events.length}
            </span>
          </h2>
        </div>

        {/* EMPTY */}
        {events.length === 0 ? (
          <div className="rounded-2xl border border-dashed p-10 text-center">
            <div className="size-12 mx-auto rounded-full bg-muted flex items-center justify-center mb-3">
              <CalendarSearch className="size-6 text-muted-foreground" />
            </div>

            <p className="font-medium">No events yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Check back later or host one.
            </p>

            {user && (
              <Button asChild className="mt-4 rounded-full">
                <Link href="/community/events/create">Host Event</Link>
              </Button>
            )}
          </div>
        ) : (
          <>
            {/* GRID */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <EventCard key={event.id} data={event} />
              ))}
            </div>

            {/* LOAD MORE */}
            <div className="flex justify-center pt-6">
              <Button variant="outline" className="rounded-full px-6">
                Load more
              </Button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}