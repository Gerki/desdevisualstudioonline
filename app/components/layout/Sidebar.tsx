// components/layout/Sidebar.tsx
// Main navigation sidebar component

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  FileText,
  Building2,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  organizationSlug?: string;
}

/**
 * Sidebar component with navigation links
 * Responsive design - collapses on mobile
 */
export function Sidebar({ organizationSlug }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: Home,
    },
    {
      label: "Files",
      href: "/dashboard/files",
      icon: FileText,
    },
    {
      label: "Organizations",
      href: "/dashboard/organizations",
      icon: Building2,
    },
    {
      label: "People",
      href: "/dashboard/people",
      icon: Users,
    },
    {
      label: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ];

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <>
      {/* Mobile toggle button */}
      <div className="md:hidden flex items-center justify-between p-4 bg-slate-900 text-white">
        <h2 className="text-xl font-bold">visualgv</h2>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-slate-800 rounded"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 w-64 bg-slate-900 text-white transform transition-transform duration-200 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } z-40`}
      >
        <div className="flex flex-col h-full p-6">
          {/* Logo */}
          <Link href="/dashboard" className="mb-8">
            <h1 className="text-2xl font-bold">visualgv</h1>
          </Link>

          {/* Navigation items */}
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    isActive(item.href)
                      ? "bg-blue-600 text-white"
                      : "text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout button */}
          <div className="border-t border-slate-700 pt-4">
            <Button
              onClick={() => signOut()}
              variant="ghost"
              className="w-full justify-start text-slate-300 hover:text-white"
            >
              <LogOut size={20} className="mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
