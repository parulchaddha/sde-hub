import { Article, FeedResponse, User } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("sde_hub_token");
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(err.detail || "Request failed");
  }
  return res.json();
}

// Auth
export const authApi = {
  signup: (email: string, password: string, name: string) =>
    request<{ access_token: string }>("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    }),

  login: (email: string, password: string) =>
    request<{ access_token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  me: () => request<User>("/auth/me"),

  onboarding: (level: string, preferred_topics: string[]) =>
    request<User>("/auth/onboarding", {
      method: "PUT",
      body: JSON.stringify({ level, preferred_topics }),
    }),
};

// Articles
export const articlesApi = {
  feed: (params: {
    level?: string;
    type?: string;
    topic?: string;
    category?: string;
    sort?: string;
    page?: number;
    page_size?: number;
  }) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== "") qs.set(k, String(v));
    });
    return request<FeedResponse>(`/articles/feed?${qs}`);
  },

  get: (id: number) => request<Article>(`/articles/${id}`),

  triggerPoll: () => request<{ new_articles: number; message: string }>("/articles/admin/trigger-poll", { method: "POST" }),
};

// Bookmarks
export const bookmarksApi = {
  list: () => request<Article[]>("/bookmarks/"),
  add: (articleId: number) => request<{ message: string }>(`/bookmarks/${articleId}`, { method: "POST" }),
  remove: (articleId: number) => request<{ message: string }>(`/bookmarks/${articleId}`, { method: "DELETE" }),
};
