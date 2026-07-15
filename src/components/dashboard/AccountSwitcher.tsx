import { useState, useRef, useEffect } from "react";
import { mockAccounts } from "../../lib/mockData";
import { Avatar } from "../shared/Avatar";
import { ChevronDown, Check, Plus, Github, Gitlab, Server } from "lucide-react";
import { Account } from "../../types";

export function AccountSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeAccount, setActiveAccount] = useState<Account>(mockAccounts[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getProviderIcon = (provider: Account["provider"]) => {
    switch (provider) {
      case "github": return <Github size={14} />;
      case "github_enterprise": return <Server size={14} />;
      case "gitlab": return <Gitlab size={14} />;
      case "bitbucket": return <Server size={14} />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-[#161B24] border border-[#242B36] rounded-full px-1 pr-3 py-1 hover:border-[#8B7FFF]/50 transition-colors"
      >
        <Avatar initials={activeAccount.initials} color={activeAccount.avatarColor} size="sm" />
        <span className="text-sm font-medium text-[#E7EAF0]">{activeAccount.handle}</span>
        <ChevronDown size={14} className="text-[#8A93A3]" />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-72 bg-[#161B24] border border-[#242B36] rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-3 py-2 border-b border-[#242B36]">
            <span className="text-[10px] font-semibold text-[#8A93A3] uppercase tracking-wider">Switch Account</span>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {mockAccounts.map((account) => (
              <button
                key={account.id}
                onClick={() => { setActiveAccount(account); setIsOpen(false); }}
                className="w-full flex items-center justify-between p-3 hover:bg-[#242B36] transition-colors text-left"
              >
                <div className="flex items-center space-x-3">
                  <Avatar initials={account.initials} color={account.avatarColor} size="md" />
                  <div>
                    <div className="text-sm font-medium text-[#E7EAF0] leading-tight">{account.handle}</div>
                    <div className="flex items-center space-x-1 mt-1 text-[#8A93A3]">
                      {getProviderIcon(account.provider)}
                      <span className="text-[10px] capitalize font-medium">{account.provider.replace('_', ' ')}</span>
                      {account.isEnterprise && <span className="text-[9px] bg-[#8B7FFF]/15 text-[#8B7FFF] px-1.5 py-0.5 rounded ml-1 font-mono">ENT</span>}
                    </div>
                  </div>
                </div>
                {activeAccount.id === account.id && (
                  <Check size={16} className="text-[#3FD68B]" />
                )}
              </button>
            ))}
          </div>
          <div className="p-2 border-t border-[#242B36]">
            <button className="w-full flex items-center justify-center space-x-2 py-2 rounded-lg text-sm font-medium text-[#8A93A3] hover:text-[#E7EAF0] hover:bg-[#242B36] transition-colors">
              <Plus size={16} />
              <span>Add account</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
