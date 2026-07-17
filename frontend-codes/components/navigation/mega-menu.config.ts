// mega-menu.config.ts

import {
    BookOpen,
    Users,
    Trophy,
    CalendarDays,
    Network,
    LifeBuoy,
    Newspaper,
    Code2,
    Map,
    Activity,
    PlusCircle,
    CalendarPlus,
    Briefcase,
    Presentation,
} from "lucide-react";

export const megaMenuConfig = {
    products: {
        title: "Products",
        description:
            "Discover the products that power learning, collaboration, innovation, and capability development across the NextHive ecosystem.",

        categories: [
            {
                id: "all",
                title: "All",
                description:
                    "Explore every product that powers the NextHive ecosystem—from learning to collaboration, innovation, and professional growth.",

                items: [
                    {
                        id: "learning",
                        title: "Learning",
                        href: "/learning",
                        icon: BookOpen,
                        description:
                            "Master practical AI, data, and digital skills through hands-on learning.",
                    },
                    {
                        id: "hives",
                        title: "Hives",
                        href: "/community/hives",
                        icon: Users,
                        description:
                            "Collaborate with others to build projects, grow communities, and achieve shared goals.",
                    },
                    {
                        id: "arena",
                        title: "Arena",
                        href: "/activities",
                        icon: Trophy,
                        description:
                            "Participate in hackathons and innovation challenges that turn ideas into impact.",
                    },
                    {
                        id: "events",
                        title: "Events",
                        href: "/events",
                        icon: CalendarDays,
                        description:
                            "Create and manage webinars, workshops, demo days, and community events.",
                    },
                    {
                        id: "signal-graph",
                        title: "Signal Graph",
                        href: "/signal-graph",
                        icon: Network,
                        description:
                            "Build a living professional profile that showcases your capabilities and contributions.",
                    },
                ],
            },

            {
                id: "learn",
                title: "Learn",
                description:
                    "Develop practical skills through immersive learning experiences.",

                items: [
                    {
                        id: "learning",
                        title: "Learning",
                        href: "/learning",
                        icon: BookOpen,
                        description:
                            "Master practical AI, data, and digital skills through hands-on learning.",
                    },
                ],
            },

            {
                id: "collaboration",
                title: "Collaboration",
                description:
                    "Work with others to learn, build, and solve meaningful problems.",

                items: [
                    {
                        id: "hives",
                        title: "Hives",
                        href: "/community/hives",
                        icon: Users,
                        description:
                            "Collaborate with others to build projects, grow communities, and achieve shared goals.",
                    },
                    {
                        id: "events",
                        title: "Events",
                        href: "/events",
                        icon: CalendarDays,
                        description:
                            "Create and manage webinars, workshops, demo days, and community events.",
                    },
                ],
            },

            {
                id: "innovation",
                title: "Innovation",
                description:
                    "Put your knowledge into practice through real-world challenges and activities.",

                items: [
                    {
                        id: "arena",
                        title: "Arena",
                        href: "/activities",
                        icon: Trophy,
                        description:
                            "Participate in hackathons and innovation challenges that turn ideas into impact.",
                    },
                ],
            },

            {
                id: "showcase",
                title: "Showcase",
                description:
                    "Demonstrate your capabilities through projects, contributions, and achievements.",

                items: [
                    {
                        id: "signal-graph",
                        title: "Signal Graph",
                        href: "/signal-graph",
                        icon: Network,
                        description:
                            "Build a living professional profile that showcases your capabilities and contributions.",
                    },
                ],
            },
        ],
    },
    solutions: {
        title: "Solutions",
        description:
            "Find solutions tailored to the unique needs of learners, organizations, universities, communities, facilitators, and employers.",

        categories: [
            {
                id: "all",
                title: "All",
                description:
                    "Explore solutions designed for every stage of capability development.",

                items: [
                    {
                        id: "learning",
                        title: "Learning",
                        href: "/learning",
                        icon: BookOpen,
                        description:
                            "Master practical AI, data, and digital skills through hands-on learning.",
                    },
                    {
                        id: "hives",
                        title: "Hives",
                        href: "/community/hives",
                        icon: Users,
                        description:
                            "Collaborate with others to build projects, grow communities, and achieve shared goals.",
                    },
                    {
                        id: "arena",
                        title: "Arena",
                        href: "/activities",
                        icon: Trophy,
                        description:
                            "Participate in hackathons and innovation challenges that turn ideas into impact.",
                    },
                    {
                        id: "events",
                        title: "Events",
                        href: "/events",
                        icon: CalendarDays,
                        description:
                            "Create and manage webinars, workshops, demo days, and community events.",
                    },
                    {
                        id: "signal-graph",
                        title: "Signal Graph",
                        href: "/signal-graph",
                        icon: Network,
                        description:
                            "Build a living professional profile that showcases your capabilities and contributions.",
                    },
                ],
            },

            {
                id: "learners",
                title: "Learners",
                description:
                    "Build practical skills, gain experience, and advance your career.",

                items: [
                    {
                        id: "learning",
                        title: "Learning",
                        href: "/learning",
                        icon: BookOpen,
                        description:
                            "Master practical AI, data, and digital skills through hands-on learning.",
                    },
                    {
                        id: "hives",
                        title: "Hives",
                        href: "/community/hives",
                        icon: Users,
                        description:
                            "Collaborate with others to build projects, grow communities, and achieve shared goals.",
                    },
                    {
                        id: "arena",
                        title: "Arena",
                        href: "/activities",
                        icon: Trophy,
                        description:
                            "Participate in hackathons and innovation challenges that turn ideas into impact.",
                    },
                    {
                        id: "events",
                        title: "Events",
                        href: "/events",
                        icon: CalendarDays,
                        description:
                            "Create and manage webinars, workshops, demo days, and community events.",
                    },
                    {
                        id: "signal-graph",
                        title: "Signal Graph",
                        href: "/signal-graph",
                        icon: Network,
                        description:
                            "Build a living professional profile that showcases your capabilities and contributions.",
                    },
                ],
            },

            {
                id: "organizations",
                title: "Organizations",
                description:
                    "Develop talent, foster innovation, and build high-performing teams.",

                items: [
                    {
                        id: "learning",
                        title: "Learning",
                        href: "/learning",
                        icon: BookOpen,
                        description:
                            "Master practical AI, data, and digital skills through hands-on learning.",
                    },
                    {
                        id: "hives",
                        title: "Hives",
                        href: "/community/hives",
                        icon: Users,
                        description:
                            "Collaborate with others to build projects, grow communities, and achieve shared goals.",
                    },
                    {
                        id: "arena",
                        title: "Arena",
                        href: "/activities",
                        icon: Trophy,
                        description:
                            "Participate in hackathons and innovation challenges that turn ideas into impact.",
                    },
                    {
                        id: "events",
                        title: "Events",
                        href: "/events",
                        icon: CalendarDays,
                        description:
                            "Create and manage webinars, workshops, demo days, and community events.",
                    },
                ],
            },

            {
                id: "universities",
                title: "Universities",
                description:
                    "Deliver experiential learning beyond the classroom.",

                items: [
                    {
                        id: "learning",
                        title: "Learning",
                        href: "/learning",
                        icon: BookOpen,
                        description:
                            "Master practical AI, data, and digital skills through hands-on learning.",
                    },
                    {
                        id: "hives",
                        title: "Hives",
                        href: "/community/hives",
                        icon: Users,
                        description:
                            "Collaborate with others to build projects, grow communities, and achieve shared goals.",
                    },
                    {
                        id: "events",
                        title: "Events",
                        href: "/events",
                        icon: CalendarDays,
                        description:
                            "Create and manage webinars, workshops, demo days, and community events.",
                    },
                ],
            },

            {
                id: "communities",
                title: "Communities",
                description:
                    "Grow thriving communities through collaboration and shared learning.",

                items: [
                    {
                        id: "hives",
                        title: "Hives",
                        href: "/community/hives",
                        icon: Users,
                        description:
                            "Collaborate with others to build projects, grow communities, and achieve shared goals.",
                    },
                    {
                        id: "arena",
                        title: "Arena",
                        href: "/activities",
                        icon: Trophy,
                        description:
                            "Participate in hackathons and innovation challenges that turn ideas into impact.",
                    },
                    {
                        id: "events",
                        title: "Events",
                        href: "/events",
                        icon: CalendarDays,
                        description:
                            "Create and manage webinars, workshops, demo days, and community events.",
                    },
                ],
            },

            {
                id: "facilitators",
                title: "Facilitators",
                description:
                    "Design and deliver engaging learning experiences at scale.",

                items: [
                    {
                        id: "learning",
                        title: "Learning",
                        href: "/learning",
                        icon: BookOpen,
                        description:
                            "Master practical AI, data, and digital skills through hands-on learning.",
                    },
                    {
                        id: "hives",
                        title: "Hives",
                        href: "/community/hives",
                        icon: Users,
                        description:
                            "Collaborate with others to build projects, grow communities, and achieve shared goals.",
                    },
                    {
                        id: "events",
                        title: "Events",
                        href: "/events",
                        icon: CalendarDays,
                        description:
                            "Create and manage webinars, workshops, demo days, and community events.",
                    },
                ],
            },

            {
                id: "employers",
                title: "Employers",
                description:
                    "Identify and engage talent through demonstrated capability.",

                items: [
                    {
                        id: "signal-graph",
                        title: "Signal Graph",
                        href: "/signal-graph",
                        icon: Network,
                        description:
                            "Build a living professional profile that showcases your capabilities and contributions.",
                    },
                    {
                        id: "arena",
                        title: "Arena",
                        href: "/activities",
                        icon: Trophy,
                        description:
                            "Participate in hackathons and innovation challenges that turn ideas into impact.",
                    },
                ],
            },
        ],
    },
    resources: {
        title: "Resources",
        description:
            "Everything you need to learn, build, and get the most out of NextHive.",

        categories: [
            {
                id: "all",
                title: "All Resources",
                description:
                    "Browse documentation, guides, updates, and technical resources.",

                items: [
                    {
                        id: "documentation",
                        title: "Documentation",
                        href: "/docs",
                        icon: BookOpen,
                        description:
                            "Learn how to use every part of the NextHive ecosystem.",
                    },
                    {
                        id: "help-center",
                        title: "Help Center",
                        href: "/help",
                        icon: LifeBuoy,
                        description:
                            "Find answers to common questions and support articles.",
                    },
                    {
                        id: "blog",
                        title: "Blog",
                        href: "/blog",
                        icon: Newspaper,
                        description:
                            "Insights, stories, product updates, and community highlights.",
                    },
                    {
                        id: "roadmap",
                        title: "Roadmap",
                        href: "/roadmap",
                        icon: Map,
                        description:
                            "See what we're building and what's coming next.",
                    },
                ],
            },

            {
                id: "learn",
                title: "Learn",
                description:
                    "Guides and documentation to help you succeed.",

                items: [
                    {
                        id: "documentation",
                        title: "Documentation",
                        href: "/docs",
                        icon: BookOpen,
                        description:
                            "Learn how to use every part of the NextHive ecosystem.",
                    },
                    {
                        id: "help-center",
                        title: "Help Center",
                        href: "/help",
                        icon: LifeBuoy,
                        description:
                            "Find answers to common questions and support articles.",
                    },
                ],
            },

            {
                id: "discover",
                title: "Discover",
                description:
                    "Stay informed with stories, updates, and announcements.",

                items: [
                    {
                        id: "blog",
                        title: "Blog",
                        href: "/blog",
                        icon: Newspaper,
                        description:
                            "Insights, stories, product updates, and community highlights.",
                    },
                    {
                        id: "roadmap",
                        title: "Roadmap",
                        href: "/roadmap",
                        icon: Map,
                        description:
                            "See what we're building and what's coming next.",
                    },
                ],
            },
        ],
    },
    quickActions: {
        title: "Quick Actions",
        description:
            "Jump straight into the most common things you want to do.",

        categories: [
            {
                id: "all",
                title: "Popular Actions",
                description:
                    "Get started with NextHive in just a few clicks.",

                items: [
                    {
                        id: "join-hive",
                        title: "Join a Hive",
                        href: "/community/hives",
                        icon: Users,
                        description:
                            "Find a community to learn, build, and collaborate.",
                    },
                    {
                        id: "explore-learning",
                        title: "Explore Learning",
                        href: "/learning",
                        icon: BookOpen,
                        description:
                            "Browse courses, learning paths, and bootcamps.",
                    },
                    {
                        id: "create-hive",
                        title: "Create a Hive",
                        href: "/community/hives/create",
                        icon: PlusCircle,
                        description:
                            "Start your own collaborative workspace.",
                    },
                    {
                        id: "host-event",
                        title: "Host an Event",
                        href: "/events/create",
                        icon: CalendarPlus,
                        description:
                            "Create webinars, workshops, and community events.",
                    },
                    {
                        id: "browse-opportunities",
                        title: "Browse Opportunities",
                        href: "/opportunities",
                        icon: Briefcase,
                        description:
                            "Discover projects, internships, and career opportunities.",
                    },
                    {
                        id: "book-demo",
                        title: "Book a Demo",
                        href: "/demo",
                        icon: Presentation,
                        description:
                            "Schedule a personalized walkthrough of NextHive.",
                    },
                ],
            },

            {
                id: "learn",
                title: "Learning",
                description:
                    "Everything you need to start learning.",

                items: [
                    {
                        id: "explore-learning",
                        title: "Explore Learning",
                        href: "/learning",
                        icon: BookOpen,
                        description:
                            "Browse courses, learning paths, and bootcamps.",
                    },
                    {
                        id: "join-hive",
                        title: "Join a Hive",
                        href: "/community/hives",
                        icon: Users,
                        description:
                            "Find a community to learn and build with others.",
                    },
                ],
            },

            {
                id: "create",
                title: "Create",
                description:
                    "Launch communities and experiences.",

                items: [
                    {
                        id: "create-hive",
                        title: "Create a Hive",
                        href: "/community/hives/create",
                        icon: PlusCircle,
                        description:
                            "Start your own collaborative workspace.",
                    },
                    {
                        id: "host-event",
                        title: "Host an Event",
                        href: "/events/create",
                        icon: CalendarPlus,
                        description:
                            "Organize workshops, webinars, and meetups.",
                    },
                ],
            },

            {
                id: "grow",
                title: "Grow",
                description:
                    "Discover new opportunities and partnerships.",

                items: [
                    {
                        id: "browse-opportunities",
                        title: "Browse Opportunities",
                        href: "/opportunities",
                        icon: Briefcase,
                        description:
                            "Find projects, jobs, internships, and collaborations.",
                    },
                    {
                        id: "book-demo",
                        title: "Book a Demo",
                        href: "/demo",
                        icon: Presentation,
                        description:
                            "See how NextHive can support your goals.",
                    },
                ],
            },
        ],
    },
};