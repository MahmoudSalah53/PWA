// app/api/orders/route.ts

import { NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/prisma"; // ✅ نفس الطريقة الصحيحة من signup

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const prisma = getPrismaClient(); // ✅ استدعاء صحيح داخل الفنكشن

    const body = await request.json();
    const {
      userId,
      email,
      firstName,
      lastName,
      address,
      city,
      state,
      zipCode,
      country,
      phone,
      total,
      items,
    } = body;

    if (!email || !firstName || !lastName || !address || !city || !zipCode || !phone || !total || !items) {
      return NextResponse.json(
        { error: "Missing required order fields" },
        { status: 400 }
      );
    }

    // ✅ إنشاء الطلب الجديد
    const order = await prisma.order.create({
      data: {
        userId: userId || undefined,
        email,
        firstName,
        lastName,
        address,
        city,
        state,
        zipCode,
        country: country || "United States",
        phone,
        total,
        status: "processing",
        orderItems: {
          create: items.map((item: any) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const prisma = getPrismaClient(); // ✅ لازم يكون هنا كمان

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (userId) {
      // ✅ إحضار الطلبات الخاصة بمستخدم معين
      const orders = await prisma.order.findMany({
        where: { userId },
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(orders);
    }

    // ✅ إحضار كل الطلبات (لـ admin)
    const orders = await prisma.order.findMany({
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
