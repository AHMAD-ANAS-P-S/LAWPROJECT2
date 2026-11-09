import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Home,
  BookOpen,
  Layers,
  Calendar,
  Search,
  FileEdit,
  Bookmark,
  Crown,
  HelpCircle,
  LogOut,
  X
} from 'lucide-react';

export default function Sidebar() {
  const { activePage, setActivePage, logout, mobileMenuOpen, setMobileMenuOpen } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'acts', label: 'Browse Acts', icon: BookOpen },
    { id: 'rules', label: 'Browse Rules', icon: Layers },
    { id: 'amendments', label: 'Amendments & Updates', icon: Calendar },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'notes', label: 'My Notes', icon: FileEdit },
    { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark },
    { id: 'subscription', label: 'Subscription Details', icon: Crown },
    { id: 'help', label: 'Help & How to Use', icon: HelpCircle },
    { id: 'logout', label: 'Logout', icon: LogOut, isLogout: true },
  ];

  // Determine bottom illustration based on reference screenshots
  const isLadyJusticePage = activePage === 'subscription' || activePage === 'help';

  const handleNavClick = (item) => {
    if (item.isLogout) {
      logout();
    } else {
      setActivePage(item.id);
    }
    if (setMobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  const renderNavContent = () => (
    <>
      <div className="py-4 px-3 space-y-1.5 z-10">
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = activePage === item.id;

          if (item.isLogout) {
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className="w-full flex items-center space-x-3.5 px-4 py-2.5 rounded-xl text-white/90 hover:text-white hover:bg-white/10 transition-all font-medium text-[13.5px] mt-2 group"
              >
                <Icon className="w-4 h-4 text-white/80 group-hover:text-white" />
                <span>{item.label}</span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item)}
              className={`w-full flex items-center space-x-3.5 px-4 py-2.5 rounded-xl text-[13.5px] transition-all font-medium relative ${
                isActive
                  ? 'gold-gradient-bg text-[#2d0f39] font-bold shadow-[0_2px_12px_rgba(248,223,128,0.35)]'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon
                className={`w-4 h-4 ${
                  isActive ? 'text-[#391048] fill-[#e6b93d]' : 'text-white/80'
                }`}
              />
              <span className="tracking-wide">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Decorative Legal Illustration at the bottom */}
      <div className="w-full mt-auto relative z-10 flex flex-col items-center justify-end pointer-events-none">
        {isLadyJusticePage ? (
          <img
            src="/assets/sidebar_lady_justice.png"
            alt="Lady Justice"
            className="w-full object-contain object-bottom -mb-1 filter drop-shadow-md"
          />
        ) : (
          <img
            src="/assets/sidebar_books_gavel.png"
            alt="Acts, Rules, Amendments Legal Books and Gavel"
            className="w-full object-contain object-bottom -mb-1 filter drop-shadow-md"
          />
        )}
      </div>

      {/* Subtle background glow */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-purple-950/60 to-transparent pointer-events-none" />
    </>
  );

  return (
    <>
      {/* 1. Desktop & Laptop Fixed Sticky Sidebar */}
      <aside className="hidden md:flex w-[260px] min-w-[260px] sidebar-gradient-bg sticky top-[70px] h-[calc(100vh-70px)] flex-col justify-between select-none shadow-xl border-r border-[#690d8e] overflow-hidden z-20">
        {renderNavContent()}
      </aside>

      {/* 2. Mobile Responsive Drawer (< md) */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Off-canvas sidebar */}
          <div className="relative w-[280px] max-w-[85vw] h-full sidebar-gradient-bg flex flex-col justify-between shadow-2xl z-10 overflow-y-auto">
            {/* Mobile Header with brand & close */}
            <div className="p-4 border-b border-purple-800/40 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <img
                  src="/assets/gold_scales_emblem.png"
                  alt="Emblem"
                  className="w-7 h-7 object-contain"
                />
                <span className="text-white font-bold text-sm tracking-wide">
                  Tamil Raw Library
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Menu Items */}
            <div className="flex-1 flex flex-col justify-between">
              {renderNavContent()}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
