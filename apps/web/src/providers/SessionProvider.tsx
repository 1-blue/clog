"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

const SessionProvider: React.FC<React.PropsWithChildren> = ({ children }) => (
  <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
);

export default SessionProvider;
