import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, ChevronDown, User, CheckCircle, CreditCard, HelpCircle, LogOut, Menu, X } from 'lucide-react';

export default function Header() {
  const {
    user,
    language,
    changeLanguage,
    activePage,
    setActivePage,
    logout,
    notifications,
    showNotifications,
    setShowNotifications,
    showUserDropdown,
    setShowUserDropdown,
    mobileMenuOpen,
    setMobileMenuOpen
  } = useAuth();

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="h-[64px] md:h-[70px] bg-white border-b border-[#ebdcf7] px-3 md:px-6 flex items-center justify-between sticky top-0 z-40 select-none shadow-[0_2px_10px_rgba(110,10,140,0.03)]">
      {/* Click backdrop to close dropdowns on outside click */}
      {(showNotifications || showUserDropdown) && (
        <div
          className="fixed inset-0 z-40 bg-transparent"
          onClick={() => {
            setShowNotifications(false);
            setShowUserDropdown(false);
          }}
        />
      )}
      {/* Left branding & mobile hamburger */}
      <div className="flex items-center space-x-2 md:space-x-3">
        {/* Mobile menu toggle button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-[#5b0378] hover:bg-purple-50 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div
          className="flex items-center cursor-pointer space-x-2"
          onClick={() => {
            setActivePage('dashboard');
            setMobileMenuOpen(false);
          }}
        >
          <img
            src="/assets/header_brand.png"
            alt="Tamil Raw Library | Legal Acts Subscription Platform"
            className="h-8 md:h-[46px] object-contain hover:opacity-95 transition-opacity"
          />
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center space-x-2 md:space-x-4">
        {/* Language selector */}
        <div className="flex items-center bg-[#f8f1fc] p-0.5 rounded-full border border-[#e4ccf5]">
          <button
            onClick={() => changeLanguage('English')}
            className={`px-2.5 md:px-4 py-1 md:py-1.5 rounded-full text-[11px] md:text-xs font-semibold transition-all ${
              language === 'English'
                ? 'bg-white text-[#4a0364] shadow-sm border border-[#e2c7f5]'
                : 'text-[#6f258a] hover:text-[#4a0364]'
            }`}
          >
            English
          </button>
          <button
            onClick={() => changeLanguage('தமிழ்')}
            className={`px-2.5 md:px-4 py-1 md:py-1.5 rounded-full text-[11px] md:text-xs font-semibold transition-all ${
              language === 'தமிழ்'
                ? 'bg-[#5b0378] text-white shadow-sm'
                : 'text-[#6f258a] hover:text-[#4a0364]'
            }`}
          >
            தமிழ்
          </button>
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserDropdown(false);
            }}
            className="w-9 h-9 rounded-full bg-[#fbf6fe] hover:bg-[#f3e5fc] flex items-center justify-center border border-[#e5cbf5] text-[#d68a0d] relative transition-colors shadow-sm"
            title="Notifications"
          >
            <Bell className="w-5 h-5 fill-[#f4ba26] text-[#c98b04]" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#e81123] text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-[#ebd6fa] py-2 z-50 animate-fadeIn">
              <div className="px-4 py-2 border-b border-[#f3e7fb] flex justify-between items-center">
                <span className="font-bold text-sm text-[#490364]">Notifications</span>
                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full font-medium">
                  {unreadCount} new
                </span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-[#f7eefd]">
                {notifications.map(n => (
                  <div key={n.id} className="p-3 hover:bg-[#faf4fd] transition-colors cursor-pointer">
                    <p className="text-xs font-bold text-[#45055e]">{n.title}</p>
                    <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">{n.desc}</p>
                    <span className="text-[10px] text-gray-400 mt-1 block">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User profile dropdown pill */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserDropdown(!showUserDropdown);
              setShowNotifications(false);
            }}
            className="flex items-center space-x-2.5 px-3 py-1.5 rounded-full border border-[#e4ccf5] bg-[#fbf6fe] hover:bg-[#f4e6fc] transition-colors shadow-sm"
          >
            <div className="w-6 h-6 rounded-full bg-[#5b0378] text-white flex items-center justify-center">
              <User className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-[#42045c] tracking-wide hidden sm:inline">
              {user.name}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-[#6b1587]" />
          </button>

          {/* Profile Dropdown */}
          {showUserDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-[#ebd6fa] py-2 z-50 animate-fadeIn">
              <div className="px-4 py-2 border-b border-[#f3e7fb]">
                <p className="text-xs font-bold text-[#44035f]">{user.name}</p>
                <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                <div className="mt-1 flex items-center text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {user.plan}
                </div>
              </div>
              <div className="py-1 text-xs">
                <button
                  onClick={() => {
                    setActivePage('subscription');
                    setShowUserDropdown(false);
                  }}
                  className="w-full px-4 py-2 text-left text-gray-700 hover:bg-[#f8f0fd] flex items-center"
                >
                  <CreditCard className="w-4 h-4 mr-2 text-[#79159d]" />
                  Subscription Details
                </button>
                <button
                  onClick={() => {
                    setActivePage('help');
                    setShowUserDropdown(false);
                  }}
                  className="w-full px-4 py-2 text-left text-gray-700 hover:bg-[#f8f0fd] flex items-center"
                >
                  <HelpCircle className="w-4 h-4 mr-2 text-[#79159d]" />
                  Help & How to Use
                </button>
                <div className="border-t border-[#f3e7fb] my-1"></div>
                <button
                  onClick={logout}
                  className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center font-medium"
                >
                  <LogOut className="w-4 h-4 mr-2 text-red-600" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
