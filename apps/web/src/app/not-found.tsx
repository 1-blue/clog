import { FileQuestion } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "#web/components/ui/button-variants";
import { ROUTES } from "#web/constants";
import { cn } from "#web/libs/utils";

const NotFound = () => {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-6 py-16">
      <div className="mx-auto flex w-full max-w-md flex-col items-center text-center">
        <div className="mb-8 flex size-24 items-center justify-center rounded-full bg-surface-container-low ring-1 ring-outline-variant/30">
          <FileQuestion
            className="size-12 text-primary"
            strokeWidth={1.75}
            aria-hidden
          />
        </div>
        <p className="mb-2 text-xs font-bold tracking-[0.2em] text-primary uppercase">
          404
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-on-surface">
          페이지를 찾을 수 없어요
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
          주소가 잘못 입력되었거나, 페이지가 이동·삭제되었을 수 있어요.
          <br />
          홈에서 다시 둘러봐 주세요.
        </p>
        <div className="mt-10 flex w-full max-w-xs flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href={ROUTES.HOME.path}
            className={cn(
              buttonVariants({ size: "lg" }),
              "w-full rounded-full px-8 py-3 sm:w-auto",
            )}
          >
            홈으로
          </Link>
          <Link
            href={ROUTES.GYMS.path}
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "w-full rounded-full border-outline-variant px-8 py-3 sm:w-auto",
            )}
          >
            암장 찾기
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
