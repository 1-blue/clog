"use client";

import {
  Calendar,
  Home,
  MessageSquare,
  Search,
  User,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { ROUTES } from "#web/constants";

interface INavItem {
  path: string;
  label: string;
  icon: LucideIcon;
}

const NAV_ITEMS: INavItem[] = [
  { path: ROUTES.HOME.path, label: "홈", icon: Home },
  { path: ROUTES.GYMS.path, label: "암장", icon: Search },
  { path: ROUTES.COMMUNITY.path, label: "커뮤니티", icon: MessageSquare },
  { path: ROUTES.RECORDS.path, label: "기록", icon: Calendar },
  { path: ROUTES.MY.path, label: "마이", icon: User },
];

/** 하단 네비 숨김 경로 */
const HIDDEN_PATHS = ["/login"];

const BottomNav = () => {
  const pathname = usePathname();

  if (HIDDEN_PATHS.some((p) => pathname.startsWith(p))) return null;

  return (
    <nav className="fixed right-0 bottom-0 left-0 z-50 border-t border-outline-variant bg-surface-container/80 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-lg items-center justify-around">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.path === "/"
              ? pathname === "/"
              : pathname.startsWith(item.path);
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              href={item.path}
              replace
              className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <Icon
                className="size-6"
                fill={isActive ? "currentColor" : "none"}
              />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
