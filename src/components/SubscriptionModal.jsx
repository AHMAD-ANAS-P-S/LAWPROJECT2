import React, { useState } from 'react';
import { X, Check, ShieldCheck, CreditCard, RefreshCw, AlertCircle, FileText, Download } from 'lucide-react';

export default function SubscriptionModal({ mode = 'manage', isOpen, onClose, onActionSuccess }) {
  const [selectedPlan, setSelectedPlan] = useState('Tamil + English Package');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleRenew = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/subscription/manage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'renew', planType: 'Yearly' })
      });
      const data = await res.json();
      setSuccessMessage('Plan renewed successfully for 1 additional year (valid till 06 Nov 2028)!');
      setTimeout(() => {
        setIsProcessing(false);
        if (onActionSuccess) onActionSuccess();
        onClose();
      }, 1500);
    } catch (e) {
      setIsProcessing(false);
    }
  };

  const handleUpgrade = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/subscription/manage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'upgrade', planName: selectedPlan })
      });
      const data = await res.json();
      setSuccessMessage(`Plan successfully switched to ${selectedPlan}!`);
      setTimeout(() => {
        setIsProcessing(false);
        if (onActionSuccess) onActionSuccess();
        onClose();
      }, 1500);
    } catch (e) {
      setIsProcessing(false);
    }
  };

  const handleBillingUpdate = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      await fetch('/api/subscription/billing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardUpdated: true })
      });
      setSuccessMessage('Billing details updated successfully!');
      setTimeout(() => {
        setIsProcessing(false);
        if (onActionSuccess) onActionSuccess();
        onClose();
      }, 1200);
    } catch (e) {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-[#e4ccf5] w-full max-w-xl overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#5a047c] to-[#7f13ad] text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-yellow-300" />
            <h3 className="font-bold text-lg font-serif-law tracking-wide text-white">
              {mode === 'renew' ? 'Renew Subscription Plan' : mode === 'billing' ? 'Update Billing Information' : 'Manage Subscription'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {successMessage ? (
            <div className="p-6 text-center space-y-3">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
              <h4 className="font-bold text-base text-gray-800">Action Completed</h4>
              <p className="text-xs text-emerald-700 font-medium">{successMessage}</p>
            </div>
          ) : mode === 'billing' ? (
            <form onSubmit={handleBillingUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#4c0469] mb-1">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  defaultValue="AHMAD ANAS P S"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e1ccf3] focus:border-[#7c14a8] text-xs font-semibold outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4c0469] mb-1">
                  Card Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    defaultValue="•••• •••• •••• 4242"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e1ccf3] focus:border-[#7c14a8] text-xs font-semibold outline-none pr-10"
                    required
                  />
                  <CreditCard className="w-4 h-4 absolute right-3 top-3 text-gray-400" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#4c0469] mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    defaultValue="11/28"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e1ccf3] focus:border-[#7c14a8] text-xs outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#4c0469] mb-1">
                    CVV / CVC
                  </label>
                  <input
                    type="password"
                    defaultValue="•••"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e1ccf3] focus:border-[#7c14a8] text-xs outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4c0469] mb-1">
                  GSTIN / Billing Address (Optional)
                </label>
                <input
                  type="text"
                  placeholder="33AAAAA0000A1Z5 / Chennai, Tamil Nadu"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e1ccf3] focus:border-[#7c14a8] text-xs outline-none"
                />
              </div>

              <div className="pt-3 border-t border-[#f1e0fa] flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#5e047f] to-[#7f13ad] text-white text-xs font-bold shadow-md hover:opacity-95"
                >
                  {isProcessing ? 'Saving...' : 'Update Billing'}
                </button>
              </div>
            </form>
          ) : mode === 'renew' ? (
            <div className="space-y-4">
              <div className="bg-[#fbf7fe] p-4 rounded-xl border border-[#ecd9f8] space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700">Renewal Summary</span>
                <div className="flex justify-between items-center text-sm font-bold text-[#4c0469]">
                  <span>Tamil + English Package (Yearly Extension)</span>
                  <span>₹ 4,999 / year</span>
                </div>
                <p className="text-xs text-gray-600">
                  Extends your current validity from 06 Nov 2027 to 06 Nov 2028 with uninterrupted statutory updates.
                </p>
              </div>

              <div className="pt-3 border-t border-[#f1e0fa] flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleRenew}
                  disabled={isProcessing}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#5e047f] to-[#7f13ad] text-white text-xs font-bold shadow-md hover:opacity-95 flex items-center"
                >
                  {isProcessing ? (
                    <RefreshCw className="w-4 h-4 mr-1.5 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4 mr-1.5" />
                  )}
                  {isProcessing ? 'Processing Renewal...' : 'Confirm & Renew Plan'}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-gray-600">
                Select your preferred subscription tier or manage your membership settings:
              </p>

              <div className="space-y-2.5">
                {[
                  { name: 'Tamil + English Package', price: '₹ 4,999 / yr', desc: 'Full Central & State Acts, Rules, Amendments in Tamil & English (Current Plan)' },
                  { name: 'Tamil + English + Judicial Citations Pro', price: '₹ 7,999 / yr', desc: 'Adds Supreme Court & Madras High Court full headnotes & cross-citations' },
                  { name: 'Institutional Corporate Plan', price: '₹ 19,999 / yr', desc: 'Up to 10 multi-user advocates & law chambers with priority gazette tracking' }
                ].map((tier, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedPlan(tier.name)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start justify-between ${
                      selectedPlan === tier.name
                        ? 'border-[#7a0ea6] bg-[#fbf5fe] ring-1 ring-[#7a0ea6]'
                        : 'border-[#ecd9f8] hover:border-[#bf81ea]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-xs text-[#4b0467]">{tier.name}</span>
                        {tier.name.includes('Current Plan') && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-600 mt-1">{tier.desc}</p>
                    </div>
                    <span className="text-xs font-bold text-[#6a0793] whitespace-nowrap ml-3">
                      {tier.price}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-[#f1e0fa] flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => alert('Subscription auto-renew cancelled. Access remains valid until 06 Nov 2027.')}
                  className="text-xs text-red-600 hover:underline font-semibold"
                >
                  Cancel Auto-Renew
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 text-xs font-semibold"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={handleUpgrade}
                    disabled={isProcessing}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#5e047f] to-[#7f13ad] text-white text-xs font-bold shadow-md hover:opacity-95"
                  >
                    {isProcessing ? 'Updating...' : 'Save Plan Changes'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
