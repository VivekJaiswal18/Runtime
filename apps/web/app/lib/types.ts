export type ProjectStatus = "Ready" | "Building" | "Failed";

export type DeploymentState = "Success" | "In Progress" | "Error";

export type Theme = "light" | "dark" | "system";

export type Project = {
  id: string;
  name: string;
  domain: string;
  repo: string;
  branch: string;
  status: ProjectStatus;
  updatedAt: string;
  lastCommit: string;
};

export type Deployment = {
  id: string;
  projectName: string;
  branch: string;
  commitMessage: string;
  author: string;
  createdAt: string;
  state: DeploymentState;
};

export type UsageMetric = {
  label: string;
  value: string;
  /** Fill width for the usage bar (0–100); may be normalized for readability. */
  percentUsed: number;
};

export type NavItem = {
  id: string;
  label: string;
  /** If set, sidebar renders a Next.js `Link` to this path instead of in-page selection only. */
  href?: string;
  iconId?: string;
  hasSubmenu?: boolean;
  dividerBefore?: boolean;
};

export type WorkspaceConfig = {
  username: string;
  fullName: string;
  plan: string;
  initials: string;
  email: string;
};
