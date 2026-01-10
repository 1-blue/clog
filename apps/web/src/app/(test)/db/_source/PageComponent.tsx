"use client";

import { useMe } from "#/src/hooks/useMe";
import { Database } from "@clog/db";
import { supabase } from "@clog/db/web";
import { signOut } from "@clog/db/web";
import { useState } from "react";
import { useEffect } from "react";

const PageComponent: React.FC = () => {
  const [gyms, setGyms] = useState<
    Database["public"]["Tables"]["gyms"]["Row"][]
  >([]);

  useEffect(() => {
    const getGyms = async () => {
      const { data, error } = await supabase.from("gyms").select("*");

      if (error) {
        console.error(error);
      }

      setGyms(data ?? []);
    };
    getGyms();
  }, []);

  const { me } = useMe();

  console.log("🐬 me >> ", me);

  return (
    <div className="px-4">
      <div className="text-2xl font-bold text-blue-500">
        Profile: {me?.nickname || "No profile"}
      </div>
      <div className="text-2xl font-bold text-blue-500">
        PageComponent {gyms.map((gym) => gym.name).join(", ")}
      </div>

      <button
        type="button"
        onClick={() => signOut()}
        className="cursor-pointer"
      >
        Logout
      </button>
    </div>
  );
};

export default PageComponent;
