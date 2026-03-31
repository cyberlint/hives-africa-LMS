"use server";

import { prisma } from "@/lib/db";
import { CourseListItem } from "@/services/courses";
import { formatDistanceToNow } from "date-fns"; // Recommended for "2 hours ago" formatting

// Re-using the logic found in existing API routes but running purely server-side
async function transformCourses(courses: any[]): Promise<CourseListItem[]> {
    // Use map to return an array of promises
    const promises = courses.map(async (course) => {
        // In a real scenario you might need to fetch rating/reviews here if they aren't part of the initial query
        // For now we use the same transform logic as the API
        const totalLessons = course.module.reduce((sum: number, mod: any) => sum + mod.lessons.length, 0);
        const students = course._count?.enrollments || 0;

        return {
            id: course.id,
            title: course.title,
            slug: course.slug,
            thumbnail: course.fileKey,
            current_price: course.price,
            original_price: course.originalPrice, // Using the new field we added
            is_free: course.price === 0,
            instructor: {
                id: course.user.id,
                first_name: course.user.name.split(' ')[0] || course.user.name,
                last_name: course.user.name.split(' ').slice(1).join(' ') || '',
                full_name: course.user.name,
            },
            category: {
                id: course.category,
                name: course.category,
                slug: course.category.toLowerCase().replace(/\s+/g, '-'),
            },
            difficulty: course.level,
            average_rating: 4.8, // Mocked rating for now as per existing APIs logic
            total_reviews: 0,
            total_enrollments: students,
            short_description: course.shortdescription,
            created_at: course.createdAt.toISOString(),
        };
    });

    return Promise.all(promises);
}

export async function getFeaturedCourses(): Promise<CourseListItem[]> {
    try {
        const courses = await prisma.course.findMany({
            where: {
                status: 'Published',
            },
            take: 4,
            orderBy: {
                createdAt: 'asc', // "Featured" logic per existing API
            },
            include: {
                user: { select: { id: true, name: true, image: true } },
                module: { include: { lessons: true } },
                _count: { select: { enrollments: true } },
            },
        });
        return transformCourses(courses);
    } catch (error) {
        console.error("Failed to fetch featured courses", error);
        return [];
    }
}

export async function getBestSellingCourses(limit = 8): Promise<CourseListItem[]> {
    try {
        const courses = await prisma.course.findMany({
            where: {
                status: 'Published',
            },
            take: limit,
            orderBy: {
                enrollments: { _count: 'desc' }
            },
            include: {
                user: { select: { id: true, name: true, image: true } },
                module: { include: { lessons: true } },
                _count: { select: { enrollments: true } },
            },
        });
        return transformCourses(courses);
    } catch (error) {
        console.error("Failed to fetch best selling courses", error);
        return [];
    }
}

export async function getRecentlyAddedCourses(limit = 8): Promise<CourseListItem[]> {
    try {
        const courses = await prisma.course.findMany({
            where: {
                status: 'Published',
            },
            take: limit,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                user: { select: { id: true, name: true, image: true } },
                module: { include: { lessons: true } },
                _count: { select: { enrollments: true } },
            },
        });
        return transformCourses(courses);
    } catch (error) {
        console.error("Failed to fetch recently added courses", error);
        return [];
    }
}

export async function getLivePulseData() {
  // 1. Fetch Latest Reputation Gains
  const repTransactions = await prisma.reputationTransaction.findMany({
    take: 4,
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { name: true, image: true } } }
  });

  // 2. Fetch Latest Events
  const events = await prisma.event.findMany({
    take: 4,
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { name: true, image: true } } }
  });

  // 3. Fetch Latest Verified Portfolio Items
  const portfolios = await prisma.portfolioItem.findMany({
    take: 4,
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { name: true, image: true } } }
  });

  // 4. Transform and Merge into a unified Feed
  const feed: any[] = [
    ...repTransactions.map(t => ({
      id: `rep-${t.id}`,
      type: "REPUTATION",
      user: t.user,
      title: `${t.user.name} earned +${t.points} Rep`,
      subtitle: t.reason,
      createdAt: t.createdAt,
      timestamp: formatDistanceToNow(t.createdAt, { addSuffix: true })
    })),
    ...events.map(e => ({
      id: `evt-${e.id}`,
      type: "EVENT",
      user: e.user,
      title: `${e.user.name} scheduled a ${e.eventCategory.replace(/_/g, " ")}`,
      subtitle: e.title,
      createdAt: e.createdAt,
      timestamp: formatDistanceToNow(e.createdAt, { addSuffix: true })
    })),
    ...portfolios.map(p => ({
      id: `port-${p.id}`,
      type: "PORTFOLIO",
      user: p.user,
      title: `${p.user.name} published a Verified Artifact`,
      subtitle: p.title,
      createdAt: p.createdAt,
      timestamp: formatDistanceToNow(p.createdAt, { addSuffix: true })
    }))
  ];

  // 5. Sort by most recent and take the top 8 for the loop
  return feed.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 8);
}

export async function getArenaChallenges() {
  const challenges = await prisma.activity.findMany({
    where: {
      status: "Published",
      // Focus strictly on competitive/collaborative activities
      type: {
        in: ["Hackathon", "Challenge", "Datathon", "Team_Project"]
      },
      // Ensure the deadline hasn't passed
      deadline: {
        gte: new Date()
      }
    },
    include: {
      creator: { select: { name: true } },
      participations: { select: { id: true } }, // To count enrolled users
      ksbs: { include: { ksb: true } } // To extract tags
    },
    orderBy: { deadline: 'asc' }, // Soonest deadlines first
    take: 3 // Only show top 3 on homepage
  });

  return challenges.map(c => ({
    id: c.id,
    title: c.title,
    type: c.type,
    difficulty: c.difficulty,
    points: c.points,
    deadline: c.deadline,
    participantCount: c.participations.length,
    creatorName: c.creator.name,
    // Map the attached KSBs into simple string tags for the UI
    tags: c.ksbs.map(k => k.ksb.title)
  }));
}

export async function getActiveHives() {
  const events = await prisma.event.findMany({
    where: {
      // Only show upcoming events
      startdate: {
        gte: new Date(),
      },
      // Filter for collaborative, peer-to-peer event types
      eventCategory: {
        in: [
          "Study_Group", 
          "Brainstorming_Session", 
          "Meetup", 
          "Workshop", 
          "Roundtable", 
          "Tutorial", 
          "Office_Hours"
        ]
      }
    },
    include: {
      user: { 
        select: { 
          name: true, 
          image: true, 
          jobTitle: true // Assuming you have this in your schema, fallback if not
        } 
      }
    },
    orderBy: { startdate: 'asc' }, // Soonest events first
    take: 4 // Fit 4 cards perfectly on the grid
  });

  return events.map(e => ({
    id: e.id,
    title: e.title,
    shortdescription: e.shortdescription,
    category: e.eventCategory,
    startdate: e.startdate,
    isOnline: e.isOnline,
    venue: e.venue,
    host: {
      name: e.user.name,
      image: e.user.image,
      role: e.user.jobTitle || "NextHive Builder"
    }
  }));
}

export async function getTheVanguard() {
  // Define "Recent" as the last 30 days to keep the board fresh and competitive
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // 1. Group transactions by user and sum their points
  const aggregatedPoints = await prisma.reputationTransaction.groupBy({
    by: ['userId'],
    where: {
      createdAt: { gte: thirtyDaysAgo }
    },
    _sum: { points: true },
    orderBy: { _sum: { points: 'desc' } },
    take: 5
  });

  if (aggregatedPoints.length === 0) return [];

  // 2. Fetch the actual user details for those top IDs
  const userIds = aggregatedPoints.map(ag => ag.userId);
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, name: true, image: true, jobTitle: true }
  });

  // 3. Map them together and assign ranks
  const vanguardData = aggregatedPoints.map((ag, index) => {
    const user = users.find(u => u.id === ag.userId);
    return {
      id: user?.id || `unknown-${index}`,
      name: user?.name || "Anonymous Builder",
      image: user?.image || null,
      role: user?.jobTitle || "NextHive Architect",
      points: ag._sum.points || 0,
      rank: index + 1 // 1, 2, 3, 4, 5
    };
  });

  return vanguardData;
}