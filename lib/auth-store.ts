import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  hasHydrated: boolean;
  setAuth: (user: User, token: string, refreshToken?: string) => void;
  updateTokens: (token: string, refreshToken: string) => void;
  clearAuth: () => void;
  setHasHydrated: (v: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      hasHydrated: false,
      setAuth: (user, token, refreshToken) =>
        set({ user, token, refreshToken: refreshToken ?? null }),
      updateTokens: (token, refreshToken) =>
        set({ token, refreshToken }),
      clearAuth: () =>
        set({ user: null, token: null, refreshToken: null }),
      setHasHydrated: (v) => set({ hasHydrated: v }),
    }),
    {
      name: "dejimaru-auth",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
