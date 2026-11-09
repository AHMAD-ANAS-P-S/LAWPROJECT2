import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  Plus,
  Filter,
  RotateCcw,
  BookOpen,
  Eye,
  Star,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  Scale,
  Layers,
  List,
  FileText,
  Bell,
  Clock,
  Bookmark,
  ChevronRight,
  ChevronLeft,
  Download,
  Upload,
  Tag as TagIcon,
  Settings,
  Sparkles
} from 'lucide-react';
import DocumentModal from '../components/DocumentModal';

export default function BookmarksPage() {
  const { setActivePage } = useAuth();
  const [bookmarks, setBookmarks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Bookmarks');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [sortBy, setSortBy] = useState('Latest Added');
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState('Act');
  const [overview, setOverview] = useState({ total: 328, important: 56, recent: 36, tags: 18 });
  const [accordionOpen, setAccordionOpen] = useState({ type: true, tag: true, year: true });

  const categoryTabs = [
    { label: 'All Bookmarks', count: '328', icon: Layers },
    { label: 'Act Bookmarks', count: '124', icon: Scale },
    { label: 'Rule Bookmarks', count: '68', icon: Layers },
    { label: 'Section Bookmarks', count: '82', icon: List },
    { label: 'Amendment Bookmarks', count: '28', icon: FileText },
    { label: 'Notification Bookmarks', count: '18', icon: Bell },
    { label: 'Recent', count: '36', icon: Clock },
  ];

  const fetchBookmarks = () => {
    let url = `/api/bookmarks?q=${encodeURIComponent(searchTerm)}`;
    if (activeCategory !== 'All Bookmarks' && activeCategory !== 'Recent') {
      const cleanType = activeCategory.replace(' Bookmarks', '');
      url += `&type=${encodeURIComponent(cleanType)}`;
    }
    selectedTypes.forEach(t => { url += `&type=${encodeURIComponent(t)}`; });
    selectedTags.forEach(t => { url += `&tag=${encodeURIComponent(t)}`; });
    selectedYears.forEach(y => { url += `&year=${encodeURIComponent(y)}`; });

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data && data.bookmarks) {
          setBookmarks(data.bookmarks);
          setOverview({
            total: data.totalBookmarks || 328,
            important: data.importantCount || 56,
            recent: data.recentCount || 36,
            tags: data.tagsCount || 18
          });
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchBookmarks();
  }, [searchTerm, activeCategory, selectedTypes, selectedTags, selectedYears]);

  const toggleImportant = async (id) => {
    try {
      await fetch(`/api/bookmarks/${id}/important`, { method: 'PATCH' });
      fetchBookmarks();
    } catch (e) {
      alert('Error updating bookmark');
    }
  };

  const handleAddBookmark = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    try {
      await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          type: newType,
          jurisdiction: newType === 'Act' ? 'Central Act' : 'Central Rules',
          number: 'Act/Rule Ref',
          tag: 'Important'
        })
      });
      setNewTitle('');
      setAddModalOpen(false);
      fetchBookmarks();
    } catch (e) {
      alert('Error adding bookmark');
    }
  };

  const handleDeleteBookmark = async (id) => {
    if (!window.confirm('Remove bookmark?')) return;
    try {
      await fetch(`/api/bookmarks/${id}`, { method: 'DELETE' });
      fetchBookmarks();
    } catch (e) {
      alert('Error removing bookmark');
    }
  };

  const clearAllFilters = () => {
    setSelectedTypes([]);
    setSelectedTags([]);
    setSelectedYears([]);
    setSearchTerm('');
    setActiveCategory('All Bookmarks');
  };

  const getBadgeColor = (type) => {
    switch (type) {
      case 'Act': return 'bg-amber-100 text-amber-800';
      case 'Rule': return 'bg-purple-100 text-purple-800';
      case 'Section': return 'bg-rose-100 text-rose-800';
      case 'Amendment': return 'bg-blue-100 text-blue-800';
      case 'Notification': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Top Banner matching screenshot */}
      <div className="w-full rounded-2xl overflow-hidden shadow-lg border border-[#e2c6f5]">
        <img
          src="/assets/banner_bookmarks.png"
          alt="Bookmarks - Save and Quickly Access Important Acts, Rules and Notifications"
          className="w-full h-auto object-cover select-none"
        />
      </div>

      {/* 2. Search & Add Bookmark Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="flex-1 w-full flex items-center bg-white rounded-full border border-[#dfc5f3] shadow-md pl-5 pr-2 py-1.5 focus-within:border-[#7c14a8] focus-within:ring-2 focus-within:ring-purple-200 transition-all">
          <Search className="w-5 h-5 text-[#6e0795] mr-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search your bookmarks by title, Act, Rule, Section, keyword..."
            className="w-full bg-transparent outline-none text-xs md:text-sm text-gray-800 placeholder-gray-400 font-medium"
          />
          <button
            onClick={fetchBookmarks}
            className="px-6 py-2 rounded-full bg-gradient-to-r from-[#4d036a] to-[#7f13ad] hover:from-[#5d047f] hover:to-[#9218c5] text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-all"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search</span>
          </button>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#7a0ea6] to-[#a21dc7] hover:from-[#8911b9] hover:to-[#b724e0] text-white text-xs font-bold flex items-center space-x-1.5 shadow-md transition-all whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Add Bookmark</span>
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
              onClick={() => setActiveCategory(cat.label)}
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

      {/* 4. Three-Column Grid: Left Filters, Middle Bookmarks, Right Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Filter Panel */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-[#ecd9f8] p-5 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#f3e4fb]">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-[#79159d]" />
              <h4 className="font-bold text-sm text-[#380352]">Filter Bookmarks</h4>
            </div>
            <button
              onClick={clearAllFilters}
              className="text-xs font-semibold text-[#79159d] hover:underline flex items-center space-x-1"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              <span>Clear All</span>
            </button>
          </div>

          {/* Accordion 1: Bookmark Type */}
          <div className="space-y-2">
            <button
              onClick={() => setAccordionOpen({ ...accordionOpen, type: !accordionOpen.type })}
              className="w-full flex items-center justify-between text-xs font-bold text-[#3d0356]"
            >
              <span>Bookmark Type</span>
              {accordionOpen.type ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />}
            </button>
            {accordionOpen.type && (
              <div className="space-y-2 pt-1 text-xs text-gray-700">
                {[
                  { label: 'Act', count: '124' },
                  { label: 'Rule', count: '68' },
                  { label: 'Section', count: '82' },
                  { label: 'Amendment', count: '28' },
                  { label: 'Notification', count: '18' },
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

          {/* Accordion 2: Tag */}
          <div className="space-y-2 pt-2 border-t border-[#f7eefd]">
            <button
              onClick={() => setAccordionOpen({ ...accordionOpen, tag: !accordionOpen.tag })}
              className="w-full flex items-center justify-between text-xs font-bold text-[#3d0356]"
            >
              <span>Tag</span>
              {accordionOpen.tag ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />}
            </button>
            {accordionOpen.tag && (
              <div className="space-y-2 pt-1 text-xs text-gray-700">
                {[
                  { label: 'Evidence', count: '56' },
                  { label: 'Procedure', count: '42' },
                  { label: 'IT & Digital', count: '38' },
                  { label: 'Criminal Law', count: '32' },
                  { label: 'Important', count: '24' },
                ].map((item, i) => (
                  <label key={i} className="flex items-center space-x-2 cursor-pointer hover:text-[#550676]">
                    <input
                      type="checkbox"
                      checked={selectedTags.includes(item.label)}
                      onChange={() => {
                        setSelectedTags(prev =>
                          prev.includes(item.label) ? prev.filter(x => x !== item.label) : [...prev, item.label]
                        );
                      }}
                      className="rounded border-[#d6aef2] text-[#630787] focus:ring-purple-300"
                    />
                    <span>{item.label} ({item.count})</span>
                  </label>
                ))}
                <button
                  type="button"
                  onClick={() => alert('All bookmark tags available')}
                  className="text-xs font-bold text-[#79159d] hover:underline pt-1 block"
                >
                  + Show More
                </button>
              </div>
            )}
          </div>

          {/* Accordion 3: Year */}
          <div className="space-y-2 pt-2 border-t border-[#f7eefd]">
            <button
              onClick={() => setAccordionOpen({ ...accordionOpen, year: !accordionOpen.year })}
              className="w-full flex items-center justify-between text-xs font-bold text-[#3d0356]"
            >
              <span>Year</span>
              {accordionOpen.year ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />}
            </button>
            {accordionOpen.year && (
              <div className="space-y-2 pt-1 text-xs text-gray-700">
                {[
                  { year: '2026', count: '8' },
                  { year: '2025', count: '42' },
                  { year: '2024', count: '86' },
                  { year: '2023', count: '72' },
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
              </div>
            )}
          </div>
        </div>

        {/* Middle: Bookmarks Listing */}
        <div className="lg:col-span-6 space-y-4">
          {/* Top count & Sort */}
          <div className="bg-white rounded-xl border border-[#ecd9f8] px-5 py-3 flex items-center justify-between shadow-xs">
            <span className="text-xs font-bold text-[#3d0356]">
              Showing 1 – 10 of 328 Bookmarks
            </span>
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-gray-500 font-medium">Sort By:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="bg-[#faf4fe] border border-[#e1ccf3] rounded-lg px-3 py-1.5 text-xs font-bold text-[#4c0469] outline-none"
              >
                <option value="Latest Added">Latest Added</option>
                <option value="Title A-Z">Title A-Z</option>
                <option value="Important First">Important First</option>
              </select>
            </div>
          </div>

          {/* List items matching screenshot */}
          <div className="space-y-3">
            {bookmarks.map((bm, idx) => (
              <div
                key={bm.id || idx}
                className="bg-white rounded-2xl border border-[#ebdcf7] hover:border-[#bf81ea] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all group"
              >
                {/* Left info */}
                <div className="flex items-start space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#fed866] to-[#f8df80] p-2 flex items-center justify-center text-[#550676] shadow-xs shrink-0 mt-0.5">
                    <Scale className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#380352] group-hover:text-[#6f0c97] transition-colors">
                      {bm.title}
                    </h4>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500 mt-1">
                      <span>{bm.jurisdiction}</span>
                      <span>•</span>
                      <span>{bm.number}</span>
                      <span>•</span>
                      <span>Bookmarked: {bm.bookmarkedDate}</span>
                    </div>
                  </div>
                </div>

                {/* Right actions */}
                <div className="flex flex-wrap items-center gap-2 shrink-0 self-start sm:self-center mt-2 sm:mt-0">
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${getBadgeColor(bm.type)}`}>
                    {bm.type}
                  </span>

                  <button
                    onClick={() => setSelectedDoc(bm)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#590479] hover:bg-[#720999] text-white text-xs font-bold flex items-center space-x-1 shadow-sm transition-all"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Open</span>
                  </button>

                  <button
                    onClick={() => setSelectedDoc(bm)}
                    className="px-3 py-1.5 rounded-xl bg-[#faf4fe] hover:bg-[#f3e2fd] border border-[#dcb8f3] text-[#520671] text-xs font-bold flex items-center space-x-1 transition-all"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View</span>
                  </button>

                  <button
                    onClick={() => toggleImportant(bm.id)}
                    className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-500 transition-colors"
                    title={bm.important ? 'Marked Important' : 'Mark as Important'}
                  >
                    <Star className={`w-4 h-4 ${bm.important ? 'fill-[#f4ba26] text-[#c78d05]' : 'text-gray-300'}`} />
                  </button>

                  <button
                    onClick={() => handleDeleteBookmark(bm.id)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Remove Bookmark"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
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
            <button className="px-2 h-7 rounded-lg hover:bg-purple-50 text-gray-700 flex items-center justify-center">33</button>
            <button className="p-1.5 rounded-lg border border-[#e1ccf3] hover:bg-purple-50 text-gray-600">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Quick Actions & Bookmarks Overview */}
        <div className="lg:col-span-3 space-y-5">
          {/* Quick Actions Card */}
          <div className="bg-white rounded-2xl border border-[#ecd9f8] p-5 shadow-sm space-y-3">
            <div className="flex items-center space-x-2 pb-2 border-b border-[#f3e4fb]">
              <span className="text-[#e29d12] font-bold text-sm">⚡</span>
              <h4 className="font-bold text-sm text-[#380352]">Quick Actions</h4>
            </div>

            <div className="space-y-1.5 text-xs font-semibold">
              <button
                onClick={() => setAddModalOpen(true)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#faf4fe] text-[#4c0469] transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <Bookmark className="w-4 h-4 text-[#79159d]" />
                  <span>Add New Bookmark</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>

              <button
                onClick={() => alert('Manage Bookmark Tags')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#faf4fe] text-[#4c0469] transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <TagIcon className="w-4 h-4 text-[#79159d]" />
                  <span>Manage Tags</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>

              <button
                onClick={() => alert('Export Bookmarks PDF generated')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#faf4fe] text-[#4c0469] transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <Download className="w-4 h-4 text-[#79159d]" />
                  <span>Export Bookmarks (PDF)</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>

              <button
                onClick={() => alert('Import Bookmarks ready')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#faf4fe] text-[#4c0469] transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <Upload className="w-4 h-4 text-[#79159d]" />
                  <span>Import Bookmarks</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>

              <button
                onClick={() => alert('Bookmark Settings')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#faf4fe] text-[#4c0469] transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <Settings className="w-4 h-4 text-[#79159d]" />
                  <span>Bookmark Settings</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Bookmarks Overview Card */}
          <div className="bg-white rounded-2xl border border-[#ecd9f8] p-5 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 pb-2 border-b border-[#f3e4fb]">
              <span className="text-[#79159d] font-bold text-sm">📊</span>
              <h4 className="font-bold text-sm text-[#380352]">Bookmarks Overview</h4>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-[#fdf8fe] border border-[#f2e1fc] rounded-xl flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-purple-100 text-[#79159d]">
                  <Bookmark className="w-4 h-4" />
                </div>
                <div>
                  <span className="block font-bold text-base text-[#380352]">{overview.total}</span>
                  <span className="text-[10px] text-gray-500 font-medium">Total Bookmarks</span>
                </div>
              </div>

              <div className="p-3 bg-[#fdf8fe] border border-[#f2e1fc] rounded-xl flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-amber-100 text-amber-600">
                  <Star className="w-4 h-4" />
                </div>
                <div>
                  <span className="block font-bold text-base text-[#380352]">{overview.important}</span>
                  <span className="text-[10px] text-gray-500 font-medium">Important</span>
                </div>
              </div>

              <div className="p-3 bg-[#fdf8fe] border border-[#f2e1fc] rounded-xl flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="block font-bold text-base text-[#380352]">{overview.recent}</span>
                  <span className="text-[10px] text-gray-500 font-medium">Recent</span>
                </div>
              </div>

              <div className="p-3 bg-[#fdf8fe] border border-[#f2e1fc] rounded-xl flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-rose-100 text-rose-600">
                  <TagIcon className="w-4 h-4" />
                </div>
                <div>
                  <span className="block font-bold text-base text-[#380352]">{overview.tags}</span>
                  <span className="text-[10px] text-gray-500 font-medium">Tags</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Bookmark Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#e4ccf5] w-full max-w-md overflow-hidden animate-scaleUp">
            <div className="bg-gradient-to-r from-[#5a047c] to-[#7f13ad] text-white p-5 flex items-center justify-between">
              <h3 className="font-bold text-base font-serif-law">Add Quick Bookmark</h3>
              <button onClick={() => setAddModalOpen(false)} className="text-white hover:opacity-80">✕</button>
            </div>
            <form onSubmit={handleAddBookmark} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#4c0469] mb-1">Document Title *</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Arbitration and Conciliation Act, 1996"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e1ccf3] text-xs outline-none focus:border-[#7c14a8]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#4c0469] mb-1">Type</label>
                <select
                  value={newType}
                  onChange={e => setNewType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e1ccf3] text-xs outline-none bg-white"
                >
                  <option value="Act">Act</option>
                  <option value="Rule">Rule</option>
                  <option value="Section">Section</option>
                  <option value="Amendment">Amendment</option>
                  <option value="Notification">Notification</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#590479] text-white text-xs font-bold shadow-md hover:bg-[#6e0795]"
                >
                  Save Bookmark
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Document View Modal */}
      {selectedDoc && (
        <DocumentModal
          doc={selectedDoc}
          onClose={() => setSelectedDoc(null)}
          onBookmark={() => toggleImportant(selectedDoc.id)}
        />
      )}
    </div>
  );
}
