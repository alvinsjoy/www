'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LuCircleAlert } from 'react-icons/lu';
import NavBar from '@/components/navbar';
import Link from 'next/link';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';

interface DetectionStat {
  classId: number;
  className: string;
  count: number;
}

interface ChartDataPoint {
  month: string;
  formattedMonth?: string;
  [key: string]: string | number | undefined;
}

interface StatsResponse {
  chartData: ChartDataPoint[];
  totalStats: DetectionStat[];
  classIds: number[];
  classMap: Record<number, string>;
}

// Function to format month for display (e.g., "2023-06" to "Jun 23")
function formatMonth(monthStr: string): string {
  const [year, month] = monthStr.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString(undefined, {
    month: 'short',
    year: '2-digit',
  });
}

export default function Dashboard() {
  const { status } = useSession();
  const router = useRouter();
  const [statsData, setStatsData] = useState<StatsResponse | null>(null);
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
      setStatsData(data);
    } catch (err) {
      setError('Failed to load detection statistics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Chart configuration - dynamically create colors for each sign class using classIds
  const chartConfig: ChartConfig = useMemo(() => {
    if (!statsData?.classIds) return {};

    const chartVars = ['chart-1', 'chart-2', 'chart-3', 'chart-4', 'chart-5'];

    return statsData.classIds.reduce((config, classId, index) => {
      // Use modulo to cycle through the available chart colors
      const colorVar = chartVars[index % chartVars.length];
      const className = statsData.classMap[classId];
      const classKey = `class-${classId}`;

      return {
        ...config,
        [classKey]: {
          label: className, // Use className for display
          color: `hsl(var(--${colorVar}))`,
        },
      };
    }, {});
  }, [statsData?.classIds, statsData?.classMap]);

  const processedChartData = useMemo(() => {
    if (!statsData?.chartData) return [];

    return statsData.chartData.map((dataPoint) => ({
      ...dataPoint,
      formattedMonth: formatMonth(dataPoint.month),
    }));
  }, [statsData?.chartData]);

  if (status === 'loading') {
    return (
      <main className="container mx-auto flex min-h-screen flex-col items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-medium">Loading...</h2>
        </div>
      </main>
    );
  }

  const totalDetections =
    statsData?.totalStats?.reduce((sum, stat) => sum + stat.count, 0) || 0;

  const uniqueSigns = statsData?.totalStats?.length || 0;

  const topSign = statsData?.totalStats?.[0]?.className || 'None';

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
                {loading ? '...' : totalDetections}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Unique Signs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? '...' : uniqueSigns}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Top Sign</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? '...' : topSign}
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
                ) : !statsData?.totalStats ||
                  statsData.totalStats.length === 0 ? (
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
                    {statsData.totalStats.map((stat) => (
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
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>Detection Trends</CardTitle>
                <CardDescription>
                  Monthly detection count by traffic sign type
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                {loading ? (
                  <div className="py-8 text-center">Loading chart data...</div>
                ) : !statsData?.chartData ||
                  statsData.chartData.length === 0 ? (
                  <div className="py-8 text-center">
                    <p className="text-muted-foreground">
                      No data available for chart
                    </p>
                  </div>
                ) : (
                  <div className="h-fit w-full">
                    <ChartContainer config={chartConfig}>
                      <AreaChart
                        data={processedChartData}
                        margin={{
                          top: 5,
                          right: 20,
                          left: 0,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                          dataKey="formattedMonth"
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis />
                        <ChartTooltip
                          content={(tooltipProps) => {
                            const { active, payload, label } = tooltipProps;

                            // Transform payload to show class names instead of IDs
                            const transformedPayload = payload?.map((item) => {
                              const dataKey = item.dataKey as string;
                              // Extract classId from the dataKey format "class-{id}"
                              const classId = parseInt(
                                dataKey.replace('class-', ''),
                              );
                              const className = statsData?.classMap[classId];

                              return {
                                ...item,
                                name: className,
                              };
                            });

                            return (
                              <ChartTooltipContent
                                active={active}
                                payload={transformedPayload}
                                label={label}
                              />
                            );
                          }}
                        />
                        <ChartLegend
                          content={(props) => {
                            const { payload, verticalAlign } = props;

                            // Transform payload to show class names instead of IDs
                            const transformedPayload = payload?.map((item) => {
                              const dataKey = item.dataKey as string;
                              // Extract classId from the dataKey format "class-{id}"
                              const classId = parseInt(
                                dataKey.replace('class-', ''),
                              );
                              const className = statsData?.classMap[classId];

                              return {
                                ...item,
                                value: className,
                              };
                            });

                            return (
                              <ChartLegendContent
                                payload={transformedPayload}
                                verticalAlign={verticalAlign}
                              />
                            );
                          }}
                        />

                        {/* Gradients */}
                        <defs>
                          {statsData.classIds.map((classId) => {
                            const classKey = `class-${classId}`;
                            return (
                              <linearGradient
                                key={`gradient-${classId}`}
                                id={`color-${classId}`}
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop
                                  offset="5%"
                                  stopColor={chartConfig[classKey]?.color}
                                  stopOpacity={0.8}
                                />
                                <stop
                                  offset="95%"
                                  stopColor={chartConfig[classKey]?.color}
                                  stopOpacity={0.1}
                                />
                              </linearGradient>
                            );
                          })}
                        </defs>

                        {statsData.classIds.map((classId) => {
                          const classKey = `class-${classId}`;
                          return (
                            <Area
                              key={classId}
                              type="monotone"
                              dataKey={classKey}
                              name={statsData.classMap[classId]}
                              stroke={chartConfig[classKey]?.color}
                              fill={`url(#color-${classId})`}
                            />
                          );
                        })}
                      </AreaChart>
                    </ChartContainer>
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
