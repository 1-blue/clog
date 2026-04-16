"use client";

import {
  AlertTriangle,
  Building2,
  FileText,
  LayoutDashboard,
  MessageSquare,
  ScrollText,
  UserCheck,
  Users,
} from "lucide-react";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "#web/libs/utils";

interface IItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface IGroup {
  label: string;
  items: IItem[];
}

const GROUPS: IGroup[] = [
  {
    label: "개요",
    items: [{ href: "/admin", label: "대시보드", icon: LayoutDashboard }],
  },
  {
    label: "마스터 데이터",
    items: [{ href: "/admin/gyms", label: "암장", icon: Building2 }],
  },
  {
    label: "유저·컨텐츠",
    items: [
      { href: "/admin/users", label: "유저", icon: Users },
      { href: "/admin/posts", label: "게시글", icon: FileText },
      { href: "/admin/reviews", label: "리뷰", icon: MessageSquare },
    ],
  },
  {
    label: "운영",
    items: [
      {
        href: "/admin/error-logs",
        label: "에러 로그",
        icon: AlertTriangle,
      },
      {
        href: "/admin/audit-logs",
        label: "감사 로그",
        icon: ScrollText,
      },
      {
        href: "/admin/check-ins",
        label: "활성 체크인",
        icon: UserCheck,
      },
    ],
  },
];

interface IProps {
  onNavigate?: () => void;
}

const AdminSidebar: React.FC<IProps> = ({ onNavigate }) => {
  const pathname = usePathname();

  return (
    <nav className="flex h-full flex-col gap-6 overflow-y-auto p-4">
      <div className="px-2 pt-2">
        <Link href="/admin" className="text-lg font-bold text-on-surface">
          Clog Admin
        </Link>
      </div>

      {GROUPS.map((group) => (
        <div key={group.label} className="flex flex-col gap-1">
          <div className="px-2 text-xs font-semibold text-on-surface-variant">
            {group.label}
          </div>
          <ul className="flex flex-col gap-0.5">
            {group.items.map((item) => {
              const active =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname?.startsWith(item.href);
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors",
                      active
                        ? "bg-secondary-container text-on-secondary-container"
                        : "text-on-surface hover:bg-surface-container",
                    )}
                  >
                    <Icon className="size-4" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
};

export default AdminSidebar;
