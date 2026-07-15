import { Account, ActivityEvent, Issue, NotificationSettings, PullRequest, Repo, Workflow, WorkflowRun } from '../types';

export const mockAccounts: Account[] = [
  {
    id: "acc-1",
    provider: "github",
    handle: "personal-dev",
    avatarColor: "bg-blue-500",
    initials: "PD",
  },
  {
    id: "acc-2",
    provider: "github_enterprise",
    handle: "acme-corp-admin",
    avatarColor: "bg-purple-500",
    initials: "AC",
    isEnterprise: true,
    enterpriseUrl: "github.acme.corp",
  },
  {
    id: "acc-3",
    provider: "gitlab",
    handle: "gitlab-user",
    avatarColor: "bg-orange-500",
    initials: "GU",
  }
];

export const mockRepos: Repo[] = [
  {
    id: "repo-1",
    name: "acme-corp/frontend-app",
    defaultBranch: "main",
    openPRCount: 12,
    openIssueCount: 5,
    ciStatus: "failing",
    healthRatio: 0.65,
  },
  {
    id: "repo-2",
    name: "acme-corp/auth-service",
    defaultBranch: "master",
    openPRCount: 3,
    openIssueCount: 0,
    ciStatus: "passing",
    healthRatio: 0.95,
  },
  {
    id: "repo-3",
    name: "acme-corp/design-system",
    defaultBranch: "main",
    openPRCount: 8,
    openIssueCount: 24,
    ciStatus: "passing",
    healthRatio: 0.88,
  },
  {
    id: "repo-4",
    name: "acme-corp/infra-as-code",
    defaultBranch: "main",
    openPRCount: 1,
    openIssueCount: 1,
    ciStatus: "passing",
    healthRatio: 1.0,
  }
];

export const mockPRs: Record<string, PullRequest[]> = {
  "repo-1": [
    {
      id: "pr-101",
      repoId: "repo-1",
      number: 402,
      title: "feat: redesign dashboard layout",
      author: { name: "Alice Smith", avatarColor: "bg-blue-500", initials: "AS" },
      status: "needs_review",
      filesChanged: [
        { filename: "src/components/Dashboard.tsx", additions: 145, deletions: 20 },
        { filename: "src/styles/layout.css", additions: 50, deletions: 10 },
      ],
      aiSummary: "This PR introduces a new dashboard layout using CSS grid. It reorganizes the primary widgets and updates the responsive breakpoints for better mobile viewing. Note: the old sidebar component has been deprecated.",
      openedAt: "2 hours ago",
    },
    {
      id: "pr-102",
      repoId: "repo-1",
      number: 403,
      title: "fix: memory leak in chart component",
      author: { name: "Bob Jones", avatarColor: "bg-purple-500", initials: "BJ" },
      status: "changes_requested",
      filesChanged: [
        { filename: "src/components/ChartWidget.tsx", additions: 12, deletions: 5 },
      ],
      aiSummary: "Fixes an issue where chart instances were not properly destroyed on unmount, leading to memory leaks over time. Reviewer requested additional test coverage.",
      openedAt: "5 hours ago",
    },
    {
      id: "pr-103",
      repoId: "repo-1",
      number: 405,
      title: "chore: update dependencies",
      author: { name: "Dependabot", avatarColor: "bg-gray-600", initials: "DB" },
      status: "approved",
      filesChanged: [
        { filename: "package.json", additions: 4, deletions: 4 },
        { filename: "yarn.lock", additions: 120, deletions: 120 },
      ],
      aiSummary: "Automated dependency updates including React to 18.3.0 and Vite to 5.2.0. CI is currently failing on e2e tests.",
      openedAt: "1 day ago",
    }
  ],
  "repo-2": [
    {
      id: "pr-201",
      repoId: "repo-2",
      number: 89,
      title: "feat: add OAuth2 providers",
      author: { name: "Charlie Day", avatarColor: "bg-green-500", initials: "CD" },
      status: "needs_review",
      filesChanged: [
        { filename: "pkg/auth/oauth.go", additions: 340, deletions: 0 },
        { filename: "pkg/auth/config.go", additions: 25, deletions: 2 },
      ],
      aiSummary: "Adds support for Google and GitHub OAuth providers. Includes new configuration structs and callback handlers.",
      openedAt: "3 hours ago",
    }
  ]
};

export const mockIssues: Record<string, Issue[]> = {
  "repo-1": [
    {
      id: "issue-1",
      repoId: "repo-1",
      number: 399,
      title: "App crashes on iOS 15 Safari",
      labels: ["bug", "high-priority"],
      openedAt: "1 day ago",
      assignees: [
        { name: "Alice Smith", avatarColor: "bg-blue-500", initials: "AS" }
      ],
      body: "When opening the app on iOS 15 Safari, it immediately crashes with a white screen. Console shows a Regex constraint error.",
      linkedChat: "Telegram Chat: Customer Support Group"
    },
    {
      id: "issue-2",
      repoId: "repo-1",
      number: 400,
      title: "Add dark mode toggle to settings",
      labels: ["feature", "good first issue"],
      openedAt: "3 days ago",
      assignees: [],
      body: "We need a way for users to manually toggle dark mode overriding system settings."
    }
  ]
};

export const mockActivity: ActivityEvent[] = [
  {
    id: "evt-1",
    type: "build_failed",
    repoName: "acme-corp/frontend-app",
    repoId: "repo-1",
    message: "CI failed on main branch",
    timestamp: "10m ago"
  },
  {
    id: "evt-2",
    type: "pr_opened",
    repoName: "acme-corp/auth-service",
    repoId: "repo-2",
    message: "PR #89 opened by Charlie Day",
    timestamp: "3h ago"
  },
  {
    id: "evt-3",
    type: "release_published",
    repoName: "acme-corp/design-system",
    repoId: "repo-3",
    message: "v2.1.0 published",
    timestamp: "5h ago"
  },
  {
    id: "evt-4",
    type: "issue_opened",
    repoName: "acme-corp/frontend-app",
    repoId: "repo-1",
    message: "Issue #399 opened by Alice Smith",
    timestamp: "1d ago"
  }
];

export const mockSettings: NotificationSettings = {
  newPRs: "instant",
  ciFailures: "instant",
  newIssues: "off",
  releases: "digest",
  digestFrequency: "hourly"
};

export const mockWorkflows: Record<string, Workflow[]> = {
  "repo-1": [
    { id: "wf-1", repoId: "repo-1", name: "CI Pipeline", description: "Runs linting and tests", dispatchable: false },
    { id: "wf-2", repoId: "repo-1", name: "Production Deploy", description: "Deploys main to prod", dispatchable: true },
    { id: "wf-3", repoId: "repo-1", name: "Rollback", description: "Reverts prod to previous release", dispatchable: true },
  ],
  "repo-2": [
    { id: "wf-4", repoId: "repo-2", name: "Build and Push Container", description: "Builds Docker image", dispatchable: true },
  ]
};

export const mockWorkflowRuns: Record<string, WorkflowRun[]> = {
  "repo-1": [
    { id: "run-1", repoId: "repo-1", name: "CI Pipeline", status: "completed", conclusion: "failure", branch: "main", trigger: "push", startedAt: "10m ago", duration: "2m 14s" },
    { id: "run-2", repoId: "repo-1", name: "Production Deploy", status: "completed", conclusion: "success", branch: "main", trigger: "manual", startedAt: "2h ago", duration: "5m 30s" },
    { id: "run-3", repoId: "repo-1", name: "CI Pipeline", status: "in_progress", conclusion: null, branch: "feat/new-dashboard", trigger: "pull_request", startedAt: "1m ago", duration: "1m 12s" },
  ],
  "repo-2": [
    { id: "run-4", repoId: "repo-2", name: "Build and Push Container", status: "completed", conclusion: "success", branch: "master", trigger: "push", startedAt: "1d ago", duration: "4m 20s" }
  ]
};
