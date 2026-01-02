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

        const sessions = await prisma.session.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: 'desc' }
        });

        // Map to safe session object
        const safeSessions = sessions.map(s => ({
            id: s.id,
            createdAt: s.createdAt,
            expiresAt: s.expiresAt,
            ipAddress: s.ipAddress,
            userAgent: s.userAgent,
            isCurrent: s.token === session.session.token
        }));

        return NextResponse.json({ sessions: safeSessions });
    } catch (error) {
        console.error("Error fetching sessions:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const sessionId = searchParams.get('id');

        if (!sessionId) {
            return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
        }

        // Prevent revoking current session via this route? Or allow it (logout)?
        // If revoking current, better to use signOut.
        // Check if session belongs to user
        const targetSession = await prisma.session.findUnique({
            where: { id: sessionId }
        });

        if (!targetSession || targetSession.userId !== session.user.id) {
            return NextResponse.json({ error: 'Session not found or unauthorized' }, { status: 404 });
        }

        await prisma.session.delete({
            where: { id: sessionId }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error revoking session:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
