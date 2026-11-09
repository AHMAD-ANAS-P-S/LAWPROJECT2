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
  List,
  ChevronLeft,
  ChevronRight,
  Scale,
  Landmark,
  Sparkles,
  Flame,
  Layers
} from 'lucide-react';
import DocumentModal from '../components/DocumentModal';

export default function BrowseRulesPage() {
  const { setActivePage } = useAuth();
  const [rules, setRules] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Rules');
  const [selectedRuleTypes, setSelectedRuleTypes] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [sortBy, setSortBy] = useState('Latest Updated');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const [accordionOpen, setAccordionOpen] = useState({ ruleType: true, year: true });

  const categoryTabs = [
    { label: 'All Rules', count: '2,485', icon: Layers },
    { label: 'Central Rules', count: '1,720', icon: Landmark },
    { label: 'State Rules', count: '765', icon: Scale },
    { label: 'Latest Rules', count: '120', icon: Sparkles, badge: 'New' },
    { label: 'Popular Rules', count: '350', icon: Flame },
    { label: 'My Bookmarks', count: '42', icon: Bookmark },
  ];

  const fetchRules = () => {
    let url = `/api/rules?q=${encodeURIComponent(searchTerm)}&sort=${encodeURIComponent(sortBy)}&page=${currentPage}`;
    selectedRuleTypes.forEach(t => { url += `&ruleType=${encodeURIComponent(t)}`; });
    selectedYears.forEach(y => { url += `&year=${encodeURIComponent(y)}`; });

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data && data.rules) setRules(data.rules);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchRules();
  }, [searchTerm, activeCategory, selectedRuleTypes, selectedYears, sortBy, currentPage]);

  const toggleBookmark = (id) => {
    const next = new Set(bookmarkedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setBookmarkedIds(next);
  };

  const clearAllFilters = () => {
    setSelectedRuleTypes([]);
    setSelectedYears([]);
    setSearchTerm('');
    setActiveCategory('All Rules');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Top Banner matching reference screenshot */}
      <div className="w-full rounded-2xl overflow-hidden shadow-lg border border-[#e2c6f5]">
        <img
          src="/assets/banner_rules.png"
          alt="Browse Rules - Explore Rules & Regulations framed under Central and State Acts"
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
            placeholder="Search Rules by Title, Act Name, Year, Keyword or Section..."
            className="w-full bg-transparent outline-none text-xs md:text-sm text-gray-800 placeholder-gray-400 font-medium"
          />
          <button
            onClick={fetchRules}
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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
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
              className={`p-3.5 rounded-2xl border text-center flex flex-col items-center justify-center relative transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-[#590479] to-[#7c11a8] text-white shadow-md border-transparent'
                  : 'bg-white hover:bg-[#faf4fe] text-gray-700 border-[#ecdcf8]'
              }`}
            >
              {cat.badge && (
                <span className="absolute -top-1.5 right-3 bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase shadow-xs">
                  {cat.badge}
                </span>
              )}
              <Icon className={`w-5 h-5 mb-1.5 ${isActive ? 'text-[#f5cb43]' : 'text-[#7e1ba7]'}`} />
              <span className="text-xs font-bold block">{cat.label}</span>
              <span className={`text-[11px] mt-0.5 ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                ({cat.count})
              </span>
            </button>
          );
        })}
      </div>

      {/* 4. Filter Panel on Left + Rules Listing on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Filter Panel */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-[#ecd9f8] p-5 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#f3e4fb]">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-[#79159d]" />
              <h4 className="font-bold text-sm text-[#380352]">Filter Rules</h4>
            </div>
            <button
              onClick={clearAllFilters}
              className="text-xs font-semibold text-[#79159d] hover:underline flex items-center space-x-1"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              <span>Clear All</span>
            </button>
          </div>

          {/* Accordion 1: Rule Type */}
          <div className="space-y-2">
            <button
              onClick={() => setAccordionOpen({ ...accordionOpen, ruleType: !accordionOpen.ruleType })}
              className="w-full flex items-center justify-between text-xs font-bold text-[#3d0356]"
            >
              <span>Rule Type</span>
              {accordionOpen.ruleType ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />}
            </button>
            {accordionOpen.ruleType && (
              <div className="space-y-2 pt-1 text-xs text-gray-700">
                {[
                  { label: 'Central Rules', count: '1,720' },
                  { label: 'State Rules', count: '765' },
                ].map((item, i) => (
                  <label key={i} className="flex items-center space-x-2 cursor-pointer hover:text-[#550676]">
                    <input
                      type="checkbox"
                      checked={selectedRuleTypes.includes(item.label)}
                      onChange={() => {
                        setSelectedRuleTypes(prev =>
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

          {/* Accordion 2: Year of Notification */}
          <div className="space-y-2 pt-2 border-t border-[#f7eefd]">
            <button
              onClick={() => setAccordionOpen({ ...accordionOpen, year: !accordionOpen.year })}
              className="w-full flex items-center justify-between text-xs font-bold text-[#3d0356]"
            >
              <span>Year of Notification</span>
              {accordionOpen.year ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />}
            </button>
            {accordionOpen.year && (
              <div className="space-y-2 pt-1 text-xs text-gray-700">
                {[
                  { year: '2026', count: '36' },
                  { year: '2025', count: '142' },
                  { year: '2024', count: '298' },
                  { year: '2023', count: '421' },
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
                  onClick={() => alert('All notification years available in archive')}
                  className="text-xs font-bold text-[#79159d] hover:underline pt-1 block"
                >
                  + Show More
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Rules Listing */}
        <div className="lg:col-span-9 space-y-4">
          {/* Top count & Sort */}
          <div className="bg-white rounded-xl border border-[#ecd9f8] px-5 py-3 flex items-center justify-between shadow-xs">
            <span className="text-xs font-bold text-[#3d0356]">
              Showing 1 – 10 of 2,485 Rules
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
                <option value="Notification Date">Notification Date</option>
              </select>
            </div>
          </div>

          {/* Rules List Items */}
          <div className="space-y-3">
            {rules.map((rule, idx) => {
              const isBm = bookmarkedIds.has(rule.id);
              return (
                <div
                  key={rule.id || idx}
                  className="bg-white rounded-2xl border border-[#ebdcf7] hover:border-[#bf81ea] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all group"
                >
                  {/* Left info */}
                  <div className="flex items-start space-x-3.5">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#fed866] to-[#f8df80] p-2 flex items-center justify-center text-[#550676] shadow-xs shrink-0 mt-0.5">
                      <Scale className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#380352] group-hover:text-[#6f0c97] transition-colors">
                        {rule.title}
                      </h4>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500 mt-1">
                        <span className="flex items-center">
                          <Landmark className="w-3.5 h-3.5 mr-1 text-gray-400" />
                          {rule.jurisdiction}
                        </span>
                        <span>•</span>
                        <span>{rule.number}</span>
                        {rule.notifiedDate && (
                          <>
                            <span>•</span>
                            <span>Notified: {rule.notifiedDate}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right actions */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0 self-start sm:self-center mt-2 sm:mt-0">
                    <button
                      onClick={() => setSelectedDoc(rule)}
                      className="px-4 py-1.5 rounded-xl bg-[#590479] hover:bg-[#720999] text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-all"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>View Rule</span>
                    </button>

                    <button
                      onClick={() => setSelectedDoc(rule)}
                      className="px-3.5 py-1.5 rounded-xl bg-[#faf4fe] hover:bg-[#f3e2fd] border border-[#dcb8f3] text-[#520671] text-xs font-bold flex items-center space-x-1 transition-all"
                    >
                      <List className="w-3.5 h-3.5" />
                      <span>Sections</span>
                    </button>

                    <button
                      onClick={() => toggleBookmark(rule.id)}
                      className={`p-2 rounded-xl border border-[#ebd6fa] hover:bg-[#faf4fe] transition-colors ${
                        isBm ? 'text-amber-500 bg-amber-50' : 'text-gray-400'
                      }`}
                      title="Bookmark"
                    >
                      <Bookmark className={`w-4 h-4 ${isBm ? 'fill-current' : ''}`} />
                    </button>

                    <button
                      onClick={() => alert(`Options for ${rule.title}: Print, Share, Export`)}
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
            <button className="px-2 h-7 rounded-lg hover:bg-purple-50 text-gray-700 flex items-center justify-center">249</button>
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
