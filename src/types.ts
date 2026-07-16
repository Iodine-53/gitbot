export interface Account {
  id: string;
  provider: "github" | "github_enterprise" | "gitlab" | "bitbucket";
  handle: string;
  avatarColor: string;
  initials: string;
  isEnterprise?: boolean;
  enterpriseUrl?: string;
}

export interface Repo {
  id: string;
  accountId: string;
  name: string;
  defaultBranch: string;
  openPRCount: number;
  openIssueCount: number;
  ciStatus: "passing" | "failing";
  healthRatio: number; // 0-1
}

export interface PullRequest {
  id: string;
  repoId: string;
  number: number;
  title: string;
  author: {
    name: string;
    avatarColor: string;
    initials: string;
  };
  status: "needs_review" | "approved" | "changes_requested";
  filesChanged: {
    filename: string;
    additions: number;
    deletions: number;
  }[];
  aiSummary: string;
  openedAt: string;
}

export interface Issue {
  id: string;
  repoId: string;
  number: number;
  title: string;
  labels: string[];
  openedAt: string;
  assignees?: {
    name: string;
    avatarColor: string;
    initials: string;
  }[];
  body?: string;
  linkedChat?: string;
}

export interface ActivityEvent {
  id: string;
  type: "pr_opened" | "build_failed" | "release_published" | "issue_opened" | "pr_merged";
  repoName: string;
  repoId: string;
  message: string;
  timestamp: string;
}

export interface Workflow {
  id: string;
  repoId: string;
  name: string;
  description: string;
  dispatchable: boolean;
}

export interface WorkflowRun {
  id: string;
  repoId: string;
  name: string;
  status: "in_progress" | "completed" | "queued";
  conclusion: "success" | "failure" | "cancelled" | "skipped" | null;
  branch: string;
  trigger: "push" | "manual" | "pull_request";
  startedAt: string;
  duration: string;
}

export interface NotificationSettings {
  newPRs: "instant" | "digest" | "off";
  ciFailures: "instant"; // Locked to instant
  newIssues: "instant" | "digest" | "off";
  releases: "instant" | "digest" | "off";
  digestFrequency: "off" | "hourly" | "daily";
}
