import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const approveDepositSchema = z.object({
  depositId: z.number(),
});

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
    });

    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validate input
    const validation = approveDepositSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0]?.message },
        { status: 400 }
      );
    }

    const { depositId } = validation.data;

    // Get deposit
    const deposit = await prisma.deposit.findUnique({
      where: { id: depositId },
      include: { user: true },
    });

    if (!deposit) {
      return NextResponse.json(
        { error: "Deposit not found" },
        { status: 404 }
      );
    }

    if (deposit.status !== "pending") {
      return NextResponse.json(
        { error: "Deposit already processed" },
        { status: 400 }
      );
    }

    // Update deposit and user balance
    await prisma.$transaction([
      prisma.deposit.update({
        where: { id: depositId },
        data: {
          status: "approved",
          approvedBy: user.id,
          approvedAt: new Date(),
        },
      }),
      prisma.user.update({
        where: { id: deposit.userId },
        data: {
          balance: {
            increment: deposit.amount,
          },
        },
      }),
    ]);

    return NextResponse.json(
      {
        success: true,
        message: "Deposit approved successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Approve deposit error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
