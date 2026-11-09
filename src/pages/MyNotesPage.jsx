import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  Plus,
  Filter,
  RotateCcw,
  Edit3,
  Eye,
  Bookmark,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  Scale,
  Layers,
  List,
  Gavel,
  Star,
  Clock,
  FileText,
  FilePlus,
  Upload,
  Download,
  Tag as TagIcon,
  Settings,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import NoteModal from '../components/NoteModal';

export default function MyNotesPage() {
  const { setActivePage } = useAuth();
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Notes');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [sortBy, setSortBy] = useState('Latest Updated');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [viewingNote, setViewingNote] = useState(null);
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const [overview, setOverview] = useState({ total: 246, important: 14, recent: 20, sectionNotes: 64 });
  const [accordionOpen, setAccordionOpen] = useState({ noteType: true, tag: true, year: true });

  const categoryTabs = [
    { label: 'All Notes', count: '246', icon: Layers },
    { label: 'Act Notes', count: '98', icon: Scale },
    { label: 'Rule Notes', count: '52', icon: Layers },
    { label: 'Section Notes', count: '64', icon: List },
    { label: 'Case Notes', count: '18', icon: Gavel },
    { label: 'Important', count: '14', icon: Star },
    { label: 'Recent', count: '20', icon: Clock },
  ];

  const fetchNotes = () => {
    let url = `/api/notes?q=${encodeURIComponent(searchTerm)}`;
    if (activeCategory !== 'All Notes' && activeCategory !== 'Important' && activeCategory !== 'Recent') {
      url += `&type=${encodeURIComponent(activeCategory)}`;
    }
    selectedTypes.forEach(t => { url += `&type=${encodeURIComponent(t)}`; });
    selectedTags.forEach(t => { url += `&tag=${encodeURIComponent(t)}`; });
    selectedYears.forEach(y => { url += `&year=${encodeURIComponent(y)}`; });

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data && data.notes) {
          setNotes(data.notes);
          setOverview({
            total: data.totalNotes || 246,
            important: data.importantCount || 14,
            recent: data.recentCount || 20,
            sectionNotes: data.sectionNotesCount || 64
          });
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchNotes();
  }, [searchTerm, activeCategory, selectedTypes, selectedTags, selectedYears]);

  const handleSaveNote = async (formData) => {
    try {
      if (editingNote) {
        await fetch(`/api/notes/${editingNote.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } else {
        await fetch('/api/notes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      }
      setModalOpen(false);
      setEditingNote(null);
      fetchNotes();
    } catch (e) {
      alert('Error saving note');
    }
  };

  const handleDeleteNote = async (id) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    try {
      await fetch(`/api/notes/${id}`, { method: 'DELETE' });
      setModalOpen(false);
      setEditingNote(null);
      fetchNotes();
    } catch (e) {
      alert('Error deleting note');
    }
  };

  const clearAllFilters = () => {
    setSelectedTypes([]);
    setSelectedTags([]);
    setSelectedYears([]);
    setSearchTerm('');
    setActiveCategory('All Notes');
  };

  const toggleBookmark = (id) => {
    const next = new Set(bookmarkedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setBookmarkedIds(next);
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(notes, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "tamil_raw_library_notes.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImport = () => {
    alert('Import PDF/Text: You can select documents to parse statutory citations directly into your Notes library.');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Top Banner matching screenshot */}
      <div className="w-full rounded-2xl overflow-hidden shadow-lg border border-[#e2c6f5]">
        <img
          src="/assets/banner_notes.png"
          alt="My Notes - Create, Organize and Manage Your Legal Notes"
          className="w-full h-auto object-cover select-none"
        />
      </div>

      {/* 2. Search & Create Note Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="flex-1 w-full flex items-center bg-white rounded-full border border-[#dfc5f3] shadow-md pl-5 pr-2 py-1.5 focus-within:border-[#7c14a8] focus-within:ring-2 focus-within:ring-purple-200 transition-all">
          <Search className="w-5 h-5 text-[#6e0795] mr-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search your notes by title, Act, Rule, Section, keyword..."
            className="w-full bg-transparent outline-none text-xs md:text-sm text-gray-800 placeholder-gray-400 font-medium"
          />
          <button
            onClick={fetchNotes}
            className="px-6 py-2 rounded-full bg-gradient-to-r from-[#4d036a] to-[#7f13ad] hover:from-[#5d047f] hover:to-[#9218c5] text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-all"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search</span>
          </button>
        </div>

        <button
          onClick={() => {
            setEditingNote(null);
            setModalOpen(true);
          }}
          className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#7a0ea6] to-[#a21dc7] hover:from-[#8911b9] hover:to-[#b724e0] text-white text-xs font-bold flex items-center space-x-1.5 shadow-md transition-all whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Create Note</span>
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

      {/* 4. Three-Column Grid: Left Filters, Middle Notes, Right Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Filter Panel */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-[#ecd9f8] p-5 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#f3e4fb]">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-[#79159d]" />
              <h4 className="font-bold text-sm text-[#380352]">Filter Notes</h4>
            </div>
            <button
              onClick={clearAllFilters}
              className="text-xs font-semibold text-[#79159d] hover:underline flex items-center space-x-1"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              <span>Clear All</span>
            </button>
          </div>

          {/* Accordion 1: Note Type */}
          <div className="space-y-2">
            <button
              onClick={() => setAccordionOpen({ ...accordionOpen, noteType: !accordionOpen.noteType })}
              className="w-full flex items-center justify-between text-xs font-bold text-[#3d0356]"
            >
              <span>Note Type</span>
              {accordionOpen.noteType ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />}
            </button>
            {accordionOpen.noteType && (
              <div className="space-y-2 pt-1 text-xs text-gray-700">
                {[
                  { label: 'Act Notes', count: '98' },
                  { label: 'Rule Notes', count: '52' },
                  { label: 'Section Notes', count: '64' },
                  { label: 'Case Notes', count: '18' },
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
                  { label: 'Evidence', count: '42' },
                  { label: 'Procedure', count: '36' },
                  { label: 'Amendment', count: '28' },
                  { label: 'Notification', count: '18' },
                  { label: 'Important', count: '14' },
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
                  onClick={() => alert('Manage all custom research tags in Settings')}
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
                  { year: '2026', count: '6' },
                  { year: '2025', count: '28' },
                  { year: '2024', count: '46' },
                  { year: '2023', count: '38' },
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

        {/* Middle: Notes Listing */}
        <div className="lg:col-span-6 space-y-4">
          {/* Top count & Sort */}
          <div className="bg-white rounded-xl border border-[#ecd9f8] px-5 py-3 flex items-center justify-between shadow-xs">
            <span className="text-xs font-bold text-[#3d0356]">
              Showing 1 – 10 of 246 Notes
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
                <option value="Important First">Important First</option>
              </select>
            </div>
          </div>

          {/* List items matching screenshot */}
          <div className="space-y-3">
            {notes.map((note, idx) => {
              const isBm = bookmarkedIds.has(note.id);
              return (
                <div
                  key={note.id || idx}
                  className="bg-white rounded-2xl border border-[#ebdcf7] hover:border-[#bf81ea] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all group"
                >
                  {/* Left info */}
                  <div className="flex items-start space-x-3.5">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#fed866] to-[#f8df80] p-2 flex items-center justify-center text-[#550676] shadow-xs shrink-0 mt-0.5">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#380352] group-hover:text-[#6f0c97] transition-colors">
                        {note.title}
                      </h4>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500 mt-1">
                        <span>{note.actOrRule}</span>
                        <span>•</span>
                        <span>{note.section}</span>
                        <span>•</span>
                        <span>Updated: {note.updatedDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right actions */}
                  <div className="flex items-center space-x-2 shrink-0 self-end md:self-center">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-purple-100 text-purple-800">
                      {note.tag || 'Evidence'}
                    </span>

                    <button
                      onClick={() => {
                        setEditingNote(note);
                        setModalOpen(true);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-[#590479] hover:bg-[#720999] text-white text-xs font-bold flex items-center space-x-1 shadow-sm transition-all"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => setViewingNote(note)}
                      className="px-3 py-1.5 rounded-xl bg-[#faf4fe] hover:bg-[#f3e2fd] border border-[#dcb8f3] text-[#520671] text-xs font-bold flex items-center space-x-1 transition-all"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>

                    <button
                      onClick={() => toggleBookmark(note.id)}
                      className={`p-2 rounded-xl border border-[#ebd6fa] hover:bg-[#faf4fe] transition-colors ${
                        isBm ? 'text-amber-500 bg-amber-50' : 'text-gray-400'
                      }`}
                      title="Bookmark"
                    >
                      <Bookmark className={`w-4 h-4 ${isBm ? 'fill-current' : ''}`} />
                    </button>

                    <button
                      onClick={() => alert(`Note Options: Export as PDF, Share, Duplicate`)}
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
            <button className="px-2 h-7 rounded-lg hover:bg-purple-50 text-gray-700 flex items-center justify-center">25</button>
            <button className="p-1.5 rounded-lg border border-[#e1ccf3] hover:bg-purple-50 text-gray-600">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Quick Actions & Notes Overview */}
        <div className="lg:col-span-3 space-y-5">
          {/* Quick Actions Card */}
          <div className="bg-white rounded-2xl border border-[#ecd9f8] p-5 shadow-sm space-y-3">
            <div className="flex items-center space-x-2 pb-2 border-b border-[#f3e4fb]">
              <span className="text-[#e29d12] font-bold text-sm">⚡</span>
              <h4 className="font-bold text-sm text-[#380352]">Quick Actions</h4>
            </div>

            <div className="space-y-1.5 text-xs font-semibold">
              <button
                onClick={() => {
                  setEditingNote(null);
                  setModalOpen(true);
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#faf4fe] text-[#4c0469] transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <FilePlus className="w-4 h-4 text-[#79159d]" />
                  <span>Create New Note</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>

              <button
                onClick={handleImport}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#faf4fe] text-[#4c0469] transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <Upload className="w-4 h-4 text-[#79159d]" />
                  <span>Import Notes (PDF / Text)</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>

              <button
                onClick={handleExport}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#faf4fe] text-[#4c0469] transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <Download className="w-4 h-4 text-[#79159d]" />
                  <span>Export Notes</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>

              <button
                onClick={() => alert('Tag manager: 18 active research tags')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#faf4fe] text-[#4c0469] transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <TagIcon className="w-4 h-4 text-[#79159d]" />
                  <span>Manage Tags</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>

              <button
                onClick={() => alert('Note settings: Automatic cloud backup is ENABLED.')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#faf4fe] text-[#4c0469] transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <Settings className="w-4 h-4 text-[#79159d]" />
                  <span>Note Settings</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Notes Overview Card */}
          <div className="bg-white rounded-2xl border border-[#ecd9f8] p-5 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 pb-2 border-b border-[#f3e4fb]">
              <span className="text-[#79159d] font-bold text-sm">📊</span>
              <h4 className="font-bold text-sm text-[#380352]">Notes Overview</h4>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-[#fdf8fe] border border-[#f2e1fc] rounded-xl flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-purple-100 text-[#79159d]">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <span className="block font-bold text-base text-[#380352]">{overview.total}</span>
                  <span className="text-[10px] text-gray-500 font-medium">Total Notes</span>
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
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600">
                  <Bookmark className="w-4 h-4" />
                </div>
                <div>
                  <span className="block font-bold text-base text-[#380352]">{overview.sectionNotes}</span>
                  <span className="text-[10px] text-gray-500 font-medium">Section Notes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Note Creation / Editing Modal */}
      <NoteModal
        isOpen={modalOpen}
        note={editingNote}
        onClose={() => {
          setModalOpen(false);
          setEditingNote(null);
        }}
        onSave={handleSaveNote}
        onDelete={handleDeleteNote}
      />

      {/* Note Viewing Modal */}
      {viewingNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#e4ccf5] w-full max-w-xl overflow-hidden animate-scaleUp">
            <div className="bg-gradient-to-r from-[#5a047c] to-[#7f13ad] text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-xs text-yellow-300 font-semibold">{viewingNote.actOrRule} • {viewingNote.section}</span>
                <h3 className="font-bold text-base font-serif-law">{viewingNote.title}</h3>
              </div>
              <button onClick={() => setViewingNote(null)} className="text-white hover:opacity-80">
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center space-x-2 text-xs">
                <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold">{viewingNote.tag}</span>
                <span className="text-gray-500">Updated: {viewingNote.updatedDate}</span>
              </div>
              <div className="bg-[#faf4fe] p-4 rounded-xl border border-[#ebd6fa] text-xs text-gray-800 leading-relaxed whitespace-pre-line">
                {viewingNote.content || 'No content written for this note yet.'}
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  onClick={() => {
                    const toEdit = viewingNote;
                    setViewingNote(null);
                    setEditingNote(toEdit);
                    setModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#590479] text-white text-xs font-bold"
                >
                  Edit Note
                </button>
                <button
                  onClick={() => setViewingNote(null)}
                  className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-xs font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
