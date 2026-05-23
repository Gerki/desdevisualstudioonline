// app/api/files/upload/route.ts
// File upload presigned URL generation

import { auth } from "@/lib/auth";
import { getPresignedUploadUrl } from "@/lib/s3";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const uploadRequestSchema = z.object({
  fileName: z.string().min(1),
  mimeType: z.string().min(1),
});

/**
 * POST /api/files/upload
 * Generate presigned URL for client-side S3 upload
 * This allows browsers to upload directly to S3, reducing server load
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate input
    const validation = uploadRequestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { fileName, mimeType } = validation.data;

    // Generate presigned URL
    const presignedUrl = await getPresignedUploadUrl(fileName, mimeType);

    return NextResponse.json({
      presignedUrl,
      uploadUrl: `${process.env.AWS_S3_ENDPOINT || "https://s3.amazonaws.com"}/${process.env.AWS_S3_BUCKET}`,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
