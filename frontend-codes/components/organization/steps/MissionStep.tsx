"use client";

import type { CreateOrganizationInput } from "@/lib/zodSchemas";
import { ORGANIZATION_MISSIONS } from "../config";
import { Check } from "lucide-react";

interface Props {
  form: Partial<CreateOrganizationInput>;
  setForm: React.Dispatch<
    React.SetStateAction<Partial<CreateOrganizationInput>>
  >;
}

export function MissionStep({ form, setForm }: Props) {
  const missions = form.missions ?? [];

  function toggleMission(id: typeof ORGANIZATION_MISSIONS[number]["id"]) {
    const exists = missions.includes(id);

    setForm((prev) => ({
      ...prev,
      missions: exists
        ? missions.filter((m) => m !== id)
        : [...missions, id],
    }));
  }

  return (
    <div className="w-full space-y-10">
      {/* Header Section */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          Core objectives
        </h2>
        <p className="text-slate-500 text-lg">
          {"Select one or more missions that describe your organization's focus."}
        </p>
      </div>

      {/* Grid Layout - Clean Stacked Cards */}
      <div className="grid gap-4 w-full">
        {ORGANIZATION_MISSIONS.map((mission) => {
          const selected = missions.includes(mission.id);

          return (
            <button
              key={mission.id}
              type="button"
              onClick={() => toggleMission(mission.id)}
              className={`group w-full rounded-xl border p-5 text-left transition-all duration-300 relative flex items-start gap-4 ${
                selected
                  ? "border-orange ring-1 ring-orange bg-white shadow-sm"
                  : "border-slate-200 bg-white hover:border-slate-300 shadow-sm"
              }`}
            >
              {/* Left Side: Professional Custom Selection Indicator */}
              <div className="flex items-center justify-center pt-0.5">
                <div
                  className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-200 ${
                    selected
                      ? "border-orange bg-orange text-white"
                      : "border-slate-300 group-hover:border-slate-400 bg-white"
                  }`}
                >
                  <Check
                    className={`w-3.5 h-3.5 stroke-[3] transition-transform duration-200 ${
                      selected ? "scale-100" : "scale-0"
                    }`}
                  />
                </div>
              </div>

              {/* Right Side: Content Stack */}
              <div className="flex-1 space-y-1">
                <div className="font-semibold text-slate-950 flex items-center gap-2">
                  <span>{mission.title}</span>
                  {mission.icon && (
                    <span className="text-base select-none grayscale group-hover:grayscale-0 transition-all opacity-80">
                      {mission.icon}
                    </span>
                  )}
                </div>

                <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
                  {mission.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}