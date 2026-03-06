import { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export type UserRole = "aluno" | "professor" | "coordenador" | "admin";

export interface AppUser {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

export function useAuth() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  const buildAppUser = useCallback(async (authUser: User): Promise<AppUser | null> => {
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("nome")
        .eq("user_id", authUser.id)
        .single();

      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", authUser.id)
        .single();

      return {
        id: authUser.id,
        email: authUser.email || "",
        name: profile?.nome || authUser.email || "",
        role: (roleData?.role as UserRole) || "aluno",
      };
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const appUser = await buildAppUser(session.user);
          setUser(appUser);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const appUser = await buildAppUser(session.user);
        setUser(appUser);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [buildAppUser]);

  useEffect(() => {
    if (!loading && !user && location.pathname !== "/login") {
      navigate("/login");
    }
  }, [user, loading, location.pathname, navigate]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate("/login");
  }, [navigate]);

  const login = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }, []);

  const signUp = useCallback(async (email: string, password: string, nome: string, role: UserRole) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nome, role },
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) throw error;
  }, []);

  return { user, loading, logout, login, signUp };
}
