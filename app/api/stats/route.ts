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

    // Get the last 6 months for our chart views
    const now = new Date();
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date(now);
      date.setMonth(date.getMonth() - i);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    }).reverse();

    const areaChartData = last6Months.map((month) => {
      const monthStats = monthlyStats[month] || {};
      const totalCount = Object.values(monthStats).reduce(
        (sum, count) => sum + count,
        0,
      );

      return {
        month,
        formattedMonth: formatMonth(month),
        totalCount,
      };
    });

    // Format data for radial charts (top 5 sign types per month)
    const radialChartData = last6Months.map((month) => {
      const monthStats = monthlyStats[month] || {};

      const topSigns = Object.entries(monthStats)
        .map(([classIdStr, count]) => {
          const classId = Number(classIdStr);
          return {
            name: classMap[classId] || `Sign ${classId}`, // Use className as the display name
            classId,
            count: count as number,
          };
        })
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Calculate total for percentage
      const monthTotal = topSigns.reduce((sum, item) => sum + item.count, 0);

      return {
        month,
        formattedMonth: formatMonth(month),
        data: topSigns,
        total: monthTotal,
      };
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
      areaChartData,
      totalStats,
      classIds: classIdsArray,
      classMap,
      radialChartData,
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 },
    );
  }
}

// Helper function to format month for display (e.g., "2023-06" to "Jun 23")
function formatMonth(monthStr: string): string {
  const [year, month] = monthStr.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString(undefined, {
    month: 'short',
    year: '2-digit',
  });
}
