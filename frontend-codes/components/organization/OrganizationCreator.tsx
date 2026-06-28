"use client";

import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { toast } from "sonner";

import type { CreateOrganizationInput } from "@/lib/zodSchemas";
import { createOrganization } from "@/app/(private routes)/orgs/actions";

import { Button } from "@/components/ui/button";

import { WelcomeStep } from "./steps/WelcomeStep";
import { IdentityStep } from "./steps/IdentityStep";
import { TypeStep } from "./steps/TypeStep";
import { MissionStep } from "./steps/MissionStep";
import { ReviewStep } from "./steps/ReviewStep";

// Metadata for the right-side contextual panel
const STEP_INFO = [
  { title: "Welcome", desc: "" },
  { 
    title: "Organization Details", 
    desc: "Tell us about your organization, and we'll establish your foundational workspace." 
  },
  { 
    title: "Structure & Type", 
    desc: "Based on your structure, we will tailor the underlying governance tools to match." 
  },
  { 
    title: "Core Mission", 
    desc: "Define your primary objectives to align your incoming team and ecosystem." 
  },
  { 
    title: "Review & Launch", 
    desc: "Verify your details before we initialize the environment." 
  }
];

// Premium easing curve for smooth UI transitions
const transitionLayout = { 
  duration: 0.5, 
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number] 
};

export function OrganizationCreator() {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState<Partial<CreateOrganizationInput>>({
    name: "",
    website: "",
    logoUrl: "",
    orgType: undefined,
    missions: [],
  });

  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => s - 1);

  async function handleFinish() {
    try {
      setIsSubmitting(true);
      await createOrganization(form as CreateOrganizationInput);
      // Optional: Add router.push() here to redirect upon success
    } catch (err: any) {
      toast.error(err.message || "Failed to create organization");
      setIsSubmitting(false);
    }
  }

  // Animation variants for form steps
  const slideVariants: Variants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0, transition: transitionLayout },
    exit: { opacity: 0, x: -20, transition: { duration: 0.3, ease: "easeInOut" } }
  };

  const welcomeVariants: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: transitionLayout },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <div className="flex min-h-screen w-full bg-white text-slate-900 font-sans">
      
      {/* LEFT COLUMN: Active Form Area */}
      <div className="flex flex-col flex-1 h-screen bg-white">
        
        {/* SCROLLABLE FORM CONTENT: Takes up available space */}
        <div 
          className={`flex-1 overflow-y-auto w-full px-6 py-12 lg:pt-24 lg:pb-12 ${
            step === 0 
              ? 'flex flex-col items-center justify-center text-center' 
              : 'max-w-md mx-auto lg:mx-0 lg:ml-auto lg:mr-12 xl:mr-24'
          }`}
        >
          <div className="w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                variants={step === 0 ? welcomeVariants : slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {step === 0 && <WelcomeStep onNext={next} />}
                {step === 1 && <IdentityStep form={form} setForm={setForm} />}
                {step === 2 && <TypeStep form={form} setForm={setForm} />}
                {step === 3 && <MissionStep form={form} setForm={setForm} />}
                {step === 4 && <ReviewStep form={form} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* FIXED NAVIGATION FOOTER: Always sticks to the bottom */}
        {step > 0 && (
          <div className="w-full border-t border-slate-100 bg-white p-6 lg:pl-12 lg:pr-24 lg:pb-12">
            <div className={`max-w-md flex items-center gap-4 ${step === 0 ? 'hidden' : 'mx-auto lg:mx-0 lg:ml-auto lg:mr-12 xl:mr-24'}`}>
              <Button
                variant="ghost"
                onClick={back}
                className="text-slate-500 hover:text-slate-900 px-6"
              >
                Back
              </Button>

              <div className="flex-1" />

              {step < 4 ? (
                <Button
                  onClick={next}
                  className="px-8 shadow-sm bg-orange hover:bg-orange-600 text-white transition-colors rounded-lg"
                  disabled={(step === 1 && !form.name?.trim()) || (step === 2 && !form.orgType) || (step === 3 && !form.missions?.length)}
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleFinish}
                  disabled={isSubmitting}
                  className="px-8 shadow-sm bg-slate-900 hover:bg-slate-800 text-white transition-colors rounded-lg"
                >
                  {isSubmitting ? "Initializing..." : "Launch Organization"}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* RIGHT COLUMN: Context & Progression (Hidden on mobile) */}
      {step > 0 && (
        <div className="hidden lg:flex w-[45%] bg-[#f8f9fb] border-l border-slate-200 flex-col items-start justify-center pl-24 pr-12 relative overflow-hidden">
          <div className="max-w-md w-full z-10">
            <span className="text-sm font-semibold tracking-wide text-slate-500 uppercase mb-6 block">
              Step {step} of 4
            </span>
            
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900 mb-6">
              {STEP_INFO[step]?.title}
            </h2>

            {/* Segmented Progress Bar */}
            <div className="flex gap-2 mb-8 w-full max-w-[280px]">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${
                    step >= item ? "bg-orange" : "bg-slate-200"
                  }`}
                />
              ))}
            </div>

            <p className="text-slate-600 leading-relaxed text-lg">
              {STEP_INFO[step]?.desc}
            </p>

            {/* Placeholder for future UI mockups per step */}
            <div className="mt-12 h-64 w-full bg-white rounded-xl border border-slate-200 shadow-sm opacity-50 flex items-center justify-center">
              <span className="text-slate-400 text-sm">Visual Preview Area</span>
            </div>
          </div>

          {/* Optional subtle background pattern for depth */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '32px 32px' }} 
          />
        </div>
      )}

    </div>
  );
}