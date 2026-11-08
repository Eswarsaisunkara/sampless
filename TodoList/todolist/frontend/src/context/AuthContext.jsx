import { createContext, useContext, useEffect, useState } from "react";
import api from "../utils/apiClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("studyos:session"));
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const onStorage = () => {
      try {
        setSession(JSON.parse(localStorage.getItem("studyos:session")));
      } catch {
        setSession(null);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const saveSession = (s) => {
    localStorage.setItem("studyos:session", JSON.stringify(s));
    setSession(s);
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/register", payload);
      const s = { token: res.data.token, user: res.data.user };
      saveSession(s);
      return s;
    } finally {
      setLoading(false);
    }
  };

  const login = async (payload) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", payload);
      const s = { token: res.data.token, user: res.data.user };
      saveSession(s);
      return s;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("studyos:session");
    setSession(null);
  };

  const forgotPassword = (payload) => api.post("/auth/forgot-password", payload).then((r) => r.data);
  const resetPassword = (payload) => api.post("/auth/reset-password", payload).then((r) => r.data);
  const changePassword = (payload) => api.put("/auth/change-password", payload).then((r) => r.data);

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user,
        isAuthenticated: !!session,
        loading,
        register,
        login,
        logout,
        forgotPassword,
        resetPassword,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
