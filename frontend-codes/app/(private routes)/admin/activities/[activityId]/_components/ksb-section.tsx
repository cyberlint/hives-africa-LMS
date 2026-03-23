"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { useTransition } from "react";
import { toast } from "sonner";
import { Loader2, Save, Plus, Trash2, Award } from "lucide-react";

import { updateActivityKSBs } from "../../_actions/update-ksbs";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// MOCK DATA: Eventually, you will fetch these from your `KSB` database table.
// You can leave these here for now so you can test the UI saving to the DB.
const mockAvailableKSBs = [
  { id: "e1234567-89ab-cdef-0123-456789abcdef", title: "Data Cleaning & Preprocessing", type: "SKILL" },
  { id: "f1234567-89ab-cdef-0123-456789abcdef", title: "Machine Learning Fundamentals", type: "KNOWLEDGE" },
  { id: "a1234567-89ab-cdef-0123-456789abcdef", title: "Technical Communication", type: "BEHAVIOR" },
  { id: "b1234567-89ab-cdef-0123-456789abcdef", title: "SQL Query Optimization", type: "SKILL" },
];

interface KSBSectionProps {
  initialData: any[];
  activityId: string;
}

export function KSBSection({ initialData, activityId }: KSBSectionProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    defaultValues: {
      ksbs: initialData.length > 0 ? initialData : [
        { ksbId: "", weight: 1.0 }
      ]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "ksbs"
  });

  function onSubmit(values: any) {
    // Basic validation: Prevent submitting empty selections
    if (values.ksbs.some((k: any) => !k.ksbId)) {
      toast.error("Please select a valid competency for all rows.");
      return;
    }

    startTransition(async () => {
      const result = await updateActivityKSBs(activityId, values.ksbs);
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
          <Award className="size-5 text-yellow-600" />
          Competency Mapping (KSBs)
        </CardTitle>
        <CardDescription>
          What Knowledge, Skills, and Behaviors will the learner prove by completing this?
          These will be added to their verified portfolio upon approval.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="relative flex items-end gap-4 border rounded-lg p-4 bg-muted/10">
                  
                  {/* Select the KSB */}
                  <FormField
                    control={form.control}
                    name={`ksbs.${index}.ksbId`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Select Competency</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Search KSBs..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {mockAvailableKSBs.map((ksb) => (
                              <SelectItem key={ksb.id} value={ksb.id}>
                                <span className="text-xs font-bold text-muted-foreground mr-2 border px-1 py-0.5 rounded">
                                  {ksb.type.charAt(0)}
                                </span>
                                {ksb.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Weight Multiplier */}
                  <FormField
                    control={form.control}
                    name={`ksbs.${index}.weight`}
                    render={({ field }) => (
                      <FormItem className="w-[120px]">
                        <FormLabel>Weight</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.1"
                            min="0.1"
                            {...field} 
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Delete Button */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-700 hover:bg-red-100 mb-0.5"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="outline"
                className="w-full border-dashed"
                onClick={() => append({ ksbId: "", weight: 1.0 })}
              >
                <Plus className="size-4 mr-2" /> Map Another Competency
              </Button>
            </div>

            <div className="flex justify-end pt-4 border-t">
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <><Loader2 className="animate-spin mr-2 size-4" /> Saving...</>
                ) : (
                  <><Save className="mr-2 size-4" /> Save Mappings</>
                )}
              </Button>
            </div>
            
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}