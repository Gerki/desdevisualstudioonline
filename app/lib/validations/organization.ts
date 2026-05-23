// lib/validations/organization.ts
// Organization validation schemas

import { z } from "zod";
import { MemberRole } from "@prisma/client";

export const createOrganizationSchema = z.object({
  name: z.string().min(2, "Organization name must be at least 2 characters"),
  slug: z.string().regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  industry: z.string().optional(),
  logoUrl: z.string().url().optional().or(z.literal("")),
});

export const updateOrganizationSchema = createOrganizationSchema.partial();

export const inviteUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.nativeEnum(MemberRole),
});

export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;
export type UpdateOrganizationInput = z.infer<typeof updateOrganizationSchema>;
export type InviteUserInput = z.infer<typeof inviteUserSchema>;
