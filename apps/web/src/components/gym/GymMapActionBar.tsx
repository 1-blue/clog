"use client";

import { Bus, MapPinned, Route } from "lucide-react";

interface IProps {
  gymName: string;
  latitude: number;
  longitude: number;
}

/**
 * 카카오맵 딥링크 (공식 URL 패턴)
 * - 지도: /link/map/이름,위도,경도
 * - 길찾기 목적지: /link/to/...
 * - 대중교통: /link/by/traffic/출발,위도,경도/도착,위도,경도 (출발은 보통 내 위치)
 */
function kakaoMapViewUrl(name: string, lat: number, lng: number) {
  return `https://map.kakao.com/link/map/${encodeURIComponent(name)},${lat},${lng}`;
}

function kakaoDirectionsToUrl(name: string, lat: number, lng: number) {
  return `https://map.kakao.com/link/to/${encodeURIComponent(name)},${lat},${lng}`;
}

function kakaoTrafficUrl(
  fromLabel: string,
  fromLat: number,
  fromLng: number,
  toName: string,
  toLat: number,
  toLng: number,
) {
  const from = `${encodeURIComponent(fromLabel)},${fromLat},${fromLng}`;
  const to = `${encodeURIComponent(toName)},${toLat},${toLng}`;
  return `https://map.kakao.com/link/by/traffic/${from}/${to}`;
}

/** 암장 지도 하단 — 카카오맵에서 보기 / 길찾기 / 대중교통 (항상 보이도록 지도 위 고정) */
const GymMapActionBar: React.FC<IProps> = ({
  gymName,
  latitude,
  longitude,
}) => {
  const mapHref = kakaoMapViewUrl(gymName, latitude, longitude);
  const toHref = kakaoDirectionsToUrl(gymName, latitude, longitude);

  const openTrafficDirections = () => {
    if (typeof window === "undefined") return;
    if (!navigator.geolocation) {
      window.open(toHref, "_blank", "noopener,noreferrer");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const uLat = pos.coords.latitude;
        const uLng = pos.coords.longitude;
        const url = kakaoTrafficUrl("내 위치", uLat, uLng, gymName, latitude, longitude);
        window.open(url, "_blank", "noopener,noreferrer");
      },
      () => {
        window.open(toHref, "_blank", "noopener,noreferrer");
      },
      { enableHighAccuracy: false, timeout: 12_000, maximumAge: 120_000 },
    );
  };

  const btnClass =
    "pointer-events-auto inline-flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-xl bg-surface-container-high/95 px-2.5 py-2 text-[11px] font-semibold text-on-surface shadow-lg ring-1 ring-white/10 backdrop-blur-sm transition-colors hover:bg-surface-container hover:text-primary sm:text-xs";

  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-col gap-1.5 bg-gradient-to-t from-background via-background/90 to-transparent px-2 pt-10 pb-2"
      aria-label="카카오맵 바로가기"
    >
      <p className="pointer-events-none px-1 text-center text-[10px] text-on-surface-variant">
        주변 지하철역은 지도에 표시됩니다. 버스·지하철 노선은 카카오맵 앱에서 확인할 수
        있어요.
      </p>
      <div className="flex flex-wrap items-stretch justify-center gap-2 sm:flex-nowrap">
        <a
          href={mapHref}
          target="_blank"
          rel="noopener noreferrer"
          className={btnClass}
        >
          <MapPinned className="size-4 shrink-0 text-primary" strokeWidth={2} aria-hidden />
          카카오맵에서 보기
        </a>
        <a
          href={toHref}
          target="_blank"
          rel="noopener noreferrer"
          className={btnClass}
        >
          <Route className="size-4 shrink-0 text-secondary" strokeWidth={2} aria-hidden />
          길찾기
        </a>
        <button type="button" onClick={openTrafficDirections} className={btnClass}>
          <Bus className="size-4 shrink-0 text-tertiary" strokeWidth={2} aria-hidden />
          대중교통
        </button>
      </div>
    </div>
  );
};

export default GymMapActionBar;
