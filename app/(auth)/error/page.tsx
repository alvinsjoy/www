'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';
import Link from 'next/link';

const ERROR_MESSAGES: Record<string, string> = {
  Configuration: 'There is a problem with the server configuration.',
  AccessDenied: 'You do not have access to this resource.',
  Verification: 'The verification link has expired or has already been used.',
  Default: 'An unexpected authentication error occurred.',
};

function ErrorContent() {
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string>(
    ERROR_MESSAGES['Default'],
  );

  useEffect(() => {
    const error = searchParams.get('error');
    if (error && error in ERROR_MESSAGES) {
      setErrorMessage(ERROR_MESSAGES[error]);
    }
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center text-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-4 md:mb-6"
      >
        <h1 className="text-2xl font-bold md:text-3xl">Authentication Error</h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="w-full"
      >
        <p className="text-muted-foreground mx-auto mb-6 max-w-md text-sm md:mb-8 md:text-base">
          {errorMessage}
        </p>

        <div className="flex justify-center">
          <Link href="/">
            <Button>Return to Home</Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <main className="container mx-auto flex min-h-screen flex-col items-center justify-center px-3 py-6 md:px-4 md:py-8">
      <div className="pointer-events-none absolute top-0 left-1/4 h-[400px] w-1/2 bg-gradient-to-b from-purple-600/30 via-fuchsia-500/15 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute top-0 right-[10%] h-[350px] w-[400px] bg-gradient-to-b from-orange-500/30 via-pink-500/15 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute top-0 left-[10%] h-[350px] w-[400px] bg-gradient-to-b from-blue-600/30 via-indigo-500/15 to-transparent blur-3xl" />

      <div className="mx-auto w-full max-w-2xl">
        <Card className="overflow-hidden border-2 p-4 shadow-lg md:p-8">
          <Suspense fallback={<div>Loading...</div>}>
            <ErrorContent />
          </Suspense>
        </Card>
      </div>
    </main>
  );
}
