import type { Metadata } from "next";
import { getEventById } from "../events-actions";
import { constructUrl } from "@/lib/construct-url";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://hives.africa";
const SITE_NAME = "NextHive";

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ eventId: string }>;
};

export async function generateMetadata({
  params,
}: LayoutProps): Promise<Metadata> {
  const { eventId } = await params;
  const event = await getEventById(eventId);

  if (!event) {
    return {
      title: "Event Not Found",
      robots: { index: false, follow: false },
    };
  }

  const url = `${SITE_URL}/events/${event.id}`;
  const title = event.title;
  const description =
    event.shortdescription?.trim() ||
    `${event.eventCategory} event hosted by ${event.user.name}. ${
      event.isOnline ? "Join online" : `Held at ${event.venue}`
    }.`;

  const formattedDate = new Date(event.startdate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return {
    title: `${title} | ${formattedDate}`,
    description,
    alternates: { canonical: url },
    keywords: [
      event.eventCategory,
      event.title,
      event.venue,
      event.isOnline ? "virtual event" : "in-person event",
      "event",
    ].filter(Boolean) as string[],
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_US",
      images: [
        {
          url: `${SITE_URL}/events/${event.id}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE_URL}/events/${event.id}/opengraph-image`],
    },
  };
}

export default async function EventLayout({ children, params }: LayoutProps) {
  const { eventId } = await params;
  const event = await getEventById(eventId);

  if (!event) return <>{children}</>;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.shortdescription,
    startDate: new Date(event.startdate).toISOString(),
    endDate: new Date(event.enddate).toISOString(),
    eventAttendanceMode: event.isOnline
      ? "https://schema.org/OnlineEventAttendanceMode"
      : "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: event.isOnline
      ? { "@type": "VirtualLocation", url: `${SITE_URL}/events/${event.id}` }
      : { "@type": "Place", name: event.venue, address: event.venue },
    image: event.imageKey
      ? [constructUrl(event.imageKey)]
      : [`${SITE_URL}/events/${event.id}/opengraph-image`],
    organizer: { "@type": "Person", name: event.user.name },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}