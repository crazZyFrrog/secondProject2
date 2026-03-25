import type { Project } from "@/types";

const envUrl = (import.meta.env.VITE_API_URL ?? "").trim();
/** Dev: тот же origin + proxy (без CORS). Prod / e2e с отдельным API: задайте VITE_API_URL. */
const base =
  envUrl || (import.meta.env.DEV ? "/api" : "http://localhost:8000");

export function getToken(): string | null {
  return localStorage.getItem("token");
}

export function setToken(t: string | null) {
  if (t) localStorage.setItem("token", t);
  else localStorage.removeItem("token");
}

async function request<T>(
  path: string,
  init: RequestInit & { json?: unknown } = {},
): Promise<T> {
  const headers: Record<string, string> = {
    ...(init.headers as Record<string, string>),
  };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  let body: BodyInit | undefined = init.body as BodyInit | undefined;
  if (init.json !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(init.json);
  }
  const res = await fetch(`${base}${path}`, { ...init, headers, body });
  if (!res.ok) {
    let detail = res.statusText;
    try {
      const j = await res.json();
      if (j?.detail) detail = typeof j.detail === "string" ? j.detail : JSON.stringify(j.detail);
    } catch {
      /* ignore */
    }
    throw new Error(detail);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  register: (email: string, password: string) =>
    request<{ access_token: string }>("/auth/register", {
      method: "POST",
      json: { email, password },
    }),
  login: (email: string, password: string) =>
    request<{ access_token: string }>("/auth/login", {
      method: "POST",
      json: { email, password },
    }),
  me: () => request<{ id: number; email: string }>("/users/me"),
  patchMe: (email: string) =>
    request<{ id: number; email: string }>("/users/me", {
      method: "PATCH",
      json: { email },
    }),
  projects: () => request<Project[]>("/projects"),
  project: (id: number) => request<Project>(`/projects/${id}`),
  createProject: (name: string) =>
    request<Project>("/projects", {
      method: "POST",
      json: { name },
    }),
  updateProject: (id: number, body: { name?: string; content?: object }) =>
    request<Project>(`/projects/${id}`, {
      method: "PATCH",
      json: body,
    }),
  deleteProject: (id: number) =>
    request<void>(`/projects/${id}`, { method: "DELETE" }),
  aiGenerate: (prompt: string) =>
    request<{ text: string }>("/ai/generate", {
      method: "POST",
      json: { prompt },
    }),
};
