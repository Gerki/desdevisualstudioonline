// hooks/useCurrentUser.ts
// Custom hook for accessing current user session

"use client";

import { useSession } from "next-auth/react";

/**
 * Hook to get current user information
 * Returns user data or loading/error state
 */
export function useCurrentUser() {
  const { data: session, status } = useSession();

  return {
    user: session?.user,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
  };
}
