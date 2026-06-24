"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Loader2, Save, Plus, Trash2, Award } from "lucide-react";

import { updateActivityKSBs } from "../../_actions/update-ksbs"; // Your existing action
import { createGlobalKSB } from "../../_actions/ksb-actions"; // The new action

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // FIX 1: Added Textarea import
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog"

interface KSBSectionProps {
  initialData?: any[]; 
  activityId: string;
  availableKSBs?: { id: string; title: string; type: string }[]; 
}

export function KSBSection({ 
  initialData = [], 
  activityId, 
  availableKSBs = [] 
}: KSBSectionProps) {
  const [isPending, startTransition] = useTransition();
  const [isCreatingKSB, setIsCreatingKSB] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // State for the quick-create modal
  const [newKsb, setNewKsb] = useState({ title: "", type: "Skill" as const, description: "" });

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

  // Handle on-the-fly KSB Creation
  async function handleCreateKSB() {
    if (!newKsb.title || !newKsb.description) return;
    setIsCreatingKSB(true);
    
    // FIX 2: Added description to the server action payload!
    const res = await createGlobalKSB({ 
      title: newKsb.title, 
      type: newKsb.type, 
      description: newKsb.description 
    });
    
    if (res.success) {
      toast.success("New competency added to the global library!");
      setIsDialogOpen(false);
      setNewKsb({ title: "", type: "Skill", description: "" }); // reset
    } else {
      toast.error(res.error);
    }
    setIsCreatingKSB(false);
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2">
            <Award className="size-5 text-yellow-600" />
            Competency Mapping (KSBs)
          </CardTitle>
          <CardDescription>
            What Knowledge, Skills, and Behaviors will the learner prove?
          </CardDescription>
        </div>

        {/* ON-THE-FLY CREATION MODAL */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 border-dashed">
              <Plus className="size-3 mr-2" /> New Global KSB
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add to Competency Library</DialogTitle>
              <DialogDescription>Create a new outcome that can be mapped to any program.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Competency Title</Label>
                <Input 
                  placeholder="e.g., Methodical Handling of Data Anomalies" 
                  value={newKsb.title}
                  onChange={(e) => setNewKsb({...newKsb, title: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={newKsb.type} onValueChange={(val: any) => setNewKsb({...newKsb, type: val})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Knowledge">Knowledge</SelectItem>
                    <SelectItem value="Skill">Skill</SelectItem>
                    <SelectItem value="Behavior">Behavior</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* THE NEW REQUIRED DESCRIPTION FIELD */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Evaluation Prompt (Required)</Label>
                </div>
                <Textarea 
                  placeholder="e.g., Did the learner demonstrate a clear ability to identify and clean anomalies from the dataset without losing critical information?" 
                  className="resize-none h-20 text-sm"
                  value={newKsb.description}
                  onChange={(e) => setNewKsb({...newKsb, description: e.target.value})}
                />
                <p className="text-[10px] text-muted-foreground">Phrase this as a specific question for the reviewer to answer while looking at the evidence.</p>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateKSB} disabled={isCreatingKSB || !newKsb.title || !newKsb.description}>
                {isCreatingKSB ? <Loader2 className="size-4 animate-spin mr-2"/> : null}
                Create & Add to Library
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
                            <SelectTrigger className="bg-background">
                              <SelectValue placeholder="Search KSBs..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableKSBs.map((ksb) => (
                              <SelectItem key={ksb.id} value={ksb.id}>
                                <span className="text-[10px] font-bold text-muted-foreground mr-2 border px-1.5 py-0.5 rounded uppercase">
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
                            className="bg-background"
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
                    className="text-red-500 hover:text-red-700 hover:bg-red-100 mb-0.5 shrink-0"
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