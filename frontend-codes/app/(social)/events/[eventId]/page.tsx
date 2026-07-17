import { getEventById } from "../events-actions";
import SpeakerBio from "../_components/SpeakerBio";
import { RichTextRenderer } from "@/components/lms/RichTextRenderer";
import Image from "next/image";
import Link from "next/link";
import { constructUrl } from "@/lib/construct-url";
import { EventFooterCTA } from "../_components/EventDetailFooter";
import { CalendarDays, MapPin, Tag, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/domains/auth/user";

// Define the correct type for Next.js 15 params
type PageProps = {
  params: Promise<{ eventId: string }>;
};

export default async function EventDetailsPage({ params }: PageProps) {
  // Await the params before using them
  const { eventId } = await params;
  const event = await getEventById(eventId);
  const user = await getCurrentUser();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Banner */}

      {event.imageKey && (
  <div className="mb-10">
    <div className="relative overflow-hidden rounded-3xl border border-border bg-muted aspect-[4/5] sm:aspect-[16/8] lg:aspect-[16/6]">
      <Image
        src={constructUrl(event.imageKey)}
        alt={event.title}
        fill
        priority
        className="object-cover"
      />
    </div>

    {/* Event Header */}
    <div className="mt-6">
      <span className="inline-flex rounded-full bg-muted px-3 py-1 text-xs font-medium">
        {event.eventCategory}
      </span>

      <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
        {event.title}
      </h1>

      <p className="mt-3 max-w-3xl text-lg text-muted-foreground">
        {event.shortdescription}
      </p>
    </div>
  </div>
)}
      {/* Fallback if no banner */}

      {!event.imageKey && (
        <header className="mb-10">
          <span className="inline-flex rounded-full bg-muted px-3 py-1 text-xs font-medium">
            {event.eventCategory}
          </span>

          <h1 className="mt-4 text-4xl font-extrabold tracking-tight">
            {event.title}
          </h1>

          <p className="mt-3 max-w-3xl text-lg text-muted-foreground">
            {event.shortdescription}
          </p>
        </header>
      )}

      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_340px]">
        {/* Left Column */}
        <div>
          {/* About */}
          <section className="prose prose-slate dark:prose-invert max-w-3xl">
            <h2 className="mb-4 text-2xl font-bold">
              About this event
            </h2>

            <RichTextRenderer contentJsonString={event.description} />
          </section>

          {/* Speakers */}

          {event.speakers.length > 0 && (
            <section className="mt-20">

              <div className="mb-8">
                <h2 className="text-3xl font-bold">
                  Speakers
                </h2>

                <p className="mt-2 text-muted-foreground">
                  Learn from the experts leading this event.
                </p>
              </div>

              <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-2">

                {event.speakers.map((speaker) => (

                  <div
                    key={speaker.id}
                    className="group overflow-hidden rounded-3xl border border-border/60 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >

                    <div className="relative aspect-[4/4.5] overflow-hidden">

                      {speaker.imageUrl ? (

                        <Image
                          src={constructUrl(speaker.imageUrl)}
                          alt={speaker.name}
                          fill
                          className="object-cover transition duration-500 group-hover:scale-105"
                        />

                      ) : (

                        <div className="flex h-full items-center justify-center bg-muted">
                          No image
                        </div>

                      )}

                    </div>

                    <div className="p-5">

                      <h3 className="text-lg font-bold tracking-tight">
                        {speaker.name}
                      </h3>

                      {speaker.title && (
                        <p className="mt-1 text-sm text-primary">
                          {speaker.title}
                        </p>
                      )}

                      {speaker.bio && (
                        <SpeakerBio bio={speaker.bio}/>
                      )}

                    </div>

                  </div>

                ))}

              </div>

            </section>
          )}

          {/* Host */}

          <section className="mt-20 rounded-2xl border bg-card p-6">

            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              Hosted by
            </p>

            <div className="mt-4 flex items-center gap-4">

              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-xl font-bold">

                {event.user.name.charAt(0)}

              </div>

              <div>

                <h3 className="font-semibold">
                  {event.user.name}
                </h3>

              </div>

            </div>

          </section>
        </div>

        {/* Right Column */}
        <aside className="order-first lg:order-last h-fit lg:sticky lg:top-24">

          <div className="rounded-3xl border bg-card p-6 shadow-sm">

            <h3 className="text-lg font-semibold">
              Event Details
            </h3>

            <div className="mt-6 space-y-5">

              <div className="flex gap-3">

                <CalendarDays className="mt-1 h-5 w-5 text-muted-foreground" />

                <div>

                  <p className="text-xs uppercase tracking-wider text-muted-foreground">
                    Schedule
                  </p>

                  <p className="font-medium">
                    {new Date(event.startdate).toLocaleDateString()}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {new Date(event.enddate).toLocaleDateString()}
                  </p>

                </div>

              </div>

              <div className="flex gap-3">

                <MapPin className="mt-1 h-5 w-5 text-muted-foreground" />

                <div>

                  <p className="text-xs uppercase tracking-wider text-muted-foreground">
                    Venue
                  </p>

                  <p>{event.venue}</p>

                </div>

              </div>

              <div className="flex gap-3">

                <Wifi className="mt-1 h-5 w-5 text-muted-foreground" />

                <div>

                  <p className="text-xs uppercase tracking-wider text-muted-foreground">
                    Format
                  </p>

                  <p>{event.isOnline ? "Virtual Event" : "On-site"}</p>

                </div>

              </div>

              <div className="flex gap-3">

                <Tag className="mt-1 h-5 w-5 text-muted-foreground" />

                <div>

                  <p className="text-xs uppercase tracking-wider text-muted-foreground">
                    Category
                  </p>

                  <p>{event.eventCategory}</p>

                </div>

              </div>

            </div>

            <div className="mt-8 space-y-3">

              {user &&
                (user.id === event.user.id || user.role === "admin") && (

                  <Button
                    asChild
                    variant="outline"
                    className="w-full"
                  >
                    <Link href={`/events/${event.id}/edit`}>
                      Edit Event
                    </Link>
                  </Button>

                )}

              <EventFooterCTA
                eventId={event.id}
                eventTitle={event.title}
                currentUser={user}
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}