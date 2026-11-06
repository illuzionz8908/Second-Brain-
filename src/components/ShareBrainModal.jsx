import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  ExternalLink,
  Globe,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { buildShareUrl } from '../utils/brainLogic.js';

export const ShareBrainModal = ({
  isOpen,
  onClose,
  isShared,
  shareHash,
  authToken,
  onShareStatusChange,
  onOpenPreview,
}) => {
  const [copied, setCopied] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
  const publicUrl = shareHash ? buildShareUrl(origin, shareHash) : '';

  const handleToggleShare = async () => {
    setIsUpdating(true);
    setError(null);

    const nextState = !isShared;

    try {
      const res = await fetch('/app/v1/brain/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authToken,
        },
        body: JSON.stringify({ share: nextState }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to update share setting');
      }

      onShareStatusChange(nextState, nextState ? data.hash : null);
    } catch (err) {
      setError(err.message || 'Error communicating with server');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCopy = () => {
    if (!publicUrl) return;
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#0a0a10] rounded-xl shadow-2xl border border-gray-200 dark:border-[#181926] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-[#181926]">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-lg">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                Sharable Second Brain
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Publish a public read-only link to share your curated knowledge with anyone
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close share modal"
            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Main Toggle Card */}
          <div className="p-4 rounded-xl border border-gray-200 dark:border-[#181926] bg-gray-100/50 dark:bg-[#07070b]/60 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  Public Link Sharing
                </span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                    isShared
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-slate-200 text-slate-600 dark:bg-[#181926] dark:text-slate-400'
                  }`}
                >
                  {isShared ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isShared
                  ? 'Your Second Brain is visible to anyone with your public URL.'
                  : 'Your Second Brain is strictly private to your account.'}
              </p>
            </div>

            <button
              onClick={handleToggleShare}
              disabled={isUpdating}
              aria-label="Toggle public brain sharing"
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                isShared ? 'bg-purple-600' : 'bg-slate-300 dark:bg-[#181926]'
              } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  isShared ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Public Link Box if active */}
          {isShared && shareHash ? (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-purple-600 dark:text-purple-300" />
                    <span>Your Unique Sharable URL</span>
                  </span>
                  <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                    Active &amp; Shareable
                  </span>
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 px-3 py-2 bg-gray-100 dark:bg-[#07070b] border border-gray-300 dark:border-[#181926] rounded-lg text-xs font-mono text-slate-800 dark:text-[#ededef] truncate select-all">
                    {publicUrl}
                  </div>
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-purple-600 hover:bg-purple-500 text-white transition-colors shrink-0 shadow-xs"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Action Buttons: Preview & Social */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => onOpenPreview(shareHash)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-gray-100 dark:bg-[#07070b] hover:bg-gray-200 dark:hover:bg-[#141520] border border-transparent dark:border-[#181926] rounded-lg transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Preview Guest View</span>
                </button>

                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                    'Check out my curated Second Brain: ' + publicUrl
                  )}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-gray-100 dark:bg-[#07070b] hover:bg-gray-200 dark:hover:bg-[#141520] border border-transparent dark:border-[#181926] rounded-lg transition-colors flex items-center gap-1"
                >
                  <span>Share on X</span>
                </a>
              </div>

              {/* Public Privileges Notice */}
              <div className="p-3 bg-purple-50/70 dark:bg-purple-950/25 border border-purple-200/60 dark:border-purple-900/40 rounded-lg text-xs text-purple-950 dark:text-purple-200 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-purple-700 dark:text-purple-300">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Guest Features Enabled</span>
                </div>
                <p className="text-[11px] leading-relaxed text-purple-900/80 dark:text-purple-300/80">
                  Anyone accessing this link can view your items, read documents, and interact with the public AI assistant for your brain. Write permissions and account management remain private to you.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-gray-100/60 dark:bg-[#07070b]/60 rounded-lg border border-gray-200 dark:border-[#181926] text-xs text-slate-600 dark:text-slate-400 space-y-2">
              <div className="flex items-center gap-2 font-medium text-slate-800 dark:text-slate-200">
                <ShieldCheck className="w-4 h-4 text-slate-500" />
                <span>Currently Private</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Turn on the switch above to generate a unique, secure link that you can send to colleagues, friends, or publish on your social profiles.
              </p>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 p-2.5 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs rounded-md">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-gray-100/40 dark:bg-[#07070b] border-t border-gray-200 dark:border-[#181926] flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-400">
            Hash: {shareHash || 'None'}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-[#181926] rounded-md transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
