import { 
    AlertDialogContent, 
    AlertDialogTrigger, 
    AlertDialogDescription, 
    AlertDialogHeader, 
    AlertDialogTitle, 
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialog
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { tryCatch } from "@/hooks/try-catch";
import { Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { deleteModule } from "../actions";
import { toast } from "sonner";

export function DeleteModule({
    courseId,
    moduleId,
} : {
    courseId: string;
    moduleId: string;
}) {
    const [open, setOpen] = useState(false);
    const [pending, startTransition] = useTransition();

    async function onSubmit() {
        startTransition(async () => {
            const {data: result, error} = await tryCatch(
                deleteModule({moduleId, courseId })
                );

                if (error) {
                        toast.error("An unexpected error occurred. Please try again.");
                        return;
                      }
                
                      if (result.status === "success") {
                        toast.success(result.message);
                        setOpen(false);
                      } else {
                        toast.error(result.message);
                      }
        });
    }
    return (    
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild> 
            <Button variant="ghost" size="icon">
                <Trash2 className="size-4" />
            </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Permanently Delete Lesson?</AlertDialogTitle>
                    <AlertDialogDescription>This action cannot be undone. Permanently delete this module?</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button onClick={onSubmit} disabled={pending} variant="destructive">
                        {pending ? "Deleting..." : "Delete"}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
    </AlertDialog>
  )
}
