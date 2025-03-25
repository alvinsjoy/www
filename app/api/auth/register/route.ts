import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { signUpSchema } from '@/lib/validations/auth';
import { sendVerificationEmail } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = signUpSchema.safeParse(body);

    if (!result.success) {
      const formattedErrors = result.error.format();
      return NextResponse.json(
        {
          success: false,
          message: 'Validation failed',
          error: formattedErrors,
        },
        { status: 400 },
      );
    }

    const { name, email, password } = result.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: 'User with this email already exists',
          error: 'User with this email already exists',
        },
        { status: 409 },
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        emailVerified: null,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    const { success, error } = await sendVerificationEmail(email);

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to send verification email',
          error: error,
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message:
          'User registered successfully. Please check your email to verify your account.',
        data: { user },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Something went wrong',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
