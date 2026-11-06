# 🧠 Second Brain – Digital Knowledge Base & AI Chat

A modern, full-stack personal knowledge management platform designed to store, manage, and synthesize digital content spread across various platforms (PDF documents, YouTube videos, Twitter/X posts, LinkedIn posts, and web articles).

Includes **Public Sharable Brain Links**, **AI Chat with Uploaded Documents (powered by Google Gemini 3.8 Flash)**, and **Cloud Storage Architecture**.

---

## 🌟 Key Features

### 1. 🔗 Sharable Brain (Public Link)
- **Public Share Links**: Users can generate a unique, public read-only link to share their personal knowledge vault with anyone on the internet (e.g. `https://your-domain.com/?share=brain-sonu-public`).
- **Read-Only Guest Mode**: Anyone visiting the public link can search, browse content, read document text, and interact with the AI assistant for that brain. Owner management actions (such as deletion) are protected.
- **1-Click Share & Revoke**: Instant clipboard copy, social sharing to X (Twitter), and instant revocation to make the brain private at any time.

### 2. 🤖 AI Chat with Uploaded Documents & PDFs
- **Gemini 3.8 Flash Integration**: Powered by `@google/genai` on the Node.js backend.
- **Flexible Scope**:
  - **Single Document Mode**: Select any uploaded PDF or document to ask targeted questions, extract formulas, quote citations, or generate summaries.
  - **Entire Brain Mode**: Cross-synthesizes insights across all notes, videos, tweets, and documents stored in the brain.
- **Suggested Prompts & Instant Takeaways**: Pre-built prompt chips (*"Summarize this document"*, *"Extract 5 key takeaways"*) and instant executive takeaways on every card.

### 3. ☁️ Cloud Storage Architecture
- **Distributed Upload Pipeline**: Files uploaded via `multer` are assigned deterministic SHA-256 cloud keys (`brains/[userId]/[timestamp]-[filename]`) and edge CDN URLs (`https://cdn.secondbrain.storage/...`).
- **Text Indexing**: Automatic text extraction from `.pdf`, `.docx`, and `.txt` files for instant AI indexing and search.
- **Cloud Provider Settings**: Built-in support for Second Brain Cloud CDN, Cloudflare R2, AWS S3, and Google Cloud Storage.

### 4. 🗂️ Multi-Platform Content Management
- **YouTube Integration**: Auto-extracts video IDs and embeds playable video players.
- **Twitter / X Cards**: Clean tweet previews with author handles and direct links.
- **Instant Search**: Fast debounced search across titles, document filenames, and curator notes.

---

## 🛠️ Tech Stack

- **Frontend**: React (JavaScript JSX), Tailwind CSS, Lucide Icons
- **Backend**: Node.js, Express.js, Multer (file uploads), JSON Web Tokens (JWT)
- **AI / LLM**: Google Gemini 3.8 Flash (`@google/genai` TypeScript/JavaScript SDK)
- **PDF Engine**: `pdf-parse` (in-memory buffer parsing)
- **Database & Storage**: Dual-mode file-backed JSON store (`data/secondbrain_db.json`) with MongoDB Atlas compatibility

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/your-username/second-brain.git
cd second-brain
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory:
```env
# Required for Gemini AI features (get your free key at https://aistudio.google.com)
GEMINI_API_KEY="your_gemini_api_key_here"

# Server configuration
PORT=3000
JWT_SECRET="your_jwt_secret_key"
```

### 4. Start the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📡 API Endpoints

### Authentication
- `POST /app/v1/signup` - Register a new user (`{ email, username, password }`)
- `POST /app/v1/signin` - Log in and obtain JWT token (`{ username, password }`)
- `GET /app/v1/me` - Get current user profile and vault statistics

### Content Management
- `GET /app/v1/content?search=...&type=...` - Fetch content items with optional query filter
- `POST /app/v1/content` - Add a web link, YouTube video, tweet, or article
- `DELETE /app/v1/content` - Delete a content item (`{ contentId }`)

### Document Upload & Cloud Storage
- `POST /app/v1/content/upload` - Multipart document upload (PDF, DOCX, TXT)
- `GET /app/v1/cloud/stats` - Cloud storage metrics and CDN status
- `POST /app/v1/cloud/config` - Update cloud storage provider settings

### Public Sharable Brain
- `POST /app/v1/brain/share` - Toggle public sharing on/off (`{ share: true|false }`)
- `GET /app/v1/brain/share-status` - Check active share status and URL
- `GET /app/v1/brain/:shareLink` - **Public endpoint** (no auth required) to view shared brain

### AI Document Chat
- `POST /app/v1/chat/document` - AI Q&A with a specific uploaded document
- `POST /app/v1/chat/brain` - Cross-brain synthesis with Gemini 3.8 Flash
- `POST /app/v1/ai/summarize` - Instant executive summary and action items

---

## 📄 License
MIT License
