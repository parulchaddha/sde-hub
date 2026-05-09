"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { BookMarked, Rss, LogOut, User } from "lucide-react";
import { clearToken, isLoggedIn } from "@/lib/auth";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(isLoggedIn());
  }, [pathname]);

  function handleLogout() {
    clearToken();
    router.push("/login");
  }

  const linkClass = (href: string) =>
    `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
      pathname === href
        ? "bg-indigo-100 text-indigo-700"
        : "text-slate-600 hover:text-indigo-600 hover:bg-slate-100"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-indigo-700 text-lg tracking-tight">
          <Rss size={20} />
          SDE Hub
        </Link>

        <nav className="flex items-center gap-1">
          {loggedIn ? (
            <>
              <Link href="/feed" className={linkClass("/feed")}>
                Feed
              </Link>
              <Link href="/bookmarks" className={linkClass("/bookmarks")}>
                <BookMarked size={15} />
                Saved
              </Link>
              <button onClick={handleLogout} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-500 hover:text-red-500 hover:bg-red-50 transition-colors ml-1">
                <LogOut size={15} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className={linkClass("/login")}>
                Log in
              </Link>
              <Link href="/signup" className="ml-1 px-4 py-1.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
