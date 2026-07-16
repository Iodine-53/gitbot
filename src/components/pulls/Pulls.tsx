import { usePRs, useRepos } from "../../lib/api";
import { PRListItem } from "../repo/PRListItem";
import { Loader2 } from "lucide-react";
import { useAppContext } from "../../context/AppContext";

export function Pulls() {
  const { activeAccount } = useAppContext();
  const { data: allPRs, loading: loadingPRs } = usePRs();
  const { data: repos, loading: loadingRepos } = useRepos(activeAccount?.id);

  if (loadingPRs || loadingRepos) {
    return <div className="p-4 flex justify-center"><Loader2 className="animate-spin text-[#8A93A3]" /></div>;
  }

  const grouped: Record<string, typeof allPRs> = {};
  for (const pr of (allPRs || [])) {
    if (!grouped[pr.repoId]) grouped[pr.repoId] = [];
    grouped[pr.repoId]!.push(pr);
  }
  const prsByRepo = Object.entries(grouped).filter(([_, prs]) => prs!.length > 0);

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-300 pb-20">
      <header className="pt-2">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-[#E7EAF0]">
          Pull Requests
        </h1>
      </header>

      <div className="space-y-8">
        {prsByRepo.length === 0 ? (
          <p className="text-[#8A93A3] text-sm text-center py-8">No open pull requests</p>
        ) : (
          prsByRepo.map(([repoId, prs]) => {
            const repo = repos?.find((r) => r.id === repoId);
            if (!repo || !prs) return null;
            return (
              <div key={repoId} className="space-y-3 relative">
                <div className="sticky top-0 z-10 bg-[#0B0E13]/90 backdrop-blur-md py-2 -mx-4 px-4 border-b border-[#242B36] mb-4">
                  <h2 className="font-mono text-sm font-medium text-[#8A93A3]">
                    {repo.name}
                  </h2>
                </div>
                {prs.map((pr) => (
                  <PRListItem key={pr.id} pr={pr} />
                ))}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
