import { useState, useMemo } from "react";
import { useIssues, useRepos } from "../../lib/api";
import { IssueListItem } from "../repo/IssueListItem";
import { Plus, Loader2 } from "lucide-react";
import { useAppContext } from "../../context/AppContext";

export function Issues() {
  const { activeAccount } = useAppContext();
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  
  const { data: allIssues, loading: loadingIssues } = useIssues();
  const { data: repos, loading: loadingRepos } = useRepos(activeAccount?.id);

  const displayLabels = useMemo(() => {
    if (!allIssues) return ["bug", "feature", "stale", "unlabeled"];
    const labels = Array.from(new Set(allIssues.flatMap(i => i.labels)));
    if (allIssues.some(i => i.labels.length === 0) && !labels.includes("unlabeled")) {
      labels.push("unlabeled");
    }
    return labels.length > 0 ? labels : ["bug", "feature", "stale", "unlabeled"];
  }, [allIssues]);

  const issuesByRepo = useMemo(() => {
    if (!allIssues) return [];
    const filteredIssues = selectedLabel 
      ? allIssues.filter(i => selectedLabel === "unlabeled" ? i.labels.length === 0 : i.labels.includes(selectedLabel))
      : allIssues;

    const grouped: Record<string, typeof allIssues> = {};
    for (const issue of filteredIssues) {
      if (!grouped[issue.repoId]) grouped[issue.repoId] = [];
      grouped[issue.repoId]!.push(issue);
    }
    return Object.entries(grouped);
  }, [allIssues, selectedLabel]);

  if (loadingIssues || loadingRepos) {
    return <div className="p-4 flex justify-center"><Loader2 className="animate-spin text-[#8A93A3]" /></div>;
  }

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-300 pb-20">
      <header className="pt-2">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-[#E7EAF0]">
          Issues
        </h1>
      </header>

      <div className="flex space-x-2 overflow-x-auto pb-1 no-scrollbar -mx-4 px-4 relative">
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

      <div>
        <button className="w-full py-4 border border-dashed border-[#242B36] rounded-xl flex items-center justify-center space-x-2 text-[#8A93A3] hover:text-[#E7EAF0] hover:border-[#8B7FFF]/50 hover:bg-[#8B7FFF]/5 transition-colors">
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#242B36] text-[#E7EAF0]">
            <Plus size={12} />
          </span>
          <span className="text-sm font-medium">New Issue from Chat</span>
        </button>
      </div>

      <div className="space-y-8 mt-4">
        {issuesByRepo.length === 0 ? (
          <p className="text-[#8A93A3] text-sm text-center py-8">No matching issues</p>
        ) : (
          issuesByRepo.map(([repoId, repoIssues]) => {
            const repo = repos?.find((r) => r.id === repoId);
            if (!repo || !repoIssues) return null;
            return (
              <div key={repoId} className="space-y-3 relative">
                <div className="sticky top-0 z-10 bg-[#0B0E13]/90 backdrop-blur-md py-2 -mx-4 px-4 border-b border-[#242B36] mb-4">
                  <h2 className="font-mono text-sm font-medium text-[#8A93A3]">
                    {repo.name}
                  </h2>
                </div>
                {repoIssues.map((issue) => (
                  <IssueListItem key={issue.id} issue={issue} />
                ))}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
