"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Send, Trash2, EyeOff, Loader2 } from "lucide-react";

import { updateActivityStatus } from "../../_actions/update-status";
import { deleteActivity } from "../../_actions/delete-activity";

interface ActivityActionsProps {
  activityId: string;
  currentStatus: string;
}

export function ActivityActions({ activityId, currentStatus }: ActivityActionsProps) {
  const [isPending, startTransition] = useTransition();

  const handleStatusToggle = (newStatus: "Draft" | "Published") => {
    startTransition(async () => {
      const result = await updateActivityStatus(activityId, newStatus);
      if (result.status === "success") {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  };

  const handleDelete = () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this activity? This action cannot be undone."
    );
    
    if (isConfirmed) {
      startTransition(async () => {
        const result = await deleteActivity(activityId);
        // We only handle the error case here because a success will trigger a redirect
        if (result?.status === "error") {
          toast.error(result.message);
        }
      });
    }
  };

  const isPublished = currentStatus === "PUBLISHED" || currentStatus === "ACTIVE";

  return (
    <div className="flex items-center gap-3">
      <Button 
        variant="destructive" 
        size="icon" 
        onClick={handleDelete} 
        disabled={isPending}
        title="Delete Activity"
      >
        <Trash2 className="size-4" />
      </Button>

      {isPublished ? (
        <Button 
          variant="outline" 
          onClick={() => handleStatusToggle("Draft")} 
          disabled={isPending}
        >
          {isPending ? <Loader2 className="size-4 mr-2 animate-spin" /> : <EyeOff className="size-4 mr-2" />}
          Revert to Draft
        </Button>
      ) : (
        <Button 
          onClick={() => handleStatusToggle("Published")} 
          disabled={isPending}
        >
          {isPending ? <Loader2 className="size-4 mr-2 animate-spin" /> : <Send className="size-4 mr-2" />}
          Publish Activity
        </Button>
      )}
    </div>
  );
}