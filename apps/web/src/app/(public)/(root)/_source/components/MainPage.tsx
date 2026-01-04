import { routes } from "@clog/libs";
import Link from "next/link";
import React from "react";

type RouteItem = {
  label: string;
  url: string | ((...args: unknown[]) => string);
  access?: string;
  [key: string]: unknown;
};

const MainPage: React.FC = () => {
  const renderRouteLinks = (
    routeObj: Record<string, unknown>,
    prefix = ""
  ): React.ReactNode[] => {
    const links: React.ReactNode[] = [];

    for (const [key, value] of Object.entries(routeObj)) {
      if (!value || typeof value !== "object") continue;

      const route = value as RouteItem;

      // url과 label이 있는 경우 Link 생성
      if (route.url && route.label) {
        const href =
          typeof route.url === "function"
            ? route.url("test-id") // 함수형 URL의 경우 임시 ID 사용
            : route.url;

        const fullKey = prefix ? `${prefix}.${key}` : key;

        links.push(
          <Link
            key={fullKey}
            href={href}
            className="text-blue-600 hover:underline"
          >
            {`[${route.access || "N/A"}] ${route.label}`} - {href}
          </Link>
        );
      }

      // 중첩된 객체가 있으면 재귀적으로 탐색
      if (typeof value === "object" && !route.url) {
        const nestedPrefix = prefix ? `${prefix}.${key}` : key;
        links.push(
          ...renderRouteLinks(value as Record<string, unknown>, nestedPrefix)
        );
      } else if (typeof value === "object" && route.url) {
        // url이 있지만 추가 속성도 있는 경우 (예: detail, create, edit)
        const nestedPrefix = prefix ? `${prefix}.${key}` : key;
        for (const [nestedKey, nestedValue] of Object.entries(route)) {
          if (
            nestedKey !== "url" &&
            nestedKey !== "label" &&
            nestedKey !== "access" &&
            nestedValue &&
            typeof nestedValue === "object"
          ) {
            links.push(
              ...renderRouteLinks({ [nestedKey]: nestedValue }, nestedPrefix)
            );
          }
        }
      }
    }

    return links;
  };

  return (
    <div className="flex flex-col gap-4 p-8">
      <h1 className="mb-4 text-2xl font-bold">Routes 테스트 (임시)</h1>
      <div className="flex flex-col gap-2">
        {renderRouteLinks(routes as Record<string, unknown>)}
      </div>
    </div>
  );
};

export default MainPage;
