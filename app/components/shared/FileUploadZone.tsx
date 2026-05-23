// components/shared/FileUploadZone.tsx
// Drag-and-drop file upload component

"use client";

import { useState, useRef } from "react";
import { Upload, File } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploadZoneProps {
  onFileSelected?: (file: File) => void;
  accept?: string;
  multiple?: boolean;
}

/**
 * Drag-and-drop file upload zone
 * Provides visual feedback and file validation
 */
export function FileUploadZone({
  onFileSelected,
  accept = "*",
  multiple = false,
}: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      onFileSelected?.(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      onFileSelected?.(file);
    }
  };

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-lg p-8 transition-colors ${
        isDragging
          ? "border-blue-500 bg-blue-50"
          : "border-slate-300 bg-slate-50"
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileInput}
        className="hidden"
      />

      <div className="flex flex-col items-center justify-center gap-4">
        {selectedFile ? (
          <>
            <File size={48} className="text-blue-600" />
            <div className="text-center">
              <p className="font-semibold text-slate-900">{selectedFile.name}</p>
              <p className="text-sm text-slate-600">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </>
        ) : (
          <>
            <Upload size={48} className="text-slate-400" />
            <div className="text-center">
              <p className="font-semibold text-slate-900">
                Drag and drop your files here
              </p>
              <p className="text-sm text-slate-600">or click to browse</p>
            </div>
          </>
        )}

        <Button
          onClick={() => fileInputRef.current?.click()}
          variant="outline"
        >
          {selectedFile ? "Change File" : "Select File"}
        </Button>
      </div>
    </div>
  );
}
