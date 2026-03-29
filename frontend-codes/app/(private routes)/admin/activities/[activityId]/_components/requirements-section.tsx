"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { useTransition } from "react";
import { toast } from "sonner";
import { Loader2, Save, Plus, Trash2 } from "lucide-react";

import { updateActivityRequirements } from "../../_actions/update-requirements";
import { ActivityRequirementEnum } from "@/lib/zodSchemas";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

interface RequirementsSectionProps {
  initialData: any[];
  activityId: string;
}

export function RequirementsSection({ initialData, activityId }: RequirementsSectionProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    defaultValues: {
      requirements: initialData.length > 0 ? initialData : [
        // Add one blank requirement by default if none exist
        { type: "File_Upload", config: { label: "", description: "", required: true } }
      ]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "requirements"
  });

  function onSubmit(values: any) {
    startTransition(async () => {
      const result = await updateActivityRequirements(activityId, values.requirements);
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
        <CardTitle>Deliverables & Requirements</CardTitle>
        <CardDescription>
          What exactly must the learner submit or do to complete this activity?
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="relative border rounded-lg p-4 bg-muted/10">
                  {/* Delete Button */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-100"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="size-4" />
                  </Button>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mr-8">
                    {/* Requirement Type */}
                    <FormField
                      control={form.control}
                      name={`requirements.${index}.type`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Requirement Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.values(ActivityRequirementEnum.enum).map((type: string) => (
                                <SelectItem key={type} value={type}>
                                  {type.replace(/_/g, " ")}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Label */}
                    <FormField
                      control={form.control}
                      name={`requirements.${index}.config.label`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Label (e.g., GitHub Repo Link)</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter label..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Description */}
                    <FormField
                      control={form.control}
                      name={`requirements.${index}.config.description`}
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Instructions / Description</FormLabel>
                          <FormControl>
                            <Input placeholder="What exactly do they need to provide?" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Is Required Checkbox */}
                    <FormField
                      control={form.control}
                      name={`requirements.${index}.config.required`}
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 mt-2">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Mandatory</FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Learners must complete this to submit the activity.
                            </p>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="outline"
                className="w-full border-dashed"
                onClick={() => append({ type: "File_Upload", config: { label: "", description: "", required: true } })}
              >
                <Plus className="size-4 mr-2" /> Add Another Requirement
              </Button>
            </div>

            <div className="flex justify-end pt-4 border-t">
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <><Loader2 className="animate-spin mr-2 size-4" /> Saving...</>
                ) : (
                  <><Save className="mr-2 size-4" /> Save Requirements</>
                )}
              </Button>
            </div>
            
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}