import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Initialize database function
async function initializeDatabase() {
  try {
    // Create table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Subscriber" (
        "id" SERIAL PRIMARY KEY,
        "email" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL
      )
    `;

    // Create index in a separate statement
    await prisma.$executeRaw`
      CREATE UNIQUE INDEX IF NOT EXISTS "Subscriber_email_key" ON "Subscriber"("email")
    `;

    return true;
  } catch (error) {
    console.error('Database initialization error:', error);
    return false;
  }
}

export async function POST(request: Request) {
  try {
    // Initialize database if needed
    const initialized = await initializeDatabase();
    if (!initialized) {
      return NextResponse.json(
        { error: 'Database initialization failed. Please try again later.' },
        { status: 500 }
      );
    }

    const { email } = await request.json();

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // Check if email already exists
    try {
      const existingSubscriber = await prisma.subscriber.findUnique({
        where: { email },
      });

      if (existingSubscriber) {
        return NextResponse.json(
          { message: 'You are already subscribed!' },
          { status: 200 }
        );
      }
    } catch (error) {
      console.error('Error checking existing subscriber:', error);
      // Continue with creation attempt even if check fails
    }

    // Create new subscriber
    try {
      await prisma.subscriber.create({
        data: {
          email,
          updatedAt: new Date(), // Explicitly set updatedAt
        },
      });

      return NextResponse.json(
        { message: 'Successfully subscribed!' },
        { status: 201 }
      );
    } catch (error) {
      console.error('Error creating subscriber:', error);
      return NextResponse.json(
        { error: 'Failed to subscribe. Please try again later.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again later.' },
      { status: 500 }
    );
  }
} 