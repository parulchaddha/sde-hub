"use client";

import { LevelFilter, SortOption, TypeFilter } from "@/types";
import { TrendingUp, Clock, Info } from "lucide-react";

interface Props {
  level: LevelFilter;
  contentType: TypeFilter;
  sort: SortOption;
  hideTypeFilter?: boolean;
  onLevelChange: (v: LevelFilter) => void;
  onTypeChange: (v: TypeFilter) => void;
  onSortChange: (v: SortOption) => void;
}

const levels: { value: LevelFilter; label: string; color: string }[] = [
  { value: "", label: "All levels", color: "bg-slate-100 text-slate-600 border-slate-200" },
  { value: "SDE-1", label: "SDE-1", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { value: "SDE-2", label: "SDE-2", color: "bg-blue-50 text-blue-700 border-blue-200" },
  { value: "SDE-3", label: "SDE-3", color: "bg-purple-50 text-purple-700 border-purple-200" },
];

const types: { value: TypeFilter; label: string }[] = [
  { value: "", label: "All types" },
  { value: "LLD", label: "LLD" },
  { value: "HLD", label: "HLD" },
  { value: "Both", label: "Both" },
];

export default function FeedFilters({ level, contentType, sort, hideTypeFilter = false, onLevelChange, onTypeChange, onSortChange }: Props) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-4">
      {/* Sort */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Sort by</p>
        <div className="flex gap-2">
          <button
            onClick={() => onSortChange("recent")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
              sort === "recent"
                ? "bg-indigo-600 text-white border-indigo-600"
                : "border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600"
            }`}
          >
            <Clock size={13} />
            Recent
          </button>
          <button
            onClick={() => onSortChange("trending")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
              sort === "trending"
                ? "bg-indigo-600 text-white border-indigo-600"
                : "border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600"
            }`}
          >
            <TrendingUp size={13} />
            Trending
          </button>
        </div>
        {sort === "trending" && (
          <p className="mt-2 flex items-start gap-1 text-[11px] text-slate-400 leading-snug">
            <Info size={11} className="mt-0.5 flex-shrink-0" />
            Top articles from the last 7 days, ranked by saves (3×) + views
          </p>
        )}
      </div>

      {/* Level */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Level</p>
        <div className="flex flex-wrap gap-2">
          {levels.map((l) => (
            <button
              key={l.value}
              onClick={() => onLevelChange(l.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                level === l.value
                  ? l.color + " ring-2 ring-offset-1 ring-indigo-400"
                  : "border-slate-200 text-slate-500 hover:border-slate-300 bg-white"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content type — hidden on AI tab */}
      {!hideTypeFilter && (
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Type</p>
          <div className="flex flex-wrap gap-2">
            {types.map((t) => (
              <button
                key={t.value}
                onClick={() => onTypeChange(t.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  contentType === t.value
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-600 bg-white"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
