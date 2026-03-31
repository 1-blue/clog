"use client";

import * as React from "react";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldTitle,
} from "#web/components/ui/field";

export type TFormHelperMessage = {
  error?: string;
  info?: string;
};

const mergeDescribedBy = (
  existing: string | undefined,
  next: string | undefined,
) => {
  if (!existing) {
    return next;
  }
  if (!next) {
    return existing;
  }
  return `${existing} ${next}`;
};

interface IProps {
  label?: string;
  /** 라벨 옆(예: 글자 수) */
  labelSuffix?: React.ReactNode;
  /** 없으면 내부 useId — cloneChild true일 때 컨트롤 id로 사용 */
  htmlFor?: string;
  /** 회색 보조 설명 */
  description?: string;
  message?: TFormHelperMessage;
  children: React.ReactNode;
  /** 단일 Input/Textarea 등에 id·aria 주입. false면 복합 컨트롤(별점 그룹 등) */
  cloneChild?: boolean;
  /** cloneChild false일 때 래퍼에 부여할 id (스크롤 등) */
  controlId?: string;
  /** cloneChild false일 때 래퍼 role=group용 접근성 라벨 */
  controlAriaLabel?: string;
  className?: string;
}

const FormHelper: React.FC<IProps> = ({
  label,
  labelSuffix,
  htmlFor,
  description,
  message,
  children,
  cloneChild = true,
  controlId: controlIdProp,
  controlAriaLabel,
  className,
}) => {
  const generatedId = React.useId();
  const id = htmlFor ?? generatedId;
  const controlId = controlIdProp ?? id;
  const errorId = `${controlId}-error`;
  const descId = `${controlId}-description`;
  const infoId = `${controlId}-info`;

  const errorMsg = message?.error;
  const infoMsg = message?.info;
  const hasError = Boolean(errorMsg);
  const showInfo = !hasError && Boolean(infoMsg);

  const describedByParts = [
    description ? descId : null,
    showInfo ? infoId : null,
    hasError ? errorId : null,
  ].filter(Boolean) as string[];
  const describedBy =
    describedByParts.length > 0 ? describedByParts.join(" ") : undefined;

  const controlProps = {
    "aria-invalid": hasError ? true : undefined,
    "aria-describedby": describedBy,
  } as const;

  const renderControl = () => {
    if (!cloneChild) {
      return (
        <div
          id={controlId}
          role="group"
          aria-label={controlAriaLabel}
          {...controlProps}
          className="w-full"
        >
          {children}
        </div>
      );
    }

    if (!React.isValidElement(children)) {
      return children;
    }

    const childProps = children.props as {
      id?: string;
      "aria-describedby"?: string;
    };

    return React.cloneElement(
      children as React.ReactElement<Record<string, unknown>>,
      {
        id: childProps.id ?? id,
        ...controlProps,
        "aria-describedby": mergeDescribedBy(
          childProps["aria-describedby"],
          describedBy,
        ),
      },
    );
  };

  const renderLabelRow = () => {
    if (!label) {
      return null;
    }
    const labelNode = cloneChild ? (
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
    ) : (
      <FieldTitle>{label}</FieldTitle>
    );
    if (labelSuffix) {
      return (
        <div className="flex w-full items-end justify-between gap-2">
          {labelNode}
          {labelSuffix}
        </div>
      );
    }
    return labelNode;
  };

  return (
    <Field
      data-invalid={hasError ? true : undefined}
      className={className}
    >
      {renderLabelRow()}

      {description && (
        <FieldDescription id={descId}>{description}</FieldDescription>
      )}

      {showInfo && (
        <FieldDescription id={infoId} className="text-muted-foreground">
          {infoMsg}
        </FieldDescription>
      )}

      <FieldContent>{renderControl()}</FieldContent>

      {hasError && (
        <FieldError id={errorId}>{errorMsg}</FieldError>
      )}
    </Field>
  );
};

export default FormHelper;
