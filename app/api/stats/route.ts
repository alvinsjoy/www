import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

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

    const detections = await prisma.detection.findMany({
      where: {
        userId,
      },
      select: {
        classId: true,
        className: true,
        count: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Create a mapping of classId to className
    const classMap: Record<number, string> = {};
    detections.forEach((d) => {
      classMap[d.classId] = d.className;
    });

    const monthlyStats: Record<string, Record<number, number>> = {};
    const signClassIds = new Set<number>();

    detections.forEach((detection) => {
      const date = detection.createdAt;
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const classId = detection.classId;

      signClassIds.add(classId);

      if (!monthlyStats[month]) {
        monthlyStats[month] = {};
      }

      if (!monthlyStats[month][classId]) {
        monthlyStats[month][classId] = 0;
      }

      monthlyStats[month][classId] += detection.count;
    });

    // Format data for the chart - using class IDs as keys
    const chartData = Object.entries(monthlyStats).map(([month, stats]) => {
      const monthData: Record<string, string | number> = { month };

      // Add each sign class as a property using classId
      signClassIds.forEach((classId) => {
        // Use classId as the key
        monthData[`class-${classId}`] = stats[classId] || 0;
      });

      return monthData;
    });

    const totalStats = Array.from(signClassIds)
      .map((classId) => {
        const count = detections
          .filter((d) => d.classId === classId)
          .reduce((sum, d) => sum + d.count, 0);

        return {
          classId,
          className: classMap[classId],
          count,
        };
      })
      .sort((a, b) => b.count - a.count);

    const classIdsArray = Array.from(signClassIds);

    return NextResponse.json({
      chartData,
      totalStats,
      classIds: classIdsArray,
      classMap,
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 },
    );
  }
}
