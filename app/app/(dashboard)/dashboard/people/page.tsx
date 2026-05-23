// app/(dashboard)/dashboard/people/page.tsx
// Team members management page

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

/**
 * Team members management page
 */
export default function PeoplePage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Team Members</h1>
          <p className="text-slate-600 mt-2">
            Manage your team and invite new members
          </p>
        </div>
        <Button>+ Invite Member</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users size={20} />
            Team Members
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-slate-600">Select an organization first</p>
            <p className="text-sm text-slate-500 mt-1">
              Go to Organizations to manage your team
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
