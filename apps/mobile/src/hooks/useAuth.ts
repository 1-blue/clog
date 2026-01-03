import { useEffect, useState } from "react";
import {
  supabase,
  getCurrentUser,
  getSession,
  type User,
  type Session,
} from "@clog/db";

/**
 * 현재 로그인한 사용자 정보를 가져오는 Hook (Mobile)
 */
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 초기 사용자 정보 가져오기
    const initAuth = async () => {
      try {
        const [userData, sessionData] = await Promise.all([
          getCurrentUser(),
          getSession(),
        ]);
        setUser(userData);
        setSession(sessionData);
      } catch {
        setUser(null);
        setSession(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // 인증 상태 변경 감지
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
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
