// hooks/useOrganization.ts
// Custom hook for organization operations

"use client";

import { useQuery, useMutation } from "@tanstack/react-query";

interface Organization {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  industry?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Fetch organizations for current user
 */
export function useOrganizations() {
  return useQuery({
    queryKey: ["organizations"],
    queryFn: async () => {
      const response = await fetch("/api/organizations");
      if (!response.ok) throw new Error("Failed to fetch organizations");
      return response.json() as Promise<Organization[]>;
    },
  });
}

/**
 * Create a new organization
 */
export function useCreateOrganization() {
  return useMutation({
    mutationFn: async (data: {
      name: string;
      slug: string;
      industry?: string;
      logoUrl?: string;
    }) => {
      const response = await fetch("/api/organizations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create organization");
      return response.json() as Promise<Organization>;
    },
  });
}
