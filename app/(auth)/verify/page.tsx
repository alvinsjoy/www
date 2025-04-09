'use client';

import { Card } from '@/components/ui/card';
import { motion } from 'motion/react';
import Link from 'next/link';

export default function VerifyEmailPage() {
  return (
    <main className="container mx-auto flex min-h-screen flex-col items-center justify-center px-3 py-6 md:px-4 md:py-8">
      <div className="pointer-events-none absolute top-0 left-1/4 h-[400px] w-1/2 bg-gradient-to-b from-purple-600/30 via-fuchsia-500/15 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute top-0 right-[10%] h-[350px] w-[400px] bg-gradient-to-b from-orange-500/30 via-pink-500/15 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute top-0 left-[10%] h-[350px] w-[400px] bg-gradient-to-b from-blue-600/30 via-indigo-500/15 to-transparent blur-3xl" />

      <div className="mx-auto w-full max-w-2xl">
        <Card className="overflow-hidden border-2 p-4 shadow-lg md:p-8">
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-4 md:mb-6"
            >
              <h1 className="text-2xl font-bold md:text-3xl">
                Check Your Email
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="w-full"
            >
              <p className="text-muted-foreground mx-auto mb-6 max-w-md text-sm md:mb-8 md:text-base">
                We&apos;ve sent a verification link to your email address.
                Please check your inbox and click the link to complete your
                registration.
              </p>

              <div className="mx-auto mt-6 max-w-md">
                <p className="text-muted-foreground mb-2 text-sm">
                  The verification link will expire in 24 hours.
                </p>

                <div className="mt-4">
                  Already verified?{' '}
                  <Link href="/" className="text-primary underline">
                    Go Home
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </Card>
      </div>
    </main>
  );
}
