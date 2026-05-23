// store/organizationStore.ts
// Zustand store for organization state management

import { create } from "zustand";

interface Organization {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  industry?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface OrganizationState {
  currentOrganization: Organization | null;
  organizations: Organization[];
  setCurrentOrganization: (org: Organization | null) => void;
  setOrganizations: (orgs: Organization[]) => void;
}

/**
 * Global organization state store
 * Manages which organization is currently selected
 */
export const useOrganizationStore = create<OrganizationState>((set) => ({
  currentOrganization: null,
  organizations: [],
  setCurrentOrganization: (org) => set({ currentOrganization: org }),
  setOrganizations: (orgs) => set({ organizations: orgs }),
}));
