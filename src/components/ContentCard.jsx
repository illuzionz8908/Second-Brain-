import React, { useState } from 'react';
import {
  FileText,
  Youtube,
  Twitter,
  Globe,
  Trash2,
  ExternalLink,
  Sparkles,
  Eye,
  Cloud,
  Play,
} from 'lucide-react';
import { formatBytes, extractYouTubeId } from '../utils/brainLogic.js';

export const ContentCard = ({
  item,
  onDelete,
  onAskAi,
  onPreviewDocument,
  onSummarize,
  isGuest = false,
}) => {
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!onDelete) return;
    if (window.confirm(`Delete "${item.title}" from your Second Brain?`)) {
      setIsDeleting(true);
      await onDelete(item._id);
    }
  };

  const youtubeId = item.type === 'youtube' && item.link ? extractYouTubeId(item.link) : null;

  return (
    <article className="group relative flex flex-col justify-between p-4 bg-white dark:bg-[#0a0a10] rounded-xl border border-gray-200 dark:border-[#14151e] shadow-xs hover:border-gray-300 dark:hover:border-[#222332] transition-all">
      <div>
        {/* Top Header Row: Category indicator & Actions */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-[#787a90]">
            {item.type === 'document' && (
              <span className="flex items-center gap-1 font-medium text-purple-600 dark:text-purple-300">
                <FileText className="w-3.5 h-3.5" />
                <span>Document</span>
              </span>
            )}
            {item.type === 'youtube' && (
              <span className="flex items-center gap-1 font-medium text-rose-600 dark:text-rose-400">
                <Youtube className="w-3.5 h-3.5" />
                <span>YouTube</span>
              </span>
            )}
            {item.type === 'twitter' && (
              <span className="flex items-center gap-1 font-medium text-sky-600 dark:text-sky-400">
                <Twitter className="w-3.5 h-3.5" />
                <span>Twitter / X</span>
              </span>
            )}
            {item.type === 'linkedin' && (
              <span className="flex items-center gap-1 font-medium text-blue-700 dark:text-blue-400">
                <Globe className="w-3.5 h-3.5" />
                <span>LinkedIn</span>
              </span>
            )}
            {item.type === 'article' && (
              <span className="flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
                <Globe className="w-3.5 h-3.5" />
                <span>Article</span>
              </span>
            )}

            {/* File size if available */}
            {item.fileSize ? (
              <>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums text-slate-400 dark:text-[#636578]">
                  {formatBytes(item.fileSize)}
                </span>
              </>
            ) : null}

            {/* Cloud Storage verification badge */}
            {item.cloudStorageKey && (
              <>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-0.5 text-slate-400 dark:text-[#636578]" title="Stored in Cloud Storage">
                  <Cloud className="w-3 h-3 text-sky-500" />
                  <span>Cloud Stored</span>
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-1">
            {item.type === 'document' && (
              <button
                onClick={() => onPreviewDocument(item)}
                title="Preview Document"
                aria-label={`Preview document ${item.title}`}
                className="p-1 text-slate-400 hover:text-purple-600 dark:hover:text-purple-300 rounded transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
            )}

            {item.link && (
              <a
                href={item.link}
                target="_blank"
                rel="noreferrer noopener"
                title="Open Source Link"
                aria-label={`Open external link for ${item.title}`}
                className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            {!isGuest && onDelete && (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                title="Delete from Second Brain"
                aria-label={`Delete ${item.title}`}
                className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold text-slate-900 dark:text-[#f0f1f5] leading-snug line-clamp-2 mb-2">
          {item.title}
        </h3>

        {/* Media / Document Preview Section */}
        {item.type === 'youtube' && youtubeId && (
          <div className="mb-3 rounded-lg overflow-hidden border border-gray-200 dark:border-[#14151e] bg-slate-950 aspect-video relative">
            {isPlayingVideo ? (
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
                title={item.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div
                onClick={() => setIsPlayingVideo(true)}
                className="w-full h-full relative cursor-pointer group/vid"
              >
                <img
                  src={`https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover/vid:bg-black/20 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-md">
                    <Play className="w-5 h-5 ml-0.5 fill-white" />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {item.type === 'document' && (
          <div
            onClick={() => onPreviewDocument(item)}
            className="mb-3 p-3 rounded-lg bg-gray-100/70 dark:bg-[#07070c] border border-gray-200 dark:border-[#14151e] cursor-pointer hover:bg-gray-200/50 dark:hover:bg-[#0d0e16] transition-colors"
          >
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
              <span className="font-mono text-[11px] truncate max-w-[180px] text-slate-700 dark:text-slate-300">
                {item.fileName || 'document.pdf'}
              </span>
              <span className="text-[11px] text-purple-600 dark:text-purple-300 font-medium">
                Click to Read
              </span>
            </div>
            {item.extractedText && (
              <p className="mt-1.5 text-xs text-slate-500 dark:text-[#787a90] line-clamp-2 leading-relaxed">
                {item.extractedText}
              </p>
            )}
          </div>
        )}

        {/* Notes Excerpt if present */}
        {item.notes && item.type !== 'document' && (
          <p className="text-xs text-slate-600 dark:text-[#9092a4] line-clamp-2 leading-relaxed mb-3">
            {item.notes}
          </p>
        )}
      </div>

      {/* Footer Bar with AI Action buttons */}
      <div className="pt-3 border-t border-gray-100 dark:border-[#14151e] flex items-center justify-between gap-2 mt-auto">
        <button
          onClick={() => onAskAi(item)}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-purple-600 dark:text-purple-300 bg-purple-300/40 dark:bg-purple-600/15 hover:bg-purple-300/60 dark:hover:bg-purple-600/25 rounded-md transition-colors"
        >
          <Sparkles className="w-3 h-3 text-purple-600 dark:text-purple-300" />
          <span>{item.type === 'document' ? 'Chat with PDF' : 'Ask AI'}</span>
        </button>

        <button
          onClick={() => onSummarize(item)}
          className="text-xs text-slate-500 hover:text-slate-900 dark:text-[#787a90] dark:hover:text-white transition-colors"
        >
          Key Takeaways
        </button>
      </div>
    </article>
  );
};
