"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { registerForEvent } from "../events-actions";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EventRegistrationFormProps {
  eventId: string;
  eventTitle: string;

  currentUser?: {
    id: string;
    name?: string | null;
    email?: string | null;
  } | null;

  onRegistered?: () => void;
}

export const EventRegistrationForm: React.FC<EventRegistrationFormProps> = ({
  eventId,
  eventTitle,
  currentUser,
  onRegistered,
}) => {
  const [name, setName] = useState(currentUser?.name ?? "");
  const [email, setEmail] = useState(currentUser?.email ?? "");
  const [phone, setPhone] = useState("");
  const [referralSource, setReferralSource] = useState("");
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    startTransition(async () => {
      try {
        await registerForEvent(
          {
            eventId,
            name,
            email,
            phone,
            referralSource
          },
          eventId,
          currentUser?.id
        );

        toast.success("Successfully registered");

        onRegistered?.();

        router.refresh();
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Registration failed"
        );
      }
    });
  };

  return (
  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
    {/* Using text-foreground to automatically adapt to dark/light mode */}
    <h2 className="text-xl font-bold mb-2 text-foreground">
      Register for {eventTitle}
    </h2>
    
    <p className="text-sm text-muted-foreground">
      Reserve your spot and receive event updates.
    </p>
    
    <Input
  type="text"
  placeholder="Full Name"
  value={name}
  onChange={(e) => setName(e.target.value)}
  required
/>
    
    <Input
  type="email"
  placeholder="Email Address"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  required
/>
    
    <Input
  type="tel"
  placeholder="Phone Number (optional)"
  value={phone}
  onChange={(e) => setPhone(e.target.value)}
/>
    
    <Select value={referralSource} onValueChange={setReferralSource}>
      <SelectTrigger className="bg-background text-foreground border-border focus:ring-[#FDB606]">
  <SelectValue placeholder="How did you hear about this event?" />
</SelectTrigger>

      <SelectContent className="bg-popover text-popover-foreground border-border">
        <SelectItem value="whatsapp">WhatsApp</SelectItem>
        <SelectItem value="community-group">Community Group</SelectItem>
        <SelectItem value="newsletter">Newsletter</SelectItem>
        <SelectItem value="email">Email Invitation</SelectItem>
        <SelectItem value="twitter">Twitter / X</SelectItem>
        <SelectItem value="linkedin">LinkedIn</SelectItem>
        <SelectItem value="facebook">Facebook</SelectItem>
        <SelectItem value="instagram">Instagram</SelectItem>
        <SelectItem value="friend">Friend or Colleague</SelectItem>
        <SelectItem value="google">Google Search</SelectItem>
        <SelectItem value="nexthive">NextHive</SelectItem>
        <SelectItem value="other">Other</SelectItem>
      </SelectContent>
    </Select>
    
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