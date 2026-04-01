"use client";

import { useFormContext, useWatch } from "react-hook-form";

import FormHelper from "#web/components/shared/FormHelper";
import MultiImageUploader from "#web/components/shared/MultiImageUploader";
import { cn } from "#web/libs/utils";

import type { TRecordFormData } from "../../hooks/useRecordForm";
import { recordFormFieldLabelClass } from "../../utils/record-form-ui";

interface IProps {
  maxFiles?: number;
  className?: string;
}

const RecordGallerySection = ({ maxFiles = 10, className }: IProps) => {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext<TRecordFormData>();
  const imageUrls = useWatch({ control, name: "imageUrls" }) ?? [];

  return (
    <FormHelper
      label="갤러리"
      labelClassName={recordFormFieldLabelClass}
      labelSuffix={
        <span className="text-xs font-normal text-on-surface-variant">
          오늘의 클라이밍 {imageUrls.length}/{maxFiles}
        </span>
      }
      className={cn("gap-3", className)}
      message={{ error: errors.imageUrls?.message }}
      cloneChild={false}
      controlAriaLabel="기록 이미지"
    >
      <section className="flex flex-col gap-3">
        <MultiImageUploader
          urls={imageUrls}
          onUrlsChange={(urls) =>
            setValue("imageUrls", urls, { shouldValidate: true })
          }
          maxFiles={maxFiles}
          emptyLabel="사진 추가"
          className="rounded-2xl border border-dashed border-outline-variant/50 bg-surface-container-low/40 p-3"
        />
      </section>
    </FormHelper>
  );
};

export default RecordGallerySection;
