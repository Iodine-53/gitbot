import { ActivityEvent } from "../../types";
import { GitPullRequest, AlertCircle, Tag, CircleDot, GitMerge } from "lucide-react";

export function ActivityFeed({ events }: { events: ActivityEvent[] }) {
  const getIconInfo = (type: ActivityEvent["type"]) => {
    switch (type) {
      case "pr_opened":
        return { icon: GitPullRequest, color: "text-[#E7EAF0]" };
      case "pr_merged":
        return { icon: GitMerge, color: "text-[#8B7FFF]" };
      case "build_failed":
        return { icon: AlertCircle, color: "text-[#FF6B6B]" };
      case "release_published":
        return { icon: Tag, color: "text-[#3FD68B]" };
      case "issue_opened":
        return { icon: CircleDot, color: "text-[#F2A93B]" };
    }
  };

  return (
    <div className="space-y-4">
      {events.map((event) => {
        const { icon: Icon, color } = getIconInfo(event.type);
        return (
          <div key={event.id} className="flex items-start space-x-3">
            <div className={`mt-0.5 ${color}`}>
              <Icon size={16} />
            </div>
            <div className="flex-1">
              <p className="text-sm text-[#E7EAF0]">{event.message}</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="font-mono text-[10px] text-[#8A93A3]">
                  {event.repoName}
                </span>
                <span className="text-[#242B36]">•</span>
                <span className="text-[10px] text-[#8A93A3]">
                  {event.timestamp}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}