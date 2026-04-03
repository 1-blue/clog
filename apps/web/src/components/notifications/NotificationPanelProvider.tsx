"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import NotificationListSection from "#web/app/(auth)/notifications/_source/components/NotificationListSection";
import { Dialog, DialogContent, DialogTitle } from "#web/components/ui/dialog";

interface INotificationPanelContext {
  open: () => void;
  close: () => void;
  isOpen: boolean;
}

const NotificationPanelContext =
  createContext<INotificationPanelContext | null>(null);

export const useNotificationPanel = () =>
  useContext(NotificationPanelContext);

const NotificationPanelDialog = () => {
  const ctx = useNotificationPanel();
  if (!ctx) return null;

  return (
    <Dialog
      open={ctx.isOpen}
      onOpenChange={(next) => {
        if (!next) ctx.close();
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="fixed top-0 left-0 flex h-dvh max-h-dvh w-full max-w-none translate-x-0 translate-y-0 flex-col gap-0 overflow-hidden rounded-none border-0 p-0 sm:max-w-none"
      >
        <DialogTitle className="sr-only">알림</DialogTitle>
        <NotificationListSection showCloseButton />
      </DialogContent>
    </Dialog>
  );
};

export const NotificationPanelProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [isOpen, setOpen] = useState(false);
  const open = useCallback(() => setOpen(true), []);
  const close = useCallback(() => setOpen(false), []);

  const value = useMemo(
    () => ({
      open,
      close,
      isOpen,
    }),
    [open, close, isOpen],
  );

  return (
    <NotificationPanelContext.Provider value={value}>
      {children}
      <NotificationPanelDialog />
    </NotificationPanelContext.Provider>
  );
};
