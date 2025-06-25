"use client";

import React, { useState } from "react";
import FileUpload from "./FileUpload";
import { useRouter } from "next/navigation";
import { useNotification } from "./Notification";
import { FaRegImage, FaRegFileVideo, FaSpinner, FaExclamationCircle } from "react-icons/fa";
import Image from "next/image";

const initialState = {
  title: "",
  description: "",
  videoUrl: "",
  thumbnailUrl: "",
};

function VideoUploadForm() {
  const [form, setForm] = useState(initialState);
  const [uploading, setUploading] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [thumbnailProgress, setThumbnailProgress] = useState(0);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [thumbnailError, setThumbnailError] = useState<string | null>(null);
  const router = useRouter();
  const { showNotification } = useNotification();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleVideoUpload = (res: unknown) => {
    const result = res as { url?: string; filePath?: string };
    setForm((prev) => ({ ...prev, videoUrl: result.url || result.filePath || "" }));
    setVideoError(null);
    showNotification("Video uploaded!", "success");
  };

  const handleThumbnailUpload = (res: unknown) => {
    const result = res as { url?: string; filePath?: string };
    setForm((prev) => ({ ...prev, thumbnailUrl: result.url || result.filePath || "" }));
    setThumbnailError(null);
    showNotification("Thumbnail uploaded!", "success");
  };

  // Custom error handler for FileUpload
  const handleVideoUploadError = (msg: string) => {
    setVideoError(msg);
    showNotification(msg, "error");
  };
  const handleThumbnailUploadError = (msg: string) => {
    setThumbnailError(msg);
    showNotification(msg, "error");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.videoUrl || !form.thumbnailUrl) {
      showNotification("Please fill all fields and upload files", "warning");
      return;
    }
    setUploading(true);
    try {
      const res = await fetch("/api/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to upload video");
      showNotification("Video uploaded successfully!", "success");
      setForm(initialState);
      router.push("/");
    } catch (error: unknown) {
      if (error instanceof Error) {
        showNotification(error.message || "Upload failed", "error");
      } else {
        showNotification("Upload failed", "error");
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <form
      className="max-w-xl mx-auto mt-10 bg-gradient-to-br from-[#181c2b] via-[#232946] to-[#1a1a2e] rounded-3xl shadow-2xl border-2 border-[#2c5364]/60 bg-clip-padding backdrop-blur-lg p-8 relative overflow-hidden"
      onSubmit={handleSubmit}
    >
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="w-full h-full bg-gradient-to-tr from-cyan-500/10 via-purple-700/10 to-pink-500/10 blur-2xl opacity-80"></div>
      </div>
      <div className="relative z-10 space-y-7">
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-6 text-center tracking-tight drop-shadow-lg">
          Upload Your Video
        </h2>
        <div>
          <label className="block mb-2 font-semibold text-cyan-300 tracking-wide flex items-center gap-2">
            <FaRegFileVideo className="text-lg" /> Title
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full px-5 py-3 rounded-xl bg-[#1a2233]/80 border border-cyan-700 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 text-white placeholder:text-cyan-200 transition-all duration-200 shadow-inner outline-none"
            placeholder="Enter a catchy title..."
          />
        </div>
        <div>
          <label className="block mb-2 font-semibold text-purple-300 tracking-wide">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={3}
            className="w-full px-5 py-3 rounded-xl bg-[#1a2233]/80 border border-purple-700 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 text-white placeholder:text-purple-200 transition-all duration-200 shadow-inner outline-none"
            placeholder="Describe your video..."
          />
        </div>
        <div>
          <label className="block mb-2 font-semibold text-cyan-200 tracking-wide flex items-center gap-2">
            <FaRegFileVideo className="text-lg" /> Video File
          </label>
          <FileUpload
            onSuccess={handleVideoUpload}
            onProgress={setVideoProgress}
            fileType="video"
            onError={handleVideoUploadError}
          />
          {videoError && (
            <div className="flex items-center gap-2 mt-2 text-sm text-red-400 bg-red-900/30 px-3 py-2 rounded-lg">
              <FaExclamationCircle /> {videoError}
            </div>
          )}
          {videoProgress > 0 && videoProgress < 100 && (
            <div className="mt-2">
              <div className="w-full bg-cyan-900/40 rounded-full h-2.5 mb-2">
                <div
                  className="bg-cyan-400 h-2.5 rounded-full transition-all duration-200"
                  style={{ width: `${videoProgress}%` }}
                ></div>
              </div>
              <div className="flex items-center gap-2 text-xs text-cyan-300 animate-pulse">
                <FaSpinner className="animate-spin" /> Uploading: {videoProgress}%
              </div>
            </div>
          )}
          {form.videoUrl && (
            <video
              src={form.videoUrl}
              controls
              className="mt-3 w-full rounded-xl border border-cyan-700 shadow-lg"
              style={{ maxHeight: 220 }}
            />
          )}
        </div>
        <div>
          <label className="block mb-2 font-semibold text-pink-200 tracking-wide flex items-center gap-2">
            <FaRegImage className="text-lg" /> Thumbnail Image
          </label>
          <FileUpload
            onSuccess={handleThumbnailUpload}
            onProgress={setThumbnailProgress}
            fileType="image"
            onError={handleThumbnailUploadError}
          />
          {thumbnailError && (
            <div className="flex items-center gap-2 mt-2 text-sm text-red-400 bg-red-900/30 px-3 py-2 rounded-lg">
              <FaExclamationCircle /> {thumbnailError}
            </div>
          )}
          {thumbnailProgress > 0 && thumbnailProgress < 100 && (
            <div className="mt-2">
              <div className="w-full bg-pink-900/40 rounded-full h-2.5 mb-2">
                <div
                  className="bg-pink-400 h-2.5 rounded-full transition-all duration-200"
                  style={{ width: `${thumbnailProgress}%` }}
                ></div>
              </div>
              <div className="flex items-center gap-2 text-xs text-pink-300 animate-pulse">
                <FaSpinner className="animate-spin" /> Uploading: {thumbnailProgress}%
              </div>
            </div>
          )}
          {form.thumbnailUrl && (
            <Image
              src={form.thumbnailUrl}
              alt="Thumbnail"
              width={144}
              height={96}
              className="mt-3 w-36 h-24 object-cover rounded-xl border border-pink-700 shadow-lg"
            />
          )}
        </div>
        <button
          type="submit"
          disabled={uploading}
          className={`w-full py-3 rounded-2xl font-bold text-lg tracking-wide shadow-xl transition-all duration-200 bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 hover:from-cyan-600 hover:to-pink-600 focus:outline-none focus:ring-4 focus:ring-cyan-400/40 text-white flex items-center justify-center gap-2 ${
            uploading ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {uploading && <FaSpinner className="animate-spin" />}
          {uploading ? "Uploading..." : "Upload Video"}
        </button>
      </div>
    </form>
  );
}

export default VideoUploadForm;
