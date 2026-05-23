// lib/s3.ts
// AWS S3 / DigitalOcean Spaces client for file uploads

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  ...(process.env.AWS_S3_ENDPOINT && {
    endpoint: process.env.AWS_S3_ENDPOINT,
    forcePathStyle: true,
  }),
});

/**
 * Generate a presigned URL for direct client uploads
 * Reduces server load by allowing browser to upload directly to S3
 */
export async function getPresignedUploadUrl(
  fileName: string,
  mimeType: string
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: `uploads/${Date.now()}-${fileName}`,
    ContentType: mimeType,
  });

  return getSignedUrl(s3Client, command, { expiresIn: 3600 });
}

/**
 * Delete a file from S3
 */
export async function deleteS3File(fileKey: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: fileKey,
  });

  await s3Client.send(command);
}

/**
 * Get presigned download URL for secure file access
 */
export async function getPresignedDownloadUrl(
  fileKey: string,
  expiresIn = 3600
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: fileKey,
  });

  return getSignedUrl(s3Client, command, { expiresIn });
}
