"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import AdminGymForm from "../../../_source/components/AdminGymForm";
import { Button } from "#/src/components/ui/button";

const AdminGymCreatePage: React.FC = () => {
  const router = useRouter();

  return (
    <div className="space-y-6">
      {/* 상단 섹션 */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">암장 추가</h1>
      </div>

      {/* 폼 */}
      <AdminGymForm mode="create" />
    </div>
  );
};

export default AdminGymCreatePage;
