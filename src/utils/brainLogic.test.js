import test from 'node:test';
import assert from 'node:assert/strict';
import {
  detectContentType,
  extractYouTubeId,
  extractTwitterInfo,
  formatBytes,
  generateShareHash,
  isValidShareHash,
  buildShareUrl,
  filterContentItems,
  generateCloudStorageMeta,
} from './brainLogic.js';

test('detectContentType correctly identifies URLs and file types', () => {
  assert.equal(detectContentType('https://www.youtube.com/watch?v=dQw4w9WgXcQ'), 'youtube');
  assert.equal(detectContentType('https://youtu.be/dQw4w9WgXcQ'), 'youtube');
  assert.equal(detectContentType('https://x.com/karpathy/status/12345'), 'twitter');
  assert.equal(detectContentType('https://twitter.com/sama/status/67890'), 'twitter');
  assert.equal(detectContentType('https://www.linkedin.com/posts/xyz'), 'linkedin');
  assert.equal(detectContentType('notes.pdf'), 'document');
  assert.equal(detectContentType('report.docx'), 'document');
  assert.equal(detectContentType('https://paulgraham.com/lesson.html'), 'article');
});

test('extractYouTubeId extracts 11-char video id', () => {
  assert.equal(extractYouTubeId('https://www.youtube.com/watch?v=dQw4w9WgXcQ'), 'dQw4w9WgXcQ');
  assert.equal(extractYouTubeId('https://youtu.be/dQw4w9WgXcQ'), 'dQw4w9WgXcQ');
  assert.equal(extractYouTubeId('https://example.com'), null);
});

test('extractTwitterInfo extracts username and status id', () => {
  const info = extractTwitterInfo('https://x.com/sama/status/188823456789');
  assert.equal(info.username, 'sama');
  assert.equal(info.tweetId, '188823456789');
});

test('formatBytes converts byte numbers to human readable strings', () => {
  assert.equal(formatBytes(0), '0 B');
  assert.equal(formatBytes(1024), '1 KB');
  assert.equal(formatBytes(1024 * 1024 * 2.5), '2.5 MB');
});

test('generateShareHash produces alphanumeric string', () => {
  const hash = generateShareHash(10);
  assert.equal(hash.length, 10);
  assert.equal(isValidShareHash(hash), true);
  assert.equal(isValidShareHash(''), false);
});

test('buildShareUrl produces valid link', () => {
  assert.equal(
    buildShareUrl('http://localhost:3000', 'brain-123'),
    'http://localhost:3000/?share=brain-123'
  );
});

test('filterContentItems searches by title and type', () => {
  const items = [
    { _id: '1', title: 'Deep Learning Notes', type: 'document' },
    { _id: '2', title: 'React Hooks Tutorial', type: 'youtube' },
  ];

  const filtered = filterContentItems(items, 'deep', 'document');
  assert.equal(filtered.length, 1);
  assert.equal(filtered[0]._id, '1');
});

test('generateCloudStorageMeta produces object key and CDN URL', () => {
  const meta = generateCloudStorageMeta('my-doc.pdf', 'user_123');
  assert.ok(meta.cloudStorageKey.startsWith('brains/user_123/'));
  assert.ok(meta.cloudUrl.startsWith('https://cdn.secondbrain.storage/brains/user_123/'));
});
