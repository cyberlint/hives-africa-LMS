"use client";

import type { CreateOrganizationInput } from "@/lib/zodSchemas";
import { ORGANIZATION_MISSIONS, ORGANIZATION_TYPES } from "../config";
import { CheckCircle2, Building2, Target, Briefcase } from "lucide-react";

interface Props {
  form: Partial<CreateOrganizationInput>;
}

export function ReviewStep({ form }: Props) {
  // Helper to find display labels from config
  const selectedType = ORGANIZATION_TYPES.find((t) => t.id === form.orgType);
  const selectedMissions = ORGANIZATION_MISSIONS.filter((m) =>
    form.missions?.includes(m.id)
  );

  return (
    <div className="w-full space-y-10">
      {/* Header Section */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          Review & Launch
        </h2>
        <p className="text-slate-500 text-lg">
          {"Please verify your organization's details before we initialize your workspace."}
        </p>
      </div>

      {/* Summary Card */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-8 shadow-sm space-y-8">
        
        {/* Basic Details */}
        <div className="flex items-start gap-4">
          <div className="mt-1 p-2 bg-white rounded-lg border border-slate-200 shadow-sm">
            <Building2 className="w-5 h-5 text-orange" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Organization Name</p>
            <p className="text-lg font-semibold text-slate-900">{form.name || "N/A"}</p>
          </div>
        </div>

        {/* Organization Type */}
        <div className="flex items-start gap-4">
          <div className="mt-1 p-2 bg-white rounded-lg border border-slate-200 shadow-sm">
            <Briefcase className="w-5 h-5 text-orange" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Organization Type</p>
            <p className="text-lg font-semibold text-slate-900">
              {selectedType?.title || form.orgType?.replace(/_/g, " ")}
            </p>
          </div>
        </div>

        {/* Missions */}
        <div className="flex items-start gap-4">
          <div className="mt-1 p-2 bg-white rounded-lg border border-slate-200 shadow-sm">
            <Target className="w-5 h-5 text-orange" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Core Missions</p>
            <div className="flex flex-wrap gap-2">
              {selectedMissions.length > 0 ? (
                selectedMissions.map((m) => (
                  <span
                    key={m.id}
                    className="inline-flex items-center rounded-full bg-white px-3 py-1 text-sm font-medium text-slate-700 border border-slate-200"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-indigo-500" />
                    {m.title}
                  </span>
                ))
              ) : (
                <span className="text-slate-400 italic">No missions selected</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}