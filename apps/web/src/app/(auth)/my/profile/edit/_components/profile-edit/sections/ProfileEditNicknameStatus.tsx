"use client";

interface IProps {
  baselineNickname: string;
  debouncedNickname: string;
  available: boolean | undefined;
  isFetching: boolean;
  isError: boolean;
}

const ProfileEditNicknameStatus = ({
  baselineNickname,
  debouncedNickname,
  available,
  isFetching,
  isError,
}: IProps) => {
  const trimmed = debouncedNickname.trim();
  const shouldCheck =
    trimmed.length >= 1 &&
    trimmed.length <= 20 &&
    trimmed !== baselineNickname;

  if (trimmed === baselineNickname) {
    return (
      <p className="mt-1.5 text-xs text-on-surface-variant">현재 닉네임입니다.</p>
    );
  }
  if (trimmed.length === 0) {
    return (
      <p className="mt-1.5 text-xs text-on-surface-variant">
        닉네임을 입력해 주세요.
      </p>
    );
  }
  if (trimmed.length > 20) {
    return (
      <p className="mt-1.5 text-xs text-destructive">
        닉네임은 20자 이하여야 합니다.
      </p>
    );
  }
  if (!shouldCheck) return null;
  if (isFetching) {
    return <p className="mt-1.5 text-xs text-on-surface-variant">확인 중…</p>;
  }
  if (isError) {
    return (
      <p className="mt-1.5 text-xs text-destructive">확인에 실패했습니다.</p>
    );
  }
  if (available === true) {
    return (
      <p className="mt-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
        사용할 수 있는 닉네임입니다.
      </p>
    );
  }
  if (available === false) {
    return (
      <p className="mt-1.5 text-xs font-medium text-destructive">
        이미 사용 중인 닉네임입니다.
      </p>
    );
  }
  return null;
};

export default ProfileEditNicknameStatus;
