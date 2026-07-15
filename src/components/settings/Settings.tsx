import { useState } from "react";
import { mockSettings, mockRepos } from "../../lib/mockData";
import { NotificationSettings } from "../../types";

export function Settings() {
  const [settings, setSettings] = useState<NotificationSettings>(mockSettings);

  const toggleSetting = (key: keyof NotificationSettings) => {
    if (key === "ciFailures") return; // Locked
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const setFrequency = (freq: NotificationSettings["digestFrequency"]) => {
    setSettings({ ...settings, digestFrequency: freq });
  };

  return (
    <div className="p-4 space-y-8 animate-in fade-in duration-300">
      <header className="pt-2">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-[#E7EAF0]">
          Settings
        </h1>
      </header>

      <section className="space-y-4">
        <h2 className="font-heading text-sm font-semibold text-[#8A93A3] uppercase tracking-wider">
          Notifications
        </h2>
        <div className="bg-[#161B24] border border-[#242B36] rounded-xl overflow-hidden">
          <ToggleRow
            label="New pull requests"
            enabled={settings.newPRs}
            onChange={() => toggleSetting("newPRs")}
          />
          <ToggleRow
            label="CI failures on main"
            enabled={settings.ciFailures}
            locked
            onChange={() => toggleSetting("ciFailures")}
          />
          <ToggleRow
            label="New issues"
            enabled={settings.newIssues}
            onChange={() => toggleSetting("newIssues")}
          />
          <ToggleRow
            label="Releases & tags"
            enabled={settings.releases}
            onChange={() => toggleSetting("releases")}
            isLast
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-sm font-semibold text-[#8A93A3] uppercase tracking-wider">
          Digest Frequency
        </h2>
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

function ToggleRow({
  label,
  enabled,
  locked,
  isLast,
  onChange,
}: {
  label: string;
  enabled: boolean;
  locked?: boolean;
  isLast?: boolean;
  onChange: () => void;
}) {
  return (
    <div
      className={`flex items-center justify-between p-4 ${
        !isLast ? "border-b border-[#242B36]" : ""
      }`}
    >
      <span className={`text-sm ${locked ? "text-[#8A93A3]" : "text-[#E7EAF0]"}`}>
        {label}
        {locked && <span className="ml-2 text-[10px] uppercase tracking-wider">Required</span>}
      </span>
      <button
        onClick={onChange}
        disabled={locked}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          enabled ? "bg-[#8B7FFF]" : "bg-[#242B36]"
        } ${locked ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}
