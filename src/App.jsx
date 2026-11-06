import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Search,
  Plus,
  FileText,
  Lock,
} from 'lucide-react';
import { TopBar } from './components/TopBar.jsx';
import { Sidebar } from './components/Sidebar.jsx';
import { ContentCard } from './components/ContentCard.jsx';
import { AddContentModal } from './components/AddContentModal.jsx';
import { ShareBrainModal } from './components/ShareBrainModal.jsx';
import { AiChatDrawer } from './components/AiChatDrawer.jsx';
import { DocumentPreviewModal } from './components/DocumentPreviewModal.jsx';
import { TakeawaysModal } from './components/TakeawaysModal.jsx';
import { CloudStorageModal } from './components/CloudStorageModal.jsx';
import { AuthModal } from './components/AuthModal.jsx';
import { filterContentItems } from './utils/brainLogic.js';

export default function App() {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return (
        localStorage.getItem('sb_theme') === 'dark' ||
        window.matchMedia('(prefers-color-scheme: dark)').matches
      );
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('sb_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('sb_theme', 'light');
    }
  }, [isDarkMode]);

  // Auth & User State
  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || 'demo_token_sonu';
  });
  const [user, setUser] = useState({
    id: 'user_default_secondbrain_1',
    username: 'Sonu',
    email: 'kumar.sonu.35798@gmail.com',
  });
  const [stats, setStats] = useState(null);
  const [cloudStats, setCloudStats] = useState(null);

  // Content items state
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search state (no tags needed)
  const [searchQuery, setSearchQuery] = useState('');
  const [activeType, setActiveType] = useState('all');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [isCloudModalOpen, setIsCloudModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Selected item for modals
  const [selectedDocForChat, setSelectedDocForChat] = useState(null);
  const [previewDocument, setPreviewDocument] = useState(null);
  const [takeawayItem, setTakeawayItem] = useState(null);

  // Public Share Link Guest View state
  const [publicShareHash, setPublicShareHash] = useState(null);
  const [publicOwnerName, setPublicOwnerName] = useState('');
  const [isGuestMode, setIsGuestMode] = useState(false);

  // Fetch Public Brain (Guest view)
  const fetchPublicBrain = async (hash) => {
    setLoading(true);
    try {
      const res = await fetch(`/app/v1/brain/${hash}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Shared brain link is invalid or expired.');
      }
      setContents(data.content || []);
      setPublicOwnerName(data.username || 'Curator');
      if (data.stats) {
        setStats({
          totalItems: data.stats.total,
          documentsCount: data.stats.documents,
          videosCount: data.stats.videos,
          tweetsCount: data.stats.tweets,
          linksCount: data.stats.links,
          isShared: true,
          shareHash: hash,
        });
      }
    } catch (err) {
      console.error('Error fetching public brain:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Authenticated User Vault
  const refreshData = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      // 1. Fetch user profile and stats
      const meRes = await fetch('/app/v1/me', {
        headers: { Authorization: token },
      });
      if (meRes.ok) {
        const meData = await meRes.json();
        setUser(meData.user);
        setStats(meData.stats);
        setCloudStats(meData.cloud);
      }

      // 2. Fetch contents
      const contentRes = await fetch('/app/v1/content', {
        headers: { Authorization: token },
      });
      if (contentRes.ok) {
        const contentData = await contentRes.json();
        setContents(contentData.content || []);
      }
    } catch (err) {
      console.error('Error refreshing Second Brain data:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Check URL query parameters for ?share=hash on load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shareParam = params.get('share');
    if (shareParam) {
      setPublicShareHash(shareParam);
      setIsGuestMode(true);
      fetchPublicBrain(shareParam);
    } else {
      refreshData();
    }
  }, [refreshData]);

  // Handle Delete content
  const handleDeleteContent = async (contentId) => {
    try {
      const res = await fetch('/app/v1/content', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({ contentId }),
      });
      if (res.ok) {
        setContents((prev) => prev.filter((c) => c._id !== contentId));
        refreshData();
      }
    } catch (err) {
      console.error('Failed to delete content:', err);
    }
  };

  // Filtered contents by query and type
  const filteredItems = useMemo(() => {
    return filterContentItems(contents, searchQuery, activeType);
  }, [contents, searchQuery, activeType]);

  // Documents list for AI Chat selector
  const uploadedDocuments = useMemo(() => {
    return contents.filter((c) => c.type === 'document');
  }, [contents]);

  // Handlers for card actions
  const handleAskAiAboutDoc = (item) => {
    setSelectedDocForChat(item.type === 'document' ? item._id : null);
    setIsAiDrawerOpen(true);
  };

  const handlePreviewDocument = (item) => {
    setPreviewDocument(item);
  };

  const handleSummarize = (item) => {
    setTakeawayItem(item);
  };

  // Exit guest mode back to user's personal vault
  const handleExitGuestMode = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete('share');
    window.history.pushState({}, '', url.toString());
    setIsGuestMode(false);
    setPublicShareHash(null);
    refreshData();
  };

  // Open guest preview from Share modal
  const handleOpenGuestPreview = (hash) => {
    setIsShareModalOpen(false);
    setPublicShareHash(hash);
    setIsGuestMode(true);
    fetchPublicBrain(hash);
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] dark:bg-[#040406] text-slate-900 dark:text-[#ededef] flex flex-col font-sans transition-colors">
      {/* Public Guest Mode Banner */}
      {isGuestMode && (
        <div className="bg-purple-600 text-white px-6 py-2.5 flex items-center justify-between text-xs shadow-xs">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-white/20">
              <Lock className="w-3.5 h-3.5" />
            </span>
            <span className="font-medium">
              Viewing <strong>{publicOwnerName}'s</strong> Second Brain · Public Sharable Link
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline opacity-90 text-purple-100">
              Read-only view · AI Document Chat enabled
            </span>
            <button
              onClick={handleExitGuestMode}
              className="px-3 py-1 font-semibold bg-white text-purple-700 hover:bg-purple-50 rounded-md transition-colors"
            >
              Exit to My Vault
            </button>
          </div>
        </div>
      )}

      {/* Top Bar with Brain Logo */}
      <TopBar
        activeType={activeType}
        onSelectType={setActiveType}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenShareModal={() => setIsShareModalOpen(true)}
        onOpenChatDrawer={() => {
          setSelectedDocForChat(null);
          setIsAiDrawerOpen(true);
        }}
        onOpenCloudModal={() => setIsCloudModalOpen(true)}
        isShared={stats?.isShared || false}
        isGuest={isGuestMode}
        onExitGuest={isGuestMode ? handleExitGuestMode : undefined}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* Sidebar (Tags removed) */}
        <Sidebar
          activeType={activeType}
          onSelectType={setActiveType}
          stats={stats}
          contents={contents}
          user={user}
          onOpenShareModal={() => setIsShareModalOpen(true)}
          onOpenCloudModal={() => setIsCloudModalOpen(true)}
          onOpenChatDrawer={() => {
            setSelectedDocForChat(null);
            setIsAiDrawerOpen(true);
          }}
          onSignOut={() => setIsAuthModalOpen(true)}
          isDarkMode={isDarkMode}
          onToggleTheme={() => setIsDarkMode((prev) => !prev)}
          isGuest={isGuestMode}
        />

        {/* Central Content Canvas */}
        <main className="flex-1 p-6 space-y-6 min-w-0">
          {/* Header Controls: Search Bar & Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search titles, document names, notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-gray-200 dark:border-[#14151e] bg-white dark:bg-[#0a0a10] text-slate-900 dark:text-[#ededef] placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-600 shadow-xs"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center p-1 bg-white dark:bg-[#0a0a10] rounded-lg border border-gray-200 dark:border-[#14151e] text-xs">
                <button
                  onClick={() => setActiveType('all')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    activeType === 'all'
                      ? 'bg-purple-100/70 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-semibold'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  All ({contents.length})
                </button>
                <button
                  onClick={() => setActiveType('document')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    activeType === 'document'
                      ? 'bg-purple-100/70 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-semibold'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Docs ({contents.filter((c) => c.type === 'document').length})
                </button>
              </div>

              {!isGuestMode && (
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-lg shadow-xs transition-colors shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Item</span>
                </button>
              )}
            </div>
          </div>

          {/* Content Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="h-48 rounded-xl bg-gray-200/60 dark:bg-[#0a0a10] animate-pulse border border-gray-200 dark:border-[#14151e]"
                />
              ))}
            </div>
          ) : filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map((item) => (
                <ContentCard
                  key={item._id}
                  item={item}
                  onDelete={isGuestMode ? undefined : handleDeleteContent}
                  onAskAi={handleAskAiAboutDoc}
                  onPreviewDocument={handlePreviewDocument}
                  onSummarize={handleSummarize}
                  isGuest={isGuestMode}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="p-12 text-center rounded-2xl border border-dashed border-gray-300 dark:border-[#181926] bg-white/50 dark:bg-[#07070b]/60 space-y-3">
              <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-300 flex items-center justify-center mx-auto">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                {searchQuery || activeType !== 'all'
                  ? 'No matching knowledge items found'
                  : 'Your Second Brain is ready for knowledge'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                {searchQuery || activeType !== 'all'
                  ? 'Try clearing your search query or filters to view all stored documents and notes.'
                  : 'Upload your first PDF or document to cloud storage, save video lectures, or bookmark articles to build your personal knowledge vault.'}
              </p>
              {!isGuestMode && (
                <div className="pt-2">
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-lg shadow-xs transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Upload First Document</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Modals & Drawers */}
      <AddContentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onContentAdded={refreshData}
        authToken={token}
      />

      <ShareBrainModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        isShared={stats?.isShared || false}
        shareHash={stats?.shareHash || null}
        authToken={token}
        onShareStatusChange={(shared, hash) => {
          setStats((prev) =>
            prev ? { ...prev, isShared: shared, shareHash: hash } : null
          );
        }}
        onOpenPreview={handleOpenGuestPreview}
      />

      <AiChatDrawer
        isOpen={isAiDrawerOpen}
        onClose={() => setIsAiDrawerOpen(false)}
        documents={uploadedDocuments}
        selectedDocumentId={selectedDocForChat}
        onSelectDocumentId={setSelectedDocForChat}
        authToken={token}
        shareLink={isGuestMode && publicShareHash ? publicShareHash : undefined}
      />

      <DocumentPreviewModal
        item={previewDocument}
        onClose={() => setPreviewDocument(null)}
        onChatWithDoc={(doc) => {
          setSelectedDocForChat(doc._id);
          setIsAiDrawerOpen(true);
        }}
      />

      <TakeawaysModal
        item={takeawayItem}
        onClose={() => setTakeawayItem(null)}
        onAskAi={(item) => {
          setSelectedDocForChat(item.type === 'document' ? item._id : null);
          setIsAiDrawerOpen(true);
        }}
      />

      <CloudStorageModal
        isOpen={isCloudModalOpen}
        onClose={() => setIsCloudModalOpen(false)}
        stats={cloudStats}
        authToken={token}
        onRefresh={refreshData}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(newToken, newUser) => {
          setToken(newToken);
          localStorage.setItem('token', newToken);
          setUser(newUser);
          refreshData();
        }}
      />
    </div>
  );
}
