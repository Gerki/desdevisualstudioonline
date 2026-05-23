// lib/validations/file.ts
// File and campaign validation schemas

import { z } from "zod";
import { FileType } from "@prisma/client";

export const fileUploadSchema = z.object({
  name: z.string().min(1, "File name is required"),
  fileType: z.nativeEnum(FileType),
  organizationId: z.string().cuid("Invalid organization ID"),
  campaignId: z.string().cuid().optional(),
  mimeType: z.string(),
});

export const createCampaignSchema = z.object({
  name: z.string().min(2, "Campaign name must be at least 2 characters"),
  description: z.string().optional(),
  organizationId: z.string().cuid("Invalid organization ID"),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  budget: z.number().positive().optional(),
});

export const createPrintOrderSchema = z.object({
  campaignId: z.string().cuid("Invalid campaign ID"),
  fileId: z.string().cuid("Invalid file ID"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  notes: z.string().optional(),
});

export type FileUploadInput = z.infer<typeof fileUploadSchema>;
export type CreateCampaignInput = z.infer<typeof createCampaignSchema>;
export type CreatePrintOrderInput = z.infer<typeof createPrintOrderSchema>;
