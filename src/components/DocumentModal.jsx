import React, { useState } from 'react';
import { X, BookOpen, Bookmark, Download, Printer, Share2, Check } from 'lucide-react';

export default function DocumentModal({ doc, onClose, onBookmark }) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('content');

  if (!doc) return null;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-[#e4ccf5] w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#590479] to-[#7a0ea6] text-white p-5 flex items-start justify-between">
          <div className="space-y-1 pr-6">
            <div className="flex items-center space-x-2 text-xs font-semibold text-yellow-300">
              <span className="bg-white/20 px-2 py-0.5 rounded-full">{doc.jurisdiction || 'Central Act'}</span>
              <span>•</span>
              <span>{doc.number || 'Act No. 1'}</span>
              <span>•</span>
              <span className="text-emerald-300">{doc.status || 'In Force'}</span>
            </div>
            <h2 className="text-xl font-bold font-serif-law tracking-wide text-white">
              {doc.title}
            </h2>
            <p className="text-xs text-white/80 line-clamp-1">
              {doc.description || 'Indian Government Legal Enactment'}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onBookmark && onBookmark(doc)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-yellow-300 transition-colors"
              title="Bookmark this document"
            >
              <Bookmark className="w-4 h-4 fill-current" />
            </button>
            <button
              onClick={handlePrint}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Print document"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Share link"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#ebdcf7] px-6 bg-[#faf4fe] text-xs font-semibold">
          <button
            onClick={() => setActiveTab('content')}
            className={`py-3 px-4 border-b-2 transition-all ${
              activeTab === 'content'
                ? 'border-[#620885] text-[#5b0378] font-bold'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Overview & Full Text
          </button>
          <button
            onClick={() => setActiveTab('sections')}
            className={`py-3 px-4 border-b-2 transition-all ${
              activeTab === 'sections'
                ? 'border-[#620885] text-[#5b0378] font-bold'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Sections & Provisions ({doc.sections?.length || 0})
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm text-gray-800 leading-relaxed max-h-[60vh]">
          {activeTab === 'content' ? (
            <div className="space-y-4">
              <div className="bg-[#fbf7fe] p-4 rounded-xl border border-[#ebdcf7]">
                <h4 className="font-bold text-[#51046d] mb-1">Official Summary</h4>
                <p className="text-xs text-gray-700">
                  {doc.description || 'This statute establishes comprehensive rules, definitions, and procedures under Indian Law.'}
                </p>
                <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-gray-500 block">Enactment Year</span>
                    <span className="font-bold text-[#45055e]">{doc.year || '1872'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Jurisdiction</span>
                    <span className="font-bold text-[#45055e]">{doc.jurisdiction}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Languages</span>
                    <span className="font-bold text-[#45055e]">English & தமிழ்</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Status</span>
                    <span className="font-bold text-emerald-700">{doc.status || 'Active'}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-base text-[#490364] mb-2 font-serif-law">
                  Statutory Enactment Text
                </h4>
                <p className="text-xs text-gray-600 mb-3">
                  Whereas it is expedient to consolidate, define and amend the law of Evidence in India; It is hereby enacted as follows:
                </p>
                <div className="space-y-3">
                  {(doc.sections && doc.sections.length > 0 ? doc.sections : [
                    { section: 'Section 1', title: 'Short title, extent and commencement', content: 'This Act may be called the Act. It extends to the whole of India and shall come into force at once.' },
                    { section: 'Section 2', title: 'Definitions', content: 'In this Act, unless the context otherwise requires, terms shall have the meanings respectively assigned to them.' }
                  ]).map((s, idx) => (
                    <div key={idx} className="p-3 bg-white rounded-lg border border-[#f0e3fa] shadow-sm">
                      <div className="font-bold text-xs text-[#630787] flex items-center justify-between">
                        <span>{s.section}: {s.title}</span>
                      </div>
                      <p className="text-xs text-gray-700 mt-1 leading-normal">{s.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {doc.sections && doc.sections.length > 0 ? (
                doc.sections.map((sec, i) => (
                  <div key={i} className="p-4 bg-white rounded-xl border border-[#ecd9f8] hover:border-[#bf81ea] transition-all">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                      {sec.section}
                    </span>
                    <h5 className="font-bold text-sm text-[#4b0366] mt-1">{sec.title}</h5>
                    <p className="text-xs text-gray-600 mt-2">{sec.content}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 text-xs">
                  No individual section breakdowns registered for this entry.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#fcf8fe] px-6 py-3 border-t border-[#ebdcf7] flex items-center justify-between text-xs">
          <span className="text-gray-500">
            Tamil Raw Library Digital Verified Statutory Repository
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#5e047f] hover:bg-[#730a9c] text-white font-semibold transition-colors"
          >
            Close Document
          </button>
        </div>
      </div>
    </div>
  );
}
