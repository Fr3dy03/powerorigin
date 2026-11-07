export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

export function apiUrl(path: string) {
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function authHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("po_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}