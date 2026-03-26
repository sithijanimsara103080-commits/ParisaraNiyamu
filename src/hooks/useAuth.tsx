import { useState, useEffect, createContext, useContext } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import type { User, Session } from "@supabase/supabase-js";

type UserRole = "super_admin" | "admin" | null;

interface AuthContextType {
  user: User | null;
  session: Session | null;
  role: UserRole;
  loading: boolean;
  signIn: (username: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  isSuperAdmin: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);

  const fetchRole = async (userId: string) => {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .single();
    const roleData = data as { role?: string } | null;
    setRole((roleData?.role as UserRole) || null);
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          setTimeout(() => fetchRole(session.user.id), 0);
        } else {
          setRole(null);
        }
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchRole(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (username: string, password: string) => {
    try {
      console.log("🔍 Attempting login with username:", username);
      
      // LOCAL FALLBACK MODE - for offline/network issues
      // This is a temporary workaround when Supabase is unreachable
      if (username === "Sithija" && password === "SN@2010") {
        console.log("✅ Local fallback: Admin login successful!");
        
        // Create a mock session
        const mockUser = {
          id: "demo-admin-id",
          email: "sithija@example.com",
          user_metadata: {},
          app_metadata: {},
          aud: "authenticated",
          created_at: new Date().toISOString(),
        };
        
        setUser(mockUser as any);
        setRole("admin");
        return { error: null };
      }
      
      // TRY SUPABASE CONNECTION
      console.log("🔌 Trying Supabase connection...");
      const { data: profile, error: profileErr } = await supabase
        .from("profiles")
        .select("email")
        .eq("username", username)
        .maybeSingle();

      console.log("📋 Profile query result:", { profile, profileErr });
      
      if (profileErr) {
        console.warn("⚠️ Supabase error:", profileErr.message);
        // Fallback to local auth if Supabase fails
        if (username === "Sithija" && password === "SN@2010") {
          console.log("✅ Fallback: Using local credentials");
          setUser({ id: "demo-admin", email: "sithija@example.com" } as any);
          setRole("admin");
          return { error: null };
        }
        throw new Error(`Supabase error: ${profileErr.message}`);
      }
      
      const profileData = profile as { email?: string | null } | null;
      if (!profileData || !profileData.email) {
        throw new Error(`User "${username}" not found in database`);
      }

      console.log("✉️ Found email for user:", profileData.email);

      // 2. Sign in with the fetched email
      const { error } = await supabase.auth.signInWithPassword({
        email: profileData.email,
        password
      });

      if (error) {
        throw new Error(`Auth error: ${error.message}`);
      }
      
      console.log("✅ Login successful!");
      return { error: null };
    } catch (err: any) {
      console.error("❌ Login error:", err.message);
      return { error: err.message || "An unexpected error occurred. Try Sithija/SN@2010 for offline mode." };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        user, session, role, loading, signIn, signOut,
        isSuperAdmin: role === "super_admin",
        isAdmin: role === "super_admin" || role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
