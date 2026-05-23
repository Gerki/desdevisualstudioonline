// app/api/organizations/route.ts
// Organizations CRUD operations

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createOrganizationSchema } from "@/lib/validations/organization";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/organizations
 * Get all organizations for the current user
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const organizations = await prisma.organization.findMany({
      where: {
        members: {
          some: {
            userId: session.user.id,
          },
        },
      },
      include: {
        members: {
          where: {
            userId: session.user.id,
          },
        },
      },
    });

    return NextResponse.json(organizations);
  } catch (error) {
    console.error("Get organizations error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/organizations
 * Create a new organization
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate input
    const validation = createOrganizationSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { name, slug, industry, logoUrl } = validation.data;

    // Check if slug already exists
    const existingOrg = await prisma.organization.findUnique({
      where: { slug },
    });

    if (existingOrg) {
      return NextResponse.json(
        { error: "Organization slug already exists" },
        { status: 409 }
      );
    }

    // Create organization with owner
    const organization = await prisma.organization.create({
      data: {
        name,
        slug,
        industry,
        logoUrl,
        members: {
          create: {
            userId: session.user.id,
            role: "OWNER",
          },
        },
      },
      include: {
        members: true,
      },
    });

    return NextResponse.json(organization, { status: 201 });
  } catch (error) {
    console.error("Create organization error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
