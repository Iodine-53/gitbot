import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { mockRepos, mockPRs, mockIssues, mockActivity } from "../../lib/mockData";
import { PRListItem } from "./PRListItem";
import { IssueListItem } from "./IssueListItem";
import { ActivityFeed } from "../dashboard/ActivityFeed";
import { ChevronLeft } from "lucide-react";

type Tab = "prs" | "issues" | "activity";

export function RepoDetail() {
  const { repoId } = useParams<{ repoId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("prs");

  const repo = mockRepos.find((r) => r.id === repoId);
  const prs = mockPRs[repoId || ""] || [];
  const issues = mockIssues[repoId || ""] || [];
  const activities = mockActivity.filter((a) => a.repoId === repoId);

  if (!repo) return <div className="p-4">Repo not found</div>;

  return (
    <div className="flex flex-col h-full animate-in slide-in-from-right-4 duration-300">
      <header className="sticky top-0 z-10 bg-[#0B0E13]/90 backdrop-blur-md border-b border-[#242B36] pt-4 px-4 pb-0">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-[#8A93A3] hover:text-[#E7EAF0] mb-4 transition-colors"
        >
          <ChevronLeft size={20} />
          <span className="font-medium text-sm">Back</span>
        </button>
        <h1 className="font-mono text-lg font-medium text-[#E7EAF0] mb-4">
          {repo.name}
        </h1>
        
        <div className="flex space-x-6 border-b border-[#242B36]">
          {(["prs", "issues", "activity"] as Tab[]).map((tab) => {
            const labels = { prs: "Pull Requests", issues: "Issues", activity: "Activity" };
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-medium transition-colors relative ${
                  activeTab === tab ? "text-[#8B7FFF]" : "text-[#8A93A3] hover:text-[#E7EAF0]"
                }`}
              >
                {labels[tab]}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8B7FFF] rounded-t-full" />
                )}
              </button>
            );
          })}
        </div>
      </header>

      <div className="p-4 space-y-4">
        {activeTab === "prs" && (
          <div className="space-y-3">
            {prs.length === 0 ? (
              <p className="text-[#8A93A3] text-sm text-center py-8">No open pull requests</p>
            ) : (
              prs.map((pr) => <PRListItem key={pr.id} pr={pr} />)
            )}
          </div>
        )}

        {activeTab === "issues" && (
          <div className="space-y-3">
            <div className="flex space-x-2 mb-4 overflow-x-auto pb-1 no-scrollbar">
              {["bug", "feature", "high-priority"].map((label) => (
                <button
                  key={label}
                  className="whitespace-nowrap px-3 py-1 rounded-full bg-[#161B24] border border-[#242B36] text-xs text-[#E7EAF0]"
                >
                  {label}
                </button>
              ))}
            </div>
            {issues.length === 0 ? (
              <p className="text-[#8A93A3] text-sm text-center py-8">No open issues</p>
            ) : (
              issues.map((issue) => <IssueListItem key={issue.id} issue={issue} />)
            )}
          </div>
        )}

        {activeTab === "activity" && (
          <div className="bg-[#161B24] border border-[#242B36] rounded-xl p-4">
            {activities.length === 0 ? (
              <p className="text-[#8A93A3] text-sm text-center py-4">No recent activity</p>
            ) : (
              <ActivityFeed events={activities} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
