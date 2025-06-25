"use client";

import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/next";
import { useRef, useState } from "react";

interface FileUploadProps {
  onSuccess: (res: any) => void;
  onProgress?: (progress: number) => void;
  fileType?: "image" | "video";
  onError?: (msg: string) => void; // <-- Add this line
}

const FileUpload = ({ onSuccess, onProgress, fileType, onError }: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);

  const validateFile = (file: File) => {
    if (fileType === "video") {
      if (!file.type.startsWith("video/")) {
        onError?.("Please upload a valid video file");
        return false;
      }
    }
    if (fileType === "image") {
      if (!file.type.startsWith("image/")) {
        onError?.("Please upload a valid image file");
        return false;
      }
    }
    if (file.size > 25 * 1024 * 1024) {
      onError?.("File size must be less than 25 MB");
      return false;
    }
    return true;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file || !validateFile(file)) return;

    setUploading(true);

    try {
      const authRes = await fetch("/api/auth/imagekit-auth");
      const auth = await authRes.json();

      const { signature, expire, token } = auth.authenticationParameters;

      const res = await upload({
        file,
        fileName: file.name,
        publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
        signature,
        expire,
        token,
        onProgress: (event) => {
          if (event.lengthComputable && onProgress) {
            const percent = (event.loaded / event.total) * 100;
            onProgress(Math.round(percent));
          }
        },
      });
      onSuccess(res);
    } catch (error: any) {
      onError?.("Upload failed. Please try again.");
      console.error("Upload failed", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <input
        type="file"
        accept={fileType === "video" ? "video/*" : "image/*"}
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-cyan-600 file:to-purple-600 file:text-white hover:file:bg-cyan-700 transition"
      />
      {uploading && <span className="text-cyan-300 text-sm ml-2">Uploading...</span>}
    </>
  );
};

export default FileUpload;
