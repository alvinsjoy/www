import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  const expectedAuthHeader = `Bearer ${process.env.CRON_SECRET}`;

  if (authHeader !== expectedAuthHeader) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await prisma.user.findFirst({
      select: { id: true },
      take: 1,
    });

    return NextResponse.json({
      message: 'Ping successful',
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    console.error('Ping error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';

    return NextResponse.json(
      { error: 'Ping failed', message: errorMessage },
      { status: 500 },
    );
  }
}
