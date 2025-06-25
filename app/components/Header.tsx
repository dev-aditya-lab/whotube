"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Home, User } from "lucide-react";
import { useNotification } from "./Notification";

export default function Header() {
  const { data: session } = useSession();
  const { showNotification } = useNotification();

  const handleSignOut = async () => {
    try {
      await signOut();
      showNotification("Signed out successfully", "success");
    } catch {
      showNotification("Failed to sign out", "error");
    }
  };

  return (
    <header className="bg-[#0f0f0f] text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <Link
            href="/"
            className="flex items-center gap-3 text-lg sm:text-xl font-bold text-white hover:text-cyan-400 transition duration-200"
            onClick={() =>
              showNotification("Welcome to ImageKit ReelsPro", "info")
            }
          >
            <Home className="w-5 h-5" />
            <span className="hidden sm:inline">WhoTube</span>
          </Link>

          {/* Right section */}
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <button
                tabIndex={0}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1c1c1c] hover:bg-[#2d2d2d] transition duration-200"
              >
                <User className="w-5 h-5 text-white" />
              </button>

              {/* Dropdown */}
              <ul className="absolute right-0 mt-3 w-64 bg-[#1a1a1a] text-white border border-white/10 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300 z-50">
                {session ? (
                  <>
                    <li className="px-4 py-3 border-b border-white/10 text-sm text-gray-400">
                      {session.user?.email?.split("@")[0]}
                    </li>
                    <li>
                      <Link
                        href="/upload"
                        className="block px-4 py-3 hover:bg-[#2d2d2d] text-white"
                        onClick={() =>
                          showNotification("Welcome to Admin Dashboard", "info")
                        }
                      >
                        📤 Upload Video
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-3 text-red-500 hover:bg-[#2d2d2d]"
                      >
                        🚪 Sign Out
                      </button>
                    </li>
                  </>
                ) : (
                  <li>
                    <Link
                      href="/login"
                      className="block px-4 py-3 hover:bg-[#2d2d2d] text-white"
                      onClick={() =>
                        showNotification("Please sign in to continue", "info")
                      }
                    >
                      🔐 Login
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}