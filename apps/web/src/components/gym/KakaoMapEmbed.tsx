"use client";

import { useEffect, useRef, useState } from "react";

/** 빌드 시점 인라인 — 런타임 trim */
const APP_KEY_RAW = process.env.NEXT_PUBLIC_KAKAO_MAP_APPKEY;
const APP_KEY = APP_KEY_RAW?.trim();
const hasAppKey = Boolean(APP_KEY);

/** services(장소 검색) 포함 — 주변 지하철역 등에 사용 */
const SDK_QUERY = "autoload=false&libraries=services";

let kakaoScriptPromise: Promise<void> | null = null;

function removeLegacyKakaoScriptsWithoutServices(): void {
  document
    .querySelectorAll("script[src*='dapi.kakao.com/v2/maps/sdk.js']")
    .forEach((el) => {
      const src = (el as HTMLScriptElement).src;
      if (!src.includes("libraries=services")) {
        el.remove();
        kakaoScriptPromise = null;
      }
    });
}

function loadKakaoMapsScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.kakao?.maps?.services) return Promise.resolve();

  removeLegacyKakaoScriptsWithoutServices();

  if (window.kakao?.maps && !window.kakao.maps.services) {
    kakaoScriptPromise = null;
  }

  if (window.kakao?.maps?.services) return Promise.resolve();
  if (kakaoScriptPromise) return kakaoScriptPromise;

  if (!APP_KEY) {
    return Promise.reject(new Error("NEXT_PUBLIC_KAKAO_MAP_APPKEY 없음"));
  }

  kakaoScriptPromise = new Promise((resolve, reject) => {
    const fullSrc = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${APP_KEY}&${SDK_QUERY}`;
    const existing = document.querySelector(
      `script[src*="dapi.kakao.com/v2/maps/sdk.js"][src*="libraries=services"]`,
    ) as HTMLScriptElement | null;

    if (existing) {
      if (window.kakao?.maps?.services) {
        resolve();
        return;
      }
      if (window.kakao?.maps) {
        resolve();
        return;
      }
      existing.addEventListener("load", () => {
        existing.dataset.kakaoLoaded = "1";
        resolve();
      });
      existing.addEventListener(
        "error",
        () => reject(new Error("kakao load")),
        { once: true },
      );
      return;
    }
    const script = document.createElement("script");
    script.src = fullSrc;
    script.async = true;
    script.onload = () => {
      script.dataset.kakaoLoaded = "1";
      resolve();
    };
    script.onerror = () => reject(new Error("kakao script"));
    document.head.appendChild(script);
  });

  return kakaoScriptPromise;
}

interface IProps {
  latitude: number;
  longitude: number;
  className?: string;
  /** 주변 지하철역 마커 (카카오 Places 카테고리 SW8) */
  showNearbySubway?: boolean;
}

const defaultMapClass = "h-80 min-h-80 w-full";

const fallbackClass =
  "flex h-80 min-h-80 items-center justify-center bg-surface-container-high px-3 text-center text-xs text-on-surface-variant";

/** 카카오맵 임베드 (키 없으면 안내 영역만 표시) */
const KakaoMapEmbed: React.FC<IProps> = ({
  latitude,
  longitude,
  className,
  showNearbySubway = true,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const markersRef = useRef<Array<{ setMap: (v: unknown) => void }>>([]);
  /** 스크립트/맵 초기화 실패만 true — services 미탑재는 지도만 표시 */
  const [scriptFailed, setScriptFailed] = useState(false);

  useEffect(() => {
    if (!hasAppKey) return;
    const el = ref.current;
    if (!el) return;

    let cancelled = false;
    markersRef.current = [];

    void (async () => {
      try {
        await loadKakaoMapsScript();
        if (cancelled || !ref.current || !window.kakao?.maps) return;

        const { maps } = window.kakao;

        /**
         * autoload=false 이므로 반드시 maps.load 안에서 지도 생성.
         * services는 load 이후에만 안정적으로 쓰는 편이 안전함.
         */
        maps.load(() => {
          if (cancelled || !ref.current) return;

          try {
            const center = new maps.LatLng(latitude, longitude);
            const map = new maps.Map(ref.current, { center, level: 3 });
            new maps.Marker({ position: center, map });

            const mapServices = maps.services;
            if (!showNearbySubway || !mapServices) return;

            const places = new mapServices.Places();
            places.categorySearch(
              "SW8",
              (result: unknown, status: unknown) => {
                if (cancelled) return;
                const Status = mapServices.Status;
                if (status !== Status.OK || !Array.isArray(result)) return;

                const slice = result.slice(0, 8);
                for (const place of slice as Array<{
                  y: string;
                  x: string;
                  place_name: string;
                }>) {
                  const pos = new maps.LatLng(Number(place.y), Number(place.x));
                  const m = new maps.Marker({
                    position: pos,
                    map,
                    title: place.place_name,
                  });
                  markersRef.current.push(m);
                }
              },
              {
                location: center,
                radius: 1500,
                sort: mapServices.SortBy.DISTANCE,
                size: 15,
              },
            );
          } catch {
            if (!cancelled) setScriptFailed(true);
          }
        });
      } catch {
        if (!cancelled) setScriptFailed(true);
      }
    })();

    return () => {
      cancelled = true;
      for (const m of markersRef.current) {
        try {
          m.setMap(null);
        } catch {
          /* noop */
        }
      }
      markersRef.current = [];
    };
  }, [latitude, longitude, showNearbySubway]);

  if (!hasAppKey) {
    return (
      <div className={className ?? fallbackClass}>
        지도를 표시하려면{" "}
        <code className="mx-1 rounded bg-surface-container px-1">
          NEXT_PUBLIC_KAKAO_MAP_APPKEY
        </code>
        를 설정하세요.
      </div>
    );
  }

  if (scriptFailed) {
    return (
      <div className={className ?? fallbackClass}>
        카카오맵을 불러오지 못했습니다. 앱 키·도메인(플랫폼) 설정과 네트워크를
        확인해 주세요.
      </div>
    );
  }

  return <div ref={ref} className={className ?? defaultMapClass} />;
};

export default KakaoMapEmbed;
