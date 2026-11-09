import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, Tag, Book, FileText } from 'lucide-react';

export default function NoteModal({ note, isOpen, onClose, onSave, onDelete }) {
  const [formData, setFormData] = useState({
    title: '',
    actOrRule: 'Indian Evidence Act, 1872',
    section: 'Section 65B',
    type: 'Section Notes',
    tag: 'Evidence',
    content: ''
  });

  useEffect(() => {
    if (note) {
      setFormData({
        title: note.title || '',
        actOrRule: note.actOrRule || 'Indian Evidence Act, 1872',
        section: note.section || 'Section 65B',
        type: note.type || 'Section Notes',
        tag: note.tag || 'Evidence',
        content: note.content || ''
      });
    } else {
      setFormData({
        title: '',
        actOrRule: 'Indian Evidence Act, 1872',
        section: 'Section 65B',
        type: 'Section Notes',
        tag: 'Evidence',
        content: ''
      });
    }
  }, [note, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Please enter a note title');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-[#e4ccf5] w-full max-w-2xl overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#5a047c] to-[#7f13ad] text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-yellow-300" />
            <h3 className="font-bold text-lg font-serif-law tracking-wide text-white">
              {note ? 'Edit Legal Note' : 'Create New Legal Note'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#4c0469] mb-1">
              Note Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Section 65B – Electronic Records (Notes)"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#e1ccf3] focus:border-[#7c14a8] focus:ring-2 focus:ring-purple-200 outline-none text-sm transition-all"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#4c0469] mb-1">
                Related Act / Rule
              </label>
              <input
                type="text"
                value={formData.actOrRule}
                onChange={e => setFormData({ ...formData, actOrRule: e.target.value })}
                placeholder="e.g. Indian Evidence Act, 1872"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e1ccf3] focus:border-[#7c14a8] outline-none text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#4c0469] mb-1">
                Section Reference
              </label>
              <input
                type="text"
                value={formData.section}
                onChange={e => setFormData({ ...formData, section: e.target.value })}
                placeholder="e.g. Section 65B"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e1ccf3] focus:border-[#7c14a8] outline-none text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#4c0469] mb-1">
                Note Category
              </label>
              <select
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e1ccf3] focus:border-[#7c14a8] outline-none text-xs bg-white"
              >
                <option value="Act Notes">Act Notes</option>
                <option value="Rule Notes">Rule Notes</option>
                <option value="Section Notes">Section Notes</option>
                <option value="Case Notes">Case Notes</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#4c0469] mb-1">
                Tag
              </label>
              <select
                value={formData.tag}
                onChange={e => setFormData({ ...formData, tag: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e1ccf3] focus:border-[#7c14a8] outline-none text-xs bg-white"
              >
                <option value="Evidence">Evidence</option>
                <option value="Procedure">Procedure</option>
                <option value="Amendment">Amendment</option>
                <option value="Notification">Notification</option>
                <option value="Important">Important</option>
                <option value="Case Note">Case Note</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4c0469] mb-1">
              Note Content & Case Points
            </label>
            <textarea
              rows={6}
              value={formData.content}
              onChange={e => setFormData({ ...formData, content: e.target.value })}
              placeholder="Enter your detailed legal analysis, statutory observations, relevant case citations..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#e1ccf3] focus:border-[#7c14a8] focus:ring-2 focus:ring-purple-200 outline-none text-xs font-sans leading-relaxed"
            />
          </div>

          {/* Footer buttons */}
          <div className="pt-3 border-t border-[#f1e0fa] flex items-center justify-between">
            {note && onDelete ? (
              <button
                type="button"
                onClick={() => onDelete(note.id)}
                className="px-4 py-2 rounded-xl text-red-600 hover:bg-red-50 text-xs font-bold flex items-center transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-1.5" />
                Delete Note
              </button>
            ) : <div />}

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#5e047f] to-[#7f13ad] hover:from-[#6b0690] hover:to-[#9116c6] text-white text-xs font-bold flex items-center shadow-md transition-all"
              >
                <Save className="w-4 h-4 mr-1.5" />
                Save Note
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
