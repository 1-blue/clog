"use client";

import { Button } from "#web/components/ui/button";

interface IProps {
  baselineNickname: string;
  debouncedNickname: string;
  available: boolean | undefined;
  isFetching: boolean;
  isError: boolean;
  onRecheck: () => void;
}

const ProfileEditNicknameStatus = ({
  baselineNickname,
  debouncedNickname,
  available,
  isFetching,
  isError,
  onRecheck,
}: IProps) => {
  const trimmed = debouncedNickname.trim();
  const shouldCheck =
    trimmed.length >= 1 &&
    trimmed.length <= 20 &&
    trimmed !== baselineNickname;

  return (
    <div className="mt-2 flex flex-col gap-2">
      {trimmed === baselineNickname ? (
        <p className="text-xs text-on-surface-variant">현재 닉네임입니다.</p>
      ) : trimmed.length === 0 ? (
        <p className="text-xs text-on-surface-variant">
          닉네임을 입력해 주세요.
        </p>
      ) : trimmed.length > 20 ? (
        <p className="text-xs text-destructive">닉네임은 20자 이하여야 합니다.</p>
      ) : !shouldCheck ? null : isFetching ? (
        <p className="text-xs text-on-surface-variant">확인 중…</p>
      ) : isError ? (
        <p className="text-xs text-destructive">확인에 실패했습니다.</p>
      ) : available === true ? (
        <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
          사용할 수 있는 닉네임입니다.
        </p>
      ) : available === false ? (
        <p className="text-xs font-medium text-destructive">
          이미 사용 중인 닉네임입니다.
        </p>
      ) : null}

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-8 w-fit rounded-lg"
        disabled={!shouldCheck || isFetching}
        onClick={() => onRecheck()}
      >
        중복 확인
      </Button>
    </div>
  );
};

export default ProfileEditNicknameStatus;
