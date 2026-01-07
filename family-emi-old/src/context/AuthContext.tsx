"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

interface User {
  id: string;
  name: string;
  email: string;
  mobileNumber: string;
  created_at?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    mobileNumber: string,
    pin: string
  ) => Promise<{ success: boolean; error?: string }>;
  register: (userData: {
    name: string;
    email: string;
    mobileNumber: string;
    pin: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  isAuthModalOpen: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("family_emi_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("family_emi_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(
    async (
      mobileNumber: string,
      pin: string
    ): Promise<{ success: boolean; error?: string }> => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mobileNumber, pin }),
        });

        const data = await res.json();

        if (data.success && data.user) {
          setUser(data.user);
          localStorage.setItem("family_emi_user", JSON.stringify(data.user));
          setIsAuthModalOpen(false);
          return { success: true };
        }

        return { success: false, error: data.error || "Login failed" };
      } catch (error) {
        console.error("Login error:", error);
        return { success: false, error: "Network error. Please try again." };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const register = useCallback(
    async (userData: {
      name: string;
      email: string;
      mobileNumber: string;
      pin: string;
    }): Promise<{ success: boolean; error?: string }> => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        });

        const data = await res.json();

        if (data.success && data.user) {
          setUser(data.user);
          localStorage.setItem("family_emi_user", JSON.stringify(data.user));
          setIsAuthModalOpen(false);
          return { success: true };
        }

        return { success: false, error: data.error || "Registration failed" };
      } catch (error) {
        console.error("Register error:", error);
        return { success: false, error: "Network error. Please try again." };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("family_emi_user");
  }, []);

  const openAuthModal = useCallback(() => setIsAuthModalOpen(true), []);
  const closeAuthModal = useCallback(() => setIsAuthModalOpen(false), []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        openAuthModal,
        closeAuthModal,
        isAuthModalOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
