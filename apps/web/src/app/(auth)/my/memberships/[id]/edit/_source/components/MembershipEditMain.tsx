"use client";

import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";

import type { components } from "#web/@types/openapi";
import { openapi } from "#web/apis/openapi";
import TopBar from "#web/components/layout/TopBar";
import FormHelper from "#web/components/shared/FormHelper";
import YmdSheetDateField from "#web/components/shared/YmdSheetDateField";
import { Button } from "#web/components/ui/button";
import { Textarea } from "#web/components/ui/textarea";
import useMembershipMutations from "#web/hooks/mutations/memberships/useMembershipMutations";
import { extractApiToastAsync } from "#web/libs/api/extractApiToast";

type TUserMembership = components["schemas"]["UserMembership"];

interface IProps {
  userMembershipId: string;
}

const MembershipEditMain: React.FC<IProps> = ({ userMembershipId }) => {
  const router = useRouter();
  const { patchMutation, createPauseMutation, deletePauseMutation } =
    useMembershipMutations();

  const { data: m } = openapi.useSuspenseQuery(
    "get",
    "/api/v1/users/me/memberships/{userMembershipId}",
    { params: { path: { userMembershipId } } },
    { select: (d) => d.payload as TUserMembership },
  );

  const [startedDateYmd, setStartedDateYmd] = useState(m.startedDateYmd);
  const [note, setNote] = useState(m.note ?? "");

  const todayYmd = new Date().toISOString().split("T")[0]!;
  const [pauseStart, setPauseStart] = useState(todayYmd);
  const [pauseEnd, setPauseEnd] = useState(todayYmd);

  const saveProfile = () => {
    patchMutation.mutate(
      {
        params: { path: { userMembershipId } },
        body: {
          startedDateYmd,
          note: note.trim() === "" ? null : note.trim(),
        },
      },
      {
        onSuccess: () => {
          if (typeof window !== "undefined" && window.history.length > 1) {
            router.back();
          } else {
            router.refresh();
          }
        },
        onError: async (e) => {
          toast.error(
            (await extractApiToastAsync(e)) ?? "저장에 실패했습니다.",
          );
        },
      },
    );
  };

  const addPause = () => {
    if (!pauseStart || !pauseEnd || pauseStart > pauseEnd) {
      toast.error("일시정지 기간을 확인해 주세요.");
      return;
    }
    createPauseMutation.mutate(
      {
        params: { path: { userMembershipId } },
        body: { startDateYmd: pauseStart, endDateYmd: pauseEnd },
      },
      {
        onSuccess: () => {
          setPauseStart(todayYmd);
          setPauseEnd(todayYmd);
        },
        onError: async (e) => {
          toast.error(
            (await extractApiToastAsync(e)) ?? "일시정지 추가에 실패했습니다.",
          );
        },
      },
    );
  };

  const removePause = (pauseId: string) => {
    if (!window.confirm("이 일시정지 구간을 삭제할까요?")) return;
    deletePauseMutation.mutate({
      params: { path: { userMembershipId, pauseId } },
    });
  };

  return (
    <div className="flex min-h-dvh flex-col bg-background pb-10">
      <TopBar
        className="border-outline-variant bg-surface-container/80"
        showQuickActions={false}
        title="회원권 수정"
      />

      <div className="mx-auto flex w-full max-w-lg flex-col gap-6 pt-4">
        <YmdSheetDateField
          label="시작일"
          sheetTitle="시작일 선택"
          valueYmd={startedDateYmd}
          onChangeYmd={setStartedDateYmd}
          disableFuture
        />

        <FormHelper label="메모" cloneChild={false}>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            className="rounded-xl border-outline-variant/40"
          />
        </FormHelper>

        <Button
          className="h-12 rounded-xl"
          onClick={saveProfile}
          disabled={patchMutation.isPending}
        >
          저장
        </Button>

        <section className="rounded-2xl border border-outline-variant/20 bg-surface-container-low p-4">
          <h2 className="mb-3 text-sm font-bold tracking-widest text-tertiary uppercase">
            일시정지 추가
          </h2>
          <div className="flex flex-col gap-4">
            <YmdSheetDateField
              label="시작"
              sheetTitle="시작일"
              valueYmd={pauseStart}
              onChangeYmd={setPauseStart}
            />
            <YmdSheetDateField
              label="종료"
              sheetTitle="종료일"
              valueYmd={pauseEnd}
              onChangeYmd={setPauseEnd}
            />
            <Button
              type="button"
              variant="secondary"
              className="h-11 shrink-0 rounded-xl"
              disabled={createPauseMutation.isPending}
              onClick={addPause}
            >
              추가
            </Button>
          </div>

          {m.pauses.length > 0 ? (
            <ul className="mt-4 space-y-2">
              {m.pauses.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between gap-2 rounded-xl border border-outline-variant/25 px-3 py-2 text-sm"
                >
                  <span>
                    {p.startDateYmd} ~ {p.endDateYmd}
                  </span>
                  <button
                    type="button"
                    className="text-destructive"
                    aria-label="일시정지 삭제"
                    onClick={() => removePause(p.id)}
                    disabled={deletePauseMutation.isPending}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      </div>
    </div>
  );
};

export default MembershipEditMain;
