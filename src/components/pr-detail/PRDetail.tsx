import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePR } from "../../lib/api";
import { Avatar } from "../shared/Avatar";
import { StatusPill } from "../shared/StatusPill";
import { ChevronLeft, Sparkles, ExternalLink, Beaker, Loader2 } from "lucide-react";

export function PRDetail() {
  const { repoId, prId } = useParams<{ repoId: string; prId: string }>();
  const navigate = useNavigate();
  const [testingState, setTestingState] = useState<"idle" | "testing" | "passed" | "failed">("idle");

  const { data: pr, loading } = usePR(repoId!, prId!);

  if (loading) return <div className="p-4 flex justify-center"><Loader2 className="animate-spin text-[#8A93A3]" /></div>;
  if (!pr) return <div className="p-4">PR not found</div>;

  const statusMap = {
    needs_review: { status: "warning" as const, label: "Needs Review" },
    approved: { status: "success" as const, label: "Approved" },
    changes_requested: { status: "danger" as const, label: "Changes Req" },
  };
  const statusConfig = statusMap[pr.status];

  const handleTest = () => {
    setTestingState("testing");
    setTimeout(() => {
      setTestingState(Math.random() > 0.5 ? "passed" : "failed");
    }, 2000);
  };

  return (
    <div className="flex flex-col pb-8 animate-in slide-in-from-right-4 duration-300">
      <div className="p-4 space-y-6">
        {/* Header section */}
        <div>
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-xl font-medium text-[#E7EAF0] leading-tight pr-4">
              {pr.title}
            </h1>
            <StatusPill status={statusConfig.status} label={statusConfig.label} />
          </div>
          
          <div className="flex items-center space-x-3">
            <Avatar initials={pr.author.initials} color={pr.author.avatarColor} />
            <div>
              <div className="text-sm text-[#E7EAF0]">{pr.author.name}</div>
              <div className="text-xs text-[#8A93A3]">
                opened <span className="font-mono">{pr.number}</span> • {pr.openedAt}
              </div>
            </div>
          </div>
        </div>

        {/* AI Summary */}
        <div className="bg-[#8B7FFF]/10 border border-[#8B7FFF]/30 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2 text-[#8B7FFF]">
            <Sparkles size={14} />
            <span className="font-heading text-xs font-semibold uppercase tracking-wider">AI Summary</span>
          </div>
          <p className="text-sm text-[#E7EAF0] leading-relaxed">
            {pr.aiSummary}
          </p>
        </div>

        {/* File Changes */}
        <div>
          <h2 className="font-heading text-sm font-semibold text-[#8A93A3] uppercase tracking-wider mb-3">
            Files Changed
          </h2>
          <div className="bg-[#161B24] border border-[#242B36] rounded-xl overflow-hidden">
            {pr.filesChanged.map((file, idx) => (
              <div
                key={file.filename}
                className={`flex items-center justify-between p-3 ${
                  idx !== pr.filesChanged.length - 1 ? "border-b border-[#242B36]" : ""
                }`}
              >
                <span className="font-mono text-xs text-[#E7EAF0] truncate max-w-[60%]">
                  {file.filename}
                </span>
                <div className="flex items-center space-x-3 font-mono text-xs">
                  <span className="text-[#3FD68B]">+{file.additions}</span>
                  <span className="text-[#FF6B6B]">-{file.deletions}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-4">
          <div className="grid grid-cols-2 gap-3">
            <button className="py-3 bg-[#161B24] border border-[#242B36] rounded-xl text-sm font-medium text-[#E7EAF0] hover:bg-[#242B36] transition-colors">
              Request changes
            </button>
            <button className="py-3 bg-[#3FD68B] text-[#0B0E13] rounded-xl text-sm font-medium hover:bg-[#3FD68B]/90 transition-colors">
              Approve
            </button>
          </div>
          
          <button className="w-full py-3 bg-[#FF6B6B]/15 border border-[#FF6B6B]/30 text-[#FF6B6B] rounded-xl text-sm font-medium hover:bg-[#FF6B6B]/20 transition-colors">
            Merge Pull Request
          </button>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleTest}
              disabled={testingState === "testing"}
              className="flex items-center justify-center space-x-2 py-3 bg-[#161B24] border border-[#242B36] rounded-xl text-sm font-medium text-[#E7EAF0] hover:bg-[#242B36] transition-colors disabled:opacity-50"
            >
              <Beaker size={16} />
              <span>
                {testingState === "idle" && "Pull to test"}
                {testingState === "testing" && "Running..."}
                {testingState === "passed" && "✓ Passed"}
                {testingState === "failed" && "✕ Failed"}
              </span>
            </button>
            <button className="flex items-center justify-center space-x-2 py-3 bg-[#161B24] border border-[#242B36] rounded-xl text-sm font-medium text-[#E7EAF0] hover:bg-[#242B36] transition-colors">
              <span>View on GitHub</span>
              <ExternalLink size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
