import { useState } from "react";

export function useActivityBuilder() {
  const [step, setStep] = useState(0);

  const [data, setData] = useState({
    overview: {},
    requirements: [],
    submission: {},
    rubric: [],
    ksb: [],
    reviewSettings: {},
  });

  const next = () => setStep((s) => s + 1);
  const prev = () => setStep((s) => s - 1);

  const update = (section: keyof typeof data, value: any) => {
    setData((prev) => ({
      ...prev,
      [section]: value,
    }));
  };

  return {
    step,
    data,
    next,
    prev,
    update,
  };
}