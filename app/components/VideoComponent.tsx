"use client";
import { useRef, useState } from "react";
import { IVideo } from "@/models/Video";

interface VideoComponentProps {
	video: IVideo;
	onClick?: () => void;
}

export default function VideoComponent({
	video,
	onClick,
}: VideoComponentProps) {
	const videoRef = useRef<HTMLVideoElement>(null);
	const [isPlaying, setIsPlaying] = useState(false);

	const handlePlay = () => {
		if (videoRef.current) {
			videoRef.current.play();
			setIsPlaying(true);
		}
		if (onClick) onClick();
	};

	if (!video || !video.videoUrl) return null;

	return (
		<div
			onClick={handlePlay}
			className="relative cursor-pointer group rounded-xl overflow-hidden shadow-xl bg-gradient-to-br from-[#181c2b] via-[#232946] to-[#1a1a2e] border border-white/10 hover:scale-[1.03] transition-transform duration-300"
		>
			<div className="aspect-video relative">
				<video
					ref={videoRef}
					src={video.videoUrl}
					className="w-full h-full object-cover rounded-t-xl group-hover:brightness-90 transition duration-300"
					muted
					loop
					preload="metadata"
					controls
					controlsList="nodownload"
					onPause={() => setIsPlaying(false)}
				/>

				{!isPlaying && (
					<div className="absolute inset-0 flex items-center justify-center bg-black/40 transition group-hover:bg-black/60">
						<button
							className="bg-white/80 hover:bg-white text-purple-700 rounded-full p-4 shadow-lg text-3xl font-bold pointer-events-none group-hover:scale-110 transition"
							aria-label="Play"
						>
							▶
						</button>
					</div>
				)}
			</div>
			<div className="p-4">
				<h3 className="text-white text-lg font-semibold truncate">
					{video.title}
				</h3>
				<p className="text-gray-400 text-sm truncate">
					{video.description}
				</p>
			</div>
		</div>
	);
}
