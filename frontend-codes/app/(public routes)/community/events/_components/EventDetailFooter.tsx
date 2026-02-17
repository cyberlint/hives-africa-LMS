"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { EventRegistrationForm } from "./EventRegistrationForm";

interface EventFooterCTAProps {
  eventId: string;
  eventTitle: string;
}

export const EventFooterCTA: React.FC<EventFooterCTAProps> = ({ eventId, eventTitle }) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setModalOpen(true)}
          className="px-6 py-3 rounded-lg font-medium bg-[#FDB606] text-white hover:bg-[#fd9a06] transition"
        >
          I will attend
        </button>

        <button className="px-4 py-2 border border-border text-muted-foreground rounded-lg hover:bg-gray-100 transition">
          Share Event
        </button>

        <button className="px-4 py-2 border border-border text-muted-foreground rounded-lg hover:bg-gray-100 transition">
          Add to Calendar
        </button>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <EventRegistrationForm
          eventId={eventId}
          eventTitle={eventTitle}
          onRegistered={() => setModalOpen(false)}
        />
      </Modal>
    </>
  );
};