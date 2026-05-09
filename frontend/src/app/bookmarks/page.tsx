"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { bookmarksApi } from "@/lib/api";
import { Article } from "@/types";
import ArticleCard from "@/components/ArticleCard";
import { BookMarked, Loader2, Inbox } from "lucide-react";
import { isLoggedIn } from "@/lib/auth";

export default function BookmarksPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoggedIn()) { router.replace("/login"); return; }
    bookmarksApi.list()
      .then(setArticles)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [router]);

  function handleBookmarkChange(id: number, bookmarked: boolean) {
    if (!bookmarked) setArticles((prev) => prev.filter((a) => a.id !== id));
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <BookMarked size={22} className="text-indigo-600" />
        <h1 className="text-xl font-bold text-slate-800">Saved articles</h1>
        {articles.length > 0 && (
          <span className="ml-auto text-sm text-slate-400">{articles.length} saved</span>
        )}
      </div>

      {loading && (
        <div className="flex justify-center py-20">
          <Loader2 size={24} className="animate-spin text-indigo-400" />
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">{error}</div>
      )}

      {!loading && articles.length === 0 && (
        <div className="text-center py-24 text-slate-400">
          <Inbox size={40} className="mx-auto mb-4 opacity-40" />
          <p className="font-medium text-slate-500">No saved articles</p>
          <p className="text-sm mt-1">Bookmark articles from your feed to find them here</p>
        </div>
      )}

      <div className="space-y-3">
        {articles.map((a) => (
          <ArticleCard key={a.id} article={a} onBookmarkChange={handleBookmarkChange} />
        ))}
      </div>
    </div>
  );
}
