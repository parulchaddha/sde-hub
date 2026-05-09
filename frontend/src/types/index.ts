export interface User {
  id: number;
  email: string;
  name: string | null;
  level: "SDE-1" | "SDE-2" | "SDE-3";
  preferred_topics: string[];
}

export interface Article {
  id: number;
  title: string;
  url: string;
  source: string;
  author: string | null;
  summary: string | null;
  thumbnail_url: string | null;
  content_type: "LLD" | "HLD" | "Both" | "AI";
  level: "SDE-1" | "SDE-2" | "SDE-3";
  topics: string[];
  category: "engineering" | "ai";
  trending_score: number;
  view_count: number;
  save_count: number;
  published_at: string | null;
  is_bookmarked: boolean;
}

export type CategoryTab = "engineering" | "ai";

export interface FeedResponse {
  articles: Article[];
  total: number;
  page: number;
  page_size: number;
  has_more: boolean;
}

export type SortOption = "recent" | "trending";
export type LevelFilter = "SDE-1" | "SDE-2" | "SDE-3" | "";
export type TypeFilter = "LLD" | "HLD" | "Both" | "";
