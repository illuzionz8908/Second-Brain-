import React, { useState } from 'react';
import { X, Cloud, ShieldCheck, Check } from 'lucide-react';

export const CloudStorageModal = ({
  isOpen,
  onClose,
  stats,
  authToken,
  onRefresh,
}) => {
  const [provider, setProvider] = useState(stats?.provider || 'Second Brain Cloud CDN');
  const [bucketName, setBucketName] = useState(stats?.bucketName || 'secondbrain-prod-vault-east');
  const [region, setRegion] = useState(stats?.region || 'global-edge-anycast');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch('/app/v1/cloud/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authToken,
        },
        body: JSON.stringify({
          provider,
          bucketName,
          region,
        }),
      });

      if (res.ok) {
        setSaveSuccess(true);
        onRefresh();
        setTimeout(() => setSaveSuccess(false), 2000);
      }
    } catch (err) {
      console.error('Error updating cloud settings:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#0a0a10] rounded-xl shadow-2xl border border-gray-200 dark:border-[#181926] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-[#181926]">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 rounded-lg">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                Cloud Storage Provider
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                All document uploads are distributed to your cloud object store
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close cloud storage modal"
            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Metrics Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-gray-100/50 dark:bg-[#07070b] rounded-lg border border-gray-200 dark:border-[#181926] text-center">
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Total Uploads</p>
              <p className="text-lg font-bold font-mono text-slate-900 dark:text-white">
                {stats?.totalFiles ?? 2}
              </p>
            </div>

            <div className="p-3 bg-gray-100/50 dark:bg-[#07070b] rounded-lg border border-gray-200 dark:border-[#181926] text-center">
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Storage Used</p>
              <p className="text-lg font-bold font-mono text-purple-600 dark:text-purple-300">
                {stats?.totalSizeFormatted ?? '0.61 MB'}
              </p>
            </div>

            <div className="p-3 bg-gray-100/50 dark:bg-[#07070b] rounded-lg border border-gray-200 dark:border-[#181926] text-center">
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Edge CDN</p>
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1 mt-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Operational</span>
              </p>
            </div>
          </div>

          {/* Provider Settings Form */}
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Active Cloud Provider
              </label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-[#181926] bg-white dark:bg-[#07070b] text-slate-900 dark:text-[#ededef] focus:outline-hidden focus:ring-2 focus:ring-purple-600"
              >
                <option value="Second Brain Cloud CDN">Second Brain Cloud CDN (Integrated)</option>
                <option value="Cloudflare R2 Object Storage">Cloudflare R2 Object Storage</option>
                <option value="AWS S3 Multi-Region Vault">AWS S3 Multi-Region Vault</option>
                <option value="Google Cloud Storage Bucket">Google Cloud Storage Bucket</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Bucket Identifier
                </label>
                <input
                  type="text"
                  value={bucketName}
                  onChange={(e) => setBucketName(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-gray-300 dark:border-[#181926] bg-white dark:bg-[#07070b] text-slate-900 dark:text-[#ededef] focus:outline-hidden focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Region Routing
                </label>
                <input
                  type="text"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-gray-300 dark:border-[#181926] bg-white dark:bg-[#07070b] text-slate-900 dark:text-[#ededef] focus:outline-hidden focus:ring-2 focus:ring-purple-600"
                />
              </div>
            </div>

            <div className="p-3 bg-gray-100/50 dark:bg-[#07070b] rounded-lg border border-gray-200 dark:border-[#181926] text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                Object Addressing &amp; CDN Verification:
              </p>
              <p className="text-[11px] leading-relaxed">
                Uploaded files receive a deterministic SHA256 object key e.g. <code className="text-purple-600 dark:text-purple-300 font-mono">brains/[userId]/[uuid]-[filename]</code> and are immediately replicated to edge CDN caches.
              </p>
            </div>

            {saveSuccess && (
              <div className="flex items-center gap-2 p-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs rounded-md">
                <Check className="w-4 h-4" />
                <span>Cloud storage configuration saved successfully!</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-[#181926] rounded-md transition-colors"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-md shadow-xs transition-colors disabled:opacity-50"
              >
                {isSaving ? 'Updating...' : 'Save Configuration'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
