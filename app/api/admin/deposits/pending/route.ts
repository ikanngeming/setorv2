import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
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

    // Get pending deposits
    const deposits = await prisma.deposit.findMany({
      where: { status: "pending" },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        emailAccount: true,
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(
      {
        success: true,
        deposits,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get pending deposits error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
