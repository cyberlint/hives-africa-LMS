export interface CommunityCard {
  id: string;
  from: string;
  to: string;

  hive: string;

  image: string;

  focus: string[];

  members: number;

  avatars: string[];

  href: string;
}

export const communities: CommunityCard[] = [
  {
    id: "founders",
    from: "Strangers",
    to: "Startup Founders",
    hive: "BuildLab Africa",
    image: "/assets/products/dummy2.jpg",
    focus: [
      "Startups",
      "Product",
      "AI",
    ],
    members: 84,
    avatars: [
      "/avatars/1.jpg",
      "/avatars/2.jpg",
      "/avatars/3.jpg",
      "/avatars/4.jpg",
    ],
    href: "/hives/buildlab-africa",
  },

  {
    id: "research",
    from: "Students",
    to: "Research Team",
    hive: "Open Research Hub",
    image: "/assets/products/dummy2.jpg",
    focus: [
      "Research",
      "Healthcare",
      "Data Science",
    ],
    members: 56,
    avatars: [
      "/avatars/5.jpg",
      "/avatars/6.jpg",
      "/avatars/7.jpg",
    ],
    href: "/hives/open-research",
  },

  {
    id: "career",
    from: "Professionals",
    to: "AI Community",
    hive: "AI Guild",
    image: "/assets/products/dummy2.jpg",
    focus: [
      "Career",
      "Mentorship",
      "Machine Learning",
    ],
    members: 123,
    avatars: [
      "/avatars/8.jpg",
      "/avatars/9.jpg",
      "/avatars/10.jpg",
    ],
    href: "/hives/ai-guild",
  },
];