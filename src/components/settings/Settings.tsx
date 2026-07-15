import { useState } from "react";
import { mockSettings, mockRepos, mockAccounts } from "../../lib/mockData";
import { NotificationSettings } from "../../types";
import { Avatar } from "../shared/Avatar";
import { Github, Gitlab, Server, Plus } from "lucide-react";

export function Settings() {
  const [settings, setSettings] = useState<NotificationSettings>(mockSettings);

  const updateSetting = (key: keyof NotificationSettings, value: "instant" | "digest" | "off") => {
    if (key === "ciFailures") return; // Locked
    setSettings({ ...settings, [key]: value });
  };

  const setFrequency = (freq: NotificationSettings["digestFrequency"]) => {
    setSettings({ ...settings, digestFrequency: freq });
  };

  return (
    <div className="p-4 space-y-8 animate-in fade-in duration-300 pb-20">
      <header className="pt-2">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-[#E7EAF0]">
          Settings
        </h1>
      </header>

      <section className="space-y-4">
        <h2 className="font-heading text-sm font-semibold text-[#8A93A3] uppercase tracking-wider">
          Accounts & Providers
        </h2>
        <div className="space-y-3">
          {mockAccounts.map((account) => (
            <div
              key={account.id}
              className="flex items-center justify-between bg-[#161B24] border border-[#242B36] p-4 rounded-xl"
            >
              <div className="flex items-center space-x-3">
                <Avatar initials={account.initials} color={account.avatarColor} size="md" />
                <div>
                  <div className="text-sm font-medium text-[#E7EAF0] leading-tight">{account.handle}</div>
                  <div className="flex items-center space-x-1 mt-1 text-[#8A93A3]">
                    {account.provider === "github" && <Github size={12} />}
                    {account.provider === "github_enterprise" && <Server size={12} />}
                    {account.provider === "gitlab" && <Gitlab size={12} />}
                    <span className="text-[10px] capitalize font-medium">{account.provider.replace('_', ' ')}</span>
                    {account.isEnterprise && <span className="text-[9px] bg-[#8B7FFF]/15 text-[#8B7FFF] px-1.5 py-0.5 rounded ml-1 font-mono">ENT</span>}
                  </div>
                </div>
              </div>
              <button className="text-xs font-medium text-[#FF6B6B] px-3 py-1.5 rounded bg-[#FF6B6B]/10 hover:bg-[#FF6B6B]/20 transition-colors">
                Remove
              </button>
            </div>
          ))}
          <button className="w-full py-4 border border-dashed border-[#242B36] rounded-xl flex items-center justify-center space-x-2 text-[#8A93A3] hover:text-[#E7EAF0] hover:border-[#8B7FFF]/50 hover:bg-[#8B7FFF]/5 transition-colors">
            <Plus size={16} />
            <span className="text-sm font-medium">Add Provider</span>
          </button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-sm font-semibold text-[#8A93A3] uppercase tracking-wider">
          Notifications
        </h2>
        <div className="bg-[#161B24] border border-[#242B36] rounded-xl overflow-hidden">
          <SegmentedRow
            label="New pull requests"
            value={settings.newPRs}
            onChange={(val) => updateSetting("newPRs", val)}
          />
          <SegmentedRow
            label="CI failures on main"
            value={settings.ciFailures}
            locked
            onChange={(val) => updateSetting("ciFailures", val)}
          />
          <SegmentedRow
            label="New issues"
            value={settings.newIssues}
            onChange={(val) => updateSetting("newIssues", val)}
          />
          <SegmentedRow
            label="Releases & tags"
            value={settings.releases}
            onChange={(val) => updateSetting("releases", val)}
            isLast
          />
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="font-heading text-sm font-semibold text-[#8A93A3] uppercase tracking-wider">
            Digest Frequency
          </h2>
          <p className="text-xs text-[#8A93A3] mt-1">
            Applies to any notification type set to Digest
          </p>
        </div>
        <div className="flex space-x-2 bg-[#161B24] border border-[#242B36] p-1.5 rounded-xl">
          {(["off", "hourly", "daily"] as const).map((freq) => (
            <button
              key={freq}
              onClick={() => setFrequency(freq)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors capitalize ${
                settings.digestFrequency === freq
                  ? "bg-[#242B36] text-[#E7EAF0]"
                  : "text-[#8A93A3] hover:text-[#E7EAF0]"
              }`}
            >
              {freq}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-sm font-semibold text-[#8A93A3] uppercase tracking-wider">
          Connected Repos
        </h2>
        <div className="space-y-3">
          {mockRepos.map((repo) => (
            <div
              key={repo.id}
              className="flex items-center justify-between bg-[#161B24] border border-[#242B36] p-4 rounded-xl"
            >
              <span className="font-mono text-sm text-[#E7EAF0]">{repo.name}</span>
              <button className="text-xs font-medium text-[#FF6B6B] px-3 py-1.5 rounded bg-[#FF6B6B]/10 hover:bg-[#FF6B6B]/20 transition-colors">
                Revoke
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function SegmentedRow({
  label,
  value,
  locked,
  isLast,
  onChange,
}: {
  label: string;
  value: "instant" | "digest" | "off";
  locked?: boolean;
  isLast?: boolean;
  onChange: (val: "instant" | "digest" | "off") => void;
}) {
  return (
    <div
      className={`flex flex-col space-y-3 p-4 ${
        !isLast ? "border-b border-[#242B36]" : ""
      }`}
    >
      <span className={`text-sm ${locked ? "text-[#8A93A3]" : "text-[#E7EAF0]"}`}>
        {label}
        {locked && <span className="ml-2 text-[10px] uppercase tracking-wider">Required</span>}
      </span>
      <div className={`flex space-x-1 bg-[#0B0E13] border border-[#242B36] p-1 rounded-lg ${locked ? "opacity-50 pointer-events-none" : ""}`}>
        {(["instant", "digest", "off"] as const).map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors capitalize ${
              value === opt
                ? "bg-[#242B36] text-[#E7EAF0]"
                : "text-[#8A93A3] hover:text-[#E7EAF0]"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
