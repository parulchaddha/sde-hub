"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { articlesApi } from "@/lib/api";
import { Article, CategoryTab, FeedResponse, LevelFilter, SortOption, TypeFilter } from "@/types";
import ArticleCard from "@/components/ArticleCard";
import FeedFilters from "@/components/FeedFilters";
import { Loader2, RefreshCw, Inbox, AlertCircle, Cpu, Layers } from "lucide-react";
import { authApi } from "@/lib/api";
import { isLoggedIn } from "@/lib/auth";

export default function FeedPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [polling, setPolling] = useState(false);

  const [category, setCategory] = useState<CategoryTab>("engineering");
  const [level, setLevel] = useState<LevelFilter>("");
  const [contentType, setContentType] = useState<TypeFilter>("");
  const [sort, setSort] = useState<SortOption>("recent");

  const isFirstLoad = useRef(true);

  const loadFeed = useCallback(async (reset = false) => {
    setLoading(true);
    setError("");
    const currentPage = reset ? 1 : page;
    try {
      const data = await articlesApi.feed({
        category,
        level: level || undefined,
        type: category === "ai" ? undefined : (contentType || undefined),
        sort,
        page: currentPage,
        page_size: 20,
      });
      if (reset) {
        setArticles(data.articles);
        setPage(2);
      } else {
        setArticles((prev) => [...prev, ...data.articles]);
        setPage((p) => p + 1);
      }
      setHasMore(data.has_more);
    } catch (e: any) {
      setError(e.message || "Failed to load articles");
    } finally {
      setLoading(false);
    }
  // category must be in deps — without it, switching tabs with no other filter changes
  // causes a stale closure that calls the API with the previous category value
  }, [category, level, contentType, sort, page]);

  // Reset on filter change
  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      loadFeed(true);
    } else {
      loadFeed(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, level, contentType, sort]);

  // Prefill level from user profile
  useEffect(() => {
    if (isLoggedIn()) {
      authApi.me().then((u) => {
        if (u.level && !level) setLevel(u.level as LevelFilter);
      }).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function triggerPoll() {
    setPolling(true);
    try {
      const res = await articlesApi.triggerPoll();
      if (res.new_articles > 0) loadFeed(true);
    } catch {
      // ignore
    } finally {
      setPolling(false);
    }
  }

  function handleBookmarkChange(id: number, bookmarked: boolean) {
    setArticles((prev) => prev.map((a) => a.id === id ? { ...a, is_bookmarked: bookmarked } : a));
  }

  function handleCategoryChange(c: CategoryTab) {
    setCategory(c);
    setContentType("");
    setLevel("");
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Tab switcher */}
      <div className="flex items-center gap-1 mb-5 bg-white border border-slate-200 rounded-xl p-1 w-fit">
        <button
          onClick={() => handleCategoryChange("engineering")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            category === "engineering"
              ? "bg-indigo-600 text-white shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <Layers size={15} />
          Engineering
        </button>
        <button
          onClick={() => handleCategoryChange("ai")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            category === "ai"
              ? "bg-amber-500 text-white shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <Cpu size={15} />
          AI Updates
          <span className="ml-0.5 px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full leading-none">
            NEW
          </span>
        </button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar filters */}
        <aside className="hidden md:block w-60 flex-shrink-0">
          <div className="sticky top-20">
            <FeedFilters
              level={level}
              contentType={contentType}
              sort={sort}
              hideTypeFilter={category === "ai"}
              onLevelChange={(v) => setLevel(v)}
              onTypeChange={(v) => setContentType(v)}
              onSortChange={(v) => setSort(v)}
            />
            <button
              onClick={triggerPoll}
              disabled={polling}
              className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={13} className={polling ? "animate-spin" : ""} />
              {polling ? "Fetching…" : "Refresh feed"}
            </button>
          </div>
        </aside>

        {/* Feed */}
        <div className="flex-1 min-w-0">
          {/* Mobile filters */}
          <div className="md:hidden mb-4">
            <FeedFilters
              level={level}
              contentType={contentType}
              sort={sort}
              hideTypeFilter={category === "ai"}
              onLevelChange={setLevel}
              onTypeChange={setContentType}
              onSortChange={setSort}
            />
          </div>

          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm mb-4">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {articles.length === 0 && !loading && (
            <div className="text-center py-24 text-slate-400">
              <Inbox size={40} className="mx-auto mb-4 opacity-40" />
              <p className="font-medium text-slate-500">No articles yet</p>
              <p className="text-sm mt-1">Click &ldquo;Refresh feed&rdquo; to pull the latest articles</p>
            </div>
          )}

          <div className="space-y-3">
            {articles.map((a) => (
              <ArticleCard key={a.id} article={a} onBookmarkChange={handleBookmarkChange} />
            ))}
          </div>

          {loading && (
            <div className="flex justify-center py-10">
              <Loader2 size={24} className="animate-spin text-indigo-400" />
            </div>
          )}

          {hasMore && !loading && articles.length > 0 && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => loadFeed(false)}
                className="px-6 py-2.5 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 font-medium text-sm transition-colors"
              >
                Load more
              </button>
            </div>
          )}

          {!hasMore && articles.length > 0 && (
            <p className="text-center text-sm text-slate-400 mt-8 py-4 border-t border-slate-100">
              You&apos;re all caught up ✓
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
