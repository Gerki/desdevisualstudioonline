// app/(dashboard)/dashboard/settings/page.tsx
// Settings page

"use client";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Settings, Bell, Lock } from "lucide-react";

/**
 * User settings page
 */
export default function SettingsPage() {
  const { user } = useCurrentUser();

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-600 mt-2">
          Manage your account and preferences
        </p>
      </div>

      {/* Profile settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings size={20} />
            Profile Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Name
            </label>
            <Input type="text" defaultValue={user?.name || ""} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <Input type="email" defaultValue={user?.email || ""} disabled />
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>

      {/* Notification settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell size={20} />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
            <label className="text-sm font-medium">Email notifications</label>
            <input type="checkbox" defaultChecked className="w-4 h-4" />
          </div>
          <Button variant="outline">Manage Preferences</Button>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock size={20} />
            Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline">Change Password</Button>
          <Button variant="destructive">Sign out all devices</Button>
        </CardContent>
      </Card>
    </div>
  );
}
