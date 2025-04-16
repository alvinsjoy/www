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
  CardFooter,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LuCircleAlert } from 'react-icons/lu';
import NavBar from '@/components/navbar';
import Link from 'next/link';
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  RadialBar,
  RadialBarChart,
  Tooltip,
  Legend,
} from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/chart';

interface DetectionStat {
  classId: number;
  className: string;
  count: number;
}

interface AreaChartDataPoint {
  month: string;
  formattedMonth: string;
  totalCount: number;
}

interface RadialChartItem {
  name: string;
  classId: number;
  count: number;
  fill: string;
}

interface MonthlyRadialChartData {
  month: string;
  formattedMonth: string;
  data: RadialChartItem[];
  total: number;
}

interface StatsResponse {
  areaChartData: AreaChartDataPoint[];
  totalStats: DetectionStat[];
  classIds: number[];
  classMap: Record<number, string>;
  radialChartData: MonthlyRadialChartData[];
}

const CustomRadialTooltip = ({
  active,
  payload,
  monthTotal,
}: {
  active?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any[];
  monthTotal: number;
}) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const data = payload[0];
  const signName = data.payload?.name || data.name || 'Unknown';
  const count = data.value || 0;
  const percentage =
    monthTotal === 0 ? 0 : Math.round((count / monthTotal) * 100);
  const fillColor = data.payload?.fill || 'currentColor';

  return (
    <div className="border-border/50 bg-background grid min-w-[8rem] items-start gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl">
      <div className="flex items-center gap-2">
        <div
          className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
          style={{ backgroundColor: fillColor }}
        />
        <div className="font-medium">{signName}</div>
      </div>
      <div className="mt-0.5 flex items-center justify-between">
        <span className="text-muted-foreground">Detections</span>
        <span className="text-foreground pl-3 font-mono font-medium tabular-nums">
          {count} ({percentage}%)
        </span>
      </div>
    </div>
  );
};

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

  const chartConfig: ChartConfig = useMemo(() => {
    if (!statsData?.classIds) return {};

    const config: ChartConfig = {
      count: {
        label: 'Count',
      },
      totalCount: {
        label: 'Total Detections',
      },
    };

    return config;
  }, [statsData?.classIds]);

  if (status === 'loading') {
    return (
      <main className="conainer mx-auto flex min-h-screen flex-col items-center justify-center">
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
          <TabsContent value="chart" className="mt-4 space-y-6">
            {/* Area Chart for Total Detections */}
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>Total Detection Trends</CardTitle>
                <CardDescription>Monthly total detection count</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                {loading ? (
                  <div className="py-8 text-center">Loading chart data...</div>
                ) : !statsData?.areaChartData ||
                  statsData.areaChartData.length === 0 ? (
                  <div className="py-8 text-center">
                    <p className="text-muted-foreground">
                      No data available for chart
                    </p>
                  </div>
                ) : (
                  <div className="h-fit w-full">
                    <ChartContainer config={chartConfig}>
                      <AreaChart
                        data={statsData.areaChartData}
                        margin={{
                          top: 10,
                          right: 30,
                          left: 0,
                          bottom: 0,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                          dataKey="formattedMonth"
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis />
                        <Tooltip
                          content={(tooltipProps) => {
                            const { active, payload, label } = tooltipProps;
                            return (
                              <ChartTooltipContent
                                active={active}
                                payload={payload?.map((item) => ({
                                  ...item,
                                  name: 'Detections',
                                }))}
                                label={label}
                              />
                            );
                          }}
                        />

                        {/* Gradient for the area */}
                        <defs>
                          <linearGradient
                            id="colorTotal"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="hsl(var(--chart-6))"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor="hsl(var(--chart-6))"
                              stopOpacity={0.1}
                            />
                          </linearGradient>
                        </defs>

                        <Area
                          type="monotone"
                          dataKey="totalCount"
                          name="Total Detections"
                          stroke="hsl(var(--chart-6))"
                          fill="url(#colorTotal)"
                        />
                      </AreaChart>
                    </ChartContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Monthly Radial Charts */}
            <div className="mt-6">
              <h3 className="text-muted-foreground mb-4 text-center text-lg">
                Monthly Detection Distribution
              </h3>

              {loading ? (
                <div className="py-8 text-center">Loading chart data...</div>
              ) : !statsData?.radialChartData ||
                statsData.radialChartData.every(
                  (month) => month.total === 0,
                ) ? (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">
                    No monthly data available for charts
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {statsData.radialChartData.map((monthData) => (
                    <Card key={monthData.month} className="flex flex-col">
                      <CardHeader className="items-center pb-2">
                        <CardTitle className="text-lg">
                          {monthData.formattedMonth}
                        </CardTitle>
                        <CardDescription>
                          Showing {monthData.data.length} top signs
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1 pb-0">
                        <ChartContainer
                          config={chartConfig}
                          className="mx-auto aspect-square max-h-[250px]"
                        >
                          <RadialBarChart
                            data={
                              monthData.total === 0
                                ? [
                                    {
                                      name: 'No Data',
                                      count: 0,
                                      classId: -1,
                                      fill: 'hsl(var(--muted))',
                                    },
                                  ]
                                : monthData.data.map((item, index) => ({
                                    ...item,
                                    fill: `hsl(var(--chart-${(index % 6) + 1}))`,
                                  }))
                            }
                            innerRadius="30%"
                            outerRadius="100%"
                            barSize={10}
                            startAngle={180}
                            endAngle={0}
                          >
                            {monthData.total > 0 && (
                              <Tooltip
                                cursor={false}
                                content={(props) => (
                                  <CustomRadialTooltip
                                    {...props}
                                    monthTotal={monthData.total}
                                  />
                                )}
                              />
                            )}
                            <RadialBar
                              dataKey="count"
                              background
                              fillOpacity={0.85}
                            />
                            <Legend
                              iconSize={10}
                              layout="vertical"
                              verticalAlign="bottom"
                              wrapperStyle={{
                                fontSize: '10px',
                                paddingTop: '10px',
                              }}
                            />

                            {monthData.total === 0 && (
                              <text
                                x="50%"
                                y="50%"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                className="fill-muted-foreground text-xs"
                              >
                                No detections
                              </text>
                            )}
                          </RadialBarChart>
                        </ChartContainer>
                      </CardContent>
                      <CardFooter className="flex-col gap-1 py-3 text-sm">
                        <div className="text-muted-foreground leading-none">
                          {monthData.total} detections in{' '}
                          {monthData.formattedMonth}
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </main>
  );
}
