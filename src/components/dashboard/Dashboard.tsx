import { RepoCard } from "./RepoCard";
import { ActivityFeed } from "./ActivityFeed";
import { Plus, Loader2 } from "lucide-react";
import { AccountSwitcher } from "./AccountSwitcher";
import { useRepos, useActivity } from "../../lib/api";
import { useAppContext } from "../../context/AppContext";

export function Dashboard() {
  const { activeAccount } = useAppContext();
  const { data: repos, loading: loadingRepos } = useRepos(activeAccount?.id);
  const { data: activity, loading: loadingActivity } = useActivity();

  if (loadingRepos || loadingActivity) {
    return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-[#8A93A3]" /></div>;
  }

  // Sort repos: failing first
  const sortedRepos = [...(repos || [])].sort((a, b) => {
    if (a.ciStatus === "failing" && b.ciStatus === "passing") return -1;
    if (a.ciStatus === "passing" && b.ciStatus === "failing") return 1;
    return 0;
  });

  return (
    <div className="p-4 space-y-8 animate-in fade-in duration-300">
      <header className="pt-2 flex justify-between items-start">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-[#E7EAF0]">
            Dashboard
          </h1>
          <p className="text-sm text-[#8A93A3] mt-1">
            Monitoring {repos?.length || 0} repositories
          </p>
        </div>
        <AccountSwitcher />
      </header>

      <section className="space-y-3">
        <h2 className="font-heading text-sm font-semibold text-[#8A93A3] uppercase tracking-wider">
          Repositories
        </h2>
        <div className="space-y-3">
          {sortedRepos.map((repo) => (
            <RepoCard key={repo.id} repo={repo} />
          ))}
          <button className="w-full py-4 border border-dashed border-[#242B36] rounded-xl flex items-center justify-center space-x-2 text-[#8A93A3] hover:text-[#E7EAF0] hover:border-[#8B7FFF]/50 hover:bg-[#8B7FFF]/5 transition-colors">
            <Plus size={16} />
            <span className="text-sm font-medium">Connect repo</span>
          </button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-sm font-semibold text-[#8A93A3] uppercase tracking-wider">
          Today's Activity
        </h2>
        <div className="bg-[#161B24] border border-[#242B36] rounded-xl p-4">
          <ActivityFeed events={activity || []} />
        </div>
      </section>
    </div>
  );
}
