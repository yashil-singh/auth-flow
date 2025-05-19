import type { User } from "@/services/auth/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type AuthState = {
  isLoading: boolean;
  isAuthenticated: boolean;
  accessToken?: string | null;
  user?: User | null;
  verificationResendOn?: string | null;
};

type AuthActions = {
  loginUser: (user: User, accessToken: string) => void;
  setUser: (user: User) => void;
  setAccessToken: (accessToken: string) => void;
  setIsLoading: (loading: boolean) => void;
  logoutUser: () => void;
  setVerificationResendOn: (on: Date | null) => void;
};

const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      isLoading: true,
      accessToken: null,
      user: null,
      verificationResendOn: null,
      setIsLoading: (loading: boolean) =>
        set(() => ({
          isLoading: loading,
        })),
      loginUser: (user: User, accessToken: string) =>
        set(() => ({
          isLoading: false,
          isAuthenticated: true,
          accessToken,
          user,
        })),
      setUser(user) {
        set(() => ({
          user,
          isLoading: false,
          isAuthenticated: true,
        }));
      },
      setAccessToken(accessToken) {
        set(() => ({
          accessToken,
          isLoading: false,
          isAuthenticated: true,
        }));
      },
      logoutUser: () =>
        set(() => ({
          isLoading: false,
          isAuthenticated: false,
          accessToken: null,
          user: null,
        })),
      setVerificationResendOn(verificationResendOn) {
        set(() => ({
          verificationResendOn: verificationResendOn?.toString(),
        }));
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        verificationResendOn: state.verificationResendOn,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setIsLoading(false);
      },
    }
  )
);

export const selectAccessToken = (state: AuthState) => state.accessToken;
export const selectIsLoading = (state: AuthState) => state.isLoading;
export const selectIsAuthenticated = (state: AuthState) =>
  state.isAuthenticated;
export const selectUser = (state: AuthState) => state.user;

export default useAuthStore;
