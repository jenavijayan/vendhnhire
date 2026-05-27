import React, { useState } from 'react';
import { Shield, Key, User, AlertCircle, Sparkles } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export default function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network delay
    setTimeout(() => {
      if (username.toLowerCase() === 'admin' && password === 'password123') {
        localStorage.setItem('rp_admin_session', 'true');
        onLoginSuccess();
      } else {
        setError('Invalid administrative credentials. Please verify and try again.');
        setIsLoading(false);
      }
    }, 600);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12" id="login-container">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-gray-100 bg-white p-8 shadow-xl shadow-gray-100/50" id="login-card">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gray-900 text-white shadow-md">
            <Shield className="h-6 w-6" />
          </div>
          <h2 className="mt-4 font-sans text-2xl font-semibold tracking-tight text-gray-900">
            Administrative Portal
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Secure sign-in for recruiters and hiring managers
          </p>
        </div>

        {error && (
          <div className="flex items-start space-x-2.5 rounded-lg bg-red-50 p-3.5 text-sm text-red-700 border border-red-100" id="login-error">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-500 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form className="mt-8 space-y-5" onSubmit={handleSubmit} id="login-form">
          <div className="space-y-1">
            <label className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Username
            </label>
            <div className="relative rounded-lg shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="login-username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="block w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 text-sm placeholder-gray-400 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Password
            </label>
            <div className="relative rounded-lg shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Key className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="login-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="block w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 text-sm placeholder-gray-400 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="bg-gray-50/50 rounded-lg border border-gray-100 px-4 py-3 text-xs text-gray-500 flex items-start gap-2.5">
            <Sparkles className="h-4 w-4 text-amber-500 shrink-0 mt-0.5 animate-pulse" />
            <div>
              <span className="font-medium text-gray-700">Demo Mode Active:</span>
              <p className="mt-0.5">Use username <span className="font-mono bg-gray-100 px-1 py-0.5 rounded text-gray-800">admin</span> and password <span className="font-mono bg-gray-100 px-1 py-0.5 rounded text-gray-800">password123</span> to inspect administrative tracking capabilities.</p>
            </div>
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            disabled={isLoading}
            className="group relative flex w-full justify-center rounded-lg bg-gray-900 py-3 text-sm font-semibold text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isLoading ? (
              <span className="inline-flex items-center space-x-2">
                <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Verifying Access...</span>
              </span>
            ) : (
              'Authenticate Dashboard'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
