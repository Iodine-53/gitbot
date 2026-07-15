export interface Repo {
  id: string;
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
}

export interface ActivityEvent {
  id: string;
  type: "pr_opened" | "build_failed" | "release_published" | "issue_opened" | "pr_merged";
  repoName: string;
  repoId: string;
  message: string;
  timestamp: string;
}

export interface NotificationSettings {
  newPRs: boolean;
  ciFailures: boolean; // Locked to true
  newIssues: boolean;
  releases: boolean;
  digestFrequency: "off" | "hourly" | "daily";
}
