"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { articlesApi, bookmarksApi } from "@/lib/api";
import { Article } from "@/types";
import { LevelBadge, TypeBadge } from "@/components/LevelBadge";
import { Bookmark, BookmarkCheck, ExternalLink, ArrowLeft, Loader2, Clock } from "lucide-react";
import { isLoggedIn } from "@/lib/auth";
import Link from "next/link";

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return days < 30 ? `${days}d ago` : new Date(dateStr).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default function ArticlePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  useEffect(() => {
    articlesApi.get(Number(id)).then((a) => {
      setArticle(a);
      setBookmarked(a.is_bookmarked);
    }).catch(() => router.push("/feed")).finally(() => setLoading(false));
  }, [id, router]);

  async function toggleBookmark() {
    if (!isLoggedIn()) { router.push("/login"); return; }
    setBookmarkLoading(true);
    try {
      if (bookmarked) {
        await bookmarksApi.remove(Number(id));
        setBookmarked(false);
      } else {
        await bookmarksApi.add(Number(id));
        setBookmarked(true);
      }
    } catch {} finally {
      setBookmarkLoading(false);
    }
  }

  if (loading) return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <Loader2 size={28} className="animate-spin text-indigo-400" />
    </div>
  );

  if (!article) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link href="/feed" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 mb-6 transition-colors">
        <ArrowLeft size={15} />
        Back to feed
      </Link>

      <article className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
        {/* Source + time */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
          <span className="font-semibold text-slate-500">{article.source}</span>
          {article.author && <><span>·</span><span>{article.author}</span></>}
          {article.published_at && (
            <><span>·</span>
            <span className="flex items-center gap-0.5"><Clock size={11} />{timeAgo(article.published_at)}</span></>
          )}
        </div>

        <h1 className="text-2xl font-bold text-slate-900 leading-snug mb-4">{article.title}</h1>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-6">
          <LevelBadge level={article.level} />
          <TypeBadge type={article.content_type} />
          {article.topics.map((t) => (
            <span key={t} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded border border-slate-200">{t}</span>
          ))}
        </div>

        {article.thumbnail_url && (
          <img
            src={article.thumbnail_url}
            alt={article.title}
            className="w-full h-52 object-cover rounded-xl mb-6 bg-slate-100"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        )}

        {/* Summary */}
        {article.summary && (
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5 mb-6">
            <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wide mb-2">AI Summary</p>
            <p className="text-slate-700 leading-relaxed text-sm">{article.summary}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
          >
            <ExternalLink size={16} />
            Read full article
          </a>
          <button
            onClick={toggleBookmark}
            disabled={bookmarkLoading}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-medium text-sm transition-all ${
              bookmarked
                ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                : "border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600"
            }`}
          >
            {bookmarkLoading
              ? <Loader2 size={15} className="animate-spin" />
              : bookmarked ? <BookmarkCheck size={15} /> : <Bookmark size={15} />
            }
            {bookmarked ? "Saved" : "Save"}
          </button>
        </div>
      </article>
    </div>
  );
}
