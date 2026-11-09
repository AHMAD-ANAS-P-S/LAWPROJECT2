import React, { useState } from 'react';
import { X, Send, CheckCircle2, MessageSquare } from 'lucide-react';

export default function ContactSupportModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: 'AHMAD ANAS P S',
    email: 'anas@tamilrawlibrary.com',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fetch('/api/help/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      setSubmitted(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitted(false);
        onClose();
      }, 1800);
    } catch (e) {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-[#e4ccf5] w-full max-w-lg overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#5a047c] to-[#7f13ad] text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-yellow-300" />
            <h3 className="font-bold text-lg font-serif-law tracking-wide text-white">
              Contact Support
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
            </div>
            <h4 className="font-bold text-base text-[#4c0469]">Ticket Submitted</h4>
            <p className="text-xs text-gray-600">
              Our legal technology support desk will respond to your registered email within 2 business hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#4c0469] mb-1">
                Your Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e1ccf3] focus:border-[#7c14a8] text-xs font-semibold outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4c0469] mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e1ccf3] focus:border-[#7c14a8] text-xs font-semibold outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4c0469] mb-1">
                Subject
              </label>
              <input
                type="text"
                placeholder="e.g. Assistance with Section search or invoice copy"
                value={formData.subject}
                onChange={e => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e1ccf3] focus:border-[#7c14a8] text-xs outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4c0469] mb-1">
                Message / Query
              </label>
              <textarea
                rows={4}
                placeholder="Describe your inquiry or the document you are looking for..."
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e1ccf3] focus:border-[#7c14a8] text-xs outline-none"
                required
              />
            </div>

            <div className="pt-2 flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#5e047f] to-[#7f13ad] hover:from-[#6b0690] hover:to-[#9116c6] text-white text-xs font-bold flex items-center shadow-md transition-all"
              >
                <Send className="w-3.5 h-3.5 mr-1.5" />
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
