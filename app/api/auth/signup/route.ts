// app/api/auth/signup/route.ts

import { NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/prisma"; 
import * as bcrypt from "bcryptjs";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // 2. استدعاء الفانكشن جوه الـ POST
    const prisma = getPrismaClient();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 409 } // 409 Conflict
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        name: name || null,
        email,
        password: hashedPassword,
      },
    });

    // Return user data without password
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error("Signup error:", error);
    
    // Better error logging
    if (error instanceof Error) {
      console.error("Error details:", error.message);
      console.error("Stack:", error.stack);
    }
    
    return NextResponse.json(
      { 
        message: "Internal server error",
        error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
      },
      { status: 500 }
    );
  }
}