"use client";

import Link from "next/link";
import { Bookmark, BookmarkCheck, ExternalLink, Eye, Clock } from "lucide-react";
import { Article } from "@/types";
import { LevelBadge, TypeBadge } from "./LevelBadge";
import { bookmarksApi } from "@/lib/api";
import { useState } from "react";
import { isLoggedIn } from "@/lib/auth";
import { useRouter } from "next/navigation";

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

interface Props {
  article: Article;
  onBookmarkChange?: (id: number, bookmarked: boolean) => void;
}

export default function ArticleCard({ article, onBookmarkChange }: Props) {
  const [bookmarked, setBookmarked] = useState(article.is_bookmarked);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function toggleBookmark(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn()) {
      router.push("/login");
      return;
    }
    setSaving(true);
    try {
      if (bookmarked) {
        await bookmarksApi.remove(article.id);
        setBookmarked(false);
        onBookmarkChange?.(article.id, false);
      } else {
        await bookmarksApi.add(article.id);
        setBookmarked(true);
        onBookmarkChange?.(article.id, true);
      }
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  }

  return (
    <article className="group bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md hover:border-indigo-200 transition-all duration-200">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Source + time */}
          <div className="flex items-center gap-2 mb-2 text-xs text-slate-400">
            <span className="font-medium text-slate-500">{article.source}</span>
            {article.author && <span>· {article.author}</span>}
            {article.published_at && (
              <>
                <span>·</span>
                <span className="flex items-center gap-0.5">
                  <Clock size={11} />
                  {timeAgo(article.published_at)}
                </span>
              </>
            )}
          </div>

          {/* Title */}
          <Link href={`/article/${article.id}`} className="block">
            <h2 className="text-base font-semibold text-slate-800 group-hover:text-indigo-700 leading-snug line-clamp-2 transition-colors">
              {article.title}
            </h2>
          </Link>

          {/* Summary */}
          {article.summary && (
            <p className="mt-1.5 text-sm text-slate-500 line-clamp-2 leading-relaxed">
              {article.summary}
            </p>
          )}

          {/* Tags row */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <LevelBadge level={article.level} />
            <TypeBadge type={article.content_type} />
            {article.topics.slice(0, 2).map((t) => (
              <span key={t} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded border border-slate-200">
                {t}
              </span>
            ))}
            {article.category === "ai" && (
              <span className="ml-auto px-2 py-0.5 bg-amber-50 text-amber-600 text-xs rounded border border-amber-200 font-semibold">
                ✦ AI
              </span>
            )}
          </div>
        </div>

        {/* Thumbnail */}
        {article.thumbnail_url && (
          <img
            src={article.thumbnail_url}
            alt=""
            className="w-20 h-16 object-cover rounded-lg flex-shrink-0 bg-slate-100"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        )}
      </div>

      {/* Footer */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Eye size={13} />
            {article.view_count.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <Bookmark size={13} />
            {article.save_count.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleBookmark}
            disabled={saving}
            className={`p-1.5 rounded-lg transition-colors ${
              bookmarked
                ? "text-indigo-600 bg-indigo-50 hover:bg-indigo-100"
                : "text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
            }`}
            title={bookmarked ? "Remove bookmark" : "Save article"}
          >
            {bookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
          </button>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
            title="Open original"
          >
            <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </article>
  );
}
