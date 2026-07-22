import { baseEmailLayout } from "@/domains/communications/base";
import { blocks } from "@/domains/communications/blocks";
import { renderEmailBlocks } from "@/domains/communications/renderers/email";

type EventRegistrationPayload = {
  attendeeName: string;

  eventTitle: string;
  description?: string | null;

  startDate: string;
  endDate?: string;

  location?: string | null;
  meetingLink?: string | null;

  organizer?: string | null;

  actionUrl?: string;
};

export function eventRegistrationConfirmation(
  payload: EventRegistrationPayload
) {
  const preheader = `You're registered for ${payload.eventTitle}`;

  const contentBlocks = [
  blocks.text(`Hi ${payload.attendeeName},`),

  blocks.text(
    `Your registration has been confirmed. We're looking forward to welcoming you to **${payload.eventTitle}**.`
  ),

  blocks.spacer(16),

  blocks.heading("Event Details"),

  blocks.callout("Event", payload.eventTitle),
  blocks.callout("Starts", payload.startDate),

  ...(payload.endDate
    ? [blocks.callout("Ends", payload.endDate)]
    : []),

  ...(payload.location
    ? [blocks.callout("Venue", payload.location)]
    : []),

  ...(payload.meetingLink
    ? [blocks.callout("Join Link", payload.meetingLink)]
    : []),

  ...(payload.organizer
    ? [blocks.callout("Hosted by", payload.organizer)]
    : []),

  blocks.spacer(20),

  ...(payload.actionUrl
    ? [
        blocks.spacer(24),
        blocks.cta("View Event Details", payload.actionUrl),
      ]
    : []),

  blocks.spacer(28),

  blocks.text(
    "If you have any questions about this event, please contact the event host directly."
  ),
];

  return {
    subject: `Registration Confirmed • ${payload.eventTitle}`,
    html: baseEmailLayout(
      renderEmailBlocks(contentBlocks),
      preheader
    ),
  };
}