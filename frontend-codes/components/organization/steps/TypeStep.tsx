"use client";

import type { Dispatch, SetStateAction } from "react";
import type { CreateOrganizationInput } from "@/lib/zodSchemas";
import { ORGANIZATION_TYPES } from "../config";
import { Check } from "lucide-react";

interface Props {
  form: Partial<CreateOrganizationInput>;
  setForm: Dispatch<SetStateAction<Partial<CreateOrganizationInput>>>;
}

export function TypeStep({ form, setForm }: Props) {
  return (
    <div className="w-full space-y-10">
      {/* Header Section */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          Organization type
        </h2>
        <p className="text-slate-500 text-lg">
          Select the structure that best defines your workspace.
        </p>
      </div>

      {/* Vertical Selection Stack */}
      <div className="grid gap-4 w-full">
        {ORGANIZATION_TYPES.map((type) => {
          const isSelected = form.orgType === type.id;

          return (
            <button
              key={type.id}
              type="button"
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  orgType: type.id,
                }))
              }
              className={`group w-full rounded-xl border p-5 text-left transition-all duration-300 relative flex items-start gap-4 ${
                isSelected
                  ? "border-orange ring-1 ring-orange bg-white shadow-sm"
                  : "border-slate-200 bg-white hover:border-slate-300 shadow-sm"
              }`}
            >
              {/* Radio-style Selection Indicator */}
              <div className="flex items-center justify-center pt-0.5">
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-200 ${
                    isSelected
                      ? "border-orange bg-orange"
                      : "border-slate-300 group-hover:border-slate-400 bg-white"
                  }`}
                >
                  {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </div>

              {/* Content Area */}
              <div className="flex-1 space-y-1">
                <div className="font-semibold text-slate-950 flex items-center gap-2">
                  <span>{type.title}</span>
                  <span className="text-base opacity-80">{type.icon}</span>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
                  {type.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}