"use client";

export function saveToken(token: string) {
  localStorage.setItem("sde_hub_token", token);
}

export function clearToken() {
  localStorage.removeItem("sde_hub_token");
}

export function getToken(): string | null {
  return localStorage.getItem("sde_hub_token");
}

export function isLoggedIn(): boolean {
  return !!getToken();
}
