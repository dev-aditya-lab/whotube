import VideoComponent from "./components/VideoComponent";
import Link from "next/link";
import Video, { IVideo } from "@/models/Video";
import { connectToDatabase } from "@/lib/db";

async function getVideos(): Promise<IVideo[]> {
  await connectToDatabase();
  const videos = await Video.find({}).sort({ createdAt: -1 }).lean();
  return videos.map((v) => ({
    ...v,
    _id: v._id?.toString(),
    title: v.title,
    description: v.description,
    videoUrl: v.videoUrl,
    thumbnailUrl: v.thumbnailUrl,
    // add any other required fields from IVideo here
  })) as IVideo[];
}

export default async function HomePage() {
  const videos = await getVideos();

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Hero Section */}
      <section className="relative z-10 py-24 px-6 sm:px-12 lg:px-24 bg-gradient-to-br from-[#1f1f1f] via-[#121212] to-[#000000] shadow-inner">
        <div className="max-w-7xl mx-auto text-center animate-fade-in">
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-white mb-6">
            Welcome to <span className="text-cyan-400">WhoTube</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 mb-10">
            Discover, Upload and Explore the best videos crafted by creators like you.
          </p>
          <Link
            href="/upload"
            className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white font-semibold py-3 px-8 rounded-full transition-transform duration-300 transform hover:scale-105 shadow-lg"
          >
            🚀 Upload Your Video
          </Link>
        </div>
      </section>

      {/* Video Feed Section */}
      <section className="relative z-10 py-20 px-6 sm:px-12 lg:px-24 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold mb-10 text-center text-white tracking-tight animate-fade-up">
          🎬 Explore <span className="text-purple-500">Latest Uploads</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {videos.length === 0 ? (
            <div className="col-span-full flex justify-center items-center py-16">
              <p className="text-gray-500 text-lg italic animate-pulse">
                No videos yet. Be the first to upload!
              </p>
            </div>
          ) : (
            videos.map((video) => (
              <div
                key={video._id?.toString()}
                className="rounded-xl overflow-hidden bg-[#1c1c1e] border border-white/10 shadow-md hover:shadow-purple-600/20 transition-all duration-300 transform hover:scale-105 animate-fade-in"
              >
                <VideoComponent video={video} />
              </div>
            ))
          )}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-gradient-to-t from-black via-[#121212] to-[#1f1f1f] py-20 px-6 sm:px-12 lg:px-24">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <h3 className="text-3xl sm:text-4xl font-bold mb-6 text-white">
            Start Building Your Audience
          </h3>
          <p className="text-lg sm:text-xl text-gray-400 mb-8">
            Whether you&apos;re a beginner or a pro, WhoTube helps your content shine. Join a community of creative minds and share your story.
          </p>
          <Link
            href="/upload"
            className="inline-block bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-full transition-transform duration-300 transform hover:scale-105 shadow-xl"
          >
            ✨ Upload Now
          </Link>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-black border-t border-white/10 text-center py-8 text-sm text-gray-500">
        &copy; {new Date().getFullYear()} WhoTube. All rights reserved.
      </footer>
    </main>
  );
}
