import React, { useState } from 'react';
import { X, Lock, Mail, User, ShieldCheck, ArrowRight, Eye, EyeOff, CheckCircle2, Sparkles } from 'lucide-react';
import { loginUser, registerUser } from '@/services/api';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: any) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      if (tab === 'login') {
        const data = await loginUser(email, password);
        localStorage.setItem('forecastx_token', data.access_token);
        localStorage.setItem('forecastx_user', JSON.stringify(data.user));
        setSuccessMsg(`Welcome back, ${data.user.name}!`);
        setTimeout(() => {
          onLoginSuccess(data.user);
          onClose();
        }, 600);
      } else {
        if (!name.trim()) throw new Error('Please enter your full name');
        const data = await registerUser(name, email, password);
        localStorage.setItem('forecastx_token', data.access_token);
        localStorage.setItem('forecastx_user', JSON.stringify(data.user));
        setSuccessMsg(`Account created successfully! Welcome, ${data.user.name}`);
        setTimeout(() => {
          onLoginSuccess(data.user);
          onClose();
        }, 600);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMsg(null);
    setIsLoading(true);
    try {
      const data = await loginUser(demoEmail, demoPass);
      localStorage.setItem('forecastx_token', data.access_token);
      localStorage.setItem('forecastx_user', JSON.stringify(data.user));
      setSuccessMsg(`Signed in as ${data.user.name}`);
      setTimeout(() => {
        onLoginSuccess(data.user);
        onClose();
      }, 500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Quick login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-1 pt-1">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 shadow-sm mb-1">
            <ShieldCheck className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-extrabold text-[#0f2942]">ForecastX Portal</h3>
          <p className="text-xs text-slate-500 font-medium">
            National Meteorological Intelligence & Early Warning System
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setTab('login');
              setErrorMsg(null);
            }}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              tab === 'login' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('register');
              setErrorMsg(null);
            }}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              tab === 'register' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {tab === 'register' && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Rajesh Sharma"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Official / Personal Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@imd.gov.in or email@domain.com"
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-9 pr-9 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <span>{isLoading ? 'Authenticating...' : tab === 'login' ? 'Sign In to ForecastX' : 'Register New Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo One-Click Logins */}
        <div className="pt-3 border-t border-slate-100 space-y-2">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>One-Click Role Demonstration:</span>
          </p>
          <div className="grid grid-cols-2 gap-1.5 text-[11px]">
            <button
              type="button"
              onClick={() => handleQuickLogin('james@forecastx.gov.in', 'password123')}
              className="p-2 bg-blue-50/60 hover:bg-blue-100 text-blue-900 border border-blue-200/80 rounded-xl text-left transition-colors font-semibold"
            >
              <p className="truncate">James Anderson</p>
              <p className="text-[9px] text-blue-600 font-normal">IMD Meteorologist</p>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('disaster.ops@odisha.gov.in', 'password123')}
              className="p-2 bg-red-50/60 hover:bg-red-100 text-red-900 border border-red-200/80 rounded-xl text-left transition-colors font-semibold"
            >
              <p className="truncate">Priya Jena</p>
              <p className="text-[9px] text-red-600 font-normal">Disaster Response Ops</p>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('agri.officer@punjab.gov.in', 'password123')}
              className="p-2 bg-emerald-50/60 hover:bg-emerald-100 text-emerald-900 border border-emerald-200/80 rounded-xl text-left transition-colors font-semibold"
            >
              <p className="truncate">Dr. R. Sharma</p>
              <p className="text-[9px] text-emerald-600 font-normal">Agricultural Advisory</p>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('citizen@india.net', 'password123')}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 rounded-xl text-left transition-colors font-semibold"
            >
              <p className="truncate">Public Traveler</p>
              <p className="text-[9px] text-slate-500 font-normal">General User</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
