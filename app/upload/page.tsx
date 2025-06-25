"use client";

import VideoUploadForm from "../components/VideoUploadForm";

export default function VideoUploadPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f2027] via-[#232526] to-[#2c5364]">
      <div className="w-full max-w-2xl bg-gradient-to-br from-[#232526]/90 to-[#0f2027]/90 border border-[#2c5364]/40 shadow-2xl rounded-2xl p-10 backdrop-blur-md">
        <h1 className="text-4xl font-extrabold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 drop-shadow-lg tracking-wide">
          Upload New Reel
        </h1>
        <VideoUploadForm />
      </div>
    </div>
  );
}
