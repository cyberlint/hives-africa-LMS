"use client";

import { Button } from "@/components/ui/button";
import { Building2, ArrowRight } from "lucide-react";

interface WelcomeStepProps {
  onNext: () => void;
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <div className="space-y-8 w-full max-w-lg mx-auto text-center pb-12">
      
      {/* Premium Icon Graphic instead of a raw Emoji */}
      <div className="mx-auto w-20 h-20 bg-indigo-50/50 border border-indigo-100 rounded-2xl flex items-center justify-center shadow-sm mb-8">
        <Building2 className="w-10 h-10 text-orange" strokeWidth={1.5} />
      </div>

      <div className="space-y-4">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900">
          Build your organization
        </h1>

        <p className="text-lg text-slate-500 leading-relaxed max-w-md mx-auto">
          Design how your people learn, build, and execute together in a verifiable ecosystem.
        </p>
      </div>

      <div className="pt-8">
        <Button
          onClick={onNext}
          className="h-12 px-8 text-base shadow-sm bg-orange hover:bg-orange text-white transition-all rounded-lg group"
        >
          Begin setup
          <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
      
    </div>
  );
}