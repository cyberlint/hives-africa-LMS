"use client";

import { useState } from "react";
import { completeOnboardingAction } from "../app/api/onboarding/actions"; // Adjust path
import { motion, Variants, AnimatePresence } from "framer-motion";

const LOCAL_LANGUAGES = [
  "Amharic", "Arabic", "Hausa", "Igbo", "Oromo", 
  "Shona", "Swahili", "Yoruba", "Zulu", "None", "Other"
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

const itemVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function OnboardingFlow() {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    primaryLanguage: "English",
    localLanguage: "",
    jobTitle: "",
    careerInterests: [] as string[],
    learningIntent: "",
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

  const handleNext = async () => {
    if (step < 3) {
      setStep(s => s + 1);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await completeOnboardingAction(formData);
      if (!response?.success) throw new Error(response?.error || "Failed");
      
      // Add a slight delay here if you want to show a success state/confetti later
      window.location.href = "/dashboard";
    } catch (err) {
      alert("We couldn't save your profile. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleBack = () => setStep(s => s - 1);
  const progress = (step / 3) * 100;

  // Validation checks
  const canProceedStep2 = formData.careerInterests.length >= 2 && formData.jobTitle.trim() !== "";
  const canProceedStep3 = formData.learningIntent !== "";

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
              <path d="m15 18-6-6 6-6"/>
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
                
                <motion.div variants={itemVariant} className="space-y-4">
                  <h1 className="text-4xl md:text-5xl font-extrabold text-darkBlue-500 tracking-tight leading-[1.1]">
                    Ready to build <br/> something <span className="text-orange relative">
                      great?
                      <svg className="absolute w-full h-3 -bottom-1 left-0 text-orange/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                        <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="transparent"/>
                      </svg>
                    </span>
                  </h1>
                  <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
                    {"At NextHive, we don't just watch tutorials. We build real-world solutions. Let's set up your personalized workspace."}
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

            {/* STEP 1: LANGUAGE */}
            {step === 1 && (
              <motion.div key="language" variants={springVariant} initial="hidden" animate="visible" exit="exit" className="w-full space-y-8 mt-4">
                <div className="space-y-2">
                  <h2 className="text-3xl md:text-4xl font-extrabold text-darkBlue-500 tracking-tight">
                    {"What's your language?"}
                  </h2>
                  <p className="text-muted-foreground text-lg">
                    Select the language you are most comfortable learning in.
                  </p>
                </div>

                <div className="space-y-6 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    {["English", "French"].map((lang) => {
                      const isActive = formData.primaryLanguage === lang;
                      return (
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          key={lang}
                          onClick={() => setFormData({ ...formData, primaryLanguage: lang })}
                          className={`relative p-6 rounded-3xl border-2 font-bold text-xl transition-all overflow-hidden text-center
                          ${isActive 
                              ? "border-orange bg-orange/5 text-orange shadow-sm" 
                              : "border-border bg-card text-muted-foreground hover:border-orange/30 hover:bg-muted/50"}`}
                        >
                          {isActive && (
                            <motion.div layoutId="outline" className="absolute inset-0 border-2 border-orange rounded-3xl pointer-events-none" />
                          )}
                          {lang}
                        </motion.button>
                      );
                    })}
                  </div>

                  <div className="relative group">
                    <select
                      value={formData.localLanguage}
                      onChange={(e) => setFormData({ ...formData, localLanguage: e.target.value })}
                      className="w-full p-5 rounded-2xl border-2 border-border bg-card text-foreground font-medium focus:outline-none focus:border-orange transition-all appearance-none cursor-pointer hover:border-orange/30"
                    >
                      <option value="" disabled>Add a local language (optional)</option>
                      {LOCAL_LANGUAGES.map(l => (
                        <option key={l} value={l}>{l}</option>
                      ))}
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground group-hover:text-orange transition-colors">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: CAREER & TRACK */}
            {step === 2 && (
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

            {/* STEP 3: INTENT */}
            {step === 3 && (
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
                disabled={
                  (step === 2 && !canProceedStep2) || 
                  (step === 3 && (!canProceedStep3 || isSubmitting))
                }
                onClick={handleNext}
                className="w-full sm:w-auto bg-orange text-white px-10 py-4 rounded-full font-bold text-lg shadow-lg shadow-orange/20 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed hover:bg-orange/90 transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Building Profile...
                  </span>
                ) : step === 3 ? (
                  "Start Building"
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