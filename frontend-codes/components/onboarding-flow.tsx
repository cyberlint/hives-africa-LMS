"use client";

import { useState } from "react";
import { completeOnboardingAction } from "../app/api/onboarding/actions"; // Adjust path
import { motion, Variants, AnimatePresence } from "framer-motion";
import { ORGANIZATION_TYPES, ORGANIZATION_MISSIONS } from "./organization/config";

// Constants for the onboarding flow
const USER_TYPES = [
  {
    id: "INDIVIDUAL",
    title: "Grow My Career",
    icon: "🚀",
    description:
      "Learn, build projects, join programs and showcase your work."
  },
  {
    id: "ORGANIZATION",
    title: "Run Programs",
    icon: "🏢",
    description:
      "Manage innovation challenges, fellowships, communities and talent programs."
  }
];

const CAREER_INTERESTS = [
  "AI & Machine Learning", "SQL & Databases", "BI & Analytics",
  "UI/UX Design", "Software Engineering", "Product Management",
];

const LEARNING_INTENTS = [
  { id: "Upskill", icon: "🚀", title: "Upskilling", desc: "Build projects to advance in your current role." },
  { id: "Career Switch", icon: "🔄", title: "Career Switch", desc: "Transition into a new tech field." },
  { id: "Academic", icon: "🎓", title: "Academic Support", desc: "Turn university theory into practical skills." },
  { id: "Personal", icon: "💡", title: "Personal Growth", desc: "Explore tech and build out of curiosity." },
];

// Spring animations for a playful, native-app feel
const springVariant: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 24, staggerChildren: 0.1 }
  },
  exit: { opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.2 } }
};

const itemVariant: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function OnboardingFlow() {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    userType: "",

    // These fields are only relevant if the userType is "INDIVIDUAL"
    jobTitle: "",
    careerInterests: [] as string[],
    learningIntent: "",

    // These fields are only relevant if the userType is "ORGANIZATION"
    organizationName: "",
    organizationType: "",
    organizationMission: "",
  });

  const toggleInterest = (interest: string) => {
    setFormData((prev) => {
      const exists = prev.careerInterests.includes(interest);


      return {
        ...prev,
        careerInterests: exists
          ? prev.careerInterests.filter(i => i !== interest)
          : [...prev.careerInterests, interest]
      };
    });
  };

  const maxStep =
    formData.userType === "ORGANIZATION"
      ? 4
      : 3;

  const handleNext = async () => {
    if (step < maxStep) {
      setStep(s => s + 1);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await completeOnboardingAction(formData as any);
      if (!response?.success) throw new Error(response?.error || "Failed");

      // Add a slight delay here if you want to show a success state/confetti later
      window.location.href = "/home";
    } catch (err) {
      alert("We couldn't save your profile. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleBack = () => setStep(s => s - 1);
  const progress = (step / maxStep) * 100;

  // Validation checks
  // For INDIVIDUAL users:
  const canProceedUserType = formData.userType !== "";
  const canProceedIndividualStep2 =
    formData.jobTitle.trim() !== "" && formData.careerInterests.length >= 2;
  const canProceedIndividualStep3 = formData.learningIntent !== "";

  // For ORGANIZATION users:
  const canProceedOrgStep2 = formData.organizationName.trim().length >= 2;
  const canProceedOrgStep3 = formData.organizationMission !== "";
  const canProceedOrgStep4 = formData.organizationType !== "";

  const isContinueDisabled = (() => {
    // User type selection
    if (step === 1) {
      return !canProceedUserType;
    }

    // Individual flow
    if (formData.userType === "INDIVIDUAL") {
      if (step === 2) {
        return !canProceedIndividualStep2;
      }

      if (step === 3) {
        return !canProceedIndividualStep3 || isSubmitting;
      }
    }

    // Organization flow
    if (formData.userType === "ORGANIZATION") {
      if (step === 2) {
        return !canProceedOrgStep2;
      }

      if (step === 3) {
        return !canProceedOrgStep3;
      }

      if (step === 4) {
        return !canProceedOrgStep4 || isSubmitting;
      }
    }

    return false;
  })();

  return (
    <div className="fixed inset-0 bg-background text-foreground z-50 flex flex-col h-[100dvh] overflow-hidden selection:bg-orange/20">

      {/* Duolingo-style Progress Bar */}
      {step > 0 && (
        <div className="w-full px-6 pt-6 pb-2 max-w-2xl mx-auto flex items-center gap-4">
          <button
            onClick={handleBack}
            className="text-muted-foreground hover:text-darkBlue-500 transition-colors p-2 -ml-2 rounded-full hover:bg-muted"
            aria-label="Go back"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-orange rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            />
          </div>
        </div>
      )}



      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar-on-hover relative">
        <div className="max-w-xl mx-auto px-6 pt-8 pb-32 min-h-full flex flex-col justify-center">
          <AnimatePresence mode="wait">

            {/* STEP 0: THE HOOK */}
            {step === 0 && (
              <motion.div
                key="intro"
                variants={springVariant}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="text-center space-y-8 my-auto"
              >
                <motion.div variants={itemVariant} className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-orange/10 text-orange mb-4 shadow-inner">
                  <span className="text-5xl">👋</span>
                </motion.div>

                <motion.div variants={itemVariant} className="space-y-6 text-center">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-darkBlue-500 tracking-tighter leading-[1.15]">
                    Build talent. <br className="hidden sm:block" /> Run programs.{" "}
                    <span className="relative inline-block text-orange whitespace-nowrap">
                      Scale innovation.
                      {/* Hand-drawn style marker underline */}
                      <svg
                        className="absolute -bottom-1.5 left-0 w-full h-4 text-orange/20"
                        viewBox="0 0 100 20"
                        preserveAspectRatio="none"
                      >
                        <path
                          d="M5 15 Q 50 25 95 5"
                          stroke="currentColor"
                          strokeWidth="8"
                          strokeLinecap="round"
                          fill="transparent"
                        />
                      </svg>
                    </span>
                  </h1>
                  <p className="text-base md:text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed text-balance">
                    NextHive helps individuals grow through real-world work and helps organizations run programs that create measurable outcomes.
                  </p>
                </motion.div>

                <motion.div variants={itemVariant} className="pt-8">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleNext}
                    className="w-full sm:w-auto bg-orange text-white px-12 py-4 rounded-full font-bold text-lg shadow-xl shadow-orange/20 hover:shadow-orange/30 transition-shadow"
                  >
                    {"Let's go!"}
                  </motion.button>
                </motion.div>
              </motion.div>
            )}

            {/* STEP 1: USER TYPE */}
            {step === 1 && (
              <motion.div
                key="user-type"
                variants={springVariant}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-full space-y-8 mt-4"
              >
                <div className="space-y-2">
                  <h2 className="text-3xl md:text-4xl font-extrabold text-darkBlue-500 tracking-tight">
                    What brings you to NextHive?
                  </h2>

                  <p className="text-muted-foreground text-lg">
                    Choose the experience that best describes what you want to accomplish.
                  </p>
                </div>

                <div className="grid gap-4 pt-4">
                  {USER_TYPES.map((type) => {
                    const active = formData.userType === type.id;
                    return (
                      <motion.button
                        key={type.id}
                        whileTap={{ scale: 0.98 }}
                        onClick={() =>
                          setFormData({
                            ...formData,
                            userType: type.id,
                          })
                        }
                        className={`w-full flex items-center gap-5 p-5 rounded-3xl border-2 text-left transition-all
            ${active
                            ? "border-orange bg-orange/5 shadow-sm ring-2 ring-orange/20"
                            : "border-border bg-card hover:border-orange/40"
                          }`}
                      >
                        <div
                          className={`flex items-center justify-center w-14 h-14 rounded-2xl text-2xl
              ${active
                              ? "bg-orange text-white"
                              : "bg-muted text-muted-foreground"
                            }`}
                        >
                          {type.icon}
                        </div>

                        <div className="flex-1">
                          <div
                            className={`font-bold text-lg ${active ? "text-orange" : "text-darkBlue-500"
                              }`}
                          >
                            {type.title}
                          </div>

                          <div className="text-sm text-muted-foreground mt-1">
                            {type.description}
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* STEP 2: (For INDIVIDUAL) */}
            {step === 2 && formData.userType === "INDIVIDUAL" && (
              <motion.div key="career" variants={springVariant} initial="hidden" animate="visible" exit="exit" className="w-full space-y-8 mt-4">
                <div className="space-y-2">
                  <h2 className="text-3xl md:text-4xl font-extrabold text-darkBlue-500 tracking-tight">
                    Tell us about you.
                  </h2>
                  <p className="text-muted-foreground text-lg">
                    {"We'll match you with the right practical projects based on your background."}
                  </p>
                </div>

                <div className="space-y-8 pt-4">
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-darkBlue-500 uppercase tracking-wider">Current Role</label>
                    <input
                      placeholder="e.g. Student, Data Analyst..."
                      value={formData.jobTitle}
                      onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                      className="w-full p-5 rounded-2xl border-2 border-border bg-card text-foreground text-lg focus:outline-none focus:border-orange focus:ring-4 focus:ring-orange/10 transition-all placeholder:text-muted-foreground/50"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-end mb-4">
                      <label className="text-sm font-bold text-darkBlue-500 uppercase tracking-wider">Learning Tracks</label>
                      <span className={`text-xs font-bold px-2 py-1 rounded-md ${formData.careerInterests.length >= 2 ? "bg-green-100 text-green-700" : "bg-orange/10 text-orange"}`}>
                        Select at least 2
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {CAREER_INTERESTS.map(i => {
                        const active = formData.careerInterests.includes(i);
                        return (
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            key={i}
                            onClick={() => toggleInterest(i)}
                            className={`px-5 py-3 rounded-2xl border-2 text-sm font-bold transition-all
                            ${active
                                ? "bg-orange border-orange text-white shadow-md shadow-orange/20"
                                : "bg-card border-border text-muted-foreground hover:border-orange/40 hover:text-darkBlue-500"}`}
                          >
                            {i}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: ORGANIZATION NAME */}
            {step === 2 && formData.userType === "ORGANIZATION" && (
              <motion.div
                key="org-name"
                variants={springVariant}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-full space-y-8 mt-4"
              >
                <div className="space-y-2">
                  <h2 className="text-3xl md:text-4xl font-extrabold text-darkBlue-500 tracking-tight">
                    {"What's your organization called?"}
                  </h2>

                  <p className="text-muted-foreground text-lg">
                    This will be used to personalize your workspace and create your organization profile.
                  </p>
                </div>

                <div className="pt-4">
                  <label className="text-sm font-bold text-darkBlue-500 uppercase tracking-wider">
                    Organization Name
                  </label>

                  <input
                    type="text"
                    placeholder="e.g. NextHive, Acme Foundation, Innovate Nigeria"
                    value={formData.organizationName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        organizationName: e.target.value,
                      })
                    }
                    className="mt-3 w-full p-5 rounded-2xl border-2 border-border bg-card text-foreground text-lg focus:outline-none focus:border-orange focus:ring-4 focus:ring-orange/10 transition-all placeholder:text-muted-foreground/50"
                  />
                </div>

                <div className="rounded-2xl border border-border bg-muted/30 p-4">
                  <p className="text-sm text-muted-foreground">
                    {"Don't worry, you'll be able to update your organization details later and invite teammates after setup."}
                  </p>
                </div>
              </motion.div>
            )}


            {/* STEP 3: (GOAL for INDIVIDUAL) */}
            {step === 3 && formData.userType === "INDIVIDUAL" && (
              <motion.div key="intent" variants={springVariant} initial="hidden" animate="visible" exit="exit" className="w-full space-y-8 mt-4">
                <div className="space-y-2">
                  <h2 className="text-3xl md:text-4xl font-extrabold text-darkBlue-500 tracking-tight">
                    {"What's your goal?"}
                  </h2>
                  <p className="text-muted-foreground text-lg">
                    Select your primary objective to finalize your curriculum.
                  </p>
                </div>

                <div className="grid gap-4 pt-4">
                  {LEARNING_INTENTS.map(intent => {
                    const active = formData.learningIntent === intent.id;
                    return (
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        key={intent.id}
                        onClick={() => setFormData({ ...formData, learningIntent: intent.id })}
                        className={`w-full flex items-center gap-5 p-5 rounded-3xl border-2 transition-all text-left
                        ${active
                            ? "border-orange bg-orange/5 shadow-sm ring-2 ring-orange/20"
                            : "border-border bg-card hover:border-orange/40 hover:bg-muted/50"}`}
                      >
                        <div className={`flex items-center justify-center w-14 h-14 rounded-2xl text-2xl transition-colors ${active ? "bg-orange text-white shadow-inner" : "bg-muted text-muted-foreground"}`}>
                          {intent.icon}
                        </div>
                        <div className="flex-1">
                          <div className={`font-bold text-lg ${active ? "text-orange" : "text-darkBlue-500"}`}>
                            {intent.title}
                          </div>
                          <div className="text-sm text-muted-foreground mt-1 font-medium">
                            {intent.desc}
                          </div>
                        </div>

                        {/* Custom radio indicator */}
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${active ? "border-orange bg-orange" : "border-muted-foreground/30"}`}>
                          {active && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-2.5 h-2.5 bg-white rounded-full" />}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* STEP 3: (GOAL for ORGANIZATION) */}
            {step === 3 && formData.userType === "ORGANIZATION" && (
              <motion.div key="intent" variants={springVariant} initial="hidden" animate="visible" exit="exit" className="w-full space-y-8 mt-4">
                <div className="space-y-2">
                  <h2 className="text-3xl md:text-4xl font-extrabold text-darkBlue-500 tracking-tight">
                    {"What's your goal?"}
                  </h2>
                  <p className="text-muted-foreground text-lg">
                    What are you trying to achieve?
                  </p>
                </div>

                <div className="grid gap-4 pt-4">
                  {ORGANIZATION_MISSIONS.map(intent => {
                    const active = formData.organizationMission === intent.id;
                    return (
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        key={intent.id}
                        onClick={() => setFormData({ ...formData, organizationMission: intent.id })}
                        className={`w-full flex items-center gap-5 p-5 rounded-3xl border-2 transition-all text-left
                        ${active
                            ? "border-orange bg-orange/5 shadow-sm ring-2 ring-orange/20"
                            : "border-border bg-card hover:border-orange/40 hover:bg-muted/50"}`}
                      >
                        <div className={`flex items-center justify-center w-14 h-14 rounded-2xl text-2xl transition-colors ${active ? "bg-orange text-white shadow-inner" : "bg-muted text-muted-foreground"}`}>
                          {intent.icon}
                        </div>
                        <div className="flex-1">
                          <div className={`font-bold text-lg ${active ? "text-orange" : "text-darkBlue-500"}`}>
                            {intent.title}
                          </div>
                          <div className="text-sm text-muted-foreground mt-1 font-medium">
                            {intent.desc}
                          </div>
                        </div>

                        {/* Custom radio indicator */}
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${active ? "border-orange bg-orange" : "border-muted-foreground/30"}`}>
                          {active && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-2.5 h-2.5 bg-white rounded-full" />}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* STEP 4: (For ORGANIZATION - ORGANIZATION TYPE) */}
            {step === 4 && formData.userType === "ORGANIZATION" && (
              <motion.div
                key="org-type"
                variants={springVariant}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-full space-y-8 mt-4"
              >
                <div className="space-y-2">
                  <h2 className="text-3xl md:text-4xl font-extrabold text-darkBlue-500 tracking-tight">
                    Tell us about your organization
                  </h2>

                  <p className="text-muted-foreground text-lg">
                    {"We'll tailor your workspace around the programs you run."}
                  </p>
                </div>

                <div className="grid gap-4 pt-4">
                  {ORGANIZATION_TYPES.map((type) => {
                    const active = formData.organizationType === type.id;

                    return (
                      <motion.button
                        key={type.id}
                        whileTap={{ scale: 0.98 }}
                        onClick={() =>
                          setFormData({
                            ...formData,
                            organizationType: type.id,
                          })
                        }
                        className={`w-full flex items-center gap-5 p-5 rounded-3xl border-2 transition-all text-left
            ${active
                            ? "border-orange bg-orange/5 shadow-sm ring-2 ring-orange/20"
                            : "border-border bg-card hover:border-orange/40 hover:bg-muted/50"
                          }`}
                      >
                        <div
                          className={`flex items-center justify-center w-14 h-14 rounded-2xl text-2xl transition-colors
              ${active
                              ? "bg-orange text-white shadow-inner"
                              : "bg-muted text-muted-foreground"
                            }`}
                        >
                          {type.icon}
                        </div>

                        <div className="flex-1">
                          <div
                            className={`font-bold text-lg ${active ? "text-orange" : "text-darkBlue-500"
                              }`}
                          >
                            {type.title}
                          </div>

                          <div className="text-sm text-muted-foreground mt-1 font-medium">
                            {type.desc}
                          </div>
                        </div>

                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center
              ${active
                              ? "border-orange bg-orange"
                              : "border-muted-foreground/30"
                            }`}
                        >
                          {active && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-2.5 h-2.5 bg-white rounded-full"
                            />
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Glassmorphism Bottom Action Bar */}
      <AnimatePresence>
        {step > 0 && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="fixed bottom-0 left-0 right-0 border-t border-border bg-background/80 backdrop-blur-xl p-4 sm:p-6 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]"
          >
            <div className="max-w-xl mx-auto flex justify-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}

                disabled={isContinueDisabled}
                onClick={handleNext}
                className="w-full sm:w-auto bg-orange text-white px-10 py-4 rounded-full font-bold text-lg shadow-lg shadow-orange/20 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed hover:bg-orange/90 transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  "Setting things up..."
                ) : step === maxStep ? (
                  "Complete Setup"
                ) : (
                  "Continue"
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}