import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

// Pages
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import DashboardPage from './pages/DashboardPage';
import BrowseActsPage from './pages/BrowseActsPage';
import BrowseRulesPage from './pages/BrowseRulesPage';
import AmendmentsPage from './pages/AmendmentsPage';
import AdvancedSearchPage from './pages/AdvancedSearchPage';
import MyNotesPage from './pages/MyNotesPage';
import BookmarksPage from './pages/BookmarksPage';
import SubscriptionPage from './pages/SubscriptionPage';
import HelpPage from './pages/HelpPage';

function MainApp() {
  const { isAuthenticated, activePage } = useAuth();

  // If on signup or login pages:
  if (activePage === 'signup') {
    return <SignUpPage />;
  }
  if (!isAuthenticated || activePage === 'login') {
    return <LoginPage />;
  }

  // Render authenticated pages with common Header and Sidebar
  const renderContent = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'acts':
        return <BrowseActsPage />;
      case 'rules':
        return <BrowseRulesPage />;
      case 'amendments':
        return <AmendmentsPage />;
      case 'search':
        return <AdvancedSearchPage />;
      case 'notes':
        return <MyNotesPage />;
      case 'bookmarks':
        return <BookmarksPage />;
      case 'subscription':
        return <SubscriptionPage />;
      case 'help':
        return <HelpPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f1fc] flex flex-col font-sans">
      {/* Fixed Common Header */}
      <Header />

      {/* Main Body: Sidebar + Dynamic Page Content */}
      <div className="flex-1 flex">
        {/* Fixed Common Sidebar */}
        <Sidebar />

        {/* Dynamic Page Content matching desktop reference resolution */}
        <main className="flex-1 p-3 sm:p-5 md:p-8 max-w-[1500px] w-full overflow-x-hidden">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
