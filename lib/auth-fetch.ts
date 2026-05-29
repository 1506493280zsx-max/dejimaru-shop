import { useAuthStore } from "./auth-store";

export async function authFetch(input: string, init: RequestInit = {}): Promise<Response> {
  const { token, refreshToken, setAuth, clearAuth, user } = useAuthStore.getState();

  const withAuth = (t: string): RequestInit => ({
    ...init,
    headers: {
      ...(init.headers as Record<string, string> | undefined),
      Authorization: `Bearer ${t}`,
    },
  });

  const res = await fetch(input, withAuth(token ?? ""));
  if (res.status !== 401 || !refreshToken) return res;

  const refreshRes = await fetch("/api/auth/refresh", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!refreshRes.ok) {
    clearAuth();
    return res;
  }

  const refreshData = await refreshRes.json();
  if (!refreshData.token || !user) {
    clearAuth();
    return res;
  }

  setAuth(user, refreshData.token, refreshData.refresh_token ?? refreshToken);
  return fetch(input, withAuth(refreshData.token));
}
