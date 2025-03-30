'use client';

import { Card } from '@/components/ui/card';
import { motion } from 'motion/react';
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function VerifyEmailPage() {
  return (
    <main className="container mx-auto flex min-h-screen flex-col items-center justify-center px-3 py-6 md:px-4 md:py-8">
      <div className="pointer-events-none absolute top-0 left-1/4 h-[400px] w-1/2 bg-gradient-to-b from-purple-600/30 via-fuchsia-500/15 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute top-0 right-[10%] h-[350px] w-[400px] bg-gradient-to-b from-orange-500/30 via-pink-500/15 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute top-0 left-[10%] h-[350px] w-[400px] bg-gradient-to-b from-blue-600/30 via-indigo-500/15 to-transparent blur-3xl" />

      <div className="mx-auto w-full max-w-2xl">
        <Card className="overflow-hidden border-2 p-4 shadow-lg md:p-8">
          <Suspense fallback={<LoadingState />}>
            <VerifyEmail />
          </Suspense>
        </Card>
      </div>
    </main>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center text-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-4 md:mb-6"
      >
        <h1 className="text-2xl font-bold md:text-3xl">
          Verifying your email...
        </h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <p className="text-muted-foreground mb-6 max-w-md text-sm md:mb-8 md:text-base">
          Please wait while we verify your email address...
        </p>
      </motion.div>
    </div>
  );
}

function VerifyEmail() {
  const router = useRouter();
  const { update } = useSession();
  const searchParams = useSearchParams();
  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);
  const [isDefaultPage, setIsDefaultPage] = useState(false);

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setVerifying(false);
      setIsDefaultPage(true);
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await fetch(`/api/auth/verify?token=${token}`);
        const data = await response.json();

        if (data.success) {
          setSuccess(true);
          toast.success('Email verified successfully!');
          update().then(() => {
            router.push('/');
          });
        } else {
          toast.error(data.error || 'Failed to verify email');
        }
      } catch (error: unknown) {
        toast.error('An error occurred while verifying your email', {
          description:
            error instanceof Error ? error.message : 'Unknown error occurred',
        });
      } finally {
        setVerifying(false);
      }
    };

    verifyToken();
  }, [router, searchParams, update]);

  return (
    <div className="flex flex-col items-center text-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-4 md:mb-6"
      >
        <h1 className="text-2xl font-bold md:text-3xl">
          {verifying
            ? 'Verifying your email...'
            : isDefaultPage
              ? 'Check Your Email'
              : success
                ? 'Email Verified!'
                : 'Verification Failed'}
        </h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <p className="text-muted-foreground mb-6 max-w-md text-sm md:mb-8 md:text-base">
          {verifying
            ? 'Please wait while we verify your email address...'
            : isDefaultPage
              ? "We've sent a verification link to your email address. Please check your inbox and click the link to complete your registration."
              : success
                ? 'Your email has been verified successfully. You can now sign in.'
                : 'There was a problem verifying your email. The link may have expired or is invalid.'}
        </p>

        {isDefaultPage && (
          <p className="text-muted-foreground mt-6 text-sm">
            Didn&apos;t receive the email? Check your spam folder or
            <Link href="/" className="text-primary ml-1">
              contact support
            </Link>
          </p>
        )}
      </motion.div>
    </div>
  );
}
