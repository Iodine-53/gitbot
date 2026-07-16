import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRepo, usePRs, useIssues, useActivity } from "../../lib/api";
import { PRListItem } from "./PRListItem";
import { IssueListItem } from "./IssueListItem";
import { ActivityFeed } from "../dashboard/ActivityFeed";
import { ActionsTab } from "./ActionsTab";
import { ChevronLeft, Plus, Loader2 } from "lucide-react";

type Tab = "prs" | "issues" | "activity" | "actions";

export function RepoDetail() {
  const { repoId } = useParams<{ repoId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("prs");
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);

  const { data: repo, loading: loadingRepo } = useRepo(repoId!);
  const { data: prsData, loading: loadingPRs } = usePRs(repoId);
  const { data: issuesData, loading: loadingIssues } = useIssues(repoId);
  const { data: activitiesData, loading: loadingActivity } = useActivity(repoId);

  const prs = prsData || [];
  const issues = issuesData || [];
  const activities = activitiesData || [];

  const displayLabels = useMemo(() => {
    if (!issuesData) return ["bug", "feature", "stale", "unlabeled"];
    const labels = Array.from(new Set(issues.flatMap(i => i.labels)));
    if (issues.some(i => i.labels.length === 0) && !labels.includes("unlabeled")) {
      labels.push("unlabeled");
    }
    return labels.length > 0 ? labels : ["bug", "feature", "stale", "unlabeled"];
  }, [issues]);

  const filteredIssues = useMemo(() => {
    if (!selectedLabel) return issues;
    if (selectedLabel === "unlabeled") return issues.filter(i => i.labels.length === 0);
    return issues.filter(i => i.labels.includes(selectedLabel));
  }, [issues, selectedLabel]);

  if (loadingRepo) return <div className="p-4 flex justify-center"><Loader2 className="animate-spin text-[#8A93A3]" /></div>;
  if (!repo) return <div className="p-4">Repo not found</div>;

  return (
    <div className="flex flex-col h-full animate-in slide-in-from-right-4 duration-300">
      <header className="sticky top-0 z-10 bg-[#0B0E13]/90 backdrop-blur-md border-b border-[#242B36] pt-4 px-4 pb-0">
        <h1 className="font-mono text-lg font-medium text-[#E7EAF0] mb-4">
          {repo.name}
        </h1>
        
        <div className="flex space-x-6 border-b border-[#242B36] overflow-x-auto no-scrollbar">
          {(["prs", "issues", "activity", "actions"] as Tab[]).map((tab) => {
            const labels = { prs: "Pull Requests", issues: "Issues", activity: "Activity", actions: "CI/CD" };
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-medium transition-colors relative whitespace-nowrap ${
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
            {loadingPRs ? (
               <div className="flex justify-center py-8"><Loader2 className="animate-spin text-[#8A93A3]" /></div>
            ) : prs.length === 0 ? (
              <p className="text-[#8A93A3] text-sm text-center py-8">No open pull requests</p>
            ) : (
              prs.map((pr) => <PRListItem key={pr.id} pr={pr} />)
            )}
          </div>
        )}

        {activeTab === "issues" && (
          <div className="space-y-3">
            <div className="flex space-x-2 mb-4 overflow-x-auto pb-1 no-scrollbar">
              {displayLabels.map((label) => {
                const isSelected = selectedLabel === label;
                return (
                  <button
                    key={label}
                    onClick={() => setSelectedLabel(isSelected ? null : label)}
                    className={`whitespace-nowrap px-3 py-1 rounded-full border text-xs transition-colors ${
                      isSelected
                        ? "bg-[#8B7FFF] border-[#8B7FFF] text-[#0B0E13]"
                        : "bg-[#161B24] border-[#242B36] text-[#E7EAF0] hover:border-[#8B7FFF]/50"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            
            <button className="w-full py-4 mb-2 border border-dashed border-[#242B36] rounded-xl flex items-center justify-center space-x-2 text-[#8A93A3] hover:text-[#E7EAF0] hover:border-[#8B7FFF]/50 hover:bg-[#8B7FFF]/5 transition-colors">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#242B36] text-[#E7EAF0]">
                <Plus size={12} />
              </span>
              <span className="text-sm font-medium">New Issue from Chat</span>
            </button>

            {loadingIssues ? (
               <div className="flex justify-center py-8"><Loader2 className="animate-spin text-[#8A93A3]" /></div>
            ) : filteredIssues.length === 0 ? (
              <p className="text-[#8A93A3] text-sm text-center py-8">No open issues</p>
            ) : (
              filteredIssues.map((issue) => <IssueListItem key={issue.id} issue={issue} />)
            )}
          </div>
        )}

        {activeTab === "activity" && (
          <div className="bg-[#161B24] border border-[#242B36] rounded-xl p-4">
            {loadingActivity ? (
               <div className="flex justify-center py-4"><Loader2 className="animate-spin text-[#8A93A3]" /></div>
            ) : activities.length === 0 ? (
              <p className="text-[#8A93A3] text-sm text-center py-4">No recent activity</p>
            ) : (
              <ActivityFeed events={activities} />
            )}
          </div>
        )}

        {activeTab === "actions" && (
          <ActionsTab repoId={repoId} />
        )}
      </div>
    </div>
  );
}
