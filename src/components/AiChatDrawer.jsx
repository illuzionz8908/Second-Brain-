import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Sparkles,
  Send,
  FileText,
  Bot,
  User,
  RotateCcw,
} from 'lucide-react';

export const AiChatDrawer = ({
  isOpen,
  onClose,
  documents = [],
  selectedDocumentId,
  onSelectDocumentId,
  authToken,
  shareLink,
}) => {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'ai',
      text: "Hello! I am your Second Brain AI. Ask me anything about your uploaded documents, PDFs, research notes, or ask me to synthesize insights across your entire knowledge vault.",
      timestamp: 'Just now',
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const currentDoc = documents.find((d) => d._id === selectedDocumentId);

  const presetQuestions = currentDoc
    ? [
        'Summarize this document',
        'Extract 5 key takeaways',
        'What are the core action items?',
        'Explain the methodology simply',
      ]
    : [
        'What are the main topics in my Second Brain?',
        'Find connections between my documents and notes',
        'Summarize recent AI research saved in my brain',
        'What should I review next?',
      ];

  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isLoading) return;

    const userMessage = {
      id: `msg_user_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setIsLoading(true);

    try {
      let res;
      const history = messages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({
          role: m.sender === 'user' ? 'user' : 'model',
          parts: m.text,
        }));

      if (selectedDocumentId) {
        res = await fetch('/app/v1/chat/document', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(authToken ? { Authorization: authToken } : {}),
          },
          body: JSON.stringify({
            documentId: selectedDocumentId,
            query,
            history,
            shareLink,
          }),
        });
      } else {
        res = await fetch('/app/v1/chat/brain', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(authToken ? { Authorization: authToken } : {}),
          },
          body: JSON.stringify({
            query,
            history,
            shareLink,
          }),
        });
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'AI request failed');
      }

      const aiMessage = {
        id: `msg_ai_${Date.now()}`,
        sender: 'ai',
        text: data.answer || 'Completed analysis.',
        documentTitle: data.documentTitle || (currentDoc ? currentDoc.title : 'Entire Second Brain'),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      const errorMessage = {
        id: `msg_err_${Date.now()}`,
        sender: 'ai',
        text: `Sorry, I encountered an issue analyzing this request: ${err.message}. Please try again.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'reset',
        sender: 'ai',
        text: currentDoc
          ? `Cleared session. Ready to explore "${currentDoc.title}". What would you like to know?`
          : 'Cleared conversation history. Ask me anything about your Second Brain!',
        timestamp: 'Just now',
      },
    ]);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[460px] bg-white dark:bg-[#07070b] border-l border-gray-200 dark:border-[#14151e] shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-[#14151e] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 rounded-lg">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>Second Brain AI Chat</span>
              <span className="text-[10px] font-mono text-purple-600 dark:text-purple-300 font-normal">
                Gemini 3.8
              </span>
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Grounded in your uploaded documents and notes
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleClearHistory}
            title="Clear Chat History"
            aria-label="Clear chat history"
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            aria-label="Close AI Chat"
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Target Selector Dropdown */}
      <div className="px-4 py-2.5 bg-gray-100/50 dark:bg-[#0a0a10] border-b border-gray-200 dark:border-[#14151e]">
        <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
          Knowledge Scope
        </label>
        <div className="relative">
          <select
            value={selectedDocumentId || ''}
            onChange={(e) => onSelectDocumentId(e.target.value ? e.target.value : null)}
            className="w-full pl-3 pr-8 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-[#181926] bg-white dark:bg-[#07070b] text-slate-900 dark:text-[#ededef] font-medium focus:outline-hidden focus:ring-2 focus:ring-purple-600 truncate"
          >
            <option value="">🌐 Entire Second Brain (All Items &amp; Notes)</option>
            {documents.map((doc) => (
              <option key={doc._id} value={doc._id}>
                📄 {doc.title} ({doc.fileName || 'Document'})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs text-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-purple-600 text-white rounded-br-xs'
                    : 'bg-gray-100 dark:bg-[#0a0a10] text-slate-900 dark:text-[#ededef] rounded-bl-xs border border-gray-200/80 dark:border-[#181926]'
                }`}
              >
                {!isUser && msg.documentTitle && (
                  <div className="flex items-center gap-1 text-[10px] text-purple-600 dark:text-purple-300 font-mono mb-1 pb-1 border-b border-gray-200 dark:border-[#181926]">
                    <FileText className="w-2.5 h-2.5" />
                    <span className="truncate">{msg.documentTitle}</span>
                  </div>
                )}

                <div className="whitespace-pre-wrap space-y-1.5">{msg.text}</div>

                <div
                  className={`mt-1 text-[10px] text-right ${
                    isUser ? 'text-purple-200' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {isUser && (
                <div className="w-7 h-7 rounded-full bg-slate-300 dark:bg-[#181926] text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0 text-xs font-bold">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 p-2 bg-gray-100/70 dark:bg-[#0a0a10] rounded-lg w-fit">
            <span className="w-2 h-2 rounded-full bg-purple-600 animate-ping" />
            <span>Analyzing document passages and reasoning...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Chips */}
      <div className="px-4 py-2 border-t border-gray-200 dark:border-[#14151e] bg-gray-100/30 dark:bg-[#0a0a10]">
        <p className="text-[10px] uppercase font-semibold text-slate-400 mb-1.5">
          Suggested Prompts
        </p>
        <div className="flex flex-wrap gap-1.5">
          {presetQuestions.map((q) => (
            <button
              key={q}
              onClick={() => handleSendMessage(q)}
              disabled={isLoading}
              className="text-[11px] px-2.5 py-1 rounded-md bg-white dark:bg-[#07070b] border border-gray-200 dark:border-[#181926] text-slate-700 dark:text-slate-300 hover:border-purple-500 hover:text-purple-600 dark:hover:text-purple-300 transition-colors text-left"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <div className="p-3 border-t border-gray-200 dark:border-[#14151e] bg-white dark:bg-[#07070b]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder={
              currentDoc
                ? `Ask anything about "${currentDoc.fileName || currentDoc.title}"...`
                : 'Ask across all your documents & notes...'
            }
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            disabled={isLoading}
            className="flex-1 px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-[#181926] bg-white dark:bg-[#0a0a10] text-slate-900 dark:text-[#ededef] focus:outline-hidden focus:ring-2 focus:ring-purple-600 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isLoading}
            aria-label="Send message to AI"
            className="p-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg disabled:opacity-40 transition-colors shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
