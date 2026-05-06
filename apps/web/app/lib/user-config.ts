import type { NavItem, WorkspaceConfig } from "./types";

export const workspaceConfig: WorkspaceConfig = {
  username: "vivek",
  fullName: "Vivek Jaiswal",
  plan: "Hobby",
  initials: "VJ",
  email: "vivek@runtime.app",
};

export const navItems: NavItem[] = [
  { id: "projects",      label: "Projects",              iconId: "grid"   },
  { id: "deployments",   label: "Deployments",           iconId: "deploy" },
  { id: "logs",          label: "Logs",                  iconId: "logs"   },
  { id: "analytics",     label: "Analytics",             iconId: "chart", href: "/analytics" },
  { id: "speed",         label: "Speed Insights",        iconId: "speed"  },
  { id: "observability", label: "Observability",         iconId: "eye", hasSubmenu: true },
  { id: "envvars",       label: "Environment Variables", iconId: "env",   dividerBefore: true },
  { id: "domains",       label: "Domains",               iconId: "domain" },
  { id: "integrations",  label: "Integrations",          iconId: "puzzle" },
];
