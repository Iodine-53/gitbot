import { useState } from "react";
import { mockWorkflows, mockWorkflowRuns } from "../../lib/mockData";
import { WorkflowRun } from "../../types";
import { RotateCcw, Play, CheckCircle2, XCircle, Loader2, GitBranch, Clock } from "lucide-react";

export function ActionsTab({ repoId }: { repoId: string }) {
  const [restartingRuns, setRestartingRuns] = useState<Set<string>>(new Set());
  const [triggeringWorkflows, setTriggeringWorkflows] = useState<Set<string>>(new Set());

  const workflows = mockWorkflows[repoId] || [];
  const runs = mockWorkflowRuns[repoId] || [];

  const dispatchableWorkflows = workflows.filter((w) => w.dispatchable);

  const handleRestart = (runId: string) => {
    setRestartingRuns((prev) => new Set(prev).add(runId));
    setTimeout(() => {
      setRestartingRuns((prev) => {
        const next = new Set(prev);
        next.delete(runId);
        return next;
      });
    }, 2000);
  };

  const handleTrigger = (workflowId: string) => {
    setTriggeringWorkflows((prev) => new Set(prev).add(workflowId));
    setTimeout(() => {
      setTriggeringWorkflows((prev) => {
        const next = new Set(prev);
        next.delete(workflowId);
        return next;
      });
    }, 2000);
  };

  const getStatusIcon = (run: WorkflowRun) => {
    if (run.status === "in_progress" || run.status === "queued") {
      return <Loader2 size={16} className="text-[#F2A93B] animate-spin" />;
    }
    if (run.conclusion === "success") {
      return <CheckCircle2 size={16} className="text-[#3FD68B]" />;
    }
    return <XCircle size={16} className="text-[#FF6B6B]" />;
  };

  return (
    <div className="space-y-6">
      {dispatchableWorkflows.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-heading text-sm font-semibold text-[#8A93A3] uppercase tracking-wider">
            Manual Actions
          </h2>
          <div className="bg-[#161B24] border border-[#242B36] rounded-xl overflow-hidden">
            {dispatchableWorkflows.map((workflow, idx) => {
              const isTriggering = triggeringWorkflows.has(workflow.id);
              return (
                <div
                  key={workflow.id}
                  className={`p-4 flex items-center justify-between ${
                    idx !== dispatchableWorkflows.length - 1 ? "border-b border-[#242B36]" : ""
                  }`}
                >
                  <div>
                    <div className="font-medium text-sm text-[#E7EAF0]">{workflow.name}</div>
                    <div className="text-xs text-[#8A93A3] mt-0.5">{workflow.description}</div>
                  </div>
                  <button
                    onClick={() => handleTrigger(workflow.id)}
                    disabled={isTriggering}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      isTriggering
                        ? "bg-[#242B36] text-[#8A93A3] cursor-not-allowed"
                        : "bg-[#8B7FFF]/10 text-[#8B7FFF] hover:bg-[#8B7FFF]/20 border border-[#8B7FFF]/20"
                    }`}
                  >
                    {isTriggering ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Starting...</span>
                      </>
                    ) : (
                      <>
                        <Play size={14} />
                        <span>Run</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section className="space-y-3">
        <h2 className="font-heading text-sm font-semibold text-[#8A93A3] uppercase tracking-wider">
          Recent Runs
        </h2>
        {runs.length === 0 ? (
          <p className="text-[#8A93A3] text-sm text-center py-8">No recent workflow runs</p>
        ) : (
          <div className="space-y-3">
            {runs.map((run) => {
              const isRestarting = restartingRuns.has(run.id);
              const isFailure = run.status === "completed" && run.conclusion === "failure";

              return (
                <div
                  key={run.id}
                  className={`bg-[#161B24] border rounded-xl p-4 transition-colors ${
                    isFailure ? "border-[#FF6B6B]/30" : "border-[#242B36]"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="mt-0.5">{getStatusIcon(run)}</div>
                      <div>
                        <div className="text-sm font-medium text-[#E7EAF0]">{run.name}</div>
                        <div className="flex items-center space-x-2 mt-1.5 text-xs text-[#8A93A3]">
                          <div className="flex items-center space-x-1">
                            <GitBranch size={12} />
                            <span className="font-mono text-[10px]">{run.branch}</span>
                          </div>
                          <span className="text-[#242B36]">•</span>
                          <span className="capitalize">{run.trigger.replace("_", " ")}</span>
                        </div>
                        <div className="flex items-center space-x-2 mt-1.5 text-xs text-[#8A93A3]">
                          <div className="flex items-center space-x-1">
                            <Clock size={12} />
                            <span className="font-mono text-[10px]">{run.duration}</span>
                          </div>
                          <span className="text-[#242B36]">•</span>
                          <span>{run.startedAt}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {isFailure && (
                    <div className="mt-4 pt-3 border-t border-[#242B36] flex justify-end">
                      <button
                        onClick={() => handleRestart(run.id)}
                        disabled={isRestarting}
                        className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          isRestarting
                            ? "bg-[#242B36] text-[#8A93A3] cursor-not-allowed"
                            : "bg-[#0B0E13] border border-[#242B36] text-[#E7EAF0] hover:border-[#8B7FFF]/50"
                        }`}
                      >
                        {isRestarting ? (
                          <>
                            <Loader2 size={14} className="animate-spin" />
                            <span>Restarting...</span>
                          </>
                        ) : (
                          <>
                            <RotateCcw size={14} />
                            <span>Restart Workflow</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
