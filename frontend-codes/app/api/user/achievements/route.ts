
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function GET(req: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userAchievements = await prisma.userAchievement.findMany({
            where: { userId: session.user.id },
            include: { achievement: true }
        });

        const allAchievements = await prisma.achievement.findMany();

        // Transform to frontend expected format
        // Merging all achievements with user progress

        const achievements = allAchievements.map(ach => {
            const userAch = userAchievements.find(ua => ua.achievementId === ach.id);
            return {
                id: ach.id,
                title: ach.title,
                description: ach.description,
                icon: ach.icon, // Need to handle icon mapping in frontend
                category: ach.category,
                points: ach.points,
                rarity: ach.rarity,
                requirements: ach.steps,
                isUnlocked: userAch ? userAch.isUnlocked : false,
                unlockedAt: userAch?.unlockedAt,
                progress: userAch?.progress || 0,
                maxProgress: ach.maxProgress
            };
        });

        return NextResponse.json({ achievements });
    } catch (error) {
        console.error("Error fetching achievements:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
