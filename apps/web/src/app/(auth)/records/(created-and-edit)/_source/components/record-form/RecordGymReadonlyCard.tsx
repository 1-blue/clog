"use client";

import { MapPin } from "lucide-react";

import { Card, CardContent } from "#web/components/ui/card";

import { recordFormFieldLabelClass } from "../../utils/record-form-ui";

interface IProps {
  name: string;
  address: string;
}

/** 수정 폼에서 암장은 PATCH에 gymId가 없어 변경 불가일 때 표시 */
const RecordGymReadonlyCard = ({ name, address }: IProps) => {
  return (
    <Card className="rounded-2xl border-outline-variant/50 bg-surface-container-low shadow-none ring-1 ring-outline-variant/30">
      <CardContent className="flex flex-col gap-1">
        <p className={recordFormFieldLabelClass}>암장</p>
        <p className="text-base font-semibold text-on-surface">{name}</p>
        <div className="flex items-start gap-1.5 text-sm text-on-surface-variant">
          <MapPin
            className="mt-0.5 size-4 shrink-0 text-primary"
            strokeWidth={2}
            aria-hidden
          />
          <span className="leading-snug">{address}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecordGymReadonlyCard;
