import {
  Sparkles,
  Hammer,
  BadgeCheck,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

export const capabilityJourney = [
  {
    id: "potential",
    title: "Potential",
    description: "Untapped talent waiting to grow.",
    icon: Sparkles,
  },
  {
    id: "capability",
    title: "Capability",
    description: "Knowledge strengthened through practice.",
    icon: Hammer,
  },
  {
    id: "evidence",
    title: "Evidence",
    description: "Projects and achievements that prove ability.",
    icon: BadgeCheck,
  },
  {
    id: "trust",
    title: "Trust",
    description: "Credibility earned through consistent proof.",
    icon: ShieldCheck,
  },
  {
    id: "impact",
    title: "Impact",
    description: "Real outcomes, opportunities and influence.",
    icon: TrendingUp,
  },
] as const;