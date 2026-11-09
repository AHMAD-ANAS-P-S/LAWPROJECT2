import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  RotateCcw,
  BookOpen,
  Bookmark,
  MoreVertical,
  List,
  FileText,
  ChevronLeft,
  ChevronRight,
  Layers,
  Quote,
  Scale,
  SlidersHorizontal,
  Landmark,
  Calendar,
  Share2
} from 'lucide-react';
import DocumentModal from '../components/DocumentModal';

export default function AdvancedSearchPage() {
  const { setActivePage } = useAuth();
  const [searchMode, setSearchMode] = useState('Advanced Search');
  const [keyword, setKeyword] = useState('evidence');
  const [keywordType, setKeywordType] = useState('Any of these words');
  const [actType, setActType] = useState(['All Acts & Rules']);
  const [jurisdiction, setJurisdiction] = useState('All Jurisdictions');
  const [fromYear, setFromYear] = useState('From Year');
  const [toYear, setToYear] = useState('To Year');
  const [docType, setDocType] = useState('All Documents');
  const [docTypeChecks, setDocTypeChecks] = useState([]);
  const [results, setResults] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const [isSaved, setIsSaved] = useState(false);

  const searchModes = [
    { label: 'Universal Search', icon: Layers },
    { label: 'Exact Phrase Search', icon: Quote },
    { label: 'Section Search', icon: Scale },
    { label: 'Cross-Reference Search', icon: Share2 },
    { label: 'Advanced Search', icon: SlidersHorizontal },
  ];

  const performSearch = () => {
    fetch(`/api/search/advanced?q=${encodeURIComponent(keyword)}&mode=${encodeURIComponent(searchMode)}&keywordType=${encodeURIComponent(keywordType)}&jurisdiction=${encodeURIComponent(jurisdiction)}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.results) setResults(data.results);
      })
      .catch(() => {});
  };

  useEffect(() => {
    performSearch();
  }, [searchMode, keywordType, jurisdiction]);

  const resetFilters = () => {
    setKeyword('');
    setKeywordType('Any of these words');
    setActType(['All Acts & Rules']);
    setJurisdiction('All Jurisdictions');
    setFromYear('From Year');
    setToYear('To Year');
    setDocType('All Documents');
    setDocTypeChecks([]);
    performSearch();
  };

  const toggleBookmark = (id) => {
    const next = new Set(bookmarkedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setBookmarkedIds(next);
  };

  const handleSaveSearch = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Top Banner matching screenshot */}
      <div className="w-full rounded-2xl overflow-hidden shadow-lg border border-[#e2c6f5]">
        <img
          src="/assets/banner_search.png"
          alt="Advanced Search - Search Across Acts, Rules, Sections, Amendments and Notifications"
          className="w-full h-auto object-cover select-none"
        />
      </div>

      {/* 2. Search Modes (5 horizontal tabs matching screenshot) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {searchModes.map((mode, idx) => {
          const Icon = mode.icon;
          const isActive = searchMode === mode.label;
          return (
            <button
              key={idx}
              onClick={() => setSearchMode(mode.label)}
              className={`p-3 rounded-2xl border text-center flex items-center justify-center space-x-2 text-xs font-bold transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-[#590479] to-[#7c11a8] text-white shadow-md border-transparent'
                  : 'bg-white hover:bg-[#faf4fe] text-gray-700 border-[#ecdcf8]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#f5cb43]' : 'text-[#7e1ba7]'}`} />
              <span>{mode.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Powerful Search Filters Box matching screenshot */}
      <div className="bg-white rounded-2xl border border-[#ecd9f8] p-6 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5 items-start">
          {/* Col 1: Act Type */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-[#4c0469] flex items-center">
              <BookOpen className="w-3.5 h-3.5 mr-1.5 text-[#79159d]" />
              Act Type
            </label>
            <div className="space-y-2 text-xs text-gray-700">
              {['All Acts & Rules', 'Central Acts', 'State Acts', 'Rules / Regulations'].map((t, i) => (
                <label key={i} className="flex items-center space-x-2 cursor-pointer hover:text-[#590479]">
                  <input
                    type="checkbox"
                    checked={actType.includes(t)}
                    onChange={() => {
                      setActType(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
                    }}
                    className="rounded border-[#d6aef2] text-[#630787] focus:ring-purple-300"
                  />
                  <span>{t}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Col 2: Keyword / Search Type */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-[#4c0469] flex items-center">
              <Search className="w-3.5 h-3.5 mr-1.5 text-[#79159d]" />
              Keyword / Search Type
            </label>
            <input
              type="text"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              placeholder="Enter keywords or Act/Rule name..."
              className="w-full px-3 py-2 rounded-xl border border-[#dfc3f4] bg-[#fdfaff] focus:bg-white focus:border-[#7a0ea6] text-xs outline-none"
            />
            <div className="space-y-1.5 text-xs text-gray-700 pt-1">
              {['Any of these words', 'All words', 'Exact phrase', 'Without these words'].map((kt, i) => (
                <label key={i} className="flex items-center space-x-2 cursor-pointer hover:text-[#590479]">
                  <input
                    type="radio"
                    name="keywordType"
                    checked={keywordType === kt}
                    onChange={() => setKeywordType(kt)}
                    className="text-[#630787] focus:ring-purple-300"
                  />
                  <span>{kt}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Col 3: Jurisdiction */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-[#4c0469] flex items-center">
              <Landmark className="w-3.5 h-3.5 mr-1.5 text-[#79159d]" />
              Jurisdiction
            </label>
            <select
              value={jurisdiction}
              onChange={e => setJurisdiction(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#dfc3f4] bg-[#fdfaff] text-xs font-semibold text-[#4c0469] outline-none"
            >
              <option value="All Jurisdictions">All Jurisdictions</option>
              <option value="Central">Central</option>
              <option value="State">State</option>
            </select>
          </div>

          {/* Col 4: Year Range */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-[#4c0469] flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1.5 text-[#79159d]" />
              Year Range
            </label>
            <div className="space-y-2">
              <select
                value={fromYear}
                onChange={e => setFromYear(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#dfc3f4] bg-[#fdfaff] text-xs text-gray-700 outline-none"
              >
                <option value="From Year">From Year</option>
                <option value="2026">2026</option>
                <option value="2024">2024</option>
                <option value="2020">2020</option>
                <option value="2000">2000</option>
                <option value="1950">1950</option>
                <option value="1872">1872</option>
              </select>
              <select
                value={toYear}
                onChange={e => setToYear(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#dfc3f4] bg-[#fdfaff] text-xs text-gray-700 outline-none"
              >
                <option value="To Year">To Year</option>
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
              </select>
            </div>
          </div>

          {/* Col 5: Document Type */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-[#4c0469] flex items-center">
              <FileText className="w-3.5 h-3.5 mr-1.5 text-[#79159d]" />
              Document Type
            </label>
            <select
              value={docType}
              onChange={e => setDocType(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#dfc3f4] bg-[#fdfaff] text-xs font-semibold text-[#4c0469] outline-none mb-2"
            >
              <option value="All Documents">All Documents</option>
              <option value="Acts">Acts</option>
              <option value="Rules">Rules</option>
              <option value="Amendments">Amendments</option>
            </select>
            <div className="space-y-1.5 text-xs text-gray-700">
              {['Acts', 'Rules', 'Amendments', 'Notifications', 'Orders / Circulars'].map((dt, i) => (
                <label key={i} className="flex items-center space-x-2 cursor-pointer hover:text-[#590479]">
                  <input
                    type="checkbox"
                    checked={docTypeChecks.includes(dt)}
                    onChange={() => {
                      setDocTypeChecks(prev => prev.includes(dt) ? prev.filter(x => x !== dt) : [...prev, dt]);
                    }}
                    className="rounded border-[#d6aef2] text-[#630787] focus:ring-purple-300"
                  />
                  <span>{dt}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Buttons Centered */}
        <div className="flex items-center justify-center space-x-4 pt-3 border-t border-[#f4e6fc]">
          <button
            onClick={performSearch}
            className="px-8 py-2.5 rounded-full bg-gradient-to-r from-[#4d036a] to-[#7f13ad] hover:from-[#5d047f] hover:to-[#9218c5] text-white text-xs font-bold flex items-center space-x-2 shadow-md transition-all"
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </button>
          <button
            onClick={resetFilters}
            className="px-6 py-2.5 rounded-full bg-white hover:bg-gray-50 border border-[#dfc6f4] text-[#550676] text-xs font-bold flex items-center space-x-2 shadow-xs transition-all"
          >
            <RotateCcw className="w-4 h-4 text-[#79159d]" />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>

      {/* 4. Search Results */}
      <div className="space-y-4">
        {/* Results Header */}
        <div className="bg-white rounded-xl border border-[#ecd9f8] px-5 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-[#79159d]" />
            <h4 className="font-bold text-sm text-[#380352]">
              Search Results for "{keyword || 'all'}"
            </h4>
          </div>

          <div className="flex items-center space-x-4 text-xs">
            <span className="text-gray-500 font-medium">Showing 1 – 10 of 642 Results</span>
            <div className="flex items-center space-x-1.5">
              <span className="text-gray-500">Sort By:</span>
              <select className="bg-[#faf4fe] border border-[#e1ccf3] rounded-lg px-2.5 py-1 text-xs font-bold text-[#4c0469] outline-none">
                <option>Relevance</option>
                <option>Date</option>
                <option>Title</option>
              </select>
            </div>
            <button
              onClick={handleSaveSearch}
              className={`px-3 py-1.5 rounded-lg border flex items-center space-x-1 font-bold transition-all ${
                isSaved
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-white text-[#520671] border-[#dfc3f4] hover:bg-[#faf4fe]'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 fill-current" />
              <span>{isSaved ? 'Saved!' : 'Save Search'}</span>
            </button>
          </div>
        </div>

        {/* Results List Items matching screenshot */}
        <div className="space-y-3">
          {results.map((res, idx) => {
            const isBm = bookmarkedIds.has(res.id);
            return (
              <div
                key={res.id || idx}
                className="bg-white rounded-2xl border border-[#ebdcf7] hover:border-[#bf81ea] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all group"
              >
                {/* Left info */}
                <div className="flex items-start space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#fed866] to-[#f8df80] p-2 flex items-center justify-center text-[#550676] shadow-xs shrink-0 mt-0.5">
                    <Scale className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#380352] group-hover:text-[#6f0c97] transition-colors">
                      {res.title}
                    </h4>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500 mt-1">
                      <span>{res.jurisdiction}</span>
                      <span>•</span>
                      <span>{res.number}</span>
                      {res.status && (
                        <>
                          <span>•</span>
                          <span className="text-emerald-700 font-semibold">{res.status}</span>
                        </>
                      )}
                      {res.notifiedDate && (
                        <>
                          <span>•</span>
                          <span>Notified: {res.notifiedDate}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right badges & actions */}
                <div className="flex items-center space-x-2 shrink-0 self-end md:self-center">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800">
                    {res.badge || res.docType}
                  </span>
                  {res.subType && (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-purple-100 text-purple-800">
                      {res.subType}
                    </span>
                  )}

                  <button
                    onClick={() => setSelectedDoc(res)}
                    className="px-4 py-1.5 rounded-xl bg-[#590479] hover:bg-[#720999] text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-all"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>View</span>
                  </button>

                  <button
                    onClick={() => setSelectedDoc(res)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#faf4fe] hover:bg-[#f3e2fd] border border-[#dcb8f3] text-[#520671] text-xs font-bold flex items-center space-x-1 transition-all"
                  >
                    <List className="w-3.5 h-3.5" />
                    <span>{res.docType === 'Section' ? 'Related' : res.docType === 'Amendment' ? 'Details' : 'Sections'}</span>
                  </button>

                  <button
                    onClick={() => toggleBookmark(res.id)}
                    className={`p-2 rounded-xl border border-[#ebd6fa] hover:bg-[#faf4fe] transition-colors ${
                      isBm ? 'text-amber-500 bg-amber-50' : 'text-gray-400'
                    }`}
                    title="Bookmark"
                  >
                    <Bookmark className={`w-4 h-4 ${isBm ? 'fill-current' : ''}`} />
                  </button>

                  <button
                    onClick={() => alert(`Options for ${res.title}: Print, Share citation`)}
                    className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
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
          <button className="p-1.5 rounded-lg border border-[#e1ccf3] hover:bg-purple-50 text-gray-600">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="w-7 h-7 rounded-lg bg-[#590479] text-white flex items-center justify-center">1</button>
          <button className="w-7 h-7 rounded-lg hover:bg-purple-50 text-gray-700 flex items-center justify-center">2</button>
          <button className="w-7 h-7 rounded-lg hover:bg-purple-50 text-gray-700 flex items-center justify-center">3</button>
          <button className="w-7 h-7 rounded-lg hover:bg-purple-50 text-gray-700 flex items-center justify-center">4</button>
          <button className="w-7 h-7 rounded-lg hover:bg-purple-50 text-gray-700 flex items-center justify-center">5</button>
          <span className="px-1 text-gray-400">...</span>
          <button className="px-2 h-7 rounded-lg hover:bg-purple-50 text-gray-700 flex items-center justify-center">65</button>
          <button className="p-1.5 rounded-lg border border-[#e1ccf3] hover:bg-purple-50 text-gray-600">
            <ChevronRight className="w-4 h-4" />
          </button>
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
