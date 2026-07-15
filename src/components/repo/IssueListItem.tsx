import { Issue } from "../../types";
import { CircleDot, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar } from "../shared/Avatar";

export function IssueListItem({ issue }: { issue: Issue }) {
  return (
    <Link
      to={`/repo/${issue.repoId}/issue/${issue.id}`}
      className="block bg-[#161B24] border border-[#242B36] rounded-xl p-4 hover:border-[#8B7FFF]/50 transition-colors"
    >
      <div className="flex items-start space-x-3">
        <div className="mt-0.5 text-[#3FD68B]">
          <CircleDot size={16} />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-[#E7EAF0] leading-snug">
            {issue.title}
          </h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {issue.labels.map((label) => (
              <span
                key={label}
                className="px-2 py-0.5 rounded border border-[#242B36] bg-[#0B0E13] text-[10px] text-[#8A93A3] uppercase tracking-wider"
              >
                {label}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs text-[#8A93A3]">#{issue.number}</span>
              <span className="text-[#242B36]">•</span>
              <span className="text-xs text-[#8A93A3]">{issue.openedAt}</span>
              {issue.linkedChat && (
                <>
                  <span className="text-[#242B36]">•</span>
                  <MessageSquare size={12} className="text-[#8B7FFF]" />
                </>
              )}
            </div>
            {issue.assignees && issue.assignees.length > 0 && (
              <div className="flex -space-x-1">
                {issue.assignees.map((assignee, idx) => (
                  <div key={idx} className="ring-2 ring-[#161B24] rounded-full">
                    <Avatar initials={assignee.initials} color={assignee.avatarColor} size="sm" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
