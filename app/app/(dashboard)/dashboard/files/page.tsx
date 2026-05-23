// app/(dashboard)/dashboard/files/page.tsx
// Files management page

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileUploadZone } from "@/components/shared/FileUploadZone";

/**
 * File management page for uploading and managing digital assets
 */
export default function FilesPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Digital Assets</h1>
        <p className="text-slate-600 mt-2">
          Upload and manage your advertising artwork and designs
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload zone */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Upload File</CardTitle>
            </CardHeader>
            <CardContent>
              <FileUploadZone />
            </CardContent>
          </Card>
        </div>

        {/* Files list placeholder */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Your Files</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-slate-600">No files uploaded yet</p>
                <p className="text-sm text-slate-500 mt-1">
                  Upload your first file to get started
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
