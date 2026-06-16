import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createDepositSchema = z.object({
  amount: z.number().min(10000, "Minimum deposit is Rp 10.000"),
  emailAccountId: z.number().optional(),
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

    const body = await request.json();

    // Validate input
    const validation = createDepositSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0]?.message },
        { status: 400 }
      );
    }

    const { amount, emailAccountId } = validation.data;

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Verify email account belongs to user if provided
    if (emailAccountId) {
      const emailAccount = await prisma.emailAccount.findUnique({
        where: { id: emailAccountId },
      });

      if (!emailAccount || emailAccount.userId !== user.id) {
        return NextResponse.json(
          { error: "Email account not found" },
          { status: 404 }
        );
      }
    }

    // Create deposit
    const deposit = await prisma.deposit.create({
      data: {
        userId: user.id,
        emailAccountId,
        amount,
        status: "pending",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Deposit request created successfully",
        depositId: deposit.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create deposit error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
