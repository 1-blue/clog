"use client";

import { Button } from "#/src/components/ui/button";
import { Loader2 } from "lucide-react";

interface KakaoButtonProps {
  loading: boolean;
  onClick: () => void;
  disabled: boolean;
}

const KakaoButton: React.FC<KakaoButtonProps> = ({
  loading,
  onClick,
  disabled,
}) => {
  return (
    <Button
      type="button"
      onClick={onClick}
      disabled={disabled}
      size="lg"
      className="flex w-full gap-2 bg-[#FEE500] py-5 text-base text-[#000000] hover:bg-[#FEE500]/90 dark:bg-[#FEE500] dark:text-[#000000] dark:hover:bg-[#FEE500]/90"
    >
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.78-.123l-4.29 2.23a.84.84 0 0 1-1.2-.698l-.054-3.8c-2.17-1.82-3.676-4.37-3.676-7.287C1.5 6.665 6.201 3 12 3Z" />
        </svg>
      )}
      카카오로 계속하기
    </Button>
  );
};

export default KakaoButton;
