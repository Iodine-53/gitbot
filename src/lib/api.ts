import { useState, useEffect, useCallback } from "react";
import {
  mockAccounts,
  mockRepos,
  mockPRs,
  mockIssues,
  mockActivity,
  mockSettings,
  mockWorkflows,
  mockWorkflowRuns,
} from "./mockData";
import {
  Account,
  Repo,
  PullRequest,
  Issue,
  ActivityEvent,
  NotificationSettings,
  Workflow,
  WorkflowRun,
} from "../types";

const API_BASE_URL = "https://gitpatrol-backend.onrender.com/api";

const delay = <T>(data: T, ms = 300): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms));

export const api = {
  getAccounts: () => delay(mockAccounts),
  getRepos: (accountId?: string) => 
    delay(accountId ? mockRepos.filter(r => r.accountId === accountId) : mockRepos),
  getRepo: (repoId: string) => delay(mockRepos.find(r => r.id === repoId)),
  getPRs: (repoId?: string) => {
    if (repoId) return delay(mockPRs[repoId] || []);
    return delay(Object.values(mockPRs).flat());
  },
  getPR: (repoId: string, prId: string) =>
    delay((mockPRs[repoId] || []).find((p) => p.id === prId)),
  getIssues: (repoId?: string) => {
    if (repoId) return delay(mockIssues[repoId] || []);
    return delay(Object.values(mockIssues).flat());
  },
  getIssue: (repoId: string, issueId: string) =>
    delay((mockIssues[repoId] || []).find((i) => i.id === issueId)),
  getActivity: (repoId?: string) =>
    delay(repoId ? mockActivity.filter((a) => a.repoId === repoId) : mockActivity),
  getSettings: () => delay(mockSettings),
  getWorkflows: (repoId: string) => delay(mockWorkflows[repoId] || []),
  getWorkflowRuns: (repoId: string) => delay(mockWorkflowRuns[repoId] || []),
  updateIssue: async (repoId: string, issueId: string, updates: Partial<Issue>) => {
    const list = mockIssues[repoId];
    if (list) {
      const idx = list.findIndex(i => i.id === issueId);
      if (idx > -1) {
        list[idx] = { ...list[idx], ...updates };
        return delay(list[idx]);
      }
    }
    throw new Error("Issue not found");
  },
  updateSettings: async (settings: NotificationSettings) => {
    Object.assign(mockSettings, settings);
    return delay(mockSettings);
  },
  triggerWorkflow: async (repoId: string, workflowId: string) => {
    const wfs = mockWorkflows[repoId] || [];
    const wf = wfs.find(w => w.id === workflowId);
    if (!wf) throw new Error("Workflow not found");

    if (!mockWorkflowRuns[repoId]) mockWorkflowRuns[repoId] = [];
    const runs = mockWorkflowRuns[repoId];
    const newRun: WorkflowRun = {
      id: `run-${Date.now()}`,
      repoId,
      name: wf.name,
      status: "queued",
      conclusion: null,
      startedAt: "just now",
      trigger: "manual",
      branch: "main",
      duration: "0s"
    };
    runs.unshift(newRun);

    setTimeout(() => {
      const idx = runs.findIndex(r => r.id === newRun.id);
      if (idx > -1) runs[idx] = { ...runs[idx], status: "in_progress" };
    }, 2000);

    setTimeout(() => {
      const idx = runs.findIndex(r => r.id === newRun.id);
      if (idx > -1) runs[idx] = { ...runs[idx], status: "completed", conclusion: "success", duration: "5s" };
    }, 5000);

    return delay(newRun);
  },
  restartWorkflowRun: async (repoId: string, runId: string) => {
    const runs = mockWorkflowRuns[repoId] || [];
    const idx = runs.findIndex(r => r.id === runId);
    if (idx > -1) {
      runs[idx] = { ...runs[idx], status: "queued", conclusion: null, duration: "0s", startedAt: "just now" };
      
      setTimeout(() => {
        const i = runs.findIndex(r => r.id === runId);
        if (i > -1) runs[i] = { ...runs[i], status: "in_progress" };
      }, 2000);

      setTimeout(() => {
        const i = runs.findIndex(r => r.id === runId);
        if (i > -1) runs[i] = { ...runs[i], status: "completed", conclusion: "success", duration: "5s" };
      }, 5000);

      return delay(runs[idx]);
    }
    throw new Error("Run not found");
  },
};

export function useData<T>(fetcher: () => Promise<T>, dependencies: any[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  useEffect(() => {
    mutate();
  }, [mutate]);

  return { data, loading, error, mutate };
}

export const useAccounts = () => useData(() => api.getAccounts(), []);
export const useRepos = (accountId?: string) => {
  const [data, setData] = useState<Repo[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = `${API_BASE_URL}/repos`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Failed to fetch repos: ${res.statusText}`);
      }
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("text/html")) {
        const text = await res.text();
        console.error("Raw response HTML was:", text);
        throw new Error("Received HTML instead of JSON. See console for details.");
      }
      const json = await res.json();
      const mappedData: Repo[] = json.map((item: any) => ({
        ...item,
        defaultBranch: item.default_branch,
        openPRCount: item.open_pr_count,
        openIssueCount: item.open_issue_count,
        ciStatus: item.ci_status,
        healthRatio: Number(item.health_ratio),
      }));
      setData(mappedData);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [accountId]);

  useEffect(() => {
    mutate();
  }, [mutate]);

  return { data, loading, error, mutate };
};
export const useRepo = (repoId: string) => useData(() => api.getRepo(repoId), [repoId]);
export const usePRs = (repoId?: string) => {
  const [data, setData] = useState<PullRequest[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(async () => {
    if (!repoId) {
      setData([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/repos/${encodeURIComponent(repoId)}/prs`);
      if (!res.ok) {
        throw new Error(`Failed to fetch PRs: ${res.statusText}`);
      }
      const json = await res.json();
      const mappedData: PullRequest[] = json.map((pr: any) => ({
        ...pr,
        repoId: pr.repo_id,
        openedAt: pr.opened_at,
        aiSummary: pr.ai_summary,
        author: {
          name: pr.author_name,
          avatarColor: pr.author_avatar_color,
          initials: pr.author_initials,
        },
        filesChanged: pr.files_changed || [{ filename: "src/App.tsx", additions: 15, deletions: 2 }],
      }));
      setData(mappedData);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [repoId]);

  useEffect(() => {
    mutate();
  }, [mutate]);

  return { data, loading, error, mutate };
};
export const usePR = (repoId: string, prId: string) => useData(() => api.getPR(repoId, prId), [repoId, prId]);
export const useIssues = (repoId?: string) => {
  const [data, setData] = useState<Issue[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(async () => {
    if (!repoId) {
      setData([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/repos/${encodeURIComponent(repoId)}/issues`);
      if (!res.ok) {
        throw new Error(`Failed to fetch issues: ${res.statusText}`);
      }
      const json = await res.json();
      const mappedData: Issue[] = json.map((issue: any) => ({
        ...issue,
        repoId: issue.repo_id,
        openedAt: issue.opened_at,
        linkedChat: issue.linked_chat,
        assignees: [],
      }));
      setData(mappedData);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [repoId]);

  useEffect(() => {
    mutate();
  }, [mutate]);

  return { data, loading, error, mutate };
};
export const useIssue = (repoId: string, issueId: string) => useData(() => api.getIssue(repoId, issueId), [repoId, issueId]);
export const useActivity = (repoId?: string) => useData(() => api.getActivity(repoId), [repoId]);
export const useSettings = () => useData(() => api.getSettings(), []);
export const useWorkflows = (repoId: string) => useData(() => api.getWorkflows(repoId), [repoId]);
export const useWorkflowRuns = (repoId: string) => useData(() => api.getWorkflowRuns(repoId), [repoId]);
