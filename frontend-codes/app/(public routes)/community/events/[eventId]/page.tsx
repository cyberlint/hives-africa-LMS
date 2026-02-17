import { getEventById } from "../events-actions";
import { RichTextRenderer } from "@/components/lms/RichTextRenderer";
import Image from "next/image";
import { constructUrl } from "@/lib/construct-url";
import { EventFooterCTA } from "../_components/EventDetailFooter";
import { CalendarDays, MapPin, Tag, Wifi } from "lucide-react";

export default async function EventDetailsPage({
  params,
}: {
  params: { eventId: string };
}) {
  const event = await getEventById(params.eventId);
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Hero Section */}
      <header className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 md:gap-8 mb-6">
        <div className="flex-1">
          <h1 className="text-4xl font-extrabold tracking-tight">{event.title}</h1>
          <p className="mt-2 text-lg text-muted-foreground">{event.shortdescription}</p>

          {/* Meta Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-y-4 gap-x-6 py-4">
            {/* Date Range Item */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 py-6 border-y border-gray-100 my-4">
              {/* Date Section */}
              <div className="flex items-start gap-3">
                <CalendarDays className="h-5 w-5 text-gray-400 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Schedule</p>
                  <p className="text-sm font-medium text-gray-900 leading-tight">
                    {new Date(event.startdate).toLocaleDateString()} &mdash; {new Date(event.enddate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Location Section */}
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Location</p>
                  <p className="text-sm font-medium text-gray-900 leading-tight">
                    {event.venue}
                  </p>
                </div>
              </div>

              {/* Format Section */}
              <div className="flex items-start gap-3">
                <Wifi className="h-5 w-5 text-gray-400 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Format</p>
                  <p className="text-sm font-medium text-gray-900 leading-tight">
                    {event.isOnline ? "Virtual Event" : "On-site"}
                  </p>
                </div>
              </div>

              {/* Category Section */}
              <div className="flex items-start gap-3">
                <Tag className="h-5 w-5 text-gray-400 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Category</p>
                  <p className="text-sm font-medium text-gray-900 leading-tight italic text-gray-600">
                    {event.eventCategory}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {event.imageKey && (
          <div className="w-full md:w-80 h-48 md:h-64 relative rounded-lg overflow-hidden shadow-md">
            <Image
              src={constructUrl(event.imageKey)}
              alt={event.title}
              fill
              className="object-cover"
            />
          </div>
        )}
      </header>

      {/* RichText Description */}
      <section className="prose prose-slate max-w-none mt-6 mb-8">
        <h3 className="text-2xl font-semibold mb-4">About this event</h3>
        <RichTextRenderer contentJsonString={event.description} />
      </section>

      <hr className="my-6 border-border" />

      {/* Host Section */}
      <section className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-lg font-bold">
          {event.user.name.charAt(0)}
        </div>
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">Hosted by</p>
          <h3 className="text-lg font-semibold">{event.user.name}</h3>
          <p className="text-sm text-muted-foreground">
            {`This host is known for delivering high-quality sessions in ${event.eventCategory}.`}
          </p>
        </div>
      </section>

      {/* Footer Meta & Actions */}
      <footer className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="text-sm text-muted-foreground space-y-1">
          <p>Start: {new Date(event.startdate).toLocaleString()}</p>
          <p>End: {new Date(event.enddate).toLocaleString()}</p>
        </div>

        {/* Client-side CTA */}
        <EventFooterCTA eventId={event.id} eventTitle={event.title} />
      </footer>
    </div>
  );
}