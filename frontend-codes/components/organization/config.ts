import {
  OrgType,
  OrgMission,
} from "@prisma/client";

export const ORGANIZATION_TYPES = [
  {
    id: OrgType.INNOVATION_CHALLENGE,
    icon: "🏆",
    title: "Innovation Challenge",
    desc: "Run idea competitions, hackathons and open innovation programs.",
  },
  {
    id: OrgType.FELLOWSHIP,
    icon: "🎓",
    title: "Fellowship",
    desc: "Manage cohorts, mentors, milestones and participant progress.",
  },
  {
    id: OrgType.BOOTCAMP,
    icon: "🚀",
    title: "Bootcamp",
    desc: "Deliver intensive training and workforce readiness programs.",
  },
  {
    id: OrgType.UNIVERSITY,
    icon: "🏫",
    title: "University",
    desc: "Coordinate academic, innovation and student engagement programs.",
  },
  {
    id: OrgType.COMMUNITY,
    icon: "🤝",
    title: "Community",
    desc: "Build and engage professional or interest-based communities.",
  },
  {
    id: OrgType.INCUBATOR,
    icon: "💡",
    title: "Startup Incubator",
    desc: "Support founders, startups and venture-building initiatives.",
  },
  {
    id: OrgType.CORPORATE_LEARNING,
    icon: "🏢",
    title: "Corporate Learning",
    desc: "Upskill employees and manage internal talent development.",
  },
  {
    id: OrgType.OTHER,
    icon: "✨",
    title: "Other",
    desc: "Something else that doesn't fit the categories above.",
  },
] as const;

export const ORGANIZATION_MISSIONS = [
  {
    id: OrgMission.OPEN_INNOVATION,
    icon: "💡",
    title: "Open Innovation",
    desc: "Source ideas, solutions and talent from a wider community.",
  },
  {
    id: OrgMission.TALENT_DEVELOPMENT,
    icon: "🎓",
    title: "Talent Development",
    desc: "Train, mentor and develop future-ready talent.",
  },
  {
    id: OrgMission.COMMUNITY_BUILDING,
    icon: "🤝",
    title: "Community Building",
    desc: "Grow and engage a thriving professional community.",
  },
  {
    id: OrgMission.PRODUCT_INCUBATION,
    icon: "🚀",
    title: "Product Incubation",
    desc: "Support teams and ideas from concept to execution.",
  },
  {
    id: OrgMission.WORKFORCE_READINESS,
    icon: "🏆",
    title: "Workforce Readiness",
    desc: "Prepare participants for employment and industry opportunities.",
  },
  {
    id: OrgMission.OTHER,
    icon: "✨",
    title: "Other",
    desc: "Something else that doesn't fit the categories above.",
  },
] as const;