import { Link } from "react-router-dom";
import { Repo } from "../../types";
import { HealthBar } from "../shared/HealthBar";
import { StatusPill } from "../shared/StatusPill";
import { GitPullRequest, CircleDot } from "lucide-react";

export function RepoCard({ repo }: { repo: Repo }) {
  const isFailing = repo.ciStatus === "failing";

  return (
    <Link
      to={`/repo/${repo.id}`}
      className={`block bg-[#161B24] border rounded-xl p-4 transition-colors ${
        isFailing
          ? "border-[#FF6B6B]/40 bg-[#FF6B6B]/5"
          : "border-[#242B36] hover:border-[#8B7FFF]/50"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-mono text-sm font-medium text-[#E7EAF0]">
            {repo.name}
          </h3>
          <div className="mt-1 flex items-center space-x-2">
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#242B36] text-[#8A93A3]">
              {repo.defaultBranch}
            </span>
            <StatusPill
              status={isFailing ? "danger" : "success"}
              label={isFailing ? "Failing" : "Passing"}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4 mb-4">
        <div className="flex items-center space-x-1.5 text-[#8A93A3]">
          <GitPullRequest size={14} />
          <span className="font-mono text-xs">{repo.openPRCount}</span>
        </div>
        <div className="flex items-center space-x-1.5 text-[#8A93A3]">
          <CircleDot size={14} />
          <span className="font-mono text-xs">{repo.openIssueCount}</span>
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-[10px] text-[#8A93A3]">
          <span>Health Ratio</span>
          <span className="font-mono">{Math.round(repo.healthRatio * 100)}%</span>
        </div>
        <HealthBar ratio={repo.healthRatio} />
      </div>
    </Link>
  );
}
