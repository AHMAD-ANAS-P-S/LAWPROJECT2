import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: 'AHMAD ANAS P S',
    email: 'anas@tamilrawlibrary.com',
    plan: 'Tamil + English Package',
    planType: 'Yearly',
    planStartDate: '07 Nov 2024',
    validTill: '06 Nov 2027',
    remainingDays: 672,
    status: 'Active',
    language: 'English',
    notificationsCount: 1,
  });

  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [activePage, setActivePage] = useState('dashboard');
  const [language, setLanguage] = useState('English');
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'New Gazette Notification',
      desc: 'Ministry of Law published new procedural directions for digital affidavits.',
      time: '12 mins ago',
      read: false
    },
    {
      id: 2,
      title: 'Subscription Active',
      desc: 'Your Tamil + English Yearly package is active till 06 Nov 2027.',
      time: '2 days ago',
      read: true
    }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sync with backend /api/auth/me if available
  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data && data.user) {
          setUser(data.user);
          setLanguage(data.user.language || 'English');
        }
      })
      .catch(() => {});
  }, []);

  const login = async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      setUser(data.user);
      setIsAuthenticated(true);
      setActivePage('dashboard');
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const register = async (fullName, email, password, terms) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password, terms })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      setUser(data.user);
      setIsAuthenticated(true);
      setActivePage('dashboard');
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const googleAuth = async () => {
    try {
      const res = await fetch('/api/auth/google', { method: 'POST' });
      const data = await res.json();
      setUser(data.user);
      setIsAuthenticated(true);
      setActivePage('dashboard');
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setActivePage('login');
  };

  const changeLanguage = async (newLang) => {
    setLanguage(newLang);
    try {
      await fetch('/api/auth/language', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: newLang })
      });
    } catch (e) {}
  };

  useEffect(() => {
    window.setAppPage = setActivePage;
    window.setAuthenticated = setIsAuthenticated;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
        activePage,
        setActivePage,
        language,
        changeLanguage,
        login,
        register,
        googleAuth,
        logout,
        notifications,
        setNotifications,
        showNotifications,
        setShowNotifications,
        showUserDropdown,
        setShowUserDropdown,
        mobileMenuOpen,
        setMobileMenuOpen
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
