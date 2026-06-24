"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function ActivitiesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // In production, you would log this to Sentry, LogRocket, etc.
    console.error("Activities Route Error:", error);
  }, [error]);

  return (
    <div className="flex h-[400px] w-full flex-col items-center justify-center space-y-4 rounded-xl border border-dashed p-8 text-center mt-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
        <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-500" />
      </div>
      
      <div className="space-y-2">
        <h2 className="text-xl font-semibold tracking-tight">Something went wrong!</h2>
        <p className="text-sm text-muted-foreground max-w-md">
          {error.message || "An unexpected error occurred while trying to load this section."}
        </p>
      </div>

      <Button 
        onClick={() => reset()} 
        variant="outline"
        className="mt-4"
      >
        Try again
      </Button>
    </div>
  );
}