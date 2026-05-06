"use client";

import { createContext, useContext, type ReactNode } from "react";

type DashboardShellContextValue = {
  setSidebarOpen: (open: boolean) => void;
};

const DashboardShellContext = createContext<DashboardShellContextValue | null>(null);

export function DashboardShellProvider({
  value,
  children,
}: Readonly<{ value: DashboardShellContextValue; children: ReactNode }>): React.JSX.Element {
  return <DashboardShellContext.Provider value={value}>{children}</DashboardShellContext.Provider>;
}

export function useDashboardShell(): DashboardShellContextValue {
  const ctx = useContext(DashboardShellContext);
  if (!ctx) {
    throw new Error("useDashboardShell must be used within DashboardLayout");
  }
  return ctx;
}
