import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  BookOpen,
  Scale,
  FileText,
  FileEdit,
  Bookmark,
  ChevronRight,
  Clock,
  Layers,
  Gavel,
  Users,
  Landmark,
  HardHat,
  Leaf,
  IndianRupee,
  Briefcase,
  LayoutGrid
} from 'lucide-react';
import DocumentModal from '../components/DocumentModal';

export default function DashboardPage() {
  const { setActivePage, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoc, setSelectedDoc] = useState(null);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setActivePage('search');
    }
  };

  const recentlyViewed = [
    {
      id: 'act-2',
      title: 'Bharatiya Nyaya Sanhita, 2023',
      sectionInfo: 'Section 103 – Murder',
      jurisdiction: 'Central Act',
      number: 'Act No. 45 of 2023',
      status: 'In Force',
      description: 'An Act to consolidate and amend the provisions relating to offences and for matters connected therewith or incidental thereto.',
      sections: [
        { section: 'Section 103', title: 'Punishment for murder', content: 'Whoever commits murder shall be punished with death or imprisonment for life, and shall also be liable to fine.' }
      ]
    },
    {
      id: 'act-3',
      title: 'Bharatiya Nagarik Suraksha Sanhita, 2023',
      sectionInfo: 'Section 41 – Arrest without Warrant',
      jurisdiction: 'Central Act',
      number: 'Act No. 46 of 2023',
      status: 'In Force',
      description: 'An Act to consolidate and amend the law relating to Criminal Procedure.',
      sections: [
        { section: 'Section 41', title: 'Arrest without warrant', content: 'Any police officer may without an order from a Magistrate and without a warrant, arrest any person who commits, in the presence of a police officer, a cognizable offence.' }
      ]
    },
    {
      id: 'act-1',
      title: 'Indian Evidence Act, 1872',
      sectionInfo: 'Section 65B – Electronic Records',
      jurisdiction: 'Central Act',
      number: 'Act No. 1 of 1872',
      status: 'In Force',
      description: 'Consolidated statutory framework regarding legal evidence and admissibility.',
      sections: [
        { section: 'Section 65B', title: 'Admissibility of electronic records', content: 'Information contained in an electronic record which is printed on paper, stored, recorded or copied shall be deemed to be also a document...' }
      ]
    }
  ];

  const categories = [
    { name: 'Criminal Laws', icon: Gavel, color: 'text-rose-600', bg: 'bg-rose-50 border-rose-100 hover:border-rose-300' },
    { name: 'Civil Laws', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100 hover:border-blue-300' },
    { name: 'Constitution', icon: Landmark, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100 hover:border-amber-300' },
    { name: 'Labour Laws', icon: HardHat, color: 'text-purple-600', bg: 'bg-purple-50 border-purple-100 hover:border-purple-300' },
    { name: 'Environmental Laws', icon: Leaf, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100 hover:border-emerald-300' },
    { name: 'Taxation Laws', icon: IndianRupee, color: 'text-orange-600', bg: 'bg-orange-50 border-orange-100 hover:border-orange-300' },
    { name: 'Business & Commercial', icon: Briefcase, color: 'text-cyan-600', bg: 'bg-cyan-50 border-cyan-100 hover:border-cyan-300' },
    { name: 'All Categories', icon: LayoutGrid, color: 'text-purple-700', bg: 'bg-purple-100/60 border-purple-200 hover:border-purple-300' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Welcome Banner matching reference screenshot */}
      <div
        className="w-full rounded-2xl overflow-hidden shadow-lg border border-[#e2c6f5] relative cursor-pointer"
        onClick={() => setActivePage('subscription')}
      >
        <img
          src="/assets/banner_dashboard.png"
          alt="Welcome Ahmad Anas P S - Legal Acts Subscription Platform"
          className="w-full h-auto object-cover select-none"
        />
      </div>

      {/* 2. Main Search Bar */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <div className="flex items-center bg-white rounded-full border border-[#dfc5f3] shadow-md pl-5 pr-2 py-1.5 focus-within:border-[#7c14a8] focus-within:ring-2 focus-within:ring-purple-200 transition-all">
          <Search className="w-5 h-5 text-[#6e0795] mr-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search Acts, Rules, Sections, Amendments..."
            className="w-full bg-transparent outline-none text-xs md:text-sm text-gray-800 placeholder-gray-400 font-medium"
          />
          <button
            type="submit"
            className="px-6 py-2 rounded-full bg-gradient-to-r from-[#4d036a] to-[#7f13ad] hover:from-[#5d047f] hover:to-[#9218c5] text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-all"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search</span>
          </button>
        </div>
      </form>

      {/* 3. Quick Navigation Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {[
          { label: 'Browse Acts', icon: BookOpen, page: 'acts' },
          { label: 'Browse Rules', icon: Scale, page: 'rules' },
          { label: 'Amendments', icon: FileText, page: 'amendments' },
          { label: 'My Notes', icon: FileEdit, page: 'notes' },
          { label: 'Bookmarks', icon: Bookmark, page: 'bookmarks' },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              onClick={() => setActivePage(item.page)}
              className="flex items-center justify-between px-4 py-3 bg-white rounded-xl border border-[#ebdcf7] hover:border-[#bf81ea] hover:shadow-md transition-all group"
            >
              <div className="flex items-center space-x-2.5">
                <Icon className="w-4 h-4 text-[#79159d]" />
                <span className="text-xs font-bold text-[#3d0356]">{item.label}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#79159d] group-hover:translate-x-0.5 transition-all" />
            </button>
          );
        })}
      </div>

      {/* 4. Main Content Cards + Recently Viewed Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Three prominent feature cards */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Acts Card */}
          <div className="bg-white rounded-2xl border border-[#ecd9f8] p-5 flex flex-col items-center justify-between text-center shadow-sm hover:shadow-lg transition-all hover:border-[#b86ce8] group">
            <div className="w-full flex justify-center py-2">
              <img
                src="/assets/card_acts.png"
                alt="Acts"
                className="h-24 object-contain filter drop-shadow group-hover:scale-105 transition-transform"
              />
            </div>
            <div className="my-2">
              <h3 className="font-bold text-lg font-serif-law text-[#380352]">Acts</h3>
              <p className="text-[11px] text-gray-600 mt-1">
                Indian Government Acts<br />(Central & State)
              </p>
            </div>
            <button
              onClick={() => setActivePage('acts')}
              className="w-full mt-2 py-2 px-4 rounded-full bg-gradient-to-r from-[#4d036a] to-[#7f13ad] hover:from-[#5d047f] hover:to-[#9218c5] text-white text-xs font-bold flex items-center justify-center space-x-1 shadow-sm transition-all"
            >
              <span>View Acts</span>
              <span className="text-sm">→</span>
            </button>
          </div>

          {/* Rules Card */}
          <div className="bg-white rounded-2xl border border-[#ecd9f8] p-5 flex flex-col items-center justify-between text-center shadow-sm hover:shadow-lg transition-all hover:border-[#b86ce8] group">
            <div className="w-full flex justify-center py-2">
              <img
                src="/assets/card_rules.png"
                alt="Rules"
                className="h-24 object-contain filter drop-shadow group-hover:scale-105 transition-transform"
              />
            </div>
            <div className="my-2">
              <h3 className="font-bold text-lg font-serif-law text-[#380352]">Rules</h3>
              <p className="text-[11px] text-gray-600 mt-1">
                Rules & Regulations<br />under various Acts
              </p>
            </div>
            <button
              onClick={() => setActivePage('rules')}
              className="w-full mt-2 py-2 px-4 rounded-full bg-gradient-to-r from-[#4d036a] to-[#7f13ad] hover:from-[#5d047f] hover:to-[#9218c5] text-white text-xs font-bold flex items-center justify-center space-x-1 shadow-sm transition-all"
            >
              <span>View Rules</span>
              <span className="text-sm">→</span>
            </button>
          </div>

          {/* Amendments Card */}
          <div className="bg-white rounded-2xl border border-[#ecd9f8] p-5 flex flex-col items-center justify-between text-center shadow-sm hover:shadow-lg transition-all hover:border-[#b86ce8] group">
            <div className="w-full flex justify-center py-2">
              <img
                src="/assets/card_amendments.png"
                alt="Amendments"
                className="h-24 object-contain filter drop-shadow group-hover:scale-105 transition-transform"
              />
            </div>
            <div className="my-2">
              <h3 className="font-bold text-lg font-serif-law text-[#380352]">Amendments</h3>
              <p className="text-[11px] text-gray-600 mt-1">
                Latest Amendments,<br />Notifications & Updates
              </p>
            </div>
            <button
              onClick={() => setActivePage('amendments')}
              className="w-full mt-2 py-2 px-4 rounded-full bg-gradient-to-r from-[#4d036a] to-[#7f13ad] hover:from-[#5d047f] hover:to-[#9218c5] text-white text-xs font-bold flex items-center justify-center space-x-1 shadow-sm transition-all"
            >
              <span>View Updates</span>
              <span className="text-sm">→</span>
            </button>
          </div>
        </div>

        {/* Recently Viewed Panel */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-[#ecd9f8] p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#f3e4fb]">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-[#79159d]" />
                <h4 className="font-bold text-sm text-[#380352]">Recently Viewed</h4>
              </div>
              <button
                onClick={() => setActivePage('acts')}
                className="text-xs font-bold text-[#6a0793] hover:underline"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {recentlyViewed.map(doc => (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className="p-3 rounded-xl border border-[#f1e1fa] hover:border-[#bf81ea] hover:bg-[#faf4fe] cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-lg bg-purple-50 text-[#79159d] mt-0.5">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#3d0356] group-hover:text-[#79159d]">
                        {doc.title}
                      </p>
                      <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                        {doc.sectionInfo}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#79159d] group-hover:translate-x-0.5 transition-all" />
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-3 border-t border-[#f4e6fc] text-center">
            <span className="text-[11px] text-gray-500">
              Synced across your subscription profile
            </span>
          </div>
        </div>
      </div>

      {/* 5. Explore by Category Section */}
      <div className="bg-white rounded-2xl border border-[#ecd9f8] p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-[#79159d]" />
            <h3 className="font-bold text-base text-[#380352]">Explore by Category</h3>
          </div>
          <button
            onClick={() => setActivePage('acts')}
            className="text-xs font-bold text-[#6a0793] hover:underline flex items-center"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <button
                key={idx}
                onClick={() => setActivePage('acts')}
                className={`p-3.5 rounded-xl border flex flex-col items-center justify-center text-center transition-all hover:shadow-md ${cat.bg}`}
              >
                <div className={`p-2 rounded-lg bg-white shadow-xs ${cat.color} mb-2`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-[#35034c] leading-tight">
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Document details modal */}
      {selectedDoc && (
        <DocumentModal
          doc={selectedDoc}
          onClose={() => setSelectedDoc(null)}
          onBookmark={() => alert('Bookmarked successfully!')}
        />
      )}
    </div>
  );
}
