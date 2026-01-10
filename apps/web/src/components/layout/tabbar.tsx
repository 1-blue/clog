"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileText, Users, Building2, User } from "lucide-react";
import { routes } from "@clog/libs";
import { cn } from "@clog/libs";
import { useMe } from "#/src/hooks/useMe";

interface TabItem {
  label: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  requiresAuth?: boolean;
}

/** 로그인 시 탭 목록 */
const loggedInTabs: TabItem[] = [
  {
    label: "홈",
    url: routes.home.url,
    icon: Home,
  },
  {
    label: "기록",
    url: routes.record.url,
    icon: FileText,
    requiresAuth: true,
  },
  {
    label: "혼잡도",
    url: routes.crowd.url,
    icon: Users,
  },
  {
    label: "암장",
    url: routes.gym.url,
    icon: Building2,
  },
  {
    label: "마이",
    url: routes.profile.url,
    icon: User,
    requiresAuth: true,
  },
];

/** 비로그인 시 탭 목록 */
const guestTabs: TabItem[] = [
  {
    label: "홈",
    url: routes.home.url,
    icon: Home,
  },
  {
    label: "혼잡도",
    url: routes.crowd.url,
    icon: Users,
  },
  {
    label: "암장",
    url: routes.gym.url,
    icon: Building2,
  },
  {
    label: "로그인",
    url: routes.login.url,
    icon: User,
  },
];

const Tabbar: React.FC = () => {
  const pathname = usePathname();

  const { me: profile } = useMe();

  const tabs = profile ? loggedInTabs : guestTabs;

  const isActive = (url: string) => {
    if (url === routes.home.url) {
      return pathname === "/";
    }
    return pathname.startsWith(url);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = isActive(tab.url);

            return (
              <Link
                key={tab.url}
                href={tab.url}
                className={cn(
                  "flex flex-1 flex-col items-center justify-center gap-1 rounded-lg py-4 transition-colors",
                  active ? "text-main-600" : "text-gray-400 hover:text-gray-600"
                )}
              >
                <Icon
                  className={cn(
                    "h-6 w-6 transition-all",
                    active
                      ? "text-main-600 stroke-[2.5]"
                      : "stroke-2 text-gray-400"
                  )}
                />
                <span
                  className={cn(
                    "text-xs font-medium transition-colors",
                    active ? "text-main-600" : "text-gray-400"
                  )}
                >
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Tabbar;
