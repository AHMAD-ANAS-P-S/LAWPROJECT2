import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Eye, EyeOff, UserPlus, BookOpen, Layers, Bookmark, Search } from 'lucide-react';

export default function SignUpPage() {
  const { register, googleAuth, setActivePage } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [terms, setTerms] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setError('');

    if (!fullName.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!terms) {
      setError('You must agree to the Terms of Service');
      return;
    }

    setLoading(true);
    const res = await register(fullName, email, password, terms);
    setLoading(false);
    if (!res.success) {
      setError(res.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-[#1c032a] via-[#3d0f5c] to-[#1c032a] flex flex-col justify-center items-center overflow-x-hidden selection:bg-purple-200">
      {/* ============================================================== */}
      {/* 1. DESKTOP & LAPTOP & PC VIEW (>= 1024px)                      */}
      {/* ============================================================== */}
      <div className="hidden lg:flex w-full min-h-screen flex-col items-center justify-center p-4 xl:p-8">
        <div className="w-full max-w-[1580px] bg-white rounded-3xl shadow-[0_20px_70px_rgba(0,0,0,0.55)] border border-[#ebd6fa] overflow-hidden flex flex-row items-stretch min-h-[850px] relative">
          {/* Left Hero Section */}
          <div className="w-[60%] relative flex items-stretch bg-[#330c4f] overflow-hidden">
            <img
              src="/assets/signup_hero_clean.png"
              alt="Tamil Raw Library Legal Platform"
              className="w-full h-full object-cover object-left select-none pointer-events-none"
            />

            {/* Clickable interactive feature badges at bottom left */}
            <div
              onClick={() => setActivePage('acts')}
              style={{ position: 'absolute', left: '5.2%', bottom: '2.5%', width: '11%', height: '15%' }}
              className="cursor-pointer hover:bg-white/10 rounded-xl transition-colors"
              title="Browse Acts"
            />
            <div
              onClick={() => setActivePage('amendments')}
              style={{ position: 'absolute', left: '17.2%', bottom: '2.5%', width: '12%', height: '15%' }}
              className="cursor-pointer hover:bg-white/10 rounded-xl transition-colors"
              title="Latest Updates"
            />
            <div
              onClick={() => setActivePage('notes')}
              style={{ position: 'absolute', left: '30.5%', bottom: '2.5%', width: '13%', height: '15%' }}
              className="cursor-pointer hover:bg-white/10 rounded-xl transition-colors"
              title="Notes & Bookmarks"
            />
            <div
              onClick={() => setActivePage('search')}
              style={{ position: 'absolute', left: '44.5%', bottom: '2.5%', width: '13%', height: '15%' }}
              className="cursor-pointer hover:bg-white/10 rounded-xl transition-colors"
              title="Advanced Search"
            />
          </div>

          {/* Right Section: Lavender/Purple atmosphere + Pristine White Card */}
          <div className="w-[40%] flex flex-col items-center justify-center p-8 xl:p-12 relative overflow-hidden bg-gradient-to-br from-[#f8f1fc] via-[#ebdcf7] to-[#e4ccf5]">
            <div className="absolute top-0 right-0 w-72 h-36 bg-gradient-to-bl from-purple-800/30 to-transparent pointer-events-none rounded-bl-full" />
            <div className="absolute bottom-0 right-0 w-80 h-44 bg-gradient-to-tl from-purple-900/30 via-purple-700/20 to-transparent pointer-events-none rounded-tl-full" />

            {/* Crisp, properly aligned Sign Up Card */}
            <div className="w-full max-w-[440px] bg-white rounded-3xl p-7 xl:p-8 border-2 border-[#f0c868] shadow-[0_12px_45px_rgba(110,15,160,0.15)] relative z-10 text-gray-800">
              {/* Golden Scales Emblem */}
              <div className="flex justify-center -mt-2 mb-3">
                <div className="w-20 h-20 rounded-full border border-[#f5cb5f] p-0.5 bg-white shadow-sm flex items-center justify-center overflow-hidden">
                  <img
                    src="/assets/gold_scales_emblem.png"
                    alt="Emblem"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </div>

              {/* Title & Subtitle */}
              <div className="text-center mb-4">
                <h2 className="text-2xl xl:text-3xl font-serif-law font-bold text-[#380352]">
                  Create Your Account
                </h2>
                <p className="text-xs text-gray-600 mt-1 font-medium">
                  Join Tamil Raw Library and explore India's legal acts, rules and amendments.
                </p>
                <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#f5cb5f] to-transparent mx-auto mt-2" />
              </div>

              {/* Error message */}
              {error && (
                <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold text-center">
                  {error}
                </div>
              )}

              {/* Interactive Form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-[#45055e] mb-1 flex items-center">
                    <User className="w-3.5 h-3.5 mr-1.5 text-[#79159d]" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-2 rounded-xl border-2 border-[#dfc3f4] bg-[#fbf7fe] focus:bg-white focus:border-[#7a0ea6] text-xs font-medium outline-none transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#45055e] mb-1 flex items-center">
                    <Mail className="w-3.5 h-3.5 mr-1.5 text-[#79159d]" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-2 rounded-xl border-2 border-[#dfc3f4] bg-[#fbf7fe] focus:bg-white focus:border-[#7a0ea6] text-xs font-medium outline-none transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#45055e] mb-1 flex items-center">
                    <Lock className="w-3.5 h-3.5 mr-1.5 text-[#79159d]" />
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create password"
                      className="w-full px-4 py-2 rounded-xl border-2 border-[#dfc3f4] bg-[#fbf7fe] focus:bg-white focus:border-[#7a0ea6] text-xs font-medium outline-none pr-10 transition-colors"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2 text-gray-500 hover:text-purple-900"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#45055e] mb-1 flex items-center">
                    <Lock className="w-3.5 h-3.5 mr-1.5 text-[#79159d]" />
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm password"
                      className="w-full px-4 py-2 rounded-xl border-2 border-[#dfc3f4] bg-[#fbf7fe] focus:bg-white focus:border-[#7a0ea6] text-xs font-medium outline-none pr-10 transition-colors"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-2 text-gray-500 hover:text-purple-900"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-0.5">
                  <input
                    type="checkbox"
                    id="terms-dt"
                    checked={terms}
                    onChange={(e) => setTerms(e.target.checked)}
                    className="w-4 h-4 rounded text-[#6a0793] focus:ring-purple-300 accent-[#5b0378]"
                  />
                  <label htmlFor="terms-dt" className="text-xs text-gray-700">
                    I agree to the <span className="font-bold underline">Terms</span> and <span className="font-bold underline">Privacy Policy</span>.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-full bg-gradient-to-r from-[#4d036a] via-[#6f0c97] to-[#7f13ad] hover:from-[#5d047f] hover:to-[#9218c5] text-white text-sm font-bold flex items-center justify-center space-x-2 shadow-[0_4px_16px_rgba(110,15,160,0.3)] active:scale-95 transition-all mt-1"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{loading ? 'Creating Account...' : 'Sign Up'}</span>
                </button>

                <div className="flex items-center my-2">
                  <div className="flex-1 border-t border-gray-200" />
                  <span className="px-3 text-[11px] font-bold text-gray-400">OR</span>
                  <div className="flex-1 border-t border-gray-200" />
                </div>

                <button
                  type="button"
                  onClick={googleAuth}
                  className="w-full py-2.5 rounded-full border-2 border-[#dfc6f3] bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold flex items-center justify-center space-x-2 shadow-xs transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.04h3.88c2.28-2.09 3.66-5.18 3.66-9.14z" />
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.04c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.13C3.27 21.43 7.34 24 12 24z" />
                    <path fill="#FBBC05" d="M5.28 14.28c-.25-.72-.38-1.49-.38-2.28s.13-1.56.38-2.28V6.59H1.25C.45 8.19 0 9.99 0 12s.45 3.81 1.25 5.41l4.03-3.13z" />
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.27 2.57 1.25 6.59l4.03 3.13c.95-2.83 3.6-4.93 6.72-4.93z" />
                  </svg>
                  <span>Sign Up with Google</span>
                </button>
              </form>

              <div className="text-center mt-4 pt-3 border-t border-[#f4e4fb]">
                <p className="text-xs text-gray-600">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setActivePage('login')}
                    className="font-bold text-[#6a0793] hover:underline"
                  >
                    Login
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. MOBILE & TABLET RESPONSIVE VIEW (< 1024px)                  */}
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
            onClick={() => setActivePage('login')}
            className="text-xs font-bold text-[#f8df80] hover:underline"
          >
            Login
          </button>
        </div>

        {/* Mobile Main Sign Up Card */}
        <div className="w-full max-w-md mx-auto my-auto py-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#e6b93d] shadow-2xl text-gray-800">
            {/* Scales Emblem */}
            <div className="flex justify-center -mt-2 mb-3">
              <div className="w-16 h-16 rounded-full border border-[#f5cb5f] p-0.5 bg-white shadow-sm flex items-center justify-center overflow-hidden">
                <img
                  src="/assets/gold_scales_emblem.png"
                  alt="Emblem"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>

            <div className="text-center mb-5">
              <h2 className="text-2xl font-serif-law font-bold text-[#3d0356]">
                Create Your Account
              </h2>
              <p className="text-xs text-gray-600 mt-1">
                Join Tamil Raw Library and explore India's legal acts, rules and amendments.
              </p>
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#f5cb5f] to-transparent mx-auto mt-2.5" />
            </div>

            {error && (
              <div className="mb-4 p-2.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#45055e] mb-1.5 flex items-center">
                  <User className="w-3.5 h-3.5 mr-1.5 text-[#79159d]" />
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#dfc3f4] bg-[#fbf7fe] focus:bg-white focus:border-[#7a0ea6] text-xs font-medium outline-none transition-colors"
                  required
                />
              </div>

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
                    placeholder="Create password"
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

              <div>
                <label className="block text-xs font-bold text-[#45055e] mb-1.5 flex items-center">
                  <Lock className="w-3.5 h-3.5 mr-1.5 text-[#79159d]" />
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#dfc3f4] bg-[#fbf7fe] focus:bg-white focus:border-[#7a0ea6] text-xs font-medium outline-none pr-10 transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-2.5 text-gray-500 hover:text-purple-900"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="terms-mb"
                  checked={terms}
                  onChange={(e) => setTerms(e.target.checked)}
                  className="w-4 h-4 rounded text-[#6a0793] focus:ring-purple-300 accent-[#5b0378]"
                />
                <label htmlFor="terms-mb" className="text-xs text-gray-700">
                  I agree to the <span className="font-bold underline">Terms</span> and <span className="font-bold underline">Privacy Policy</span>.
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-full bg-gradient-to-r from-[#4d036a] to-[#7f13ad] hover:from-[#5d047f] hover:to-[#9218c5] text-white text-xs font-bold flex items-center justify-center space-x-1.5 shadow-md active:scale-95 transition-all mt-2"
              >
                <span>{loading ? 'Creating Account...' : 'Sign Up'}</span>
                <UserPlus className="w-4 h-4" />
              </button>

              <div className="flex items-center my-3">
                <div className="flex-1 border-t border-gray-200" />
                <span className="px-3 text-[11px] font-bold text-gray-400">OR</span>
                <div className="flex-1 border-t border-gray-200" />
              </div>

              <button
                type="button"
                onClick={googleAuth}
                className="w-full py-2.5 rounded-full border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-bold flex items-center justify-center space-x-2 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.04h3.88c2.28-2.09 3.66-5.18 3.66-9.14z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.04c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.13C3.27 21.43 7.34 24 12 24z" />
                  <path fill="#FBBC05" d="M5.28 14.28c-.25-.72-.38-1.49-.38-2.28s.13-1.56.38-2.28V6.59H1.25C.45 8.19 0 9.99 0 12s.45 3.81 1.25 5.41l4.03-3.13z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.27 2.57 1.25 6.59l4.03 3.13c.95-2.83 3.6-4.93 6.72-4.93z" />
                </svg>
                <span>Sign Up with Google</span>
              </button>
            </form>

            <div className="text-center mt-5 pt-3 border-t border-[#f4e4fb]">
              <p className="text-xs text-gray-600">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setActivePage('login')}
                  className="font-bold text-[#6a0793] hover:underline"
                >
                  Login
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
    </div>
  );
}
