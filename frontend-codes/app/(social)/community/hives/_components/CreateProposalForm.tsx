"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ShieldAlert, Ghost, Loader2, Send } from "lucide-react";
import { raiseProposal } from "../../actions.governance";
import { toast } from "sonner";

export default function CreateProposalForm({
  hiveId,
  currentUserId,
  members,
}: {
  hiveId: string;
  currentUserId: string;
  members: { userId: string; user: { name: string } }[];
}) {
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<string>("POLICY_CHANGE");
  const [targetUserId, setTargetUserId] = useState<string>("none");
  const [isAnonymous, setIsAnonymous] = useState(false);

  const requiresTarget = ["MEMBER_EXPULSION", "IMPEACHMENT", "LEADERSHIP_VOTE"].includes(type);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (requiresTarget && targetUserId === "none") {
      toast.error("You must select a target member.");
      return;
    }

    startTransition(async () => {
      const res = await raiseProposal({
        hiveId,
        creatorId: currentUserId,
        title,
        description,
        type: type as any,
        targetUserId: targetUserId !== "none" ? targetUserId : undefined,
        isAnonymous,
        daysToMap: 3,
      });

      if (res.success) {
        toast.success("Motion raised successfully.");
        setTitle("");
        setDescription("");
        setTargetUserId("none");
        setIsAnonymous(false);
      } else {
        toast.error(res.error || "Failed to raise motion.");
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl mx-auto rounded-2xl border border-border bg-card p-5 sm:p-6 md:p-8 space-y-6"
    >
      {/* HEADER */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <ShieldAlert className="size-5 text-indigo-500" />
          <h2 className="text-xl sm:text-2xl font-semibold">
            Raise a Motion
          </h2>
        </div>

        <p className="text-sm text-muted-foreground max-w-md">
          Submit a proposal for the Hive to vote on. Outcomes are decided by contribution-weighted consensus.
        </p>
      </div>

      {/* FORM FIELDS */}
      <div className="space-y-5">

        {/* TYPE */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">
            Motion Type
          </label>

          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Select motion type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="POLICY_CHANGE">Policy Change</SelectItem>
              <SelectItem value="MEMBER_EXPULSION" className="text-orange-500">
                Expel Member
              </SelectItem>
              <SelectItem value="IMPEACHMENT" className="text-red-500">
                Impeach Leadership
              </SelectItem>
              <SelectItem value="LEADERSHIP_VOTE" className="text-green-500">
                Promote to Leadership
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* TARGET */}
        {requiresTarget && (
          <div className="space-y-2">
            <label className="text-xs font-medium text-red-500">
              Target Member
            </label>

            <Select value={targetUserId} onValueChange={setTargetUserId}>
              <SelectTrigger className="h-11 border-red-500/30">
                <SelectValue placeholder="Select target member" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none" disabled>
                  Select a member...
                </SelectItem>
                {members.map((m) => (
                  <SelectItem key={m.userId} value={m.userId}>
                    {m.user.name}{" "}
                    {m.userId === currentUserId && "(You)"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* TITLE */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">
            Title
          </label>
          <Input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Transition backend to Go"
            className="h-11"
          />
        </div>

        {/* DESCRIPTION */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">
            Rationale
          </label>
          <Textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Explain why this motion should pass..."
            className="min-h-[120px] resize-none"
          />
        </div>

        {/* GHOST MODE */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-xl border border-border bg-muted/30">
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-medium">
              <Ghost className="size-4 text-indigo-500" />
              Ghost Mode
            </div>
            <p className="text-xs text-muted-foreground max-w-xs">
              Submit anonymously. Your identity will be hidden from the Hive.
            </p>
          </div>

          <Switch
            checked={isAnonymous}
            onCheckedChange={setIsAnonymous}
          />
        </div>
      </div>

      {/* SUBMIT */}
      <Button
        type="submit"
        disabled={
          isPending ||
          !title ||
          !description ||
          (requiresTarget && targetUserId === "none")
        }
        className="w-full h-12 rounded-xl font-medium"
      >
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <>
            <Send className="size-4 mr-2" />
            Submit Motion
          </>
        )}
      </Button>
    </form>
  );
}