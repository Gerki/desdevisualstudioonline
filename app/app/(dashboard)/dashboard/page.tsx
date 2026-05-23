// app/(dashboard)/dashboard/page.tsx
// Main dashboard home page

"use client";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useOrganizations } from "@/hooks/useOrganization";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BarChart, FileText, Building2 } from "lucide-react";

/**
 * Dashboard home page showing overview and quick stats
 */
export default function DashboardPage() {
  const { user, isLoading: userLoading } = useCurrentUser();
  const { data: organizations, isLoading: orgsLoading } = useOrganizations();

  if (userLoading || orgsLoading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Welcome section */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Welcome back!</h1>
        <p className="text-slate-600 mt-2">
          Here's an overview of your advertising campaigns and assets
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <Building2 size={16} />
              Organizations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{organizations?.length || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <FileText size={16} />
              Files
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">0</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <BarChart size={16} />
              Campaigns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">0</p>
          </CardContent>
        </Card>
      </div>

      {/* Organizations section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Your Organizations</CardTitle>
            <Button asChild>
              <Link href="/dashboard/organizations">View All</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {organizations && organizations.length > 0 ? (
            <div className="space-y-3">
              {organizations.map((org) => (
                <div
                  key={org.id}
                  className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50"
                >
                  <div>
                    <h3 className="font-semibold text-slate-900">{org.name}</h3>
                    <p className="text-sm text-slate-600">{org.slug}</p>
                  </div>
                  <Button variant="outline" asChild>
                    <Link href={`/dashboard/organizations/${org.slug}`}>
                      Open
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-600 mb-4">
                You don't have any organizations yet
              </p>
              <Button asChild>
                <Link href="/dashboard/organizations">Create Organization</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
