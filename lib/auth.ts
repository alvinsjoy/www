import { getServerSession } from 'next-auth';
import type { NextAuthOptions, DefaultSession } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { Resend } from 'resend';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
    } & DefaultSession['user'];
  }
}
const resend = new Resend(process.env.RESEND_API_KEY);

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/signin',
    signOut: '/',
    error: '/error',
    verifyRequest: '/verify',
  },
  debug: process.env.NODE_ENV === 'development',
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
          });

          if (!user || !user.password) {
            return null;
          }

          const passwordMatch = await bcrypt.compare(
            credentials.password,
            user.password,
          );

          if (!passwordMatch) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            emailVerified: user.emailVerified,
          };
        } catch (error) {
          console.error('Error in authorize callback:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};

export const auth = () => getServerSession(authOptions);

export async function sendVerificationEmail(email: string) {
  try {
    const token = crypto.randomUUID();
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    });

    const verificationUrl = `${process.env.NEXTAUTH_URL}/verify?token=${token}`;

    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: email,
      subject: 'Verify your email address',
      html: `
        <body>
          <h1>Verify your email address</h1>
          <p>Click the link below to verify your email address:</p>
          <a href="${verificationUrl}">Verify Email Address</a>
          <p>This link will expire in 24 hours.</p>
          <p>If you didn't request this email, you can safely ignore it.</p>
        </body>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending verification email:', error);
    return { success: false, error: 'Failed to send verification email' };
  }
}

export async function verifyEmail(token: string) {
  try {
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken) {
      return { success: false, error: 'Invalid token' };
    }

    if (verificationToken.expires < new Date()) {
      await prisma.verificationToken.delete({
        where: { token },
      });
      return { success: false, error: 'Token expired' };
    }

    await prisma.user.update({
      where: { email: verificationToken.identifier },
      data: { emailVerified: new Date() },
    });

    await prisma.verificationToken.delete({
      where: { token },
    });

    return { success: true };
  } catch (error) {
    console.error('Error verifying email:', error);
    return { success: false, error: 'Failed to verify email' };
  }
}
