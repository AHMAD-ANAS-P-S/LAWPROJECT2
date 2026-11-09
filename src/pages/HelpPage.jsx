import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  Rocket,
  BookOpen,
  Scale,
  FileText,
  FileEdit,
  Bookmark,
  Crown,
  PlayCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ChevronLeft,
  Mail,
  Download,
  User,
  Layers,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import VideoPlayerModal from '../components/VideoPlayerModal';
import ContactSupportModal from '../components/ContactSupportModal';

export default function HelpPage() {
  const { setActivePage } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('Getting Started');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [expandedStep, setExpandedStep] = useState(null);
  const [helpData, setHelpData] = useState(null);

  useEffect(() => {
    fetch('/api/help')
      .then(res => res.json())
      .then(data => setHelpData(data))
      .catch(() => {});
  }, []);

  const navTabs = [
    { label: 'Getting Started', icon: Rocket, page: 'help' },
    { label: 'Browse Acts', icon: BookOpen, page: 'acts' },
    { label: 'Browse Rules', icon: Scale, page: 'rules' },
    { label: 'Amendments', icon: FileText, page: 'amendments' },
    { label: 'Search', icon: Search, page: 'search' },
    { label: 'My Notes', icon: FileEdit, page: 'notes' },
    { label: 'Bookmarks', icon: Bookmark, page: 'bookmarks' },
    { label: 'Subscription', icon: Crown, page: 'subscription' },
  ];

  const tutorials = helpData?.tutorials || [
    {
      id: 'vid-1',
      title: 'Platform Overview',
      duration: '05:20',
      thumbnail: '/assets/video_thumb_1.png',
      description: 'A comprehensive walkthrough of Tamil Raw Library, covering navigation, search capabilities, and subscription features.'
    },
    {
      id: 'vid-2',
      title: 'How to Search Acts & Rules',
      duration: '04:35',
      thumbnail: '/assets/video_thumb_2.png',
      description: 'Learn how to use universal search, exact phrase matching, cross-reference filters, and section-by-section exploration.'
    },
    {
      id: 'vid-3',
      title: 'Create Notes & Bookmarks',
      duration: '03:50',
      thumbnail: '/assets/video_thumb_3.png',
      description: 'Organize your legal research by tagging notes, marking important sections, and exporting research briefs.'
    }
  ];

  const stepGuides = helpData?.stepGuides || [
    { id: 'step-1', step: 1, icon: User, title: 'Create Your Account', desc: 'Sign up with your full name, email, and password or use one-click Google OAuth authentication to initialize your legal workspace.' },
    { id: 'step-2', step: 2, icon: Crown, title: 'Choose a Subscription Plan', desc: 'Select the Tamil + English Package or bilingual tier with annual or multi-year validity for unrestricted access.' },
    { id: 'step-3', step: 3, icon: Layers, title: 'Browse Acts, Rules & Updates', desc: 'Explore central and state statutes with side-by-side section viewing, official notifications, and verified citations.' },
    { id: 'step-4', step: 4, icon: Search, title: 'Use Search & Filters Effectively', desc: 'Refine your legal inquiries with jurisdiction filters, enactment years, exact phrases, and cross-references.' },
    { id: 'step-5', step: 5, icon: Bookmark, title: 'Save Notes & Bookmarks', desc: 'Pin critical statutory provisions, take personal legal case notes, organize them with custom tags, and export them as PDF.' }
  ];

  const faqs = helpData?.faqs || [
    {
      id: 'faq-1',
      question: 'How do I search for a specific Act or Rule?',
      answer: 'Use the top universal search bar on the Dashboard or browse the dedicated Acts and Rules pages. You can search by Act title, year, section number, or keywords. For more advanced criteria, click the "Advanced Search" button.'
    },
    {
      id: 'faq-2',
      question: 'How can I access the latest Amendments?',
      answer: 'Navigate to the "Amendments & Updates" section from the sidebar. Here, all legal amendments, government notifications, corrigenda, and newly inserted sections are updated in real time with gazette citations.'
    },
    {
      id: 'faq-3',
      question: 'Can I save my notes and bookmarks?',
      answer: 'Yes! While viewing any Act, Rule, or Section, click the bookmark icon to save it to your Bookmarks dashboard. You can also write structured personal legal notes, attach tags, import PDF notes, and export notes as PDF.'
    },
    {
      id: 'faq-4',
      question: 'How do I manage my subscription?',
      answer: 'Visit the "Subscription Details" page from the sidebar. You can review your active plan, valid until date, remaining days, download GST tax invoices, update billing details, renew your plan, or manage your package tier.'
    }
  ];

  const handleDownloadManual = () => {
    alert('Tamil Raw Library Complete User Manual (PDF) - Preparing official 32-page documentation download...');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Top Banner matching screenshot */}
      <div className="w-full rounded-2xl overflow-hidden shadow-lg border border-[#e2c6f5]">
        <img
          src="/assets/banner_help.png"
          alt="Help & How to Use - A Complete User Guide to Explore, Search and Make the Best Use"
          className="w-full h-auto object-cover select-none"
        />
      </div>

      {/* 2. Search Help Bar */}
      <div className="flex items-center bg-white rounded-full border border-[#dfc5f3] shadow-md pl-5 pr-2 py-1.5 focus-within:border-[#7c14a8] focus-within:ring-2 focus-within:ring-purple-200 transition-all">
        <Search className="w-5 h-5 text-[#6e0795] mr-3" />
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search for help topics, features, or 'how to' guides..."
          className="w-full bg-transparent outline-none text-xs md:text-sm text-gray-800 placeholder-gray-400 font-medium"
        />
        <button
          onClick={() => alert(`Showing help articles matching "${searchTerm}"`)}
          className="px-6 py-2 rounded-full bg-gradient-to-r from-[#4d036a] to-[#7f13ad] hover:from-[#5d047f] hover:to-[#9218c5] text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-all whitespace-nowrap"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Search Help</span>
        </button>
      </div>

      {/* 3. Navigation Cards (8 horizontal quick tabs matching screenshot) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {navTabs.map((item, idx) => {
          const Icon = item.icon;
          const isActive = activeTab === item.label;
          return (
            <button
              key={idx}
              onClick={() => {
                setActiveTab(item.label);
                if (item.page !== 'help') setActivePage(item.page);
              }}
              className={`p-3.5 rounded-2xl border text-center flex flex-col items-center justify-center transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-[#590479] to-[#7c11a8] text-white shadow-md border-transparent'
                  : 'bg-white hover:bg-[#faf4fe] text-gray-700 border-[#ecdcf8]'
              }`}
            >
              <Icon className={`w-5 h-5 mb-1.5 ${isActive ? 'text-[#f5cb43]' : 'text-[#7e1ba7]'}`} />
              <span className="text-xs font-bold block whitespace-nowrap">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* 4. Middle Grid: Video Tutorials + Step-by-Step Guide */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left: Video Tutorials (~60% / col-span-7) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#ecd9f8] p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#f3e4fb]">
            <div className="flex items-center space-x-2">
              <PlayCircle className="w-5 h-5 text-[#79159d]" />
              <h3 className="font-bold text-base text-[#380352]">Video Tutorials</h3>
            </div>
            <button
              onClick={() => setSelectedVideo(tutorials[0])}
              className="text-xs font-bold text-[#6a0793] hover:underline flex items-center"
            >
              <span>View All Videos</span>
              <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>

          {/* Videos Carousel row matching screenshot */}
          <div className="relative flex items-center">
            <button
              onClick={() => {
                const cur = tutorials.indexOf(selectedVideo);
                setSelectedVideo(tutorials[(cur - 1 + tutorials.length) % tutorials.length]);
              }}
              className="absolute -left-3 z-10 w-7 h-7 rounded-full bg-white shadow-md border border-[#ebd6fa] flex items-center justify-center text-[#79159d] hover:bg-[#faf4fe]"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full px-2">
              {tutorials.map((vid, idx) => (
                <div
                  key={vid.id || idx}
                  onClick={() => setSelectedVideo(vid)}
                  className="bg-[#faf4fe] rounded-xl border border-[#ebd6fa] hover:border-[#bf81ea] overflow-hidden cursor-pointer group shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="relative overflow-hidden aspect-video bg-purple-950">
                    <img
                      src={vid.thumbnail}
                      alt={vid.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <div className="w-9 h-9 rounded-full bg-[#7a0ea6]/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <span className="text-sm ml-0.5">▶</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5 flex items-center justify-between text-xs">
                    <span className="font-bold text-[#3d0356] text-[11.5px] truncate">
                      {vid.title}
                    </span>
                    <span className="text-[10px] text-gray-500 font-bold ml-1 flex items-center">
                      <span className="text-[#79159d] mr-1">▶</span>
                      {vid.duration}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                const cur = tutorials.indexOf(selectedVideo);
                setSelectedVideo(tutorials[(cur + 1) % tutorials.length]);
              }}
              className="absolute -right-3 z-10 w-7 h-7 rounded-full bg-white shadow-md border border-[#ebd6fa] flex items-center justify-center text-[#79159d] hover:bg-[#faf4fe]"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center space-x-1.5 pt-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#590479]"></span>
            <span className="w-2 h-2 rounded-full bg-purple-200"></span>
            <span className="w-2 h-2 rounded-full bg-purple-200"></span>
            <span className="w-2 h-2 rounded-full bg-purple-200"></span>
          </div>
        </div>

        {/* Right: Step-by-Step Guide (~40% / col-span-5) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#ecd9f8] p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div className="pb-3 border-b border-[#f3e4fb]">
            <div className="flex items-center space-x-2">
              <PlayCircle className="w-5 h-5 text-[#79159d]" />
              <h3 className="font-bold text-base text-[#380352]">Step-by-Step Guide</h3>
            </div>
          </div>

          <div className="space-y-2">
            {stepGuides.map((guide) => (
              <div
                key={guide.id}
                className="rounded-xl border border-[#f1e1fa] hover:border-[#bf81ea] bg-[#fdfaff] transition-all overflow-hidden"
              >
                <div
                  onClick={() => setExpandedStep(expandedStep === guide.id ? null : guide.id)}
                  className="p-3 flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded-full bg-[#590479] text-white text-xs font-bold flex items-center justify-center shrink-0">
                      {guide.step}
                    </div>
                    <span className="text-xs font-bold text-[#3d0356]">{guide.title}</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${expandedStep === guide.id ? 'rotate-90 text-[#79159d]' : ''}`} />
                </div>
                {expandedStep === guide.id && (
                  <div className="px-4 pb-3 pt-1 text-xs text-gray-600 border-t border-[#f7eefd] bg-white">
                    {guide.desc}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Bottom Grid: FAQs + Need Further Help */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left: FAQs (~65% / col-span-8) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-[#ecd9f8] p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#f3e4fb]">
            <div className="flex items-center space-x-2">
              <HelpCircle className="w-5 h-5 text-[#79159d]" />
              <h3 className="font-bold text-base text-[#380352]">Frequently Asked Questions (FAQs)</h3>
            </div>
            <button
              onClick={() => alert('All FAQ questions loaded')}
              className="text-xs font-bold text-[#6a0793] hover:underline flex items-center"
            >
              <span>View All FAQs</span>
              <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {faqs.map((faq) => {
              const isOpen = expandedFaq === faq.id;
              return (
                <div
                  key={faq.id}
                  className="rounded-xl border border-[#ebdcf7] overflow-hidden bg-[#faf4fe] transition-all"
                >
                  <button
                    onClick={() => setExpandedFaq(isOpen ? null : faq.id)}
                    className="w-full p-3.5 flex items-center justify-between text-left text-xs font-bold text-[#3d0356]"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="w-5 h-5 rounded-full bg-[#590479] text-white flex items-center justify-center font-bold text-[10px]">
                        Q
                      </div>
                      <span>{faq.question}</span>
                    </div>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#79159d]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-3.5 text-xs text-gray-700 leading-relaxed border-t border-[#f0defa] bg-white pt-2.5">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Need Further Help? (~35% / col-span-4) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-[#ecd9f8] p-6 shadow-sm flex flex-col items-center justify-between text-center space-y-4">
          <div className="w-full text-left">
            <h4 className="font-bold text-sm text-[#380352]">Need Further Help?</h4>
            <p className="text-xs text-gray-600 mt-1">
              Still have questions? Our support team is here to assist you.
            </p>
          </div>

          {/* Support Illustration matching screenshot */}
          <div className="my-1 flex justify-center">
            <img
              src="/assets/help_support_avatar.png"
              alt="Support Representative"
              className="h-20 object-contain filter drop-shadow-sm"
            />
          </div>

          {/* Two Buttons */}
          <div className="w-full space-y-2">
            <button
              onClick={() => setSupportModalOpen(true)}
              className="w-full py-2.5 px-4 rounded-full bg-gradient-to-r from-[#4d036a] to-[#7f13ad] hover:from-[#5d047f] hover:to-[#9218c5] text-white text-xs font-bold flex items-center justify-center space-x-2 shadow-sm transition-all"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Contact Support</span>
            </button>

            <button
              onClick={handleDownloadManual}
              className="w-full py-2.5 px-4 rounded-full bg-[#faf4fe] hover:bg-[#f3e2fd] border border-[#dcb8f3] text-[#520671] text-xs font-bold flex items-center justify-center space-x-2 transition-all"
            >
              <Download className="w-3.5 h-3.5 text-[#79159d]" />
              <span>User Manual (PDF)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Video Player Modal */}
      {selectedVideo && (
        <VideoPlayerModal
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}

      {/* Contact Support Modal */}
      <ContactSupportModal
        isOpen={supportModalOpen}
        onClose={() => setSupportModalOpen(false)}
      />
    </div>
  );
}
