const levelColors: Record<string, string> = {
  "SDE-1": "bg-emerald-100 text-emerald-700 border-emerald-200",
  "SDE-2": "bg-blue-100 text-blue-700 border-blue-200",
  "SDE-3": "bg-purple-100 text-purple-700 border-purple-200",
};

const typeColors: Record<string, string> = {
  LLD: "bg-orange-100 text-orange-700 border-orange-200",
  HLD: "bg-sky-100 text-sky-700 border-sky-200",
  Both: "bg-rose-100 text-rose-700 border-rose-200",
  AI: "bg-amber-100 text-amber-700 border-amber-200",
};

export function LevelBadge({ level }: { level: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${levelColors[level] || "bg-gray-100 text-gray-600"}`}>
      {level}
    </span>
  );
}

export function TypeBadge({ type }: { type: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${typeColors[type] || "bg-gray-100 text-gray-600"}`}>
      {type}
    </span>
  );
}
