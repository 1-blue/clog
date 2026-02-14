"use client";

import * as React from "react";
import {
  useFormContext,
  Controller,
  type FieldPath,
  type FieldValues,
  PathValue,
} from "react-hook-form";
import { Input } from "#/src/components/ui/input";
import { Button } from "#/src/components/ui/button";
import FormHelper from "./FormHelper";

type AddressInputProps<T extends FieldValues = FieldValues> = {
  /** 주소 필드 이름 */
  addressName: FieldPath<T>;
  /** 상세주소 필드 이름 (선택) */
  addressDetailName?: FieldPath<T>;
  /** 라벨 텍스트 */
  label?: string;
  /** 설명 텍스트 */
  description?: string;
  /** 필수 필드 여부 */
  required?: boolean;
};

declare global {
  interface Window {
    daum?: {
      Postcode: new (options: {
        oncomplete: (data: {
          zonecode: string;
          address: string;
          addressType: "R" | "J";
          bname: string;
          buildingName: string;
        }) => void;
      }) => {
        open: () => void;
      };
    };
  }
}

function AddressInput<T extends FieldValues = FieldValues>({
  addressName,
  addressDetailName,
  label = "주소",
  description,
  required = false,
}: AddressInputProps<T>) {
  const { setValue, clearErrors, control } = useFormContext<T>();
  const scriptLoaded = React.useRef(false);

  // 카카오 우편번호 서비스 스크립트 로드
  React.useEffect(() => {
    if (scriptLoaded.current || typeof window === "undefined") return;

    // 이미 스크립트가 로드되어 있는지 확인
    if (window.daum?.Postcode) {
      scriptLoaded.current = true;
      return;
    }

    const script = document.createElement("script");
    script.src =
      "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    script.onload = () => {
      scriptLoaded.current = true;
    };

    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  /** 주소 검색 팝업 열기 */
  const handleAddressSearch = () => {
    if (!scriptLoaded.current || !window.daum) {
      console.error("카카오 우편번호 서비스를 불러올 수 없습니다.");
      return;
    }

    new window.daum.Postcode({
      oncomplete: (data) => {
        // 도로명 주소 선택 시 (R: 도로명, J: 지번)
        const fullAddress = data.address;
        let extraAddress = "";

        // 사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
        if (data.addressType === "R") {
          // 법정동명이 있을 경우 추가한다. (법정리는 제외)
          // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
          if (data.bname !== "" && /[동|로|가]$/g.test(data.bname)) {
            extraAddress += data.bname;
          }
          // 건물명이 있고, 공동주택일 경우 추가한다.
          if (data.buildingName !== "" && data.buildingName !== "") {
            extraAddress +=
              extraAddress !== ""
                ? `, ${data.buildingName}`
                : data.buildingName;
          }
          // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
          if (extraAddress !== "") {
            extraAddress = ` (${extraAddress})`;
          }
        }

        // 주소 필드에 값 설정
        setValue(
          addressName,
          (fullAddress + extraAddress) as PathValue<T, FieldPath<T>>,
          {
            shouldValidate: true,
          }
        );
        clearErrors(addressName);
      },
    }).open();
  };

  return (
    <div className="space-y-4">
      <FormHelper
        name={addressName}
        label={label}
        description={description}
        required={required}
      >
        <Controller
          control={control}
          name={addressName}
          render={({ field }) => (
            <div className="flex items-center gap-2">
              <Input
                {...field}
                readOnly
                placeholder="주소를 검색하세요"
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddressSearch}
              >
                주소 검색
              </Button>
            </div>
          )}
        />
      </FormHelper>

      {addressDetailName && (
        <FormHelper name={addressDetailName} label="상세 주소">
          <Controller
            control={control}
            name={addressDetailName}
            render={({ field }) => (
              <Input {...field} placeholder="상세 주소를 입력하세요" />
            )}
          />
        </FormHelper>
      )}
    </div>
  );
}

export default AddressInput;
