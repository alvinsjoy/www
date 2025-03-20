'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LuCircleAlert } from 'react-icons/lu';
import NavBar from '@/components/navbar';
import Link from 'next/link';

interface DetectionStat {
  className: string;
  classId: number;
  count: number;
}

export default function Dashboard() {
  const { status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<DetectionStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin');
      return;
    }

    if (status === 'authenticated') {
      fetchStats();
    }
  }, [status, router]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/stats');

      if (!response.ok) {
        throw new Error('Failed to fetch detection statistics');
      }

      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError('Failed to load detection statistics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <main className="container mx-auto flex min-h-screen flex-col items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-medium">Loading...</h2>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto flex min-h-screen flex-col items-center px-3 py-4 md:px-4 md:py-8">
      <div className="pointer-events-none absolute top-0 left-1/4 h-[400px] w-1/2 bg-gradient-to-b from-purple-600/30 via-fuchsia-500/15 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute top-0 right-[10%] h-[350px] w-[400px] bg-gradient-to-b from-orange-500/30 via-pink-500/15 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute top-0 left-[10%] h-[350px] w-[400px] bg-gradient-to-b from-blue-600/30 via-indigo-500/15 to-transparent blur-3xl" />

      <NavBar />

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6 w-full md:mb-8"
      >
        <p className="text-muted-foreground text-center text-xl">
          Your traffic sign detection statistics
        </p>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-4xl"
        >
          <Alert variant="destructive" className="mx-auto mb-4 md:mb-6">
            <LuCircleAlert className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-4xl"
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Detections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading
                  ? '...'
                  : stats.reduce((sum, stat) => sum + stat.count, 0)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Unique Signs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? '...' : stats.length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Top Sign</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading
                  ? '...'
                  : stats.length > 0
                    ? stats.sort((a, b) => b.count - a.count)[0]?.className ||
                      'None'
                    : 'None'}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="mt-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">All Detections</TabsTrigger>
            <TabsTrigger value="chart">Chart View</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Detection Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="py-8 text-center">Loading statistics...</div>
                ) : stats.length === 0 ? (
                  <div className="py-8 text-center">
                    <p className="text-muted-foreground">
                      No detections recorded yet
                    </p>
                    <Button asChild className="mt-4">
                      <Link href="/">Go to Detection</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {stats
                      .sort((a, b) => b.count - a.count)
                      .map((stat) => (
                        <div
                          key={stat.classId}
                          className="flex items-center justify-between rounded-lg border p-3"
                        >
                          <div className="font-medium">{stat.className}</div>
                          <div className="bg-muted rounded-full px-2.5 py-0.5 text-sm">
                            {stat.count}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="chart" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Detection Chart</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                {loading ? (
                  <div className="py-8 text-center">Loading chart data...</div>
                ) : stats.length === 0 ? (
                  <div className="py-8 text-center">
                    <p className="text-muted-foreground">
                      No data available for chart
                    </p>
                  </div>
                ) : (
                  <div className="h-[300px] w-full py-4">
                    <p className="text-muted-foreground text-center">
                      Chart view would be displayed here using an actual chart
                      library
                    </p>
                    <div className="mt-4 space-y-2">
                      {stats
                        .sort((a, b) => b.count - a.count)
                        .slice(0, 5)
                        .map((stat) => (
                          <div key={stat.classId} className="relative pt-1">
                            <div className="flex items-center justify-between">
                              <div className="text-muted-foreground text-xs font-semibold">
                                {stat.className}
                              </div>
                              <div className="text-muted-foreground text-xs font-semibold">
                                {stat.count}
                              </div>
                            </div>
                            <div className="bg-muted mb-4 flex h-2 overflow-hidden rounded">
                              <div
                                style={{
                                  width: `${
                                    (stat.count /
                                      Math.max(...stats.map((s) => s.count))) *
                                    100
                                  }%`,
                                }}
                                className="bg-primary flex flex-col justify-center rounded text-center text-white shadow-none"
                              ></div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </main>
  );
}
