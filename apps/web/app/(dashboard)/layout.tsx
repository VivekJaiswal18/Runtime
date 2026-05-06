import type { ReactNode } from "react";

export default function DashboardLayout({ children }: Readonly<{ children: ReactNode }>): React.JSX.Element {
  return <>{children}</>;
}
