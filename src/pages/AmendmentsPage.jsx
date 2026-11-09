import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  SlidersHorizontal,
  Filter,
  RotateCcw,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Bookmark,
  MoreVertical,
  FileText,
  ChevronLeft,
  ChevronRight,
  Gavel,
  Bell,
  FileEdit,
  PlusSquare,
  Ban,
  MoreHorizontal,
  Layers
} from 'lucide-react';
import DocumentModal from '../components/DocumentModal';

export default function AmendmentsPage() {
  const { setActivePage } = useAuth();
  const [updates, setUpdates] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Updates');
  const [selectedYears, setSelectedYears] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedJurisdictions, setSelectedJurisdictions] = useState([]);
  const [sortBy, setSortBy] = useState('Latest Updated');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const [accordionOpen, setAccordionOpen] = useState({ year: true, updateType: true, jurisdiction: true });

  const categoryTabs = [
    { label: 'All Updates', count: '3,215', icon: Layers },
    { label: 'Amendments', count: '1,540', icon: Gavel },
    { label: 'Notifications', count: '1,320', icon: Bell },
    { label: 'Corrections', count: '260', icon: FileEdit },
    { label: 'New Insertions', count: '48', icon: PlusSquare },
    { label: 'Repeals', count: '32', icon: Ban },
    { label: 'Misc. Updates', count: '15', icon: MoreHorizontal },
  ];

  const fetchUpdates = () => {
    let url = `/api/amendments?q=${encodeURIComponent(searchTerm)}&sort=${encodeURIComponent(sortBy)}&page=${currentPage}`;
    if (activeCategory !== 'All Updates' && activeCategory !== 'Misc. Updates') {
      url += `&updateType=${encodeURIComponent(activeCategory)}`;
    }
    selectedTypes.forEach(t => { url += `&updateType=${encodeURIComponent(t)}`; });
    selectedYears.forEach(y => { url += `&year=${encodeURIComponent(y)}`; });
    selectedJurisdictions.forEach(j => { url += `&jurisdiction=${encodeURIComponent(j)}`; });

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data && data.amendments) setUpdates(data.amendments);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchUpdates();
  }, [searchTerm, activeCategory, selectedYears, selectedTypes, selectedJurisdictions, sortBy, currentPage]);

  const toggleBookmark = (id) => {
    const next = new Set(bookmarkedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setBookmarkedIds(next);
  };

  const clearAllFilters = () => {
    setSelectedYears([]);
    setSelectedTypes([]);
    setSelectedJurisdictions([]);
    setSearchTerm('');
    setActiveCategory('All Updates');
    setCurrentPage(1);
  };

  const getBadgeColor = (type) => {
    switch (type) {
      case 'Amendment': return 'bg-amber-100 text-amber-800';
      case 'Notification': return 'bg-purple-100 text-purple-800';
      case 'Correction': return 'bg-pink-100 text-pink-800';
      case 'New Insertion': return 'bg-blue-100 text-blue-800';
      case 'Repeal': return 'bg-rose-100 text-rose-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getIconForType = (type) => {
    switch (type) {
      case 'Amendment': return Gavel;
      case 'Notification': return Bell;
      case 'Correction': return FileEdit;
      case 'New Insertion': return PlusSquare;
      case 'Repeal': return Ban;
      default: return FileText;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Top Banner matching reference screenshot */}
      <div className="w-full rounded-2xl overflow-hidden shadow-lg border border-[#e2c6f5]">
        <img
          src="/assets/banner_amendments.png"
          alt="Amendments & Updates - Stay Informed with the Latest Amendments, Notifications and Legal Updates"
          className="w-full h-auto object-cover select-none"
        />
      </div>

      {/* 2. Search & Advanced Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="flex-1 w-full flex items-center bg-white rounded-full border border-[#dfc5f3] shadow-md pl-5 pr-2 py-1.5 focus-within:border-[#7c14a8] focus-within:ring-2 focus-within:ring-purple-200 transition-all">
          <Search className="w-5 h-5 text-[#6e0795] mr-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search Amendments, Notifications, Updates by Act, Rule, Section, Year or Keyword..."
            className="w-full bg-transparent outline-none text-xs md:text-sm text-gray-800 placeholder-gray-400 font-medium"
          />
          <button
            onClick={fetchUpdates}
            className="px-6 py-2 rounded-full bg-gradient-to-r from-[#4d036a] to-[#7f13ad] hover:from-[#5d047f] hover:to-[#9218c5] text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-all"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search</span>
          </button>
        </div>

        <button
          onClick={() => setActivePage('search')}
          className="px-5 py-2.5 rounded-full bg-white hover:bg-[#faf4fe] border border-[#d9b6f3] text-[#550676] text-xs font-bold flex items-center space-x-2 shadow-sm transition-all whitespace-nowrap"
        >
          <SlidersHorizontal className="w-4 h-4 text-[#79159d]" />
          <span>Advanced Search</span>
        </button>
      </div>

      {/* 3. Category Cards (Horizontal quick tabs matching screenshot) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {categoryTabs.map((cat, idx) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.label;
          return (
            <button
              key={idx}
              onClick={() => {
                setActiveCategory(cat.label);
                setCurrentPage(1);
              }}
              className={`p-3.5 rounded-2xl border text-center flex flex-col items-center justify-center transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-[#590479] to-[#7c11a8] text-white shadow-md border-transparent'
                  : 'bg-white hover:bg-[#faf4fe] text-gray-700 border-[#ecdcf8]'
              }`}
            >
              <Icon className={`w-5 h-5 mb-1.5 ${isActive ? 'text-[#f5cb43]' : 'text-[#7e1ba7]'}`} />
              <span className="text-xs font-bold block">{cat.label}</span>
              <span className={`text-[11px] mt-0.5 ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                ({cat.count})
              </span>
            </button>
          );
        })}
      </div>

      {/* 4. Filter Panel on Left + Updates Listing on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Filter Panel */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-[#ecd9f8] p-5 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#f3e4fb]">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-[#79159d]" />
              <h4 className="font-bold text-sm text-[#380352]">Filter Updates</h4>
            </div>
            <button
              onClick={clearAllFilters}
              className="text-xs font-semibold text-[#79159d] hover:underline flex items-center space-x-1"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              <span>Clear All</span>
            </button>
          </div>

          {/* Accordion 1: Year of Update */}
          <div className="space-y-2">
            <button
              onClick={() => setAccordionOpen({ ...accordionOpen, year: !accordionOpen.year })}
              className="w-full flex items-center justify-between text-xs font-bold text-[#3d0356]"
            >
              <span>Year of Update</span>
              {accordionOpen.year ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />}
            </button>
            {accordionOpen.year && (
              <div className="space-y-2 pt-1 text-xs text-gray-700">
                {[
                  { year: '2026', count: '128' },
                  { year: '2025', count: '842' },
                  { year: '2024', count: '1,260' },
                  { year: '2023', count: '842' },
                  { year: '2022', count: '143' },
                ].map((item, i) => (
                  <label key={i} className="flex items-center space-x-2 cursor-pointer hover:text-[#550676]">
                    <input
                      type="checkbox"
                      checked={selectedYears.includes(item.year)}
                      onChange={() => {
                        setSelectedYears(prev =>
                          prev.includes(item.year) ? prev.filter(x => x !== item.year) : [...prev, item.year]
                        );
                      }}
                      className="rounded border-[#d6aef2] text-[#630787] focus:ring-purple-300"
                    />
                    <span>{item.year} ({item.count})</span>
                  </label>
                ))}
                <button
                  type="button"
                  onClick={() => alert('All years available in full archive')}
                  className="text-xs font-bold text-[#79159d] hover:underline pt-1 block"
                >
                  + Show More
                </button>
              </div>
            )}
          </div>

          {/* Accordion 2: Update Type */}
          <div className="space-y-2 pt-2 border-t border-[#f7eefd]">
            <button
              onClick={() => setAccordionOpen({ ...accordionOpen, updateType: !accordionOpen.updateType })}
              className="w-full flex items-center justify-between text-xs font-bold text-[#3d0356]"
            >
              <span>Update Type</span>
              {accordionOpen.updateType ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />}
            </button>
            {accordionOpen.updateType && (
              <div className="space-y-2 pt-1 text-xs text-gray-700">
                {[
                  { label: 'Amendment', count: '1,540' },
                  { label: 'Notification', count: '1,320' },
                  { label: 'Correction', count: '260' },
                  { label: 'New Insertion', count: '48' },
                  { label: 'Repeal', count: '32' },
                ].map((item, i) => (
                  <label key={i} className="flex items-center space-x-2 cursor-pointer hover:text-[#550676]">
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(item.label)}
                      onChange={() => {
                        setSelectedTypes(prev =>
                          prev.includes(item.label) ? prev.filter(x => x !== item.label) : [...prev, item.label]
                        );
                      }}
                      className="rounded border-[#d6aef2] text-[#630787] focus:ring-purple-300"
                    />
                    <span>{item.label} ({item.count})</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Accordion 3: Jurisdiction */}
          <div className="space-y-2 pt-2 border-t border-[#f7eefd]">
            <button
              onClick={() => setAccordionOpen({ ...accordionOpen, jurisdiction: !accordionOpen.jurisdiction })}
              className="w-full flex items-center justify-between text-xs font-bold text-[#3d0356]"
            >
              <span>Jurisdiction</span>
              {accordionOpen.jurisdiction ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />}
            </button>
            {accordionOpen.jurisdiction && (
              <div className="space-y-2 pt-1 text-xs text-gray-700">
                {[
                  { label: 'Central', count: '2,160' },
                  { label: 'State', count: '1,055' },
                ].map((item, i) => (
                  <label key={i} className="flex items-center space-x-2 cursor-pointer hover:text-[#550676]">
                    <input
                      type="checkbox"
                      checked={selectedJurisdictions.includes(item.label)}
                      onChange={() => {
                        setSelectedJurisdictions(prev =>
                          prev.includes(item.label) ? prev.filter(x => x !== item.label) : [...prev, item.label]
                        );
                      }}
                      className="rounded border-[#d6aef2] text-[#630787] focus:ring-purple-300"
                    />
                    <span>{item.label} ({item.count})</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Updates Listing */}
        <div className="lg:col-span-9 space-y-4">
          {/* Top count & Sort */}
          <div className="bg-white rounded-xl border border-[#ecd9f8] px-5 py-3 flex items-center justify-between shadow-xs">
            <span className="text-xs font-bold text-[#3d0356]">
              Showing 1 – 10 of 3,215 Updates
            </span>
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-gray-500 font-medium">Sort By:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="bg-[#faf4fe] border border-[#e1ccf3] rounded-lg px-3 py-1.5 text-xs font-bold text-[#4c0469] outline-none"
              >
                <option value="Latest Updated">Latest Updated</option>
                <option value="Title A-Z">Title A-Z</option>
                <option value="Gazette Date">Gazette Date</option>
              </select>
            </div>
          </div>

          {/* List items */}
          <div className="space-y-3">
            {updates.map((update, idx) => {
              const isBm = bookmarkedIds.has(update.id);
              const Icon = getIconForType(update.type);
              return (
                <div
                  key={update.id || idx}
                  className="bg-white rounded-2xl border border-[#ebdcf7] hover:border-[#bf81ea] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all group"
                >
                  {/* Left info */}
                  <div className="flex items-start space-x-3.5">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#fed866] to-[#f8df80] p-2 flex items-center justify-center text-[#550676] shadow-xs shrink-0 mt-0.5">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#380352] group-hover:text-[#6f0c97] transition-colors">
                        {update.title}
                      </h4>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500 mt-1">
                        <span>{update.reference}</span>
                        <span>•</span>
                        <span>{update.notificationNo}</span>
                        <span>•</span>
                        <span>Dated: {update.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right actions */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0 self-start sm:self-center mt-2 sm:mt-0">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${getBadgeColor(update.type)}`}>
                      {update.type}
                    </span>

                    <button
                      onClick={() => setSelectedDoc(update)}
                      className="px-4 py-1.5 rounded-xl bg-[#590479] hover:bg-[#720999] text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-all"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>View Update</span>
                    </button>

                    <button
                      onClick={() => setSelectedDoc(update)}
                      className="px-3.5 py-1.5 rounded-xl bg-[#faf4fe] hover:bg-[#f3e2fd] border border-[#dcb8f3] text-[#520671] text-xs font-bold flex items-center space-x-1 transition-all"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </button>

                    <button
                      onClick={() => toggleBookmark(update.id)}
                      className={`p-2 rounded-xl border border-[#ebd6fa] hover:bg-[#faf4fe] transition-colors ${
                        isBm ? 'text-amber-500 bg-amber-50' : 'text-gray-400'
                      }`}
                      title="Bookmark"
                    >
                      <Bookmark className={`w-4 h-4 ${isBm ? 'fill-current' : ''}`} />
                    </button>

                    <button
                      onClick={() => alert(`Options for ${update.title}: Copy Gazette No, Share, PDF Download`)}
                      className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                      title="More options"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          <div className="bg-white rounded-xl border border-[#ecd9f8] p-3 flex items-center justify-center space-x-2 text-xs font-bold">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              className="p-1.5 rounded-lg border border-[#e1ccf3] hover:bg-purple-50 text-gray-600"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-7 h-7 rounded-lg bg-[#590479] text-white flex items-center justify-center">1</button>
            <button className="w-7 h-7 rounded-lg hover:bg-purple-50 text-gray-700 flex items-center justify-center">2</button>
            <button className="w-7 h-7 rounded-lg hover:bg-purple-50 text-gray-700 flex items-center justify-center">3</button>
            <button className="w-7 h-7 rounded-lg hover:bg-purple-50 text-gray-700 flex items-center justify-center">4</button>
            <button className="w-7 h-7 rounded-lg hover:bg-purple-50 text-gray-700 flex items-center justify-center">5</button>
            <span className="px-1 text-gray-400">...</span>
            <button className="px-2 h-7 rounded-lg hover:bg-purple-50 text-gray-700 flex items-center justify-center">322</button>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              className="p-1.5 rounded-lg border border-[#e1ccf3] hover:bg-purple-50 text-gray-600"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Document View Modal */}
      {selectedDoc && (
        <DocumentModal
          doc={selectedDoc}
          onClose={() => setSelectedDoc(null)}
          onBookmark={() => toggleBookmark(selectedDoc.id)}
        />
      )}
    </div>
  );
}
