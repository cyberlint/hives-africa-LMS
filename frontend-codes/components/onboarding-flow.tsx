"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Pan-African focus languages for the dropdown
const LOCAL_LANGUAGES = [
  "None",
  "Amharic",
  "Arabic",
  "Hausa",
  "Igbo",
  "Oromo",
  "Shona",
  "Swahili",
  "Yoruba",
  "Zulu",
  "Other"
];

const CAREER_INTERESTS = [
  "AI & Machine Learning",
  "SQL & Databases",
  "BI & Analytics",
  "UI/UX Design",
  "Software Engineering",
  "Product Management",
];

export default function OnboardingFlow() {
  // Master State for the entire flow
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    primaryLanguage: "English",
    localLanguage: "",
    jobTitle: "",
    careerInterests: [] as string[],
    learningIntent: "",
  });

  const toggleInterest = (interest: string) => {
    setFormData((prev) => {
      const currentInterests = prev.careerInterests;
      if (currentInterests.includes(interest)) {
        return {
          ...prev,
          careerInterests: currentInterests.filter((i) => i !== interest),
        };
      } else {
        return {
          ...prev,
          careerInterests: [...currentInterests, interest],
        };
      }
    });
  };

  const handleNext = () => {
    setStep((prev) => prev + 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white p-6 text-center">
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-md w-full flex flex-col items-center"
          >
            {/* Minimalist Icon/Illustration area */}
            <div className="w-32 h-32 mb-8 bg-orange/10 rounded-full flex items-center justify-center text-5xl">
              🌍
            </div>

            <h1 className="text-3xl font-bold text-darkBlue-500 mb-2 leading-tight">
              Welcome to <span className="text-orange">NextHive</span>
            </h1>
            <p className="text-muted-foreground mb-10 px-4">
              {"Let's customize your experience. Which languages are you most comfortable learning in?"}
            </p>

            {/* Primary Language Toggle */}
            <div className="w-full mb-8">
              <label className="block text-sm font-semibold text-darkBlue-500 mb-3 text-left">
                Primary Platform Language
              </label>
              <div className="flex gap-2">
                {["English", "French"].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setFormData({ ...formData, primaryLanguage: lang })}
                    className={`flex-1 py-3 rounded-2xl border-2 transition-all duration-200 font-semibold ${
                      formData.primaryLanguage === lang
                        ? "border-orange bg-orange/5 text-orange"
                        : "border-border bg-white text-muted-foreground hover:border-orange/30"
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Local Language Select */}
            <div className="w-full mb-12">
              <label className="block text-sm font-semibold text-darkBlue-500 mb-3 text-left">
                Local Language (Optional)
              </label>
              <select
                value={formData.localLanguage}
                onChange={(e) => setFormData({ ...formData, localLanguage: e.target.value })}
                className="w-full p-4 rounded-2xl border-2 border-border bg-white text-darkBlue-500 focus:outline-none focus:border-orange transition-colors appearance-none cursor-pointer"
              >
                <option value="" disabled>Select a local language...</option>
                {LOCAL_LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>

            {/* Progress & Next Button */}
            <div className="w-full flex items-center justify-between mt-auto">
              <div className="flex gap-2">
                <div className="h-1.5 w-6 bg-orange rounded-full" />
                <div className="h-1.5 w-2 bg-border rounded-full" />
                <div className="h-1.5 w-2 bg-border rounded-full" />
              </div>
              
              <button
                onClick={handleNext}
                className="bg-orange text-white font-bold py-3 px-8 rounded-full hover:bg-orange/90 transition-all shadow-lg shadow-orange/20"
              >
                Continue
              </button>
            </div>
          </motion.div>
        )}

        {/* --- STEP 2: Professional Background --- */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-md w-full flex flex-col items-center"
          >
            <div className="w-32 h-32 mb-6 mt-6 bg-lightBlue/10 rounded-full flex items-center justify-center text-5xl">
              💼
            </div>
            <h2 className="text-3xl font-bold text-darkBlue-500 mb-2 leading-tight">
              What do you do right now?
            </h2>
            <p className="text-muted-foreground mb-10 px-4">
              Professional background & skills you want to build.
            </p>

            {/* Job Title Input */}
            <div className="w-full mb-8">
              <label className="block text-sm font-semibold text-darkBlue-500 mb-3 text-left">
                Current Job Title
              </label>
              <input
                type="text"
                placeholder="e.g., Data Analyst, Student, etc."
                value={formData.jobTitle}
                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                className="w-full p-4 rounded-2xl border-2 border-border bg-white text-darkBlue-500 focus:outline-none focus:border-orange transition-colors placeholder:text-muted-foreground/50"
              />
            </div>

            {/* Career Interests (Multi-select Chips) */}
            <div className="w-full mb-12">
              <label className="block text-sm font-semibold text-darkBlue-500 mb-1 text-left">
                What are you interested in?
              </label>
              <p className="text-xs text-muted-foreground mb-4 text-left">Select at least 2 topics</p>
              
              <div className="flex flex-wrap gap-2">
                {CAREER_INTERESTS.map((interest) => {
                  const isSelected = formData.careerInterests.includes(interest);
                  return (
                    <button
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={`px-5 py-2.5 rounded-full border-2 transition-all duration-200 text-sm font-medium ${
                        isSelected
                          ? "bg-orange border-orange text-white"
                          : "bg-white border-border text-muted-foreground hover:border-orange/50"
                      }`}
                    >
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Progress & Navigation */}
            <div className="w-full flex items-center justify-between mt-auto">
              <div className="flex gap-2">
                <div className="h-1.5 w-2 bg-border rounded-full" />
                <div className="h-1.5 w-6 bg-orange rounded-full" />
                <div className="h-1.5 w-2 bg-border rounded-full" />
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setStep(1)}
                  className="py-3 px-6 rounded-full text-muted-foreground font-semibold hover:bg-muted transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  // Disable if no job title or less than 2 interests selected
                  disabled={formData.careerInterests.length < 2 || !formData.jobTitle.trim()}
                  className="bg-orange text-white font-bold py-3 px-8 rounded-full hover:bg-orange/90 transition-all shadow-lg shadow-orange/20 disabled:opacity-50 disabled:shadow-none"
                >
                  Continue
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}