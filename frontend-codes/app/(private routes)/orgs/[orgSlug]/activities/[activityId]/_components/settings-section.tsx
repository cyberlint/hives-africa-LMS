"use client";

import { useForm } from "react-hook-form";
import { useTransition } from "react";
import { toast } from "sonner";
import { Loader2, Save, Settings } from "lucide-react";

import { updateActivitySettings } from "../../_actions/update-settings";
import { ActivityVisibilityEnum } from "@/lib/zodSchemas";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

interface SettingsSectionProps {
  initialData: any;
  activityId: string;
}

export function SettingsSection({ initialData, activityId }: SettingsSectionProps) {
  const [isPending, startTransition] = useTransition();

  // Helper to format dates for the native datetime-local input
  const formatDateForInput = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    // Format to YYYY-MM-DDThh:mm
    return date.toISOString().slice(0, 16);
  };

  const form = useForm({
    defaultValues: {
      visibility: initialData.visibility || "Public",
      isMandatory: initialData.isMandatory || false,
      startDate: formatDateForInput(initialData.startDate),
      deadline: formatDateForInput(initialData.deadline),
    },
  });

  function onSubmit(values: any) {
    // Basic date validation
    if (values.startDate && values.deadline) {
      if (new Date(values.deadline) < new Date(values.startDate)) {
        toast.error("Deadline cannot be before the start date.");
        return;
      }
    }

    startTransition(async () => {
      const result = await updateActivitySettings(activityId, values);
      if (result.status === "success") {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="size-5 text-muted-foreground" />
          Settings & Access
        </CardTitle>
        <CardDescription>
          Configure who can see this activity and when it needs to be completed.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Visibility Select */}
              <FormField
                control={form.control}
                name="visibility"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Visibility</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select visibility" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(ActivityVisibilityEnum.enum).map((v: string) => (
                          <SelectItem key={v} value={v}>
                            {v.replace(/_/g, " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Who is allowed to view and join this activity?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Mandatory Checkbox */}
              <FormField
                control={form.control}
                name="isMandatory"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Mandatory Requirement</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Learners must complete this activity to graduate from its associated program or course.
                      </p>
                    </div>
                  </FormItem>
                )}
              />

              {/* Start Date */}
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date (Optional)</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Deadline */}
              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deadline (Optional)</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end pt-4 border-t">
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <><Loader2 className="animate-spin mr-2 size-4" /> Saving...</>
                ) : (
                  <><Save className="mr-2 size-4" /> Save Settings</>
                )}
              </Button>
            </div>
            
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}