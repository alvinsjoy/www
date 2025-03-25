import NavBar from '@/components/navbar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function DashboardLoading() {
  return (
    <main className="container mx-auto flex min-h-screen flex-col items-center px-3 py-4 md:px-4 md:py-8">
      <div className="pointer-events-none absolute top-0 left-1/4 h-[400px] w-1/2 bg-gradient-to-b from-purple-600/30 via-fuchsia-500/15 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute top-0 right-[10%] h-[350px] w-[400px] bg-gradient-to-b from-orange-500/30 via-pink-500/15 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute top-0 left-[10%] h-[350px] w-[400px] bg-gradient-to-b from-blue-600/30 via-indigo-500/15 to-transparent blur-3xl" />
      <NavBar />
      <div className="mb-6 w-full md:mb-8">
        <div className="flex justify-center">
          <div className="bg-muted h-6 w-3/4 animate-pulse rounded md:w-1/2"></div>
        </div>
      </div>

      <div className="w-full max-w-4xl">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="bg-muted h-5 w-24 animate-pulse rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="bg-muted h-8 w-16 animate-pulse rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6">
          <div className="bg-accent grid w-full grid-cols-2 rounded-lg p-1">
            <div className="bg-background rounded p-1.5 text-center shadow-sm">
              <div className="bg-muted mx-auto h-4 w-24 animate-pulse rounded"></div>
            </div>
            <div className="p-1.5 text-center">
              <div className="bg-muted mx-auto h-4 w-24 animate-pulse rounded"></div>
            </div>
          </div>

          <div className="mt-4">
            <Card>
              <CardHeader>
                <div className="bg-muted h-6 w-48 animate-pulse rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div className="bg-muted h-5 w-32 animate-pulse rounded"></div>
                      <div className="bg-muted h-5 w-10 animate-pulse rounded-full"></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-4 hidden">
            <Card>
              <CardHeader>
                <div className="bg-muted h-6 w-36 animate-pulse rounded"></div>
                <div className="bg-muted mt-1 h-4 w-64 animate-pulse rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="bg-accent h-[350px] w-full animate-pulse rounded">
                  <div className="grid h-full place-items-center">
                    <div className="bg-muted h-8 w-36 animate-pulse rounded"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
