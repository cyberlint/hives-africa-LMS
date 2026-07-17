export interface HowItWorksItem {
  id: string;
  title: string;
  transition: string;
  heading: string;
  description: string;
  features: string[];
  visual: string;
}

export const howItWorks: HowItWorksItem[] = [
  {
    id: "learn",
    title: "Learn",
    transition: "Potential → Capability",
    heading: "Learning builds capability.",
    description:
      "Potential becomes capability through structured learning, deliberate practice, meaningful feedback, and reflection—not passive content consumption.",
    features: [
      "Courses",
      "Learning Activities",
      "Assessments",
      "AI Coach",
    ],
    visual: "/assets/products/dummy2.jpg",
  },

  {
    id: "build",
    title: "Build",
    transition: "Capability → Evidence",
    heading: "Building creates evidence.",
    description:
      "Capability becomes believable only when it is applied. Every project, challenge, collaboration, and contribution creates tangible proof of what you can do.",
    features: [
      "Projects",
      "Hives",
      "Challenges",
      "Arena",
    ],
    visual: "/assets/products/dummy2.jpg",
  },

  {
    id: "demonstrate",
    title: "Demonstrate",
    transition: "Evidence → Visibility",
    heading: "Evidence should be visible.",
    description:
      "Instead of telling people what you know, let your work speak. NextHive continuously organizes your contributions into a living professional portfolio.",
    features: [
      "Evidence Timeline",
      "Portfolio",
      "Credentials",
      "Achievements",
    ],
    visual: "/assets/products/dummy2.jpg",
  },

  {
    id: "trust",
    title: "Earn Trust",
    transition: "Evidence → Trust",
    heading: "Trust is accumulated.",
    description:
      "Professional trust grows through consistent evidence. Verified work, collaboration, recommendations, and demonstrated competence strengthen your reputation over time.",
    features: [
      "Reputation",
      "Recommendations",
      "Competencies",
      "Signal Graph",
    ],
    visual: "/assets/products/dummy2.jpg",
  },

  {
    id: "lead",
    title: "Lead",
    transition: "Trust → Impact",
    heading: "Trusted people create impact.",
    description:
      "Capability that is trusted opens opportunities to lead teams, build communities, mentor others, and create measurable organizational impact.",
    features: [
      "Organizations",
      "Leadership",
      "Communities",
      "Opportunities",
    ],
    visual: "/assets/products/dummy2.jpg",
  },
];