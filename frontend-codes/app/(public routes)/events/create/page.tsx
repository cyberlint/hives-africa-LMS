// /events/page.tsx (Server Component - NO "use client" directive!)

import { requireAuth } from "domains/auth/require-auth"; // Assuming your requireAuth path
import { redirect } from "next/navigation";
import EventForm from "./EventForm"; // Assuming EventForm.tsx is in the same directory

// You can fetch eventData here if you need to edit an event. 
// For now, we assume this page is for creating a new event.

export default async function CreateEventPage() {
    // 1. **Route Guard:** Await the server-only function. If the user is unauthenticated, 
    //    this function handles the redirect to /signin.
    const currentUser = await requireAuth(); 

    // 3. **Render:** Pass the authenticated user data to the Client Component.
    return (
        <div className="container py-8">
            {/* The EventForm component is now properly hydrated with required data */}
            <EventForm currentUser={currentUser} />
        </div>
    );
}