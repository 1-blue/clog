"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { updateGymSchema, type TUpdateGym } from "@clog/contracts";

import { Badge } from "#web/components/ui/badge";
import { Button } from "#web/components/ui/button";
import { Card } from "#web/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "#web/components/ui/dialog";
import { Input } from "#web/components/ui/input";
import { Label } from "#web/components/ui/label";
import { Textarea } from "#web/components/ui/textarea";

interface IProps {
  gym: {
    id: string;
    name: string;
    address: string;
    phone: string;
    region: string;
    description: string;
    notice: string | null;
    website: string | null;
    instagramId: string | null;
    coverImageUrl: string;
    logoImageUrl: string;
    isClosed: boolean;
    closedReason: string | null;
    closedAt: Date | null;
  };
}

const GymEditPanel: React.FC<IProps> = ({ gym }) => {
  const router = useRouter();
  const [closeReason, setCloseReason] = useState("");
  const [closeOpen, setCloseOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<TUpdateGym>({
    resolver: zodResolver(updateGymSchema),
    defaultValues: {
      name: gym.name,
      address: gym.address,
      phone: gym.phone,
      description: gym.description,
      notice: gym.notice,
      website: gym.website,
      instagramId: gym.instagramId,
      coverImageUrl: gym.coverImageUrl,
      logoImageUrl: gym.logoImageUrl,
    },
  });

  const onSubmit = async (values: TUpdateGym) => {
    const res = await fetch(`/api/v1/admin/gyms/${gym.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const body = await res.json().catch(() => null);
    if (!res.ok) {
      toast.error(body?.toast ?? "수정에 실패했습니다.");
      return;
    }
    toast.success(body?.toast ?? "수정되었습니다.");
    router.refresh();
  };

  const onClose = async () => {
    if (!closeReason.trim()) {
      toast.error("폐업 사유를 입력해주세요.");
      return;
    }
    const res = await fetch(`/api/v1/admin/gyms/${gym.id}/close`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ closedReason: closeReason.trim() }),
    });
    const body = await res.json().catch(() => null);
    if (!res.ok) {
      toast.error(body?.toast ?? "폐업 처리에 실패했습니다.");
      return;
    }
    toast.success("폐업 처리되었습니다.");
    setCloseOpen(false);
    router.refresh();
  };

  const onReopen = async () => {
    const res = await fetch(`/api/v1/admin/gyms/${gym.id}/reopen`, {
      method: "POST",
    });
    const body = await res.json().catch(() => null);
    if (!res.ok) {
      toast.error(body?.toast ?? "운영 재개에 실패했습니다.");
      return;
    }
    toast.success("운영 재개되었습니다.");
    router.refresh();
  };

  return (
    <div className="flex flex-col gap-4">
      {gym.isClosed ? (
        <Card className="border-error/50 bg-error-container/30 flex items-center justify-between gap-3 p-4">
          <div className="flex items-center gap-2">
            <Badge variant="destructive">폐업</Badge>
            <span className="text-sm text-on-surface">
              {gym.closedReason ?? "사유 없음"}
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={onReopen}>
            운영 재개
          </Button>
        </Card>
      ) : (
        <Card className="flex items-center justify-between gap-3 p-4">
          <div className="text-sm text-on-surface">운영 중</div>
          <Dialog open={closeOpen} onOpenChange={setCloseOpen}>
            <DialogTrigger
              render={
                <Button variant="destructive" size="sm">
                  폐업 처리
                </Button>
              }
            />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>폐업 처리</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-2">
                <Label>폐업 사유</Label>
                <Textarea
                  rows={3}
                  value={closeReason}
                  onChange={(e) => setCloseReason(e.target.value)}
                />
              </div>
              <DialogFooter>
                <DialogClose render={<Button variant="outline">취소</Button>} />
                <Button variant="destructive" onClick={onClose}>
                  폐업 처리
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Card>
      )}

      <Card className="p-6">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          <div className="flex flex-col gap-1">
            <Label>이름</Label>
            <Input {...register("name")} />
          </div>
          <div className="flex flex-col gap-1">
            <Label>전화</Label>
            <Input {...register("phone")} />
          </div>
          <div className="flex flex-col gap-1 md:col-span-2">
            <Label>주소</Label>
            <Input {...register("address")} />
          </div>
          <div className="flex flex-col gap-1">
            <Label>커버 이미지 URL</Label>
            <Input {...register("coverImageUrl")} />
          </div>
          <div className="flex flex-col gap-1">
            <Label>로고 이미지 URL</Label>
            <Input {...register("logoImageUrl")} />
          </div>
          <div className="flex flex-col gap-1">
            <Label>웹사이트</Label>
            <Input {...register("website")} />
          </div>
          <div className="flex flex-col gap-1">
            <Label>인스타그램</Label>
            <Input {...register("instagramId")} />
          </div>
          <div className="flex flex-col gap-1 md:col-span-2">
            <Label>공지</Label>
            <Textarea rows={2} {...register("notice")} />
          </div>
          <div className="flex flex-col gap-1 md:col-span-2">
            <Label>설명</Label>
            <Textarea rows={5} {...register("description")} />
          </div>
          <div className="flex justify-end md:col-span-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "저장 중..." : "저장"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default GymEditPanel;
