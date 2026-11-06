import React, { useState } from 'react';
import { X, Lock, User, Mail, Sparkles, AlertCircle, Brain } from 'lucide-react';

export const AuthModal = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [mode, setMode] = useState('signin');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const url = mode === 'signin' ? '/app/v1/signin' : '/app/v1/signup';
    const payload = mode === 'signin' ? { username, password } : { username, email, password };

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      if (mode === 'signup') {
        if (data.token) {
          onLoginSuccess(data.token, data.user);
          onClose();
        } else {
          setMode('signin');
        }
      } else {
        onLoginSuccess(data.token, data.user);
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Error communicating with server');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/app/v1/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'Sonu',
          password: 'password123',
        }),
      });
      const data = await res.json();
      if (res.ok) {
        onLoginSuccess(data.token, data.user);
        onClose();
      }
    } catch (err) {
      setError('Could not sign in with demo account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-sm bg-white dark:bg-[#0a0a10] rounded-xl shadow-2xl border border-gray-200 dark:border-[#181926] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-[#181926]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-purple-500 text-white flex items-center justify-center shadow-xs">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              {mode === 'signin' ? 'Sign In to Second Brain' : 'Create Second Brain Account'}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close auth modal"
            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1-Click Demo Shortcut */}
        <div className="p-4 bg-purple-50/60 dark:bg-purple-950/30 border-b border-purple-100 dark:border-purple-900/40">
          <button
            type="button"
            onClick={handleDemoSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-purple-700 dark:text-purple-200 bg-white dark:bg-[#07070b] border border-purple-200 dark:border-purple-900/50 rounded-lg hover:bg-purple-50/80 dark:hover:bg-[#12131d] transition-colors shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-300" />
            <span>Continue as Sonu (Pre-seeded Demo Vault)</span>
          </button>
        </div>

        {/* Form */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. sonu or warmluke"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-[#181926] bg-white dark:bg-[#07070b] text-slate-900 dark:text-[#ededef] focus:outline-hidden focus:ring-2 focus:ring-purple-600"
                />
                <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="user@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-[#181926] bg-white dark:bg-[#07070b] text-slate-900 dark:text-[#ededef] focus:outline-hidden focus:ring-2 focus:ring-purple-600"
                  />
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-[#181926] bg-white dark:bg-[#07070b] text-slate-900 dark:text-[#ededef] focus:outline-hidden focus:ring-2 focus:ring-purple-600"
                />
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-1.5 p-2 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs rounded-md">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-lg shadow-xs transition-colors disabled:opacity-50"
            >
              {loading
                ? 'Processing...'
                : mode === 'signin'
                ? 'Sign In to Vault'
                : 'Create Second Brain'}
            </button>
          </form>

          {/* Toggle mode */}
          <div className="mt-4 pt-3 border-t border-gray-200 dark:border-[#181926] text-center text-xs text-slate-600 dark:text-slate-400">
            {mode === 'signin' ? (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setError(null);
                  }}
                  className="text-purple-600 dark:text-purple-300 font-semibold hover:underline"
                >
                  Create one now
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setError(null);
                  }}
                  className="text-purple-600 dark:text-purple-300 font-semibold hover:underline"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
