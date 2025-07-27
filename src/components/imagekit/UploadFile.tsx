"use client";

import { upload } from "@imagekit/next";
import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface UploadFileProps {
  setFileUrl: (url: string | null) => void;
  folder?: string;
}

const UploadFile = ({ setFileUrl, folder = "/tutedude" }: UploadFileProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState(0);

  const abortController = new AbortController();

  const authenticator = async () => {
    const res = await fetch("/api/upload-auth");
    if (!res.ok) throw new Error("Failed to authenticate");
    const data = await res.json();
    return data;
  };

  const handleUpload = async () => {
    const fileInput = fileInputRef.current;
    const file = fileInput?.files?.[0];

    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    try {
      const { token, expire, signature, publicKey } = await authenticator();

      toast.loading("Uploading...", { id: "upload-toast" });
      setFileUrl(null); // reset

      const response = await upload({
        file,
        fileName: file.name,
        token,
        expire,
        signature,
        publicKey,
        ...(folder && { folder }),
        onProgress: (e) => {
          setProgress((e.loaded / e.total) * 100);
        },
        abortSignal: abortController.signal,
      });

      console.log("Upload successful:", response);
      toast.success("Upload successful", { id: "upload-toast" });
      setFileUrl(response.url || null);
    } catch (err) {
      toast.error("Upload failed", { id: "upload-toast" });
      console.error("Upload error:", err);
      setFileUrl(null);
    }
  };

  return (
    <div>
      <label className="block mb-2 text-sm font-medium text-gray-700">
        Upload Image (Max 5MB)
      </label>
      <Input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleUpload}
      />
      {progress > 0 && progress < 100 && (
        <p className="text-sm text-muted-foreground mt-1">
          Uploading: {Math.round(progress)}%
        </p>
      )}
    </div>
  );
};

export default UploadFile;
