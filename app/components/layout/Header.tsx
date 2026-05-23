// components/layout/Header.tsx
// Top header component with user menu

"use client";

import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Bell, Settings } from "lucide-react";

/**
 * Header component displayed at the top of dashboard
 */
export function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>
        <p className="text-sm text-slate-600">Welcome back, {session?.user?.name || "User"}</p>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <Bell size={20} />
        </Button>
        <Button variant="ghost" size="icon">
          <Settings size={20} />
        </Button>
      </div>
    </header>
  );
}
