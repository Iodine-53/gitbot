import { PullRequest } from "../../types";
import { Avatar } from "../shared/Avatar";
import { StatusPill } from "../shared/StatusPill";
import { GitPullRequest } from "lucide-react";
import { Link } from "react-router-dom";

export function PRListItem({ pr }: { pr: PullRequest }) {
  const statusMap = {
    needs_review: { status: "warning" as const, label: "Needs Review" },
    approved: { status: "success" as const, label: "Approved" },
    changes_requested: { status: "danger" as const, label: "Changes Req" },
  };

  const statusConfig = statusMap[pr.status];

  return (
    <Link
      to={`/repo/${pr.repoId}/pr/${pr.id}`}
      className="block bg-[#161B24] border border-[#242B36] rounded-xl p-4 hover:border-[#8B7FFF]/50 transition-colors"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="pr-2">
          <h3 className="text-sm font-medium text-[#E7EAF0] leading-snug">
            {pr.title}
          </h3>
          <div className="flex items-center space-x-2 mt-2">
            <span className="font-mono text-xs text-[#8A93A3]">#{pr.number}</span>
            <span className="text-[#242B36]">•</span>
            <span className="text-xs text-[#8A93A3]">{pr.openedAt}</span>
          </div>
        </div>
        <StatusPill status={statusConfig.status} label={statusConfig.label} />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Avatar
            initials={pr.author.initials}
            color={pr.author.avatarColor}
            size="sm"
          />
          <span className="text-xs text-[#8A93A3]">{pr.author.name}</span>
        </div>
        
        <div className="flex items-center space-x-3 font-mono text-[10px]">
          <span className="text-[#3FD68B]">
            +{pr.filesChanged.reduce((acc, f) => acc + f.additions, 0)}
          </span>
          <span className="text-[#FF6B6B]">
            -{pr.filesChanged.reduce((acc, f) => acc + f.deletions, 0)}
          </span>
        </div>
      </div>
    </Link>
  );
}
