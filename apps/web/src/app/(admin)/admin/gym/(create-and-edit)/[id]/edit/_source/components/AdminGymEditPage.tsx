"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useSuspenseGym } from "#/src/hooks/queries/use-gyms";
import AdminGymForm from "../../../../_source/components/AdminGymForm";
import { Button } from "#/src/components/ui/button";

type AdminGymEditPageProps = {
  gymId: string;
};

const AdminGymEditPage: React.FC<AdminGymEditPageProps> = ({ gymId }) => {
  const router = useRouter();

  // TanStack Query Suspense로 데이터 조회
  const { data: initialData } = useSuspenseGym(gymId);

  return (
    <div className="space-y-6">
      {/* 상단 섹션 */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">암장 수정</h1>
      </div>

      {/* 폼 */}
      <AdminGymForm mode="edit" initialData={initialData} />
    </div>
  );
};

export default AdminGymEditPage;
