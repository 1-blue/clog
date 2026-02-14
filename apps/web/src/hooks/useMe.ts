import { useEffect, useState } from "react";
import { supabase, getSession } from "@clog/db/web";
import type { Database } from "@clog/db";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export const useMe = () => {
  const [me, setMe] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // getSession()을 사용하여 쿠키 기반 세션 확인 (새로고침 후에도 작동)
        const session = await getSession();

        if (!session?.user) {
          setMe(null);
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (error) {
          console.error("🚫 Error fetching profile:", error);
          setMe(null);
        } else {
          setMe(data);
        }
      } catch (error) {
        console.error("🚫 Error in fetchProfile:", error);
        setMe(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      // 초기 로드 시에도 실행되므로 여기서도 처리
      if (session?.user) {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (error) {
          console.error("🚫 Error fetching profile on auth change:", error);
          setMe(null);
        } else {
          setMe(data);
        }
      } else {
        setMe(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    me,
    loading,
    isLoggedIn: !!me,
  };
};
