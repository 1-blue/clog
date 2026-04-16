"use client";

import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";

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

interface IProps {
  user: {
    id: string;
    nickname: string;
    email: string;
    role: "ADMIN" | "MANAGER" | "GUEST";
  };
}

const UserEditPanel: React.FC<IProps> = ({ user }) => {
  const router = useRouter();
  const [nickname, setNickname] = useState(user.nickname);
  const [role, setRole] = useState(user.role);
  const [saving, setSaving] = useState(false);

  const onSave = async () => {
    setSaving(true);
    const res = await fetch(`/api/v1/admin/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nickname, role }),
    });
    const body = await res.json().catch(() => null);
    setSaving(false);
    if (!res.ok) {
      toast.error(body?.toast ?? "수정 실패");
      return;
    }
    toast.success("수정되었습니다.");
    router.refresh();
  };

  const onDelete = async () => {
    const res = await fetch(`/api/v1/admin/users/${user.id}`, {
      method: "DELETE",
    });
    const body = await res.json().catch(() => null);
    if (!res.ok) {
      toast.error(body?.toast ?? "삭제 실패");
      return;
    }
    toast.success("삭제되었습니다.");
    router.push("/admin/users");
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col gap-4">
        <div>
          <Label>이메일</Label>
          <div className="mt-1 text-sm text-on-surface-variant">
            {user.email}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <Label>닉네임</Label>
          <Input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label>권한</Label>
          <select
            value={role}
            onChange={(e) =>
              setRole(e.target.value as "ADMIN" | "MANAGER" | "GUEST")
            }
            className="rounded-md border border-outline-variant bg-surface px-3 py-2 text-sm"
          >
            <option value="ADMIN">ADMIN</option>
            <option value="MANAGER">MANAGER</option>
            <option value="GUEST">GUEST</option>
          </select>
        </div>
        <div className="flex justify-between gap-2">
          <Dialog>
            <DialogTrigger
              render={
                <Button variant="destructive" size="sm">
                  계정 삭제
                </Button>
              }
            />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>계정 삭제</DialogTitle>
              </DialogHeader>
              <p className="text-sm text-on-surface-variant">
                정말로 {user.nickname} 계정을 삭제하시겠습니까? 관련된 모든
                데이터가 함께 삭제됩니다.
              </p>
              <DialogFooter>
                <DialogClose render={<Button variant="outline">취소</Button>} />
                <Button variant="destructive" onClick={onDelete}>
                  삭제
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button onClick={onSave} disabled={saving}>
            {saving ? "저장 중..." : "저장"}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default UserEditPanel;
