import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from "react";
import axios from "axios";
import { User } from "@/types";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 🔗 BACKEND URL
const API = axios.create({
  baseURL: "${API_BASE_URL}/api"
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /* -------------------- LOAD USER FROM TOKEN -------------------- */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  /* -------------------- REGISTER -------------------- */
  const signup = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      await API.post("/auth/register", {
        name,
        email,
        password
      });

      toast.success("Registration successful. Please login.");
      return true;
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Registration failed"
      );
      return false;
    }
  };

  /* -------------------- LOGIN -------------------- */
  const login = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const res = await API.post("/auth/login", {
        email,
        password
      });

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setUser(user);
      toast.success("Login successful");
      return true;
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Login failed"
      );
      return false;
    }
  };

  /* -------------------- LOGOUT -------------------- */
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    toast.success("Logged out");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* -------------------- HOOK -------------------- */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
