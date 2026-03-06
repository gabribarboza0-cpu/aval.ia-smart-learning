import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export type UserRole = "aluno" | "professor" | "coordenador" | "admin";

export interface AppUser {
  email: string;
  role: UserRole;
  name: string;
}

export function useAuth() {
  const navigate = useNavigate();
  const location = useLocation();

  const getUser = (): AppUser | null => {
    try {
      const raw = localStorage.getItem("avalia_user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  const user = getUser();

  const logout = () => {
    localStorage.removeItem("avalia_user");
    navigate("/login");
  };

  useEffect(() => {
    if (!user && location.pathname !== "/login") {
      navigate("/login");
    }
  }, [user, location.pathname, navigate]);

  return { user, logout };
}
