import React from 'react';
import { Brain, Share2, Plus, Sparkles, Cloud, Lock } from 'lucide-react';

export const TopBar = ({
  activeType,
  onSelectType,
  onOpenAddModal,
  onOpenShareModal,
  onOpenChatDrawer,
  onOpenCloudModal,
  isShared,
  isGuest = false,
  onExitGuest,
}) => {
  const navTabs = [
    { id: 'all', label: 'All Items' },
    { id: 'document', label: 'Documents' },
    { id: 'youtube', label: 'Videos' },
    { id: 'twitter', label: 'Tweets' },
    { id: 'article', label: 'Articles' },
  ];

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-8 px-6 py-3.5 bg-white/95 dark:bg-[#07070b]/95 backdrop-blur-md border-b border-gray-200 dark:border-[#14151e] transition-colors">
      {/* Zone 1: Wordmark with Brain Icon Logo */}
      <div className="flex items-center gap-3 shrink-0">
        <a
          href="/"
          className="text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0 flex items-center gap-2.5"
        >
          {/* Brain Logo with requested purple shades */}
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-purple-500 text-white flex items-center justify-center shadow-xs">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="tracking-tight">Second Brain</span>
        </a>
      </div>

      {/* Zone 2: Navigation Links */}
      <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
        {navTabs.map((tab) => {
          const isActive = activeType === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectType(tab.id)}
              className={`pb-1 text-sm transition-colors whitespace-nowrap shrink-0 ${
                isActive
                  ? 'text-purple-600 dark:text-purple-300 border-b-2 border-purple-600 dark:border-purple-300 font-semibold'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Zone 3: Actions */}
      <div className="flex items-center gap-2.5 shrink-0">
        {isGuest ? (
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded border border-amber-200 dark:border-amber-800/80 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              Public View
            </span>
            {onExitGuest && (
              <button
                onClick={onExitGuest}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-md transition-colors whitespace-nowrap shadow-xs"
              >
                Sign In / Vault
              </button>
            )}
          </div>
        ) : (
          <>
            <button
              onClick={onOpenCloudModal}
              title="Cloud Storage Provider Status"
              aria-label="Cloud Storage Status"
              className="p-2 text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-300 hover:bg-gray-100 dark:hover:bg-[#12131d] rounded-md transition-colors"
            >
              <Cloud className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenShareModal}
              aria-label="Share Brain Publicly"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-colors whitespace-nowrap shrink-0 ${
                isShared
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800'
                  : 'bg-white dark:bg-[#0c0d14] text-slate-700 dark:text-slate-300 border-gray-200 dark:border-[#181924] hover:bg-gray-100 dark:hover:bg-[#141520]'
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{isShared ? 'Shared' : 'Share Brain'}</span>
            </button>

            <button
              onClick={onOpenChatDrawer}
              aria-label="Open AI Document Chat"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-purple-600 dark:text-purple-300 bg-purple-300/40 dark:bg-purple-600/15 border border-purple-300 dark:border-purple-600/30 rounded-md hover:bg-purple-300/60 dark:hover:bg-purple-600/25 transition-colors whitespace-nowrap shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-300" />
              <span>Ask AI</span>
            </button>

            <button
              onClick={onOpenAddModal}
              aria-label="Add Content to Second Brain"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-md shadow-xs transition-colors whitespace-nowrap shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Content</span>
            </button>
          </>
        )}
      </div>
    </header>
  );
};
