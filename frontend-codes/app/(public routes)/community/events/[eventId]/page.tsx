import { getEventById } from "../events-actions";
import { RichTextRenderer } from "@/components/lms/RichTextRenderer";
import Image from "next/image";
import { constructUrl } from "@/lib/construct-url";
import { EventFooterCTA } from "../_components/EventDetailFooter";
import { CalendarDays, MapPin, Tag, Wifi } from "lucide-react";

// Define the correct type for Next.js 15 params
type PageProps = {
  params: Promise<{ eventId: string }>;
};

export default async function EventDetailsPage({ params }: PageProps) {
  // Await the params before using them
  const { eventId } = await params;
  const event = await getEventById(eventId);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <header className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 md:gap-8 mb-6">
        <div className="flex-1">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
            {event.title}
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            {event.shortdescription}
          </p>

          {/* Meta Information Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 py-6 border-y border-gray-100 my-6">
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

        {event.imageKey && (
          <div className="w-full md:w-80 h-48 md:h-64 relative rounded-lg overflow-hidden shadow-sm border border-gray-100">
            <Image
              src={constructUrl(event.imageKey)}
              alt={event.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
      </header>

      {/* Description Section */}
      <section className="prose prose-slate max-w-none mt-8 mb-12">
        <h3 className="text-2xl font-semibold mb-4 text-gray-900">About this event</h3>
        <RichTextRenderer contentJsonString={event.description} />
      </section>

      <hr className="my-8 border-gray-100" />

      {/* Host Section */}
      <section className="flex items-center gap-5 mb-10 p-4 rounded-xl bg-gray-50/50">
        <div className="w-14 h-14 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 text-xl font-bold shadow-sm">
          {event.user.name.charAt(0)}
        </div>
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Host</p>
          <h3 className="text-lg font-bold text-gray-900">{event.user.name}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {`Community champion and passionate advocate for team success. Always eager to connect with fellow learners and mentors!`}
          </p>
        </div>
      </section>

      {/* Footer Actions */}
      <footer className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6 pt-6 border-t border-gray-100">
        <div className="text-sm text-muted-foreground">
          <p className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            Starts: {new Date(event.startdate).toLocaleString()}
          </p>
          <p className="flex items-center gap-2 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
            Ends: {new Date(event.enddate).toLocaleString()}
          </p>
        </div>

        <EventFooterCTA eventId={event.id} eventTitle={event.title} />
      </footer>
    </div>
  );
}