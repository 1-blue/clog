"use client";

import {
  useFormContext,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { cn } from "@clog/libs";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "#/src/components/ui/field";

type FormHelperProps<T extends FieldValues = FieldValues> = {
  /** 필드 이름 (react-hook-form register name) */
  name: FieldPath<T>;
  /** 라벨 텍스트 */
  label?: string;
  /** 설명 텍스트 */
  description?: string;
  /** input 컴포넌트 */
  children: React.ReactNode;
  /** Field orientation */
  orientation?: "vertical" | "horizontal" | "responsive";
  /** 추가 className */
  className?: string;
  /** label의 htmlFor */
  htmlFor?: string;
  /** 필수 필드 여부 */
  required?: boolean;
};

function FormHelper<T extends FieldValues = FieldValues>({
  name,
  label,
  description,
  children,
  orientation = "vertical",
  className,
  htmlFor,
  required = false,
}: FormHelperProps<T>) {
  const form = useFormContext<T>();
  const fieldState = form.getFieldState(name, form.formState);
  const error = fieldState.error;
  const isSubmitted = form.formState.isSubmitted;

  // 제출 후이거나 필드가 touched되었을 때 에러 표시
  const hasError = !!error && (isSubmitted || fieldState.isTouched);

  return (
    <Field
      orientation={orientation}
      className={className}
      data-invalid={hasError}
    >
      {label && (
        <FieldLabel htmlFor={htmlFor || name} className="flex gap-1">
          {label}
          {required && <span className="text-destructive">*</span>}
        </FieldLabel>
      )}

      <FieldContent>
        <div
          className={cn(
            "relative",
            hasError &&
              "[&_input]:border-destructive [&_textarea]:border-destructive [&_select]:border-destructive focus-within:[&_input]:ring-destructive focus-within:[&_textarea]:ring-destructive focus-within:[&_select]:ring-destructive"
          )}
        >
          {children}
        </div>

        {description && !hasError && (
          <FieldDescription>{description}</FieldDescription>
        )}

        {hasError && <FieldError errors={error ? [error] : undefined} />}
      </FieldContent>
    </Field>
  );
}

export default FormHelper;
