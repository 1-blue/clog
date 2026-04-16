"use client";

import { CloudAlert } from "lucide-react";
import Link from "next/link";

import { Button } from "#web/components/ui/button";
import { buttonVariants } from "#web/components/ui/button-variants";
import { ROUTES } from "#web/constants";
import { cn } from "#web/libs/utils";

interface IProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const ErrorPage: React.FC<IProps> = ({ error, reset }) => {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-6 py-16">
      <div className="mx-auto flex w-full max-w-md flex-col items-center text-center">
        <div className="mb-8 flex size-24 items-center justify-center rounded-full bg-surface-container-low ring-1 ring-outline-variant/30">
          <CloudAlert
            className="size-12 text-destructive"
            strokeWidth={1.75}
            aria-hidden
          />
        </div>
        <p className="mb-2 text-xs font-bold tracking-[0.2em] text-destructive uppercase">
          오류
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-on-surface">
          문제가 발생했어요
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
          일시적인 오류일 수 있어요. 잠시 후 다시 시도해 주세요.
          {process.env.NODE_ENV === "development" && error.message ? (
            <>
              <br />
              <span className="mt-2 block font-mono text-xs text-on-surface-variant/80">
                {error.message}
              </span>
            </>
          ) : null}
        </p>
        <div className="mt-10 flex w-full max-w-xs flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            type="button"
            size="lg"
            className="w-full rounded-full px-8 py-3 sm:w-auto"
            onClick={() => reset()}
          >
            다시 시도
          </Button>
          <Link
            href={ROUTES.HOME.path}
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "inline-flex w-full items-center justify-center rounded-full border-outline-variant px-8 py-3 sm:w-auto",
            )}
          >
            홈으로
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
