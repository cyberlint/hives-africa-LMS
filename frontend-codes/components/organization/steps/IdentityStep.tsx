"use client";

import { Uploader } from "@/components/lms/file-uploader/uploader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CreateOrganizationInput } from "@/lib/zodSchemas";

interface Props {
  form: Partial<CreateOrganizationInput>;
  setForm: React.Dispatch<
    React.SetStateAction<Partial<CreateOrganizationInput>>
  >;
}

export function IdentityStep({ form, setForm }: Props) {
  return (
    <div className="w-full space-y-10">
      {/* Header Section */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          Organization details
        </h2>
        <p className="text-slate-500 text-lg">
          {"Let's establish the identity for your workspace."}
        </p>
      </div>

      <div className="space-y-8">
        
        {/* Name Input */}
        <div className="space-y-3">
          <Label className="text-slate-700 font-medium text-sm">
            Organization name <span className="text-red-500">*</span>
          </Label>
          <Input
            className="h-12 text-base px-4 rounded-lg border-slate-200 focus-visible:ring-orange focus-visible:border-orange transition-colors shadow-sm"
            value={form.name ?? ""}
            placeholder="e.g. OpenAI"
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
          />
        </div>

        {/* Website Input with Integrated Prefix & Auto-strip */}
        <div className="space-y-3">
          <Label className="text-slate-700 font-medium text-sm">
            {"Organization's website"}
          </Label>
          <div className="relative flex items-center">
            <span className="absolute left-4 text-slate-400 select-none text-base pointer-events-none">
              https://
            </span>
            <Input
              className="h-12 pl-[76px] text-base rounded-lg border-slate-200 focus-visible:ring-orange focus-visible:border-orange transition-colors shadow-sm"
              value={form.website ?? ""}
              placeholder="openai.com"
              onChange={(e) => {
                // Strip http:// or https:// if the user pastes it
                const cleanUrl = e.target.value.replace(/^https?:\/\//i, '');
                setForm((prev) => ({
                  ...prev,
                  website: cleanUrl,
                }));
              }}
            />
          </div>
        </div>

        {/* Logo Uploader Fix - Explicit width to prevent flex-squishing */}
        <div className="space-y-3 pt-2">
          <Label className="text-slate-700 font-medium text-sm">
            Organization Logo (Optional)
          </Label>
          <div className="w-full max-w-[240px] rounded-xl border border-slate-200 p-2 shadow-sm bg-slate-50/50">
            <Uploader
              value={form.logoUrl}
              apiEndpoint="/api/s3/upload-public"
              onChange={(key) =>
                setForm((prev) => ({
                  ...prev,
                  logoUrl: key,
                }))
              }
            />
          </div>
        </div>

      </div>
    </div>
  );
}