"use client";
import {
  createContext,
  ReactNode,
  useState,
  useContext,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import Cookies from "js-cookie";

interface User {
  id: string;
  userName: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  login: (userData: User, token: string) => void;
  logout: () => void;
  loading: boolean;
}

const initialValue: AuthContextType = {
  isAuthenticated: false,
  user: null,
  setUser: () => {},
  login: () => {},
  logout: () => {},
  loading: true,
};

export const AuthContext = createContext<AuthContextType>(initialValue);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    const initializeAuth = async () => {
      const token = Cookies.get("access_token");
      const localUser = localStorage.getItem("user");

      if (token && localUser) {
        try {
          const userData = JSON.parse(localUser);
          setUser(userData);
        } catch {
          localStorage.removeItem("user");
          Cookies.remove("access_token");
          setUser(null);
        }
      } else if (token && !localUser) {
        // Token exists but no user data - token might be stale, clear it
        console.log("⚠️ Token found but no user data - clearing stale token");
        Cookies.remove("access_token");
        setUser(null);
      } else {
        setUser(null);
      }

      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = useCallback((userData: User, token: string) => {
    try {
      localStorage.setItem("user", JSON.stringify(userData));
      Cookies.set("access_token", token, { expires: 7 });
      setUser(userData);
    } catch (error) {
      console.error("AuthContext: Error storing data:", error);
    }
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem("user");
      Cookies.remove("access_token");
    } catch (error) {
      console.error("AuthContext: Error clearing storage:", error);
    }
    setUser(null);
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      isAuthenticated,
      setUser,
      user,
      login,
      logout,
      loading,
    }),
    [isAuthenticated, user, login, logout, loading]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
