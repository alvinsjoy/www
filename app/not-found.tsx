'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ThemeSwitch from '@/components/theme-switch';
import AudioToggle from '@/components/audio-toggle';
import { Card } from '@/components/ui/card';
import { FaHome } from 'react-icons/fa';
import { motion } from 'motion/react';

export default function NotFound() {
  return (
    <main className="container mx-auto flex min-h-[80vh] flex-col items-center justify-center px-3 py-6 md:px-4 md:py-8">
      <div className="absolute top-2 flex w-full max-w-7xl justify-between px-3 md:top-4 md:px-4">
        <ThemeSwitch />
        <AudioToggle />
      </div>

      <div className="mx-auto w-full max-w-2xl">
        <Card className="overflow-hidden border-2 p-4 shadow-lg md:p-8">
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-4 md:mb-6"
            >
              <h1 className="from-primary to-accent-foreground bg-gradient-to-r bg-clip-text text-6xl font-extrabold text-transparent md:text-8xl">
                404
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <h2 className="mb-2 text-xl font-semibold md:text-2xl">
                Page Not Found
              </h2>
              <p className="text-muted-foreground mb-6 max-w-md text-sm md:mb-8 md:text-base">
                Oops! The page you&apos;re looking for might have moved or
                doesn&apos;t exist.
              </p>

              <Link href="/" passHref>
                <Button
                  className="gap-2 px-4 py-2 text-base transition-all hover:scale-105 md:px-6 md:py-5 md:text-lg"
                  variant="default"
                >
                  <FaHome className="h-4 w-4 md:h-5 md:w-5" />
                  Return Home
                </Button>
              </Link>
            </motion.div>
          </div>
        </Card>
      </div>
    </main>
  );
}
