"use client";

import { Menu } from "lucide-react";
import * as React from "react";

import { Button } from "#web/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "#web/components/ui/sheet";

import AdminSidebar from "./AdminSidebar";

/** 어드민 전용 셸 — 데스크톱 좌측 고정 사이드바, 모바일 햄버거 드로어 */
const AdminShell: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex min-h-dvh bg-surface">
      {/* 데스크톱 사이드바 */}
      <aside className="hidden w-60 shrink-0 border-r border-outline-variant bg-surface md:block">
        <div className="sticky top-0 h-dvh">
          <AdminSidebar />
        </div>
      </aside>

      {/* 본문 */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* 모바일 앱바 */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-outline-variant bg-surface px-4 md:hidden">
          <span className="text-base font-bold text-on-surface">
            Clog Admin
          </span>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" aria-label="메뉴 열기">
                  <Menu className="size-5" />
                </Button>
              }
            />
            <SheetContent side="left" className="w-72 p-0">
              <SheetTitle className="sr-only">관리자 메뉴</SheetTitle>
              <AdminSidebar onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>
        </header>

        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 md:px-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminShell;
