import { useAuthStore } from "./auth-store";

export async function authFetch(input: string, init: RequestInit = {}): Promise<Response> {
  const { token, refreshToken, updateTokens, clearAuth } = useAuthStore.getState();

  const withAuth = (t: string | null): RequestInit => ({
    ...init,
    headers: {
      ...(init.headers as Record<string, string> | undefined),
      ...(t ? { Authorization: `Bearer ${t}` } : {}),
    },
  });

  let res = await fetch(input, withAuth(token));
  if (res.status !== 401) return res;
  if (!refreshToken) {
    clearAuth();
    return res;
  }

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
  if (!refreshData.token) {
    clearAuth();
    return res;
  }

  updateTokens(refreshData.token, refreshData.refresh_token ?? refreshToken);
  res = await fetch(input, withAuth(refreshData.token));
  return res;
}
