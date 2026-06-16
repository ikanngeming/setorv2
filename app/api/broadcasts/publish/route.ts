import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const publishBroadcastSchema = z.object({
  broadcastId: z.number(),
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
    const validation = publishBroadcastSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0]?.message },
        { status: 400 }
      );
    }

    const { broadcastId } = validation.data;

    // Get broadcast
    const broadcast = await prisma.broadcast.findUnique({
      where: { id: broadcastId },
    });

    if (!broadcast) {
      return NextResponse.json(
        { error: "Broadcast not found" },
        { status: 404 }
      );
    }

    if (broadcast.status !== "draft") {
      return NextResponse.json(
        { error: "Broadcast already published" },
        { status: 400 }
      );
    }

    // Get target users based on role
    const targetUsers = await prisma.user.findMany({
      where:
        broadcast.targetRole === "all"
          ? {}
          : { role: broadcast.targetRole },
      select: { id: true },
    });

    // Create notifications for all target users
    const notifications = targetUsers.map((targetUser) => ({
      userId: targetUser.id,
      broadcastId: broadcast.id,
      title: broadcast.title,
      content: broadcast.content,
      type: "broadcast" as const,
      isRead: false,
    }));

    // Update broadcast and create notifications
    await prisma.$transaction([
      prisma.broadcast.update({
        where: { id: broadcastId },
        data: {
          status: "published",
          publishedAt: new Date(),
        },
      }),
      prisma.notification.createMany({
        data: notifications,
      }),
    ]);

    return NextResponse.json(
      {
        success: true,
        message: `Broadcast published to ${notifications.length} users`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Publish broadcast error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
