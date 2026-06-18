import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, User, ShieldAlert, ArrowRight, Loader2, CloudRain } from 'lucide-react';

interface LoginProps {
  theme?: 'light' | 'dark';
  toggleTheme?: () => void;
}

export const Login: React.FC<LoginProps> = () => {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      if (isRegister) {
        if (!username.trim()) throw new Error('Username is required');
        await register(username, email, password);
      } else {
        await login(email, password);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An authentication error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-main px-4 relative overflow-hidden transition-colors duration-200">
      {/* Decorative colored blobs in the background */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-primary/5 blur-[130px] pointer-events-none"></div>

      <div className="w-full max-w-md glass-card p-8 rounded-3xl relative z-10">
        {/* Logo and Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary shadow-lg shadow-primary/20 mb-4 animate-pulse">
            <CloudRain className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-text-main tracking-tight">
            ChaiDrive
          </h1>
          <p className="text-text-muted text-sm mt-2 font-medium">
            {isRegister ? 'Create a secure personal storage account' : 'Access your decentralized personal drive'}
          </p>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="flex items-center gap-3 p-4 mb-6 rounded-2xl bg-red-500/5 border border-red-500/10 text-red-600 dark:text-red-400 text-sm">
            <ShieldAlert className="w-5 h-5 text-red-500 shrink-0" />
            <p className="font-semibold">{errorMsg}</p>
          </div>
        )}

        {/* Authentication Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {isRegister && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider pl-1">Username</label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 w-5 h-5 text-text-muted" />
                <input
                  type="text"
                  required
                  placeholder="tarun_sisodia"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-bg-main/40 border border-border-custom rounded-2xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-text-main transition-all placeholder:text-text-muted/40 text-sm"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-text-muted uppercase tracking-wider pl-1">Email address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 w-5 h-5 text-text-muted" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-bg-main/40 border border-border-custom rounded-2xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-text-main transition-all placeholder:text-text-muted/40 text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center pl-1">
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Password</label>
              {!isRegister && (
                <a href="#forgot" className="text-xs font-semibold text-primary hover:underline">
                  Forgot?
                </a>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 w-5 h-5 text-text-muted" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-bg-main/40 border border-border-custom rounded-2xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-text-main transition-all placeholder:text-text-muted/40 text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary hover:bg-primary-hover text-white font-bold rounded-2xl shadow-md active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer mt-4"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>{isRegister ? 'Sign Up' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Toggle between Register & Login */}
        <div className="text-center mt-8 pt-6 border-t border-border-custom">
          <p className="text-text-muted text-sm font-medium">
            {isRegister ? 'Already have an account?' : "Don't have an account yet?"}{' '}
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setErrorMsg(null);
              }}
              className="text-primary hover:underline font-bold transition-all cursor-pointer"
            >
              {isRegister ? 'Sign In' : 'Create Account'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
