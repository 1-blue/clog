"use client";

import { Database, supabase } from "@clog/db";
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

  return (
    <div className="px-4 text-2xl font-bold text-blue-500">
      PageComponent {gyms.map((gym) => gym.name).join(", ")}
    </div>
  );
};

export default PageComponent;
