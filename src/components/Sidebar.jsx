import React from 'react';
import {
  FileText,
  Youtube,
  Twitter,
  Globe,
  Share2,
  Sparkles,
  Cloud,
  Layers,
  LogOut,
  Sun,
  Moon,
  Brain,
  Download,
} from 'lucide-react';

export const Sidebar = ({
  activeType,
  onSelectType,
  stats,
  user,
  onOpenShareModal,
  onOpenCloudModal,
  onOpenChatDrawer,
  onSignOut,
  isDarkMode,
  onToggleTheme,
  isGuest = false,
  contents = [],
}) => {
  const totalCount = stats?.totalItems ?? contents.length;
  const docsCount = stats?.documentsCount ?? contents.filter((c) => c.type === 'document').length;
  const vidsCount = stats?.videosCount ?? contents.filter((c) => c.type === 'youtube').length;
  const tweetsCount = stats?.tweetsCount ?? contents.filter((c) => c.type === 'twitter').length;
  const linksCount =
    stats?.linksCount ?? contents.filter((c) => c.type === 'article' || c.type === 'linkedin').length;

  const categories = [
    { id: 'all', label: 'All Items', icon: Layers, count: totalCount },
    { id: 'document', label: 'Documents & PDFs', icon: FileText, count: docsCount },
    { id: 'youtube', label: 'YouTube Videos', icon: Youtube, count: vidsCount },
    { id: 'twitter', label: 'Twitter / X Posts', icon: Twitter, count: tweetsCount },
    { id: 'article', label: 'Articles & Links', icon: Globe, count: linksCount },
  ];

  return (
    <aside className="w-64 shrink-0 hidden md:flex flex-col justify-between border-r border-gray-200 dark:border-[#14151e] bg-[#fbfcfd] dark:bg-[#07070b]/90 p-4 min-h-[calc(100vh-57px)] transition-colors">
      <div className="space-y-6">
        {/* Core Navigation */}
        <div>
          <p className="px-2 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-[#717388]">
            Categories
          </p>
          <nav className="space-y-0.5" aria-label="Sidebar Categories">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeType === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectType(cat.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors text-left ${
                    isActive
                      ? 'bg-purple-300/40 text-purple-600 dark:bg-purple-600/15 dark:text-purple-300 font-semibold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-[#12131d]'
                  }`}
                >
                  <span className="flex items-center gap-2.5 truncate">
                    <Icon className="w-4 h-4 shrink-0 text-slate-400 dark:text-[#717388]" />
                    <span className="truncate">{cat.label}</span>
                  </span>
                  <span className="text-[11px] font-mono tabular-nums text-slate-400 dark:text-[#636578]">
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* AI & Features */}
        <div>
          <p className="px-2 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-[#717388]">
            Key Features
          </p>
          <div className="space-y-1">
            <button
              onClick={onOpenChatDrawer}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-purple-300/30 dark:hover:bg-purple-600/15 hover:text-purple-600 dark:hover:text-purple-300 rounded-lg transition-colors text-left"
            >
              <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-300 shrink-0" />
              <span>AI Document Chat</span>
            </button>

            <button
              onClick={onOpenShareModal}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-[#12131d] rounded-lg transition-colors text-left"
            >
              <span className="flex items-center gap-2.5">
                <Share2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Sharable Brain Link</span>
              </span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                  stats?.isShared
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400'
                    : 'bg-gray-200 text-slate-600 dark:bg-[#151622] dark:text-slate-400'
                }`}
              >
                {stats?.isShared ? 'Active' : 'Private'}
              </span>
            </button>

            <button
              onClick={onOpenCloudModal}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-[#12131d] rounded-lg transition-colors text-left"
            >
              <span className="flex items-center gap-2.5">
                <Cloud className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
                <span>Cloud Storage</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400 dark:text-[#636578]">CDN</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Profile and Settings */}
      <div className="pt-4 border-t border-gray-200 dark:border-[#14151e] space-y-3">
        {/* User Card */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-purple-300/60 dark:bg-purple-600/20 text-purple-600 dark:text-purple-300 flex items-center justify-center shrink-0">
              <Brain className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                {user?.username || (isGuest ? 'Guest Viewer' : 'Sonu')}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-[#717388] truncate">
                {user?.email || (isGuest ? 'Public Brain Link' : 'kumar.sonu@gmail.com')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={onToggleTheme}
              title={isDarkMode ? 'Switch to Light' : 'Switch to Dark'}
              aria-label="Toggle theme"
              className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded hover:bg-gray-100 dark:hover:bg-[#12131d] transition-colors"
            >
              {isDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>

            {!isGuest && (
              <button
                onClick={onSignOut}
                title="Sign Out"
                aria-label="Sign Out"
                className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-rose-600 rounded hover:bg-gray-100 dark:hover:bg-[#12131d] transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Cloud Vault indicator */}
        <div className="px-2 py-1.5 rounded-md bg-white dark:bg-[#0c0d14] border border-gray-200 dark:border-[#14151e] text-[11px] flex items-center justify-between text-slate-600 dark:text-[#888b9e]">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Cloud Vault</span>
          </span>
          <span className="font-mono tabular-nums text-slate-400 dark:text-[#636578]">Fast Edge</span>
        </div>

        {/* 1-Click Codebase Export for Local & GitHub */}
        <a
          href="/app/v1/download-source"
          download="second-brain-app.zip"
          className="w-full flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-md bg-purple-600/10 hover:bg-purple-600/20 text-purple-600 dark:text-purple-300 border border-purple-300/40 dark:border-purple-600/30 text-xs font-semibold transition-colors"
          title="Download full project source code as a ZIP archive for GitHub / local development"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Code (.zip)</span>
        </a>
      </div>
    </aside>
  );
};
