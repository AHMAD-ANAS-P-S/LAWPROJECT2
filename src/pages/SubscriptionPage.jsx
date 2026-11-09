import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  CheckCircle,
  Calendar,
  Hourglass,
  Clock,
  Settings,
  RefreshCw,
  CreditCard,
  Check,
  FileText,
  Mail,
  Headphones,
  Printer,
  Download
} from 'lucide-react';
import SubscriptionModal from '../components/SubscriptionModal';
import ContactSupportModal from '../components/ContactSupportModal';

export default function SubscriptionPage() {
  const { user } = useAuth();
  const [subData, setSubData] = useState(null);
  const [modalMode, setModalMode] = useState(null);
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const fetchSubscription = () => {
    fetch('/api/subscription')
      .then(res => res.json())
      .then(data => setSubData(data))
      .catch(() => {});
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  const features = subData?.features || [
    'Access Indian Government Acts',
    'Rules & Amendments',
    'Notifications & Updates',
    'Search & Bookmark',
    'Download & Print'
  ];

  const invoices = subData?.invoices || [
    { invoiceNo: 'TRL-INV-0045', plan: 'Yearly', amount: '₹ 4,999', date: '07 Nov 2026', status: 'Paid' },
    { invoiceNo: 'TRL-INV-0038', plan: 'Yearly', amount: '₹ 4,999', date: '07 Nov 2025', status: 'Paid' },
    { invoiceNo: 'TRL-INV-0031', plan: 'Yearly', amount: '₹ 4,999', date: '07 Nov 2024', status: 'Paid' }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Top Banner matching screenshot */}
      <div className="w-full rounded-2xl overflow-hidden shadow-lg border border-[#e2c6f5]">
        <img
          src="/assets/banner_subscription.png"
          alt="Subscription Details - View Your Plan, Validity and Billing Information"
          className="w-full h-auto object-cover select-none"
        />
      </div>

      {/* 2. Top Two-Card Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Card 1: Your Current Plan (~60% / col-span-7) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#ecd9f8] p-6 shadow-sm flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#f3e4fb]">
              <h3 className="font-bold text-base text-[#380352]">Your Current Plan</h3>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white flex items-center space-x-1 shadow-xs">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>{subData?.status || user.status || 'Active'}</span>
              </span>
            </div>

            <div className="flex items-center space-x-5 py-4">
              <img
                src="/assets/sub_gold_wreath.png"
                alt="Gold Crown Wreath"
                className="w-24 h-24 object-contain shrink-0 filter drop-shadow"
              />
              <div className="space-y-1">
                <h4 className="font-bold text-lg text-[#3a0354] font-serif-law">
                  {subData?.plan || user.plan || 'Tamil + English Package'}
                </h4>
                <p className="text-xs text-gray-600">
                  Access to Acts, Rules, Amendments, Notifications & Updates
                </p>
              </div>
            </div>

            {/* Date Details Bar */}
            <div className="grid grid-cols-3 gap-3 p-3.5 bg-[#fcf8fe] border border-[#f0e0fa] rounded-xl text-center">
              <div className="space-y-1">
                <div className="flex items-center justify-center text-purple-700">
                  <Calendar className="w-4 h-4 mr-1 text-[#79159d]" />
                  <span className="text-[11px] font-bold text-gray-500">Plan Start Date</span>
                </div>
                <p className="text-xs font-bold text-[#3d0356]">
                  {subData?.planStartDate || user.planStartDate || '07 Nov 2024'}
                </p>
              </div>

              <div className="space-y-1 border-x border-[#edd8f8]">
                <div className="flex items-center justify-center text-amber-600">
                  <Hourglass className="w-4 h-4 mr-1 text-[#d68a0d]" />
                  <span className="text-[11px] font-bold text-gray-500">Valid Till</span>
                </div>
                <p className="text-xs font-bold text-[#3d0356]">
                  {subData?.validTill || user.validTill || '06 Nov 2027'}
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-center text-orange-600">
                  <Clock className="w-4 h-4 mr-1 text-orange-500" />
                  <span className="text-[11px] font-bold text-gray-500">Remaining</span>
                </div>
                <p className="text-xs font-bold text-[#b4280b]">
                  {subData?.remainingDays || user.remainingDays || 672} Days
                </p>
              </div>
            </div>
          </div>

          {/* Three Management Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
            <button
              onClick={() => setModalMode('manage')}
              className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#4d036a] to-[#7f13ad] hover:from-[#5d047f] hover:to-[#9218c5] text-white text-xs font-bold flex items-center justify-center space-x-1.5 shadow-sm transition-all"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Manage Subscription</span>
            </button>

            <button
              onClick={() => setModalMode('renew')}
              className="py-2.5 px-3 rounded-xl bg-[#faf4fe] hover:bg-[#f3e2fd] border border-[#dcb8f3] text-[#520671] text-xs font-bold flex items-center justify-center space-x-1.5 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#79159d]" />
              <span>Renew Plan</span>
            </button>

            <button
              onClick={() => setModalMode('billing')}
              className="py-2.5 px-3 rounded-xl bg-[#faf4fe] hover:bg-[#f3e2fd] border border-[#dcb8f3] text-[#520671] text-xs font-bold flex items-center justify-center space-x-1.5 transition-all"
            >
              <CreditCard className="w-3.5 h-3.5 text-[#79159d]" />
              <span>Update Billing</span>
            </button>
          </div>
        </div>

        {/* Card 2: Plan Features & Premium Badge (~40% / col-span-5) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#ecd9f8] p-6 shadow-sm flex flex-col justify-between">
          <div className="pb-3 border-b border-[#f3e4fb]">
            <h3 className="font-bold text-base text-[#380352]">Plan Features</h3>
          </div>

          <div className="flex items-center justify-between py-2 gap-4">
            {/* Checklist */}
            <div className="space-y-3">
              {features.map((feat, idx) => (
                <div key={idx} className="flex items-center space-x-2.5">
                  <div className="w-4 h-4 rounded-full bg-[#590479] text-white flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span className="text-xs font-semibold text-[#3d0356]">{feat}</span>
                </div>
              ))}
            </div>

            {/* Premium Seal Emblem */}
            <div className="shrink-0 flex justify-center items-center">
              <img
                src="/assets/sub_premium_seal.png"
                alt="Premium Subscription Badge - Your Legal Research Made Easy"
                className="w-44 h-auto object-contain filter drop-shadow-md"
              />
            </div>
          </div>

          <div className="pt-2 text-center border-t border-[#f7eefd]">
            <span className="text-[11px] font-bold text-purple-800">
              High-Speed Realtime Legal Gazette Synchronized
            </span>
          </div>
        </div>
      </div>

      {/* 3. Bottom Section: Billing History & Need Assistance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Billing History Table (~75% / col-span-9) */}
        <div className="lg:col-span-9 bg-white rounded-2xl border border-[#ecd9f8] p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#f3e4fb]">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-[#79159d]" />
              <h3 className="font-bold text-base text-[#380352]">Billing History</h3>
            </div>
            <button
              onClick={() => alert('All historical invoices loaded')}
              className="text-xs font-bold text-[#6a0793] hover:underline"
            >
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#ebdcf7] text-[#4c0469] font-bold">
                  <th className="pb-3 font-bold">Invoice No.</th>
                  <th className="pb-3 font-bold">Plan</th>
                  <th className="pb-3 font-bold">Amount</th>
                  <th className="pb-3 font-bold">Date</th>
                  <th className="pb-3 font-bold">Status</th>
                  <th className="pb-3 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f7eefd] text-gray-700">
                {invoices.map((inv, idx) => (
                  <tr key={idx} className="hover:bg-[#faf4fe] transition-colors">
                    <td className="py-3.5 font-bold text-[#4c0469] flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-[#d92222]" />
                      <span>{inv.invoiceNo}</span>
                    </td>
                    <td className="py-3.5 font-medium">{inv.plan}</td>
                    <td className="py-3.5 font-bold text-[#3d0356]">{inv.amount}</td>
                    <td className="py-3.5 text-gray-500">{inv.date}</td>
                    <td className="py-3.5">
                      <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <button
                        onClick={() => setSelectedInvoice(inv)}
                        className="p-1.5 rounded-lg hover:bg-purple-100 text-[#79159d] transition-colors"
                        title="Download / View Invoice"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Need Assistance Card (~25% / col-span-3) */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-[#ecd9f8] p-6 shadow-sm flex flex-col items-center justify-between text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#fbf5fe] border border-[#e5cbf5] text-[#79159d] flex items-center justify-center">
            <Headphones className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <h4 className="font-bold text-sm text-[#380352]">Need Assistance?</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Our Support Team is here to help you with your subscription queries.
            </p>
          </div>

          <button
            onClick={() => setSupportModalOpen(true)}
            className="w-full py-2.5 px-4 rounded-full bg-gradient-to-r from-[#4d036a] to-[#7f13ad] hover:from-[#5d047f] hover:to-[#9218c5] text-white text-xs font-bold flex items-center justify-center space-x-2 shadow-sm transition-all"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Contact Support</span>
          </button>
        </div>
      </div>

      {/* Subscription Action Modals */}
      <SubscriptionModal
        mode={modalMode}
        isOpen={Boolean(modalMode)}
        onClose={() => setModalMode(null)}
        onActionSuccess={fetchSubscription}
      />

      <ContactSupportModal
        isOpen={supportModalOpen}
        onClose={() => setSupportModalOpen(false)}
      />

      {/* Invoice View Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#e4ccf5] w-full max-w-lg overflow-hidden animate-scaleUp">
            <div className="bg-gradient-to-r from-[#5a047c] to-[#7f13ad] text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-xs text-yellow-300 font-bold">GST Tax Invoice</span>
                <h3 className="font-bold text-base font-serif-law">{selectedInvoice.invoiceNo}</h3>
              </div>
              <button onClick={() => setSelectedInvoice(null)} className="text-white hover:opacity-80">✕</button>
            </div>
            <div className="p-6 space-y-4 text-xs">
              <div className="flex justify-between border-b pb-3 border-gray-100">
                <div>
                  <span className="text-gray-400 block">Billed To</span>
                  <span className="font-bold text-[#380352] text-sm">{user.name}</span>
                  <span className="text-gray-500 block">{user.email}</span>
                </div>
                <div className="text-right">
                  <span className="text-gray-400 block">Invoice Date</span>
                  <span className="font-bold text-gray-800">{selectedInvoice.date}</span>
                  <span className="text-emerald-700 font-bold block mt-1">PAID</span>
                </div>
              </div>

              <div className="space-y-2 py-2">
                <div className="flex justify-between font-bold text-gray-800">
                  <span>Tamil Raw Library – {selectedInvoice.plan} Package</span>
                  <span>{selectedInvoice.amount}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>GST (18% inclusive)</span>
                  <span>₹ 762</span>
                </div>
              </div>

              <div className="border-t pt-3 flex justify-between font-bold text-sm text-[#4c0469]">
                <span>Total Amount Paid</span>
                <span>{selectedInvoice.amount}</span>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-purple-50 text-[#79159d] font-bold flex items-center space-x-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Invoice</span>
                </button>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="px-4 py-2 rounded-xl bg-[#590479] text-white font-bold"
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
