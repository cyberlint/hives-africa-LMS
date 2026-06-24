import { notFound } from "next/navigation";

import EventForm from "../../create/EventForm";
import { getCurrentUser } from "@/domains/auth/user";
import { getEventById } from "../../events-actions";

interface EditEventPageProps {
  params: Promise<{
    eventId: string;
  }>;
}

export default async function EditEventPage({
  params,
}: EditEventPageProps) {
  const { eventId } = await params;

  const user = await getCurrentUser();

  if (!user) {
    notFound();
  }

  const event = await getEventById(eventId);

  if (!event) {
    notFound();
  }

  // Optional ownership check
  if (
    user.role !== "admin" &&
    event.user.id !== user.id
  ) {
    notFound();
  }

  return (
    <EventForm
      eventData={event}
      currentUser={{
        id: user.id,
        role: user.role,
      }}
    />
  );
}