// app/api/campaigns/route.ts
// Campaign CRUD operations

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createCampaignSchema } from "@/lib/validations/file";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/campaigns?organizationId=...
 * Get campaigns for an organization
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get("organizationId");

    if (!organizationId) {
      return NextResponse.json(
        { error: "organizationId is required" },
        { status: 400 }
      );
    }

    // Check if user has access to this organization
    const membership = await prisma.organizationMember.findUnique({
      where: {
        organizationId_userId: {
          organizationId,
          userId: session.user.id,
        },
      },
    });

    if (!membership) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const campaigns = await prisma.campaign.findMany({
      where: {
        organizationId,
      },
      include: {
        files: true,
      },
    });

    return NextResponse.json(campaigns);
  } catch (error) {
    console.error("Get campaigns error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/campaigns
 * Create a new campaign
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate input
    const validation = createCampaignSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { name, description, organizationId, startDate, endDate, budget } =
      validation.data;

    // Check if user has access to this organization
    const membership = await prisma.organizationMember.findUnique({
      where: {
        organizationId_userId: {
          organizationId,
          userId: session.user.id,
        },
      },
    });

    if (!membership) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Create campaign
    const campaign = await prisma.campaign.create({
      data: {
        name,
        description,
        organizationId,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        budget: budget ? BigInt(Math.floor(budget * 100)) : undefined,
      },
    });

    return NextResponse.json(campaign, { status: 201 });
  } catch (error) {
    console.error("Create campaign error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
