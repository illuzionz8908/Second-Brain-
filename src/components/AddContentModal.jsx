import React, { useState } from 'react';
import { X, Upload, Link as LinkIcon, FileText, Cloud, CheckCircle, AlertCircle } from 'lucide-react';
import { detectContentType, formatBytes } from '../utils/brainLogic.js';

export const AddContentModal = ({
  isOpen,
  onClose,
  onContentAdded,
  authToken,
}) => {
  const [activeTab, setActiveTab] = useState('upload');

  // Document Upload State
  const [file, setFile] = useState(null);
  const [docTitle, setDocTitle] = useState('');
  const [docNotes, setDocNotes] = useState('');
  const [cloudProvider, setCloudProvider] = useState('Second Brain Cloud CDN');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(null);

  // Link State
  const [linkUrl, setLinkUrl] = useState('');
  const [linkTitle, setLinkTitle] = useState('');
  const [linkNotes, setLinkNotes] = useState('');
  const [isSubmittingLink, setIsSubmittingLink] = useState(false);
  const [linkError, setLinkError] = useState(null);

  if (!isOpen) return null;

  const detectedType = linkUrl ? detectContentType(linkUrl) : 'article';

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      if (!docTitle) {
        const cleanName = selected.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
        setDocTitle(cleanName);
      }
    }
  };

  const handleUploadDocument = async (e) => {
    e.preventDefault();
    if (!file) {
      setUploadError('Please select a document or PDF file to upload');
      return;
    }
    if (!docTitle.trim()) {
      setUploadError('Please provide a title for this document');
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const formData = new FormData();
      formData.append('document', file);
      formData.append('title', docTitle.trim());
      formData.append('notes', docNotes);
      formData.append('cloudProvider', cloudProvider);

      const res = await fetch('/app/v1/content/upload', {
        method: 'POST',
        headers: {
          Authorization: authToken,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to upload document');
      }

      setUploadSuccess(`Uploaded and backed by ${cloudProvider}`);
      setTimeout(() => {
        onContentAdded();
        onClose();
        setFile(null);
        setDocTitle('');
        setDocNotes('');
        setUploadSuccess(null);
      }, 1000);
    } catch (err) {
      setUploadError(err.message || 'Error uploading document to cloud storage');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveLink = async (e) => {
    e.preventDefault();
    if (!linkUrl.trim()) {
      setLinkError('Please enter a valid URL');
      return;
    }
    if (!linkTitle.trim()) {
      setLinkError('Please enter a title');
      return;
    }

    setIsSubmittingLink(true);
    setLinkError(null);

    try {
      const res = await fetch('/app/v1/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authToken,
        },
        body: JSON.stringify({
          link: linkUrl.trim(),
          title: linkTitle.trim(),
          type: detectedType,
          notes: linkNotes.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to save link');
      }

      onContentAdded();
      onClose();
      setLinkUrl('');
      setLinkTitle('');
      setLinkNotes('');
    } catch (err) {
      setLinkError(err.message || 'Error saving content');
    } finally {
      setIsSubmittingLink(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#0a0a10] rounded-xl shadow-2xl border border-gray-200 dark:border-[#181926] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-[#181926]">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              Add to Second Brain
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 pt-4">
          <div className="flex items-center p-1 bg-gray-100 dark:bg-[#12131d] rounded-lg">
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeTab === 'upload'
                  ? 'bg-white dark:bg-[#1a1b2a] text-purple-600 dark:text-purple-300 shadow-xs'
                  : 'text-slate-600 dark:text-[#787a90] hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Document (Cloud)</span>
            </button>
            <button
              onClick={() => setActiveTab('link')}
              className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeTab === 'link'
                  ? 'bg-white dark:bg-[#1a1b2a] text-purple-600 dark:text-purple-300 shadow-xs'
                  : 'text-slate-600 dark:text-[#787a90] hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>Add Web Link / Video / Tweet</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {activeTab === 'upload' ? (
            <form onSubmit={handleUploadDocument} className="space-y-4">
              {/* File Dropzone */}
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Select Document or PDF
                </label>
                <div className="relative border-2 border-dashed border-gray-300 dark:border-[#222334] hover:border-purple-600 dark:hover:border-purple-500 rounded-lg p-5 text-center transition-colors bg-gray-100/40 dark:bg-[#07070c]">
                  <input
                    type="file"
                    id="docFileInput"
                    aria-label="Upload document file"
                    accept=".pdf,.doc,.docx,.txt,.md,.ppt,.pptx"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {file ? (
                    <div className="flex items-center justify-center gap-3">
                      <FileText className="w-8 h-8 text-purple-600 dark:text-purple-300 shrink-0" />
                      <div className="text-left">
                        <p className="text-xs font-semibold text-slate-900 dark:text-white truncate max-w-[280px]">
                          {file.name}
                        </p>
                        <p className="text-[11px] font-mono text-slate-500 dark:text-[#787a90]">
                          {formatBytes(file.size)} · Click to change file
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Upload className="w-7 h-7 mx-auto text-slate-400 dark:text-[#787a90]" />
                      <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        Click or drag PDF, DOCX, or TXT here
                      </p>
                      <p className="text-[11px] text-slate-400 dark:text-[#636578]">
                        Supports up to 25MB · Files are indexed for AI chat
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Document Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI Systems Specification 2026"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-[#222334] bg-white dark:bg-[#07070c] text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-600"
                />
              </div>

              {/* Cloud Storage Provider selection */}
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Cloud className="w-3.5 h-3.5 text-sky-500" />
                    <span>Cloud Storage Target</span>
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 dark:text-[#636578]">Global CDN</span>
                </label>
                <select
                  value={cloudProvider}
                  onChange={(e) => setCloudProvider(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-[#222334] bg-white dark:bg-[#07070c] text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-600"
                >
                  <option value="Second Brain Cloud CDN">Second Brain Cloud CDN (Anycast Edge)</option>
                  <option value="Cloudflare R2 Object Storage">Cloudflare R2 Storage (S3 Compatible)</option>
                  <option value="AWS S3 Multi-Region Vault">AWS S3 Multi-Region Vault</option>
                  <option value="Google Cloud Storage Bucket">Google Cloud Storage Bucket</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Notes / Remarks
                </label>
                <input
                  type="text"
                  placeholder="Key takeaways or summary context"
                  value={docNotes}
                  onChange={(e) => setDocNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-[#222334] bg-white dark:bg-[#07070c] text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-600"
                />
              </div>

              {uploadError && (
                <div className="flex items-center gap-2 p-2.5 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs rounded-md">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              {uploadSuccess && (
                <div className="flex items-center gap-2 p-2.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs rounded-md">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>{uploadSuccess}</span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-[#12131d] rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 disabled:opacity-50 rounded-md shadow-xs transition-colors"
                >
                  {isUploading ? 'Uploading to Cloud...' : 'Upload & Sync to Cloud'}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSaveLink} className="space-y-4">
              {/* URL */}
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  URL / Resource Link <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="url"
                    required
                    placeholder="https://youtube.com/watch?v=... or https://x.com/..."
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    className="w-full pl-3 pr-24 py-2 text-xs rounded-lg border border-gray-300 dark:border-[#222334] bg-white dark:bg-[#07070c] text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-600"
                  />
                  {linkUrl && (
                    <span className="absolute right-2 top-2 text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-purple-300/40 dark:bg-purple-600/20 text-purple-600 dark:text-purple-300">
                      {detectedType}
                    </span>
                  )}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Andrej Karpathy - Intro to LLMs"
                  value={linkTitle}
                  onChange={(e) => setLinkTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-[#222334] bg-white dark:bg-[#07070c] text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Notes / Summary
                </label>
                <textarea
                  rows={3}
                  placeholder="Why is this important? Core takeaways or quotes..."
                  value={linkNotes}
                  onChange={(e) => setLinkNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-[#222334] bg-white dark:bg-[#07070c] text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-600"
                />
              </div>

              {linkError && (
                <div className="flex items-center gap-2 p-2.5 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs rounded-md">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{linkError}</span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-[#12131d] rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingLink}
                  className="px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 disabled:opacity-50 rounded-md shadow-xs transition-colors"
                >
                  {isSubmittingLink ? 'Saving...' : 'Save to Brain'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
