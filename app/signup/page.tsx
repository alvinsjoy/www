'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'motion/react';
import { LuCircleAlert } from 'react-icons/lu';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpSchema, type SignUpFormData } from '@/lib/validations/auth';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

export default function SignUp() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          confirmPassword: data.confirmPassword,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to register');
      }
      const signInResult = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (signInResult?.error) {
        throw new Error(
          'Registration successful, but auto-login failed. Please sign in manually.',
        );
      }
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'An error occurred. Please try again.',
      );
      console.error('Sign up error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container mx-auto flex min-h-screen flex-col items-center px-3 py-4 md:px-4 md:py-8">
      <div className="pointer-events-none absolute top-0 left-1/4 h-[400px] w-1/2 bg-gradient-to-b from-purple-600/30 via-fuchsia-500/15 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute top-0 right-[10%] h-[350px] w-[400px] bg-gradient-to-b from-orange-500/30 via-pink-500/15 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute top-0 left-[10%] h-[350px] w-[400px] bg-gradient-to-b from-blue-600/30 via-indigo-500/15 to-transparent blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6 md:mb-8"
      >
        <h1 className="from-primary to-accent-foreground bg-gradient-to-r bg-clip-text text-center text-4xl font-bold text-transparent">
          Sign Up
        </h1>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-sm"
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
        className="bg-card w-full max-w-sm rounded-lg border p-6 shadow-sm"
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="name@example.com"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="••••••••" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input placeholder="••••••••" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Sign Up'}
            </Button>
          </form>
        </Form>

        <div className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <Link href="/signin" className="text-primary hover:underline">
            Sign In
          </Link>
        </div>
      </motion.div>

      <div className="mt-4">
        <Button
          variant="ghost"
          onClick={() => router.push('/')}
          className="text-muted-foreground text-sm"
        >
          Back to Home
        </Button>
      </div>
    </main>
  );
}
