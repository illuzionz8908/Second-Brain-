/**
 * brainLogic.js
 * Core utility functions for Second Brain:
 * - Content type detection (YouTube, Twitter, LinkedIn, Documents, Articles)
 * - YouTube and Twitter ID extraction
 * - Human-readable file size formatting
 * - Deterministic share hash generation and validation
 * - Client-side search and filtering
 * - Cloud storage metadata generation
 */

/**
 * Detects the content type based on URL pattern or file extension
 * @param {string} input - URL or filename
 * @returns {'youtube' | 'twitter' | 'document' | 'linkedin' | 'article'}
 */
export function detectContentType(input) {
  if (!input) return 'article';
  const trimmed = input.trim().toLowerCase();

  if (trimmed.includes('youtube.com') || trimmed.includes('youtu.be')) {
    return 'youtube';
  }

  if (trimmed.includes('twitter.com') || trimmed.includes('x.com')) {
    return 'twitter';
  }

  if (trimmed.includes('linkedin.com')) {
    return 'linkedin';
  }

  if (
    trimmed.endsWith('.pdf') ||
    trimmed.endsWith('.doc') ||
    trimmed.endsWith('.docx') ||
    trimmed.endsWith('.txt') ||
    trimmed.endsWith('.ppt') ||
    trimmed.endsWith('.pptx') ||
    trimmed.endsWith('.md')
  ) {
    return 'document';
  }

  return 'article';
}

/**
 * Extracts the 11-character video ID from a YouTube URL
 * @param {string} url
 * @returns {string | null}
 */
export function extractYouTubeId(url) {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
  );
  return match ? match[1] : null;
}

/**
 * Extracts username and tweet ID from Twitter/X URL
 * @param {string} url
 * @returns {{ username?: string, tweetId?: string }}
 */
export function extractTwitterInfo(url) {
  if (!url) return {};
  const match = url.match(/(?:twitter\.com|x\.com)\/([a-zA-Z0-9_]+)(?:\/status\/(\d+))?/i);
  if (match) {
    return {
      username: match[1],
      tweetId: match[2],
    };
  }
  return {};
}

/**
 * Formats byte values into readable strings (e.g. 420.5 KB, 2.1 MB)
 * @param {number} bytes
 * @param {number} decimals
 * @returns {string}
 */
export function formatBytes(bytes, decimals = 1) {
  if (!bytes || bytes <= 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Generates an alphanumeric hash for public brain links
 * @param {number} length
 * @returns {string}
 */
export function generateShareHash(length = 10) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Validates a public share link hash format
 * @param {string} hash
 * @returns {boolean}
 */
export function isValidShareHash(hash) {
  if (!hash) return false;
  return /^[a-z0-9_-]{4,32}$/i.test(hash.trim());
}

/**
 * Builds the full public share URL for the user's brain
 * @param {string} origin
 * @param {string} hash
 * @returns {string}
 */
export function buildShareUrl(origin, hash) {
  const cleanOrigin = origin.replace(/\/+$/, '');
  return `${cleanOrigin}/?share=${encodeURIComponent(hash)}`;
}

/**
 * Searches and filters knowledge items by title, filename, notes, and category
 * @param {Array} items
 * @param {string} query
 * @param {string} typeFilter
 * @returns {Array}
 */
export function filterContentItems(items = [], query = '', typeFilter = 'all') {
  const cleanQuery = query.trim().toLowerCase();

  return items.filter((item) => {
    // 1. Type filter
    if (typeFilter && typeFilter !== 'all' && item.type !== typeFilter) {
      return false;
    }

    // 2. Search match
    if (!cleanQuery) return true;

    const matchTitle = item.title?.toLowerCase().includes(cleanQuery);
    const matchFileName = item.fileName?.toLowerCase().includes(cleanQuery);
    const matchNotes = item.notes?.toLowerCase().includes(cleanQuery);
    const matchLink = item.link?.toLowerCase().includes(cleanQuery);

    return Boolean(matchTitle || matchFileName || matchNotes || matchLink);
  });
}

/**
 * Generates Cloud Storage metadata (object key, CDN URL, provider)
 * @param {string} fileName
 * @param {string} userId
 * @param {string} customProvider
 */
export function generateCloudStorageMeta(
  fileName,
  userId,
  customProvider = 'Second Brain Cloud CDN'
) {
  const timestamp = Date.now();
  const cleanName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const objectKey = `brains/${userId}/${timestamp}-${cleanName}`;
  const cdnUrl = `https://cdn.secondbrain.storage/${objectKey}`;

  return {
    cloudStorageKey: objectKey,
    cloudUrl: cdnUrl,
    cloudProvider: customProvider,
    uploadedAt: new Date(timestamp).toISOString(),
  };
}
