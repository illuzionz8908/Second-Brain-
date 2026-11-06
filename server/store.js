import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

/**
 * store.js
 * In-memory + persistent JSON database store for the Second Brain backend.
 * Provides user management, knowledge item storage, cloud upload metadata,
 * and public shareable brain link hashes.
 */

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'secondbrain_db.json');

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function getInitialSeedData() {
  const defaultUserId = 'user_default_secondbrain_1';
  const defaultUser = {
    _id: defaultUserId,
    username: 'Sonu',
    email: 'kumar.sonu.35798@gmail.com',
    password: 'password123',
    bio: 'Software engineer building modern knowledge architectures, AI systems, and digital brains.',
    createdAt: new Date().toISOString(),
  };

  const initialContents = [
    {
      _id: 'doc_seed_1',
      title: 'Neural Architecture and Agentic Workflows Spec (2026)',
      type: 'document',
      fileName: 'agentic_architectures_spec.pdf',
      fileSize: 420800,
      mimeType: 'application/pdf',
      cloudUrl: 'https://cdn.secondbrain.storage/brains/user_default_secondbrain_1/agentic_architectures_spec.pdf',
      cloudStorageKey: 'brains/user_default_secondbrain_1/agentic_architectures_spec.pdf',
      cloudProvider: 'Second Brain Cloud CDN',
      notes: 'Essential reading on multi-agent collaboration, memory retention layers, and verification loops.',
      extractedText: `Title: Autonomous Agent Architecture & Reasoning Verification (2026)
Abstract: Modern digital knowledge engines require hybrid indexing: combining vector similarity search with structured knowledge graphs and multi-modal contextual reasoning.
Key Findings:
1. Grounding and Verification: Agentic architectures that integrate continuous unit test and simulation checkpoints reduce hallucinations by 84%.
2. Epistemic Memory: Long-term memory stores must distinguish between volatile working context and immutable reference documents.
3. Sharable Knowledge Graphs: Collaborative human-agent reasoning is accelerated when external stakeholders can query the exact state of an agent's knowledge base via deterministic share hashes.
Conclusion: Building a Second Brain requires seamless document indexing, zero-latency cloud object storage, and bidirectional chat interfaces.`,
      userId: defaultUserId,
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    },
    {
      _id: 'doc_seed_2',
      title: 'Distributed Cloud Storage & CDN Optimization Guide',
      type: 'document',
      fileName: 'cloud_storage_best_practices.txt',
      fileSize: 185400,
      mimeType: 'text/plain',
      cloudUrl: 'https://cdn.secondbrain.storage/brains/user_default_secondbrain_1/cloud_storage_best_practices.txt',
      cloudStorageKey: 'brains/user_default_secondbrain_1/cloud_storage_best_practices.txt',
      cloudProvider: 'Second Brain Cloud CDN',
      notes: 'Guidelines on content addressing, immutable object keys, and edge-caching binary assets.',
      extractedText: `Cloud Storage Engineering Rules:
1. Content Immutability: Every uploaded asset is assigned a unique UUID and SHA256 cryptographic digest.
2. Direct-to-Cloud Stream Pipelines: Large files must bypass monolithic memory buffers using streaming chunk uploads.
3. Edge CDN Delivery: Latency to end-users is minimized by distributing read replicas across edge point-of-presence servers.
4. Access Control: Public brain links generate read-only signed URLs without granting administrative write permissions.`,
      userId: defaultUserId,
      createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    },
    {
      _id: 'yt_seed_1',
      title: 'Andrej Karpathy - Deep Dive into LLMs and Synthetic Data',
      type: 'youtube',
      link: 'https://www.youtube.com/watch?v=zjkBMFhNj_g',
      notes: 'Complete breakdown of tokenization, pre-training, instruction tuning, and test-time compute.',
      userId: defaultUserId,
      createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    },
    {
      _id: 'tw_seed_1',
      title: 'System 2 Thinking and Autonomous World Models - Yann LeCun',
      type: 'twitter',
      link: 'https://x.com/ylecun/status/17823901928374',
      notes: 'Insights on hierarchical planning, non-generative representation models, and self-supervised learning.',
      userId: defaultUserId,
      createdAt: new Date(Date.now() - 3600000 * 96).toISOString(),
    },
    {
      _id: 'li_seed_1',
      title: 'Scaling High-Performance Engineering Teams',
      type: 'linkedin',
      link: 'https://www.linkedin.com/pulse/scaling-engineering-teams-system-design',
      notes: 'Architectural lessons from scaling cloud systems to 10M+ daily active sessions.',
      userId: defaultUserId,
      createdAt: new Date(Date.now() - 3600000 * 120).toISOString(),
    },
    {
      _id: 'art_seed_1',
      title: 'Paul Graham - How to Think for Yourself',
      type: 'article',
      link: 'https://paulgraham.com/think.html',
      notes: 'Why independent thinking is rare, how conventional wisdom traps organizations, and cultivating curiosity.',
      userId: defaultUserId,
      createdAt: new Date(Date.now() - 3600000 * 144).toISOString(),
    },
  ];

  const initialLinks = [
    {
      _id: 'link_seed_1',
      hash: 'brain-sonu-public',
      userId: defaultUserId,
      createdAt: new Date().toISOString(),
      isPublic: true,
    },
  ];

  return {
    users: [defaultUser],
    contents: initialContents,
    links: initialLinks,
    cloudSettings: {
      provider: 'Second Brain Cloud CDN',
      bucketName: 'secondbrain-prod-vault-east',
      region: 'global-edge-anycast',
      cdnDomain: 'https://cdn.secondbrain.storage',
    },
  };
}

class Store {
  constructor() {
    this.state = this.load();
  }

  load() {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Initializing fresh store:', e);
    }
    const seed = getInitialSeedData();
    this.save(seed);
    return seed;
  }

  save(data = this.state) {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to write data file:', e);
    }
  }

  // --- Users ---
  findUserByUsername(username) {
    return this.state.users.find(
      (u) => u.username.toLowerCase() === username.toLowerCase()
    );
  }

  findUserByEmail(email) {
    return this.state.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
  }

  findUserById(id) {
    return this.state.users.find((u) => u._id === id);
  }

  createUser(user) {
    const newUser = {
      _id: `user_${uuidv4().slice(0, 8)}`,
      email: user.email,
      username: user.username,
      password: user.password,
      bio: user.bio || 'Second Brain curator',
      createdAt: new Date().toISOString(),
    };
    this.state.users.push(newUser);
    this.save();
    return newUser;
  }

  // --- Contents ---
  getContents(userId, search = '', type = '') {
    return this.state.contents
      .filter((item) => {
        if (item.userId !== userId) return false;
        if (type && type !== 'all' && item.type !== type) return false;
        if (search && search.trim()) {
          const q = search.toLowerCase();
          const matchTitle = item.title?.toLowerCase().includes(q);
          const matchFileName = item.fileName?.toLowerCase().includes(q);
          const matchNotes = item.notes?.toLowerCase().includes(q);
          const matchText = item.extractedText?.toLowerCase().includes(q);
          if (!matchTitle && !matchFileName && !matchNotes && !matchText) return false;
        }
        return true;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getContentById(contentId) {
    return this.state.contents.find((c) => c._id === contentId);
  }

  createContent(item) {
    const newContent = {
      ...item,
      _id: `content_${uuidv4().slice(0, 10)}`,
      createdAt: new Date().toISOString(),
    };
    this.state.contents.unshift(newContent);
    this.save();
    return newContent;
  }

  deleteContent(contentId, userId) {
    const initialLen = this.state.contents.length;
    this.state.contents = this.state.contents.filter(
      (c) => !(c._id === contentId && c.userId === userId)
    );
    const deleted = this.state.contents.length < initialLen;
    if (deleted) this.save();
    return deleted;
  }

  // --- Sharable Brain Public Links ---
  getShareLinkByUserId(userId) {
    return this.state.links.find((l) => l.userId === userId && l.isPublic);
  }

  getShareLinkByHash(hash) {
    return this.state.links.find((l) => l.hash === hash && l.isPublic);
  }

  setShareLink(userId, isShared) {
    const existing = this.state.links.find((l) => l.userId === userId);
    if (!isShared) {
      if (existing) {
        this.state.links = this.state.links.filter((l) => l.userId !== userId);
        this.save();
      }
      return null;
    }

    if (existing) {
      existing.isPublic = true;
      this.save();
      return existing;
    }

    const newLink = {
      _id: `link_${uuidv4().slice(0, 8)}`,
      hash: `brain-${uuidv4().slice(0, 8)}`,
      userId,
      createdAt: new Date().toISOString(),
      isPublic: true,
    };
    this.state.links.push(newLink);
    this.save();
    return newLink;
  }

  // --- Cloud Storage Stats ---
  getCloudStats(userId) {
    const userDocs = this.state.contents.filter(
      (c) => c.userId === userId && c.type === 'document'
    );
    const totalBytes = userDocs.reduce((acc, curr) => acc + (curr.fileSize || 0), 0);

    return {
      provider: this.state.cloudSettings.provider,
      bucketName: this.state.cloudSettings.bucketName,
      region: this.state.cloudSettings.region,
      cdnDomain: this.state.cloudSettings.cdnDomain,
      totalFiles: userDocs.length,
      totalSizeBytes: totalBytes,
      totalSizeFormatted: `${(totalBytes / (1024 * 1024)).toFixed(2)} MB`,
      storageLimitBytes: 100 * 1024 * 1024,
      storageLimitFormatted: '100 MB',
      uptimeStatus: 'Operational',
      edgePointsCount: 42,
    };
  }

  updateCloudSettings(settings) {
    this.state.cloudSettings = {
      ...this.state.cloudSettings,
      ...settings,
    };
    this.save();
    return this.state.cloudSettings;
  }
}

export const dbStore = new Store();
