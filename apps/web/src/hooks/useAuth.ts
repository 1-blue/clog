import { useEffect, useState } from "react";
import { supabase, getCurrentUser, getSession } from "@clog/db/web";
import type { User, Session } from "@clog/db";

/**
 * 현재 로그인한 사용자 정보를 가져오는 Hook (Web)
 */
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 초기 사용자 정보 가져오기
    const initAuth = async () => {
      try {
        // 먼저 세션 확인
        const sessionData = await getSession();
        if (sessionData) {
          setSession(sessionData);
          setUser(sessionData.user);
        } else {
          // 세션이 없으면 사용자 정보만 확인
          const userData = await getCurrentUser();
          setUser(userData);
        }
      } catch {
        setUser(null);
        setSession(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("🔐 Auth state changed:", event, session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    session,
    loading,
    isAuthenticated: !!user,
  };
};
