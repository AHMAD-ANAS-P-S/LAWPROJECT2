import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, ArrowRight, BookOpen, Layers, Bookmark, Search, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const { login, googleAuth, setActivePage } = useAuth();
  const [email, setEmail] = useState('anas@tamilrawlibrary.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setError('');
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (!res.success) {
      setError(res.error || 'Invalid credentials');
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!forgotEmail) return;
    try {
      await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail })
      });
      setForgotSuccess(true);
      setTimeout(() => {
        setForgotSuccess(false);
        setForgotModalOpen(false);
        setForgotEmail('');
      }, 2500);
    } catch (err) {
      setError('Unable to reset password');
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-[#1c032a] via-[#3d0f5c] to-[#1c032a] flex flex-col justify-center items-center overflow-x-hidden selection:bg-purple-200">
      {/* ============================================================== */}
      {/* 1. DESKTOP & LAPTOP & PC VIEW (>= 1024px)                      */}
      {/* Exact pixel-matched full stage with proportional interactive   */}
      {/* overlay, centered against royal purple velvet background       */}
      {/* ============================================================== */}
      <div className="hidden lg:flex w-full min-h-screen flex-col items-center justify-center p-2 xl:p-4">
        <div className="w-full max-w-[1671px] aspect-[1671/941] relative select-none shadow-[0_20px_70px_rgba(0,0,0,0.55)] rounded-2xl overflow-hidden bg-white">
          {/* Complete authoritative reference design artwork */}
          <img
            src="/assets/login_portal_full.png"
            alt="Tamil Raw Library Login Portal"
            className="w-full h-full object-cover pointer-events-none select-none"
          />

          {/* Interactive HTML Form Layer positioned over card */}
          <form onSubmit={handleSubmit}>
            {/* Email Input Field */}
            <div
              style={{
                position: 'absolute',
                left: '66.72%',
                top: '37.83%',
                width: '26.63%',
                height: '5.53%',
              }}
              className="z-20 flex items-center"
            >
              <div className="relative w-full h-full flex items-center">
                <Mail className="absolute left-3.5 w-5 h-5 text-[#6c0f8e] pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full h-full bg-[#faf5fe] hover:bg-white focus:bg-white rounded-2xl border-2 border-[#dfc3f4] focus:border-[#7d14a9] text-[#330448] font-medium pl-11 pr-4 text-[13px] md:text-sm outline-none transition-all shadow-inner"
                  required
                />
              </div>
            </div>

            {/* Password Input Field */}
            <div
              style={{
                position: 'absolute',
                left: '66.72%',
                top: '50.15%',
                width: '26.63%',
                height: '5.53%',
              }}
              className="z-20 flex items-center"
            >
              <div className="relative w-full h-full flex items-center">
                <Lock className="absolute left-3.5 w-5 h-5 text-[#6c0f8e] pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full h-full bg-[#faf5fe] hover:bg-white focus:bg-white rounded-2xl border-2 border-[#dfc3f4] focus:border-[#7d14a9] text-[#330448] font-medium pl-11 pr-11 text-[13px] md:text-sm outline-none transition-all shadow-inner"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-[#721596] hover:text-[#410359] transition-colors cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <button
              type="button"
              onClick={() => {
                setForgotEmail(email);
                setForgotModalOpen(true);
              }}
              style={{
                position: 'absolute',
                left: '83.0%',
                top: '59.08%',
                width: '10.5%',
                height: '3.0%',
              }}
              className="z-20 flex items-center justify-end text-xs font-bold text-[#550573] hover:text-[#8817b7] cursor-pointer transition-colors"
            >
              <span>Forgot Password?</span>
            </button>

            {/* Error Message if any */}
            {error && (
              <div
                style={{
                  position: 'absolute',
                  left: '66.72%',
                  top: '57.0%',
                  width: '16%',
                }}
                className="z-20 text-[11px] font-bold text-red-600 truncate"
              >
                {error}
              </div>
            )}

            {/* Login Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                position: 'absolute',
                left: '66.72%',
                top: '64.82%',
                width: '26.63%',
                height: '6.16%',
              }}
              className="z-20 rounded-full bg-gradient-to-r from-[#4d036a] via-[#6f0c97] to-[#7f13ad] hover:from-[#5d047f] hover:to-[#9218c5] text-white text-base font-bold flex items-center justify-center space-x-2 shadow-[0_4px_16px_rgba(110,15,160,0.35)] cursor-pointer active:scale-[0.98] transition-all"
            >
              <ArrowRight className="w-5 h-5 text-white/90" />
              <span>{loading ? 'Logging in...' : 'Login'}</span>
            </button>
          </form>

          {/* Google Login Button */}
          <button
            type="button"
            onClick={googleAuth}
            style={{
              position: 'absolute',
              left: '66.72%',
              top: '79.06%',
              width: '26.63%',
              height: '6.16%',
            }}
            className="z-20 rounded-full bg-white hover:bg-[#fbf7fe] border-2 border-[#dfc6f3] text-[#3d0356] text-sm font-bold flex items-center justify-center space-x-2.5 shadow-sm hover:shadow-md cursor-pointer active:scale-[0.98] transition-all"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.04h3.88c2.28-2.09 3.66-5.18 3.66-9.14z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.04c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.13C3.27 21.43 7.34 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.28c-.25-.72-.38-1.49-.38-2.28s.13-1.56.38-2.28V6.59H1.25C.45 8.19 0 9.99 0 12s.45 3.81 1.25 5.41l4.03-3.13z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.27 2.57 1.25 6.59l4.03 3.13c.95-2.83 3.6-4.93 6.72-4.93z"
              />
            </svg>
            <span>Login with Google</span>
          </button>

          {/* Sign Up Link */}
          <button
            type="button"
            onClick={() => setActivePage('signup')}
            style={{
              position: 'absolute',
              left: '82.8%',
              top: '90.11%',
              width: '5.5%',
              height: '3.5%',
            }}
            className="z-20 text-sm font-bold text-[#550573] hover:text-[#8817b7] underline cursor-pointer flex items-center justify-center transition-colors"
          >
            Sign Up
          </button>

          {/* Interactive clickable zones for bottom 4 feature cards */}
          <div
            onClick={() => setActivePage('acts')}
            style={{ position: 'absolute', left: '3.2%', top: '82.8%', width: '6.8%', height: '14.8%' }}
            className="z-20 cursor-pointer hover:bg-white/10 rounded-xl transition-colors"
            title="Browse Central & State Acts"
          />
          <div
            onClick={() => setActivePage('amendments')}
            style={{ position: 'absolute', left: '10.4%', top: '82.8%', width: '7.4%', height: '14.8%' }}
            className="z-20 cursor-pointer hover:bg-white/10 rounded-xl transition-colors"
            title="Latest Amendments & Notifications"
          />
          <div
            onClick={() => setActivePage('notes')}
            style={{ position: 'absolute', left: '18.5%', top: '82.8%', width: '7.7%', height: '14.8%' }}
            className="z-20 cursor-pointer hover:bg-white/10 rounded-xl transition-colors"
            title="Notes & Bookmarks"
          />
          <div
            onClick={() => setActivePage('search')}
            style={{ position: 'absolute', left: '26.9%', top: '82.8%', width: '8.0%', height: '14.8%' }}
            className="z-20 cursor-pointer hover:bg-white/10 rounded-xl transition-colors"
            title="Advanced Search"
          />
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. MOBILE & TABLET RESPONSIVE VIEW (< 1024px)                  */}
      {/* 100% viewport fit, zero horizontal overflow, touch-optimized   */}
      {/* ============================================================== */}
      <div className="flex lg:hidden flex-col w-full min-h-screen bg-gradient-to-b from-[#2e0947] via-[#4a1267] to-[#1c0330] p-4 sm:p-6 text-white">
        {/* Mobile Header */}
        <div className="w-full flex items-center justify-between pb-4 border-b border-purple-400/20">
          <div className="flex items-center space-x-2">
            <img
              src="/assets/gold_scales_emblem.png"
              alt="Tamil Raw Library Emblem"
              className="w-8 h-8 object-contain"
            />
            <div>
              <h1 className="font-serif-law font-bold text-base text-white leading-tight">
                Tamil Raw Library
              </h1>
              <p className="text-[10px] text-purple-200">Legal Acts Subscription Platform</p>
            </div>
          </div>
          <button
            onClick={() => setActivePage('signup')}
            className="text-xs font-bold text-[#f8df80] hover:underline"
          >
            Sign Up
          </button>
        </div>

        {/* Mobile Main Login Card */}
        <div className="w-full max-w-md mx-auto my-auto py-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#e6b93d] shadow-2xl text-gray-800">
            {/* Scales Emblem */}
            <div className="flex justify-center -mt-2 mb-3">
              <div className="w-16 h-16 rounded-full border border-[#f5cb5f] p-1 bg-gradient-to-b from-white to-purple-50 shadow-sm flex items-center justify-center">
                <img
                  src="/assets/gold_scales_emblem.png"
                  alt="Emblem"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            <div className="text-center mb-5">
              <h2 className="text-2xl font-serif-law font-bold text-[#3d0356]">
                Welcome Back
              </h2>
              <p className="text-xs text-gray-600 mt-1">
                Login to Access Tamil Raw Library
              </p>
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#f5cb5f] to-transparent mx-auto mt-2.5" />
            </div>

            {error && (
              <div className="mb-4 p-2.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#45055e] mb-1.5 flex items-center">
                  <Mail className="w-3.5 h-3.5 mr-1.5 text-[#79159d]" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#dfc3f4] bg-[#fbf7fe] focus:bg-white focus:border-[#7a0ea6] text-xs font-medium outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#45055e] mb-1.5 flex items-center">
                  <Lock className="w-3.5 h-3.5 mr-1.5 text-[#79159d]" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#dfc3f4] bg-[#fbf7fe] focus:bg-white focus:border-[#7a0ea6] text-xs font-medium outline-none pr-10 transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-500 hover:text-purple-900"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setForgotEmail(email);
                    setForgotModalOpen(true);
                  }}
                  className="text-xs font-bold text-[#6a0793] hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#4d036a] to-[#7f13ad] hover:from-[#5d047f] hover:to-[#9218c5] text-white text-xs font-bold flex items-center justify-center space-x-1.5 shadow-md active:scale-95 transition-all"
              >
                <span>{loading ? 'Logging in...' : 'Login'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center my-3">
                <div className="flex-1 border-t border-gray-200" />
                <span className="px-3 text-[11px] font-bold text-gray-400">OR</span>
                <div className="flex-1 border-t border-gray-200" />
              </div>

              <button
                type="button"
                onClick={googleAuth}
                className="w-full py-2.5 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-bold flex items-center justify-center space-x-2 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.04h3.88c2.28-2.09 3.66-5.18 3.66-9.14z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.04c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.13C3.27 21.43 7.34 24 12 24z" />
                  <path fill="#FBBC05" d="M5.28 14.28c-.25-.72-.38-1.49-.38-2.28s.13-1.56.38-2.28V6.59H1.25C.45 8.19 0 9.99 0 12s.45 3.81 1.25 5.41l4.03-3.13z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.27 2.57 1.25 6.59l4.03 3.13c.95-2.83 3.6-4.93 6.72-4.93z" />
                </svg>
                <span>Login with Google</span>
              </button>
            </form>

            <div className="text-center mt-5 pt-3 border-t border-[#f4e4fb]">
              <p className="text-xs text-gray-600">
                New to Tamil Raw Library?{' '}
                <button
                  type="button"
                  onClick={() => setActivePage('signup')}
                  className="font-bold text-[#6a0793] hover:underline"
                >
                  Sign Up
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* 4 Feature Badges on Mobile */}
        <div className="w-full max-w-md mx-auto grid grid-cols-2 gap-2.5 pb-6">
          <div
            onClick={() => setActivePage('acts')}
            className="p-3 bg-white/10 rounded-2xl border border-white/15 text-center flex flex-col items-center justify-center cursor-pointer active:scale-95 transition-transform"
          >
            <BookOpen className="w-5 h-5 text-[#f8df80] mb-1" />
            <span className="text-xs font-bold text-white">Browse Acts</span>
            <span className="text-[10px] text-purple-200">Central & State</span>
          </div>
          <div
            onClick={() => setActivePage('amendments')}
            className="p-3 bg-white/10 rounded-2xl border border-white/15 text-center flex flex-col items-center justify-center cursor-pointer active:scale-95 transition-transform"
          >
            <Layers className="w-5 h-5 text-[#f8df80] mb-1" />
            <span className="text-xs font-bold text-white">Latest Updates</span>
            <span className="text-[10px] text-purple-200">Amendments</span>
          </div>
          <div
            onClick={() => setActivePage('notes')}
            className="p-3 bg-white/10 rounded-2xl border border-white/15 text-center flex flex-col items-center justify-center cursor-pointer active:scale-95 transition-transform"
          >
            <Bookmark className="w-5 h-5 text-[#f8df80] mb-1" />
            <span className="text-xs font-bold text-white">Notes & Saved</span>
            <span className="text-[10px] text-purple-200">Save & Organize</span>
          </div>
          <div
            onClick={() => setActivePage('search')}
            className="p-3 bg-white/10 rounded-2xl border border-white/15 text-center flex flex-col items-center justify-center cursor-pointer active:scale-95 transition-transform"
          >
            <Search className="w-5 h-5 text-[#f8df80] mb-1" />
            <span className="text-xs font-bold text-white">Advanced Search</span>
            <span className="text-[10px] text-purple-200">Find Acts Fast</span>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full border border-purple-200 shadow-2xl">
            <h3 className="font-bold text-lg text-[#3d0356] font-serif-law">
              Reset Your Password
            </h3>
            <p className="text-xs text-gray-600 mt-1 mb-4">
              Enter your registered email address and we'll send you instructions to reset your password.
            </p>

            {forgotSuccess ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Password reset link sent to your email!</span>
              </div>
            ) : (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-3">
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-purple-200 outline-none focus:border-purple-600"
                  required
                />
                <div className="flex space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(false)}
                    className="flex-1 py-2 rounded-xl border border-gray-200 text-gray-600 text-xs font-bold hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-[#5b0378] text-white text-xs font-bold hover:bg-[#720999]"
                  >
                    Send Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
