"use client";
import { IVideo } from "@/models/Video";
import VideoComponent from "./VideoComponent";

interface VideoFeedProps {
  videos: IVideo[];
  onVideoClick?: (video: IVideo) => void;
}

export default function VideoFeed({ videos, onVideoClick }: VideoFeedProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {videos.length === 0 ? (
        <div className="col-span-full flex justify-center items-center py-16">
          <p className="text-gray-400 text-lg italic animate-fade-in">
            No videos found. Be the first to upload!
          </p>
        </div>
      ) : (
        videos
          .filter((video) => video && video.videoUrl) // Only valid videos
          .map((video, idx) => (
            <div
              key={video._id?.toString() || idx}
              className="transform hover:scale-[1.03] transition-transform duration-300 ease-out shadow-lg hover:shadow-purple-600/30 rounded-xl overflow-hidden bg-[#111827] border border-white/5"
            >
              <VideoComponent
                video={video}
                onClick={onVideoClick ? () => onVideoClick(video) : undefined}
              />
            </div>
          ))
      )}
    </div>
  );
}
