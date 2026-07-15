import { Issue } from "../../types";
import { CircleDot } from "lucide-react";

export function IssueListItem({ issue }: { issue: Issue }) {
  return (
    <div className="bg-[#161B24] border border-[#242B36] rounded-xl p-4">
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
          <div className="flex items-center space-x-2 mt-3">
            <span className="font-mono text-xs text-[#8A93A3]">#{issue.number}</span>
            <span className="text-[#242B36]">•</span>
            <span className="text-xs text-[#8A93A3]">{issue.openedAt}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
