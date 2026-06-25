import { EventsClientPage } from "./_components/EventsClientPage";
import { getEvents } from "./get-events";
import { getCurrentUser } from "@/domains/auth/user";

interface EventsPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    format?: string;
  }>;
}

export default async function EventsPage({
  searchParams,
}: EventsPageProps) {
  const params = await searchParams;

  const events = await getEvents({
    search: params.search,
    category: params.category,
    format: params.format as
      | "online"
      | "in-person"
      | "any"
      | undefined,
  });

  const user = await getCurrentUser();

  return (
    <EventsClientPage
      events={events}
      params={params}
      user={user}
    />
  );
}