import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { mockIssues, mockAccounts } from "../../lib/mockData";
import { Avatar } from "../shared/Avatar";
import { ChevronLeft, CircleDot, MessageSquare, Plus, Tag as TagIcon, X } from "lucide-react";

export function IssueDetail() {
  const { repoId, issueId } = useParams<{ repoId: string; issueId: string }>();
  const navigate = useNavigate();

  // Find issue in mock data
  const repoIssues = mockIssues[repoId || ""] || [];
  const initialIssue = repoIssues.find((i) => i.id === issueId);

  const [issue, setIssue] = useState(initialIssue);
  const [showAssignees, setShowAssignees] = useState(false);
  const [showLabels, setShowLabels] = useState(false);

  const availableLabels = ["bug", "feature", "high-priority", "good first issue", "stale", "documentation"];

  if (!issue) return <div className="p-4">Issue not found</div>;

  const toggleAssignee = (account: typeof mockAccounts[0]) => {
    const current = issue.assignees || [];
    const exists = current.find(a => a.name === account.handle);
    let next;
    if (exists) {
      next = current.filter(a => a.name !== account.handle);
    } else {
      next = [...current, { name: account.handle, avatarColor: account.avatarColor, initials: account.initials }];
    }
    setIssue({ ...issue, assignees: next });
  };

  const toggleLabel = (label: string) => {
    const exists = issue.labels.includes(label);
    let next;
    if (exists) {
      next = issue.labels.filter(l => l !== label);
    } else {
      next = [...issue.labels, label];
    }
    setIssue({ ...issue, labels: next });
  };

  return (
    <div className="flex flex-col pb-8 animate-in slide-in-from-right-4 duration-300">
      <header className="sticky top-0 z-10 bg-[#0B0E13]/90 backdrop-blur-md border-b border-[#242B36] p-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-[#8A93A3] hover:text-[#E7EAF0] transition-colors"
        >
          <ChevronLeft size={20} />
          <span className="font-medium text-sm">Back</span>
        </button>
      </header>

      <div className="p-4 space-y-6">
        {/* Header section */}
        <div>
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-xl font-medium text-[#E7EAF0] leading-tight pr-4">
              {issue.title}
            </h1>
            <span className="mt-1 text-[#3FD68B]">
              <CircleDot size={20} />
            </span>
          </div>
          
          <div className="flex items-center space-x-2 text-xs text-[#8A93A3]">
            <span className="font-mono">#{issue.number}</span>
            <span className="text-[#242B36]">•</span>
            <span>opened {issue.openedAt}</span>
          </div>
        </div>

        {/* Labels & Assignees Triage Area */}
        <div className="grid grid-cols-2 gap-4 border-y border-[#242B36] py-4">
          <div className="relative">
            <div className="text-[10px] font-semibold text-[#8A93A3] uppercase tracking-wider mb-2">Assignees</div>
            <div className="flex flex-wrap gap-2">
              {issue.assignees?.map((assignee, idx) => (
                <div key={idx} className="flex items-center space-x-1.5 bg-[#161B24] border border-[#242B36] rounded-full pl-1 pr-2 py-0.5">
                  <Avatar initials={assignee.initials} color={assignee.avatarColor} size="sm" />
                  <span className="text-xs text-[#E7EAF0] truncate max-w-[80px]">{assignee.name}</span>
                </div>
              ))}
              <button 
                onClick={() => { setShowAssignees(!showAssignees); setShowLabels(false); }}
                className="flex items-center justify-center w-6 h-6 rounded-full border border-dashed border-[#8A93A3] text-[#8A93A3] hover:text-[#E7EAF0] hover:border-[#E7EAF0] transition-colors"
              >
                <Plus size={12} />
              </button>
            </div>

            {showAssignees && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-[#161B24] border border-[#242B36] rounded-xl shadow-2xl z-20 overflow-hidden animate-in fade-in duration-200">
                <div className="p-2 border-b border-[#242B36] flex justify-between items-center">
                  <span className="text-[10px] font-semibold text-[#8A93A3] uppercase tracking-wider">Assign up to 10</span>
                  <button onClick={() => setShowAssignees(false)} className="text-[#8A93A3] hover:text-[#E7EAF0]"><X size={14}/></button>
                </div>
                <div className="max-h-48 overflow-y-auto p-1">
                  {mockAccounts.map(account => {
                    const isAssigned = issue.assignees?.some(a => a.name === account.handle);
                    return (
                      <button
                        key={account.id}
                        onClick={() => toggleAssignee(account)}
                        className="w-full flex items-center space-x-2 p-2 rounded-lg hover:bg-[#242B36] transition-colors text-left"
                      >
                        <Avatar initials={account.initials} color={account.avatarColor} size="sm" />
                        <span className={`text-xs flex-1 truncate ${isAssigned ? "font-semibold text-[#E7EAF0]" : "text-[#8A93A3]"}`}>{account.handle}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <div className="text-[10px] font-semibold text-[#8A93A3] uppercase tracking-wider mb-2">Labels</div>
            <div className="flex flex-wrap gap-2">
              {issue.labels.map((label, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded border border-[#242B36] bg-[#0B0E13] text-[10px] text-[#8A93A3] uppercase tracking-wider">
                  {label}
                </span>
              ))}
              <button 
                onClick={() => { setShowLabels(!showLabels); setShowAssignees(false); }}
                className="flex items-center justify-center w-6 h-6 rounded-full border border-dashed border-[#8A93A3] text-[#8A93A3] hover:text-[#E7EAF0] hover:border-[#E7EAF0] transition-colors"
              >
                <Plus size={12} />
              </button>
            </div>

            {showLabels && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-[#161B24] border border-[#242B36] rounded-xl shadow-2xl z-20 overflow-hidden animate-in fade-in duration-200">
                <div className="p-2 border-b border-[#242B36] flex justify-between items-center">
                  <span className="text-[10px] font-semibold text-[#8A93A3] uppercase tracking-wider">Apply Labels</span>
                  <button onClick={() => setShowLabels(false)} className="text-[#8A93A3] hover:text-[#E7EAF0]"><X size={14}/></button>
                </div>
                <div className="max-h-48 overflow-y-auto p-1">
                  {availableLabels.map(label => {
                    const isApplied = issue.labels.includes(label);
                    return (
                      <button
                        key={label}
                        onClick={() => toggleLabel(label)}
                        className="w-full flex items-center space-x-2 p-2 rounded-lg hover:bg-[#242B36] transition-colors text-left"
                      >
                        <TagIcon size={12} className={isApplied ? "text-[#8B7FFF]" : "text-[#8A93A3]"} />
                        <span className={`text-[10px] uppercase tracking-wider truncate ${isApplied ? "font-semibold text-[#E7EAF0]" : "text-[#8A93A3]"}`}>{label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Telegram Chat Link */}
        <div className="bg-[#161B24] border border-[#242B36] rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageSquare size={16} className={issue.linkedChat ? "text-[#8B7FFF]" : "text-[#8A93A3]"} />
              <span className="text-sm font-medium text-[#E7EAF0]">Telegram Discussion</span>
            </div>
            {!issue.linkedChat && (
              <button
                onClick={() => setIssue({ ...issue, linkedChat: "Telegram Chat: Triage Thread" })}
                className="text-xs font-medium bg-[#8B7FFF]/10 text-[#8B7FFF] border border-[#8B7FFF]/20 px-3 py-1.5 rounded-lg hover:bg-[#8B7FFF]/20 transition-colors"
              >
                Link Current Chat
              </button>
            )}
          </div>
          {issue.linkedChat && (
            <div className="mt-3 text-xs text-[#8A93A3] flex items-center justify-between">
              <span>Linked to: <strong className="text-[#E7EAF0]">{issue.linkedChat}</strong></span>
              <button 
                onClick={() => setIssue({ ...issue, linkedChat: undefined })}
                className="text-[#FF6B6B] hover:underline"
              >
                Unlink
              </button>
            </div>
          )}
        </div>

        {/* Issue Body */}
        <div className="bg-[#0B0E13] border border-[#242B36] rounded-xl p-4 min-h-[150px]">
          {issue.body ? (
            <p className="text-sm text-[#E7EAF0] leading-relaxed whitespace-pre-wrap">
              {issue.body}
            </p>
          ) : (
            <p className="text-sm text-[#8A93A3] italic">No description provided.</p>
          )}
        </div>
      </div>
    </div>
  );
}
