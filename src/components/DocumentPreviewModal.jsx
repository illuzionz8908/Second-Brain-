import React from 'react';
import { X, FileText, Download, Sparkles, Cloud } from 'lucide-react';
import { formatBytes } from '../utils/brainLogic.js';

export const DocumentPreviewModal = ({
  item,
  onClose,
  onChatWithDoc,
}) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl max-h-[85vh] bg-white dark:bg-[#0a0a10] rounded-xl shadow-2xl border border-gray-200 dark:border-[#181926] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-[#181926] shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 rounded-lg shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                {item.title}
              </h2>
              <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                <span className="font-mono">{item.fileName || 'document.pdf'}</span>
                <span>·</span>
                <span>{formatBytes(item.fileSize)}</span>
                {item.cloudProvider && (
                  <>
                    <span>·</span>
                    <span className="text-purple-600 dark:text-purple-400 font-medium">
                      {item.cloudProvider}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                onClose();
                onChatWithDoc(item);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-lg shadow-xs transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask AI About This</span>
            </button>
            <button
              onClick={onClose}
              aria-label="Close document preview"
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Cloud Info Bar */}
        <div className="px-6 py-2.5 bg-gray-100/50 dark:bg-[#07070b] border-b border-gray-200 dark:border-[#181926] flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <Cloud className="w-4 h-4 text-purple-500" />
            <span className="font-mono text-[11px] text-slate-500 truncate max-w-sm">
              Key: {item.cloudStorageKey || 'vault/doc'}
            </span>
          </div>

          {item.filePath && (
            <a
              href={item.filePath}
              download={item.fileName || 'download'}
              className="inline-flex items-center gap-1 text-xs font-medium text-purple-600 dark:text-purple-300 hover:underline"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Original</span>
            </a>
          )}
        </div>

        {/* Content Viewer Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {item.notes && (
            <div className="p-3.5 bg-purple-50/60 dark:bg-purple-950/25 border border-purple-200/60 dark:border-purple-900/40 rounded-lg">
              <p className="text-xs font-semibold text-purple-900 dark:text-purple-200 mb-1">
                Curator Notes
              </p>
              <p className="text-xs text-purple-800/90 dark:text-purple-300/90 leading-relaxed">
                {item.notes}
              </p>
            </div>
          )}

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
              Extracted Text &amp; Semantic Index
            </h4>
            <div className="p-4 rounded-xl bg-gray-100/50 dark:bg-[#07070b] border border-gray-200 dark:border-[#181926] font-mono text-xs text-slate-800 dark:text-[#ededef] whitespace-pre-wrap leading-relaxed select-text">
              {item.extractedText ||
                'This document was uploaded to cloud storage. You can query its contents or summarize it using the AI Chat drawer!'}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-gray-100/40 dark:bg-[#07070b] border-t border-gray-200 dark:border-[#181926] flex items-center justify-between text-xs text-slate-500">
          <span>Indexed for semantic and multi-modal query</span>
          <button
            onClick={onClose}
            className="px-3 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-[#181926] rounded-md transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
