"use client";

import {
  COMMUNITY_POST_TAG_MAX_COUNT,
  COMMUNITY_POST_TAG_MAX_LENGTH,
} from "@clog/utils";
import { X } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

import FormHelper from "#web/components/shared/FormHelper";
import { Badge } from "#web/components/ui/badge";
import { Button } from "#web/components/ui/button";
import { Input } from "#web/components/ui/input";
import { cn } from "#web/libs/utils";

import type { TCommunityPostFormData } from "../../hooks/useCommunityPostForm";

const CommunityPostTagsField: React.FC = () => {
  const { control, clearErrors } = useFormContext<TCommunityPostFormData>();
  const [draft, setDraft] = useState("");
  const [hint, setHint] = useState<string | null>(null);
  const composingRef = useRef(false);
  const draftRef = useRef("");

  const syncDraft = useCallback((value: string) => {
    draftRef.current = value;
    setDraft(value);
  }, []);

  const tryCommitDraft = useCallback(
    (raw: string, current: string[], onChange: (next: string[]) => void) => {
      const t = raw.trim();
      setHint(null);
      clearErrors("tags");

      if (!t) {
        syncDraft("");
        return;
      }
      if (t.length > COMMUNITY_POST_TAG_MAX_LENGTH) {
        setHint(
          `태그는 ${COMMUNITY_POST_TAG_MAX_LENGTH}자까지 입력할 수 있어요.`,
        );
        return;
      }
      if (current.length >= COMMUNITY_POST_TAG_MAX_COUNT) {
        setHint(
          `태그는 최대 ${COMMUNITY_POST_TAG_MAX_COUNT}개까지 추가할 수 있어요.`,
        );
        return;
      }
      if (current.some((x) => x === t)) {
        syncDraft("");
        return;
      }

      onChange([...current, t]);
      syncDraft("");
    },
    [clearErrors, syncDraft],
  );

  return (
    <Controller
      control={control}
      name="tags"
      render={({ field, fieldState }) => (
        <FormHelper
          label="태그"
          description={`엔터 또는 쉼표로 추가 · 최대 ${COMMUNITY_POST_TAG_MAX_COUNT}개, 각 ${COMMUNITY_POST_TAG_MAX_LENGTH}자까지`}
          message={{
            error: fieldState.error?.message,
            info: hint ?? undefined,
          }}
          cloneChild={false}
          controlAriaLabel="태그 입력"
          className="mb-10"
        >
          <div
            className={cn(
              "flex flex-col gap-3 rounded-xl border border-transparent bg-surface-container-high p-3",
              fieldState.error && "border-destructive/50",
            )}
          >
            <Input
              type="text"
              value={draft}
              disabled={field.value.length >= COMMUNITY_POST_TAG_MAX_COUNT}
              placeholder={
                field.value.length >= COMMUNITY_POST_TAG_MAX_COUNT
                  ? "태그 개수가 가득 찼어요"
                  : "예: 볼더링"
              }
              className="h-auto w-full rounded-lg border border-white/10 bg-surface-container-high px-3 py-3 text-sm text-on-surface shadow-none placeholder:text-on-surface-variant focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
              onCompositionStart={() => {
                composingRef.current = true;
              }}
              onCompositionEnd={() => {
                composingRef.current = false;
              }}
              onChange={(e) => {
                setHint(null);
                clearErrors("tags");
                const v = e.target.value;
                draftRef.current = v;
                setDraft(v);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === ",") {
                  if (e.nativeEvent.isComposing || composingRef.current) {
                    return;
                  }
                  e.preventDefault();
                  const raw = (e.target as HTMLInputElement).value;
                  tryCommitDraft(raw, field.value, field.onChange);
                  return;
                }
                if (
                  e.key === "Backspace" &&
                  draftRef.current === "" &&
                  field.value.length > 0 &&
                  !composingRef.current
                ) {
                  e.preventDefault();
                  clearErrors("tags");
                  setHint(null);
                  field.onChange(field.value.slice(0, -1));
                }
              }}
              onBlur={() => {
                window.setTimeout(() => {
                  if (composingRef.current) {
                    return;
                  }
                  const raw = draftRef.current.trim();
                  if (!raw) {
                    return;
                  }
                  tryCommitDraft(draftRef.current, field.value, field.onChange);
                }, 0);
              }}
            />
            {field.value.length > 0 ? (
              <div className="flex flex-wrap gap-2 border-t border-white/10 pt-3">
                {field.value.map((tag, index) => (
                  <Badge
                    key={`${tag}-${index}`}
                    color="primary"
                    className="h-8 max-w-full gap-1 py-0 pr-0.5 pl-2.5 text-sm font-medium"
                  >
                    <span className="truncate">{tag}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="size-7 shrink-0 rounded-full text-on-surface-variant hover:bg-white/10 hover:text-on-surface"
                      aria-label={`${tag} 태그 제거`}
                      onClick={() => {
                        clearErrors("tags");
                        setHint(null);
                        field.onChange(field.value.filter((_, i) => i !== index));
                      }}
                    >
                      <X className="size-3.5" aria-hidden />
                    </Button>
                  </Badge>
                ))}
              </div>
            ) : null}
          </div>
        </FormHelper>
      )}
    />
  );
};

export default CommunityPostTagsField;
