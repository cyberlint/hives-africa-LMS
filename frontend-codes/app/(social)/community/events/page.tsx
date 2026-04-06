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
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden rounded-[2rem] border border-border/50 bg-card/20 p-8 sm:p-12 lg:p-16 backdrop-blur-md flex flex-col md:flex-row items-center gap-12 group">
        {/* Ambient Glow */}
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-orange/10 rounded-full blur-[100px] pointer-events-none transition-opacity duration-1000 opacity-60 group-hover:opacity-100" />

        <div className="flex flex-col gap-6 relative z-10 flex-1">
          <Badge variant="outline" className="w-fit bg-orange/5 text-orange border-orange/20 px-3 py-1 font-semibold uppercase tracking-wider text-xs flex items-center gap-2 rounded-full">
            <Zap className="size-3.5 fill-current" /> Community Events
          </Badge>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-foreground">
            Connect, Learn, <br className="hidden md:block" /> and Build Together.
          </h1>

          <p className="max-w-xl text-lg text-muted-foreground leading-relaxed">
            Events are the pulse of our network. Join live workshops, participate in hackathons, or host your own study room to accelerate your growth.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Button asChild size="lg" className="rounded-full px-8 bg-yellow text-background hover:bg-foreground/90 font-medium shadow-xl hover:scale-[1.02] transition-all">
              <Link href="#events-list">Explore Events</Link>
            </Button>

            {user && (
              <Button asChild variant="outline" size="lg" className="rounded-full px-8 border-border/50 bg-background/50 backdrop-blur-sm hover:bg-muted font-medium">
                <Link href="/community/events/create">
                  <PlusCircle className="mr-2 size-5 text-muted-foreground" /> Host an Event
                </Link>
              </Button>
            )}
          </div>
        </div>

        <div className="relative z-10 flex-1 w-full max-w-lg md:max-w-none">
          <div className="relative aspect-[4/3] w-full rounded-[2rem] overflow-hidden border border-border/30 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-tr from-background/40 to-transparent z-10" />
            <Image
              src="/assets/events-hero.png"
              alt="Community Events"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      {/* 2. FILTER & SEARCH BAR */}
      <section className="relative z-20 -mt-6">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-col md:flex-row gap-4 rounded-[1.5rem] bg-card/60 backdrop-blur-xl p-3 border border-border/50 shadow-lg">
            
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input 
                placeholder="Search events, workshops, or hosts..." 
                className="h-12 pl-11 bg-background/50 border-transparent focus-visible:ring-1 focus-visible:ring-orange/30 rounded-xl text-base" 
              />
            </div>

            <div className="flex w-full md:w-auto gap-3">
              <Select defaultValue="all">
                <SelectTrigger className="h-12 w-full md:w-48 bg-background/50 border-transparent rounded-xl focus:ring-1 focus:ring-orange/30">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border/50">
                  <SelectItem value="all">All Categories</SelectItem>
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
                <SelectTrigger className="h-12 w-full md:w-40 bg-background/50 border-transparent rounded-xl focus:ring-1 focus:ring-orange/30">
                  <Users className="mr-2 size-4 text-muted-foreground" />
                  <SelectValue placeholder="Format" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border/50">
                  <SelectItem value="any">Any Format</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="in-person">In-Person</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
          </div>
        </div>
      </section>

      {/* 3. EVENTS GRID */}
      <section id="events-list" className="pt-8 scroll-mt-24">
        <div className="flex items-center justify-between mb-8 px-2">
          <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            Upcoming Ops 
            <span className="flex items-center justify-center bg-muted/50 text-muted-foreground text-xs font-bold px-2.5 py-0.5 rounded-full border border-border/50">
              {events.length}
            </span>
          </h2>
        </div>

        {events.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-border/60 bg-card/20 backdrop-blur-sm p-16 text-center flex flex-col items-center justify-center">
            <div className="size-16 rounded-full bg-muted/50 flex items-center justify-center mb-4 border border-border/50">
              <CalendarSearch className="size-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-1">No ops scheduled</h3>
            <p className="text-muted-foreground text-sm max-w-sm">
              There are currently no upcoming events matching your criteria. Check back later or host your own!
            </p>
            {user && (
              <Button asChild variant="outline" className="mt-6 rounded-full">
                <Link href="/community/events/create">Host an Event</Link>
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <EventCard key={event.id} data={event} />
              ))}
            </div>
            <div className="mt-14 flex justify-center">
              <Button variant="outline" size="lg" className="rounded-full px-8 font-medium border-border/50 hover:bg-muted/50">
                Load more events
              </Button>
            </div>
          </>
        )}
      </section>
      
    </div>
  );
}