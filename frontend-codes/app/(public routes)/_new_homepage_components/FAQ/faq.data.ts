export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export const faqs: FAQ[] = [
  {
    id: "1",
    question: "What is NextHive?",
    answer:
      "NextHive is a human capability platform where people and organizations learn, build, collaborate, and demonstrate real-world capability through evidence.",
  },
  {
    id: "2",
    question: "Who is NextHive for?",
    answer:
      "Individuals, universities, organizations, bootcamps, communities, companies, and governments can all use NextHive to develop and showcase capability.",
  },
  {
    id: "3",
    question: "What is a Hive?",
    answer:
      "A Hive is a collaborative workspace where people come together around shared goals, projects, research, learning, or innovation.",
  },
  {
    id: "4",
    question: "Can organizations manage their communities on NextHive?",
    answer:
      "Yes. Organizations can create organisational account where they can create private or public Hives, publish courses, cordinate hackathons, manage members, deliver learning, coordinate projects, run events, and measure capability development.",
  },
  {
    id: "5",
    question: "How is NextHive different from a traditional LMS?",
    answer:
      "Traditional LMS platforms stop at delivering content. NextHive connects learning with collaboration, projects, evidence, reputation, and real opportunities.",
  },
  {
    id: "6",
    question: "Is NextHive only for technical fields?",
    answer:
      "No. NextHive supports every discipline—from engineering and healthcare to entrepreneurship, education, research, business, and the creative industries.",
  },
];