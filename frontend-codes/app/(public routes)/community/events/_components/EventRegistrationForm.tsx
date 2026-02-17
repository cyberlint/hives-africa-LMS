"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface EventRegistrationFormProps {
  eventId: string;
  eventTitle: string;
  onRegistered?: () => void;
}

export const EventRegistrationForm: React.FC<EventRegistrationFormProps> = ({
  eventId,
  eventTitle,
  onRegistered,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/events/${eventId}/register`, {
        method: "POST",
        body: JSON.stringify({ name, email }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Registration failed");

      alert("Successfully registered!");
      onRegistered?.();
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Failed to register. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="text-xl font-bold mb-2">Register for {eventTitle}</h2>
      <input
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="px-4 py-2 border rounded-lg focus:ring-1 focus:ring-[#FDB606] outline-none"
        required
      />
      <input
        type="email"
        placeholder="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="px-4 py-2 border rounded-lg focus:ring-1 focus:ring-[#FDB606] outline-none"
        required
      />
      <button
        type="submit"
        className="px-4 py-2 bg-[#FDB606] text-white rounded-lg font-medium hover:bg-[#fd9a06] transition"
        disabled={loading}
      >
        {loading ? "Registering..." : "I will attend"}
      </button>
    </form>
  );
};