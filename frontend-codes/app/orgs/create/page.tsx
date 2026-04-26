"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { createOrganization } from "../actions";
import type { CreateOrganizationInput } from "@/lib/zodSchemas";
import { Uploader } from "@/components/lms/file-uploader/uploader";
import {
  OrgType,
  OrgMission,
  OperatingModel,
  CollaborationMode,
} from "@prisma/client";

import { Button } from "@/components/ui/button";

// -----------------------------
// CONFIG (DYNAMIC SYSTEM MAP)
// -----------------------------

export const OrgTypeConfig = {
  Fellowship_Program: {
    missions: [
      "Talent_Development",
      "Skill_Training",
      "Community_Building",
    ],
    operatingModels: [
      "Cohort_Based",
      "Apprenticeship_Model",
      "Hybrid_Model",
    ],
    collaborationModes: [
      "Individual_First",
      "Team_Based",
      "Hybrid_Collaboration",
    ],
  },

  Startup_Company: {
    missions: [
      "Product_Incubation",
      "Talent_Development",
      "Hackathons_And_Competitions",
    ],
    operatingModels: ["Project_Based", "Apprenticeship_Model"],
    collaborationModes: ["Team_Based", "Hybrid_Collaboration"],
  },

  Tech_Community: {
    missions: [
      "Community_Building",
      "Open_Source_Contribution",
      "Hackathons_And_Competitions",
    ],
    operatingModels: ["Community_Led", "Project_Based"],
    collaborationModes: ["Hybrid_Collaboration"],
  },

  Training_Academy: {
    missions: ["Skill_Training", "Talent_Development"],
    operatingModels: ["Cohort_Based", "Project_Based"],
    collaborationModes: ["Individual_First", "Team_Based"],
  },

  Talent_Accelerator: {
    missions: ["Talent_Development", "Hiring_And_Placement_Pipeline"],
    operatingModels: ["Cohort_Based", "Apprenticeship_Model"],
    collaborationModes: ["Team_Based"],
  },

  Open_Source_Community: {
    missions: ["Open_Source_Contribution", "Community_Building"],
    operatingModels: ["Community_Led", "Project_Based"],
    collaborationModes: ["Hybrid_Collaboration"],
  },

  Corporate_Learning_Team: {
    missions: ["Internal_Team_UpSkilling", "Skill_Training"],
    operatingModels: ["Cohort_Based", "Hybrid_Model"],
    collaborationModes: ["Individual_First", "Team_Based"],
  },

  University_Department: {
    missions: ["Research_And_Education", "Skill_Training"],
    operatingModels: ["Cohort_Based"],
    collaborationModes: ["Individual_First"],
  },

  Nonprofit_Initiative: {
    missions: ["Community_Building", "Talent_Development"],
    operatingModels: ["Community_Led", "Cohort_Based"],
    collaborationModes: ["Hybrid_Collaboration"],
  },

  Bootcamp_Provider: {
    missions: ["Skill_Training", "Talent_Development", "Hiring_And_Placement_Pipeline"],
    operatingModels: ["Cohort_Based"],
    collaborationModes: ["Team_Based"],
  },

  Other: {
    missions: ["Community_Building", "Talent_Development"],
    operatingModels: ["Hybrid_Model"],
    collaborationModes: ["Hybrid_Collaboration"],
  },
} as const;

type OrgTypeKey = keyof typeof OrgTypeConfig;

// -----------------------------
// UI HELPERS
// -----------------------------

const formatEnum = (str: string) => str.replace(/_/g, " ");

const MODEL_UI_MAP: Record<string, { icon: string; title: string; desc: string }> = {
  Cohort_Based: {
    icon: "👥",
    title: "Cohort-Based",
    desc: "Structured programs with timelines",
  },
  Apprenticeship_Model: {
    icon: "🛠️",
    title: "Apprenticeship",
    desc: "Learn by building real work",
  },
  Community_Led: {
    icon: "🌍",
    title: "Community-Led",
    desc: "Peer-driven ecosystem",
  },
  Project_Based: {
    icon: "🚀",
    title: "Project-Based",
    desc: "Learn through execution",
  },
  Hybrid_Model: {
    icon: "⚡",
    title: "Hybrid Model",
    desc: "Mixed learning structure",
  },
};

const STRUCTURE_UI_MAP: Record<string, { title: string; desc: string }> = {
  Individual_First: {
    title: "Individual First",
    desc: "Self-paced execution",
  },
  Team_Based: {
    title: "Team-Based",
    desc: "Collaborative execution",
  },
  Hybrid_Collaboration: {
    title: "Hybrid Collaboration",
    desc: "Solo + team mix",
  },
};

// -----------------------------
// ANIMATION
// -----------------------------

const variant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

// -----------------------------
// COMPONENT
// -----------------------------

export default function OrganizationOnboarding() {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState<Partial<CreateOrganizationInput>>({
    name: "",
    website: "",
    logoUrl: "",
    missions: [],
  });

  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => s - 1);

  const handleOrgTypeSelect = (type: string) => {
    setForm({
      ...form,
      orgType: type as OrgType,
      missions: [],
      operatingModel: undefined,
      collaborationMode: undefined,
    });
  };

  const toggleMission = (item: string) => {
    const typed = item as OrgMission;

    setForm((prev) => ({
      ...prev,
      missions: prev.missions?.includes(typed)
        ? prev.missions.filter((m) => m !== typed)
        : [...(prev.missions || []), typed],
    }));
  };

  async function handleFinish() {
    setIsSubmitting(true);
    try {
      await createOrganization(form as CreateOrganizationInput);
    } catch (err: any) {
      toast.error(err.message || "Failed to create organization");
      setIsSubmitting(false);
    }
  }

  const config = form.orgType
    ? OrgTypeConfig[form.orgType as OrgTypeKey]
    : null;

  const progress = (step / 5) * 100;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">

      {/* PROGRESS */}
      {step > 0 && (
        <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 pt-6">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* CONTENT */}
      <div className="flex-1 flex justify-center px-4 sm:px-6 py-10">
        <div className="w-full max-w-lg space-y-6">

          <AnimatePresence mode="wait">

            {/* STEP 0 */}
            {step === 0 && (
              <motion.div key="0" variants={variant} initial="hidden" animate="visible" exit="exit" className="space-y-6 w-full max-w-lg pb-20">
                <div className="text-5xl">🏛️</div>

                <h1 className="text-3xl sm:text-4xl font-bold">
                  Build your organization OS
                </h1>

                <p className="text-muted-foreground">
                  Design how people learn, build, and execute together.
                </p>

                <Button onClick={next} size="lg" className="w-full">
                  Let's design it →
                </Button>
              </motion.div>
            )}

            {/* STEP 1 */}
            {step === 1 && (
              <motion.div key="1" variants={variant} initial="hidden" animate="visible" exit="exit" className="space-y-6 w-full max-w-lg pb-20">
                <h2 className="text-2xl font-bold">Organization Identity</h2>

                <Uploader
                  value={form.logoUrl}
                  apiEndpoint="/api/s3/upload-public"
                  onChange={(key) => setForm({ ...form, logoUrl: key })}
                />

                <input
                  className="w-full p-4 rounded-md border"
                  placeholder="Organization name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />

                <input
                  className="w-full p-4 rounded-md border"
                  placeholder="Website"
                  value={form.website || ""}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                />

                <div className="grid grid-cols-2 gap-2">
                  {Object.keys(OrgTypeConfig).map((t) => (
                    <button
                      key={t}
                      onClick={() => handleOrgTypeSelect(t)}
                      className={`p-3 rounded-md border text-sm ${
                        form.orgType === t
                          ? "bg-primary text-primary-foreground"
                          : ""
                      }`}
                    >
                      {formatEnum(t)}
                    </button>
                  ))}
                </div>

                <Button
                  onClick={next}
                  disabled={!form.name || !form.orgType}
                  className="w-full"
                >
                  Continue
                </Button>
              </motion.div>
            )}

            {/* STEP 2 */}
            {step === 2 && config && (
              <motion.div key="2" variants={variant} initial="hidden" animate="visible" exit="exit" className="space-y-6 w-full max-w-lg pb-20">
                <h2 className="text-2xl font-bold">What are your goals?</h2>

                <div className="flex flex-wrap gap-2">
                  {config.missions.map((m) => (
                    <button
                      key={m}
                      onClick={() => toggleMission(m)}
                      className={`px-4 py-2 rounded-full border ${
                        form.missions?.includes(m as OrgMission)
                          ? "bg-primary text-primary-foreground"
                          : ""
                      }`}
                    >
                      {formatEnum(m)}
                    </button>
                  ))}
                </div>

                <Button
                  onClick={next}
                  disabled={!form.missions?.length}
                  className="w-full"
                >
                  Continue
                </Button>
              </motion.div>
            )}

            {/* STEP 3 */}
            {step === 3 && config && (
              <motion.div key="3" variants={variant} initial="hidden" animate="visible" exit="exit" className="space-y-6 w-full max-w-lg pb-20">
                <h2 className="text-2xl font-bold">Operating Model</h2>

                {config.operatingModels.map((m) => {
                  const ui = MODEL_UI_MAP[m];
                  return (
                    <button
                      key={m}
                      onClick={() =>
                        setForm({
                          ...form,
                          operatingModel: m as OperatingModel,
                        })
                      }
                      className="w-full p-4 border rounded-md text-left"
                    >
                      <div className="font-bold">{ui.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {ui.desc}
                      </div>
                    </button>
                  );
                })}

                <Button onClick={next} className="w-full">
                  Continue
                </Button>
              </motion.div>
            )}

            {/* STEP 4 */}
            {step === 4 && config && (
              <motion.div key="4" variants={variant} initial="hidden" animate="visible" exit="exit" className="space-y-6 w-full max-w-lg pb-20">
                <h2 className="text-2xl font-bold">Collaboration Mode</h2>

                {config.collaborationModes.map((m) => {
                  const ui = STRUCTURE_UI_MAP[m];
                  return (
                    <button
                      key={m}
                      onClick={() =>
                        setForm({
                          ...form,
                          collaborationMode: m as CollaborationMode,
                        })
                      }
                      className="w-full p-4 border rounded-md text-left"
                    >
                      <div className="font-bold">{ui.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {ui.desc}
                      </div>
                    </button>
                  );
                })}

                <Button onClick={next} className="w-full">
                  Continue
                </Button>
              </motion.div>
            )}

            {/* STEP 5 */}
            {step === 5 && (
              <motion.div key="5" variants={variant} initial="hidden" animate="visible" exit="exit" className="space-y-6 w-full max-w-lg pb-20">
                <div className="text-6xl">🚀</div>

                <h2 className="text-3xl font-bold">
                  Your org is ready
                </h2>

                <Button
                  onClick={handleFinish}
                  disabled={isSubmitting}
                  size="lg"
                  className="w-full"
                >
                  Launch Organization
                </Button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {/* BACK */}
      {step > 0 && (
        <div className="fixed bottom-4 left-4">
          <Button variant="ghost" onClick={back}>
            ← Back
          </Button>
        </div>
      )}
    </div>
  );
}