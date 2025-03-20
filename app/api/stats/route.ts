import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface StatResult {
  classId: number;
  className: string;
  _sum: {
    count: number | null;
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    // Check if user is authenticated
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user ID from session
    const userId = session.user.id;

    // Get detection statistics for the user
    const stats = await prisma.detection.groupBy({
      by: ['classId', 'className'],
      _sum: {
        count: true,
      },
      where: {
        userId,
      },
      orderBy: {
        _sum: {
          count: 'desc',
        },
      },
    });

    // Transform the data for the frontend
    const formattedStats = stats.map((stat: StatResult) => ({
      classId: stat.classId,
      className: stat.className,
      count: stat._sum.count || 0,
    }));

    return NextResponse.json(formattedStats);
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 },
    );
  }
}
