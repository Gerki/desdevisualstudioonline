// app/(dashboard)/dashboard/organizations/page.tsx
// Organizations management page

"use client";

import { useOrganizations, useCreateOrganization } from "@/hooks/useOrganization";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

/**
 * Organizations management page
 */
export default function OrganizationsPage() {
  const { data: organizations, isLoading } = useOrganizations();
  const createOrgMutation = useCreateOrganization();
  const [showForm, setShowForm] = useState(false);

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Organizations</h1>
          <p className="text-slate-600 mt-2">
            Manage your organizations and team members
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          + New Organization
        </Button>
      </div>

      {/* Create organization form placeholder */}
      {showForm && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle>Create New Organization</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Organization name"
                className="w-full px-3 py-2 border border-slate-300 rounded-md"
              />
              <input
                type="text"
                placeholder="Slug (e.g., my-org)"
                className="w-full px-3 py-2 border border-slate-300 rounded-md"
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={() => setShowForm(false)}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button type="submit">Create</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Organizations list */}
      <div className="space-y-3">
        {organizations && organizations.length > 0 ? (
          organizations.map((org) => (
            <Card key={org.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-100 rounded-lg">
                    <Building2 size={24} className="text-slate-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{org.name}</h3>
                    <p className="text-sm text-slate-600">{org.slug}</p>
                  </div>
                </div>
                <Button asChild variant="outline">
                  <Link href={`/dashboard/organizations/${org.slug}`}>
                    View
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-slate-600">
                You don't have any organizations yet
              </p>
              <p className="text-sm text-slate-500 mt-1">
                Create one to get started managing your campaigns
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
