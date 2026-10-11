import React, { useState } from 'react';
import { CreditCard, Copy, Check, ExternalLink, Heart, Sparkles, Receipt, ArrowRight, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../context/LanguageContext';
import { DEVELOPER_DONATION_CARD } from '../data/initialData';

interface CardDonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CardDonationModal: React.FC<CardDonationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t, isRtl, formatNumber } = useLanguage();
  const [copiedType, setCopiedType] = useState<'card' | 'shaba' | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<number>(100000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [supportNote, setSupportNote] = useState<string>('');
  const [receiptData, setReceiptData] = useState<{
    amount: number;
    refCode: string;
    date: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleCopyCard = async () => {
    try {
      await navigator.clipboard.writeText(DEVELOPER_DONATION_CARD.cardNumber.replace(/-/g, ''));
      setCopiedType('card');
      setTimeout(() => setCopiedType(null), 2500);
    } catch {
      // Fallback
    }
  };

  const handleCopyShaba = async () => {
    try {
      await navigator.clipboard.writeText(DEVELOPER_DONATION_CARD.shabaNumber);
      setCopiedType('shaba');
      setTimeout(() => setCopiedType(null), 2500);
    } catch {
      // Fallback
    }
  };

  const handleSimulateDonation = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmount = customAmount ? parseInt(customAmount, 10) : selectedAmount;
    if (!finalAmount || isNaN(finalAmount)) return;

    // Trigger confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#0284c7', '#f59e0b', '#ec4899'],
      });
    } catch {
      // ignore
    }

    const randomRef = 'REF-' + Math.floor(10000000 + Math.random() * 90000000);
    setReceiptData({
      amount: finalAmount,
      refCode: randomRef,
      date: new Date().toLocaleDateString(isRtl ? 'fa-IR' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    });
  };

  const BackIcon = isRtl ? ArrowRight : ArrowLeft;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-5 md:p-6 text-slate-100 relative my-auto max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 cursor-pointer"
          aria-label="Close"
        >
          ✕
        </button>

        {receiptData ? (
          /* RECEIPT VIEW */
          <div className="text-center space-y-4 pt-4">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <Check className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold text-white">{t.supportSuccessMessage}</h3>
            <p className="text-xs text-slate-400">
              حمایت شما مستقیماً صرف توسعه و به‌روزرسانی ابزارهای رایگان کوهنوردی و سفر می‌شود.
            </p>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 text-sm space-y-2.5 text-right">
              <div className="flex justify-between items-center text-xs text-slate-400 border-b border-slate-700/60 pb-2">
                <span>{t.transferReceipt}</span>
                <span className="font-mono">{formatNumber(receiptData.date)}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">مبلغ حمایت:</span>
                <span className="font-bold text-emerald-400 text-base">
                  {formatNumber(receiptData.amount.toLocaleString())} {t.currency}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">{t.refCode}:</span>
                <span className="font-mono text-slate-300" dir="ltr">{receiptData.refCode}</span>
              </div>
              <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-700/60">
                <span className="text-slate-400">سایت توسعه‌دهنده:</span>
                <a
                  href="https://byhrsn.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:underline font-semibold flex items-center gap-1"
                >
                  <span>byhrsn.com</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <button
              onClick={() => {
                setReceiptData(null);
                onClose();
              }}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm transition cursor-pointer"
            >
              بستن و بازگشت به چک‌لیست
            </button>
          </div>
        ) : (
          /* DONATION TO CARD VIEW */
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                <Heart className="w-5 h-5 fill-amber-400/20 text-amber-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{t.donateTitle}</h3>
                <p className="text-[11px] text-slate-400">{t.donateSubtitle}</p>
              </div>
            </div>

            {/* REALISTIC SHETAB / BANK CARD UI */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 via-slate-850 to-emerald-950 p-4 border border-emerald-500/30 shadow-xl text-white">
              <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

              {/* Card Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-5 bg-amber-400/80 rounded-sm flex items-center justify-center shadow-inner">
                    <div className="w-5 h-3 border border-amber-800/40 rounded-xs grid grid-cols-2 gap-0.5 p-0.5">
                      <div className="bg-amber-300/40"></div>
                      <div className="bg-amber-300/40"></div>
                    </div>
                  </div>
                  <span className="text-[10px] tracking-wider text-emerald-300 font-semibold uppercase">
                    Shetab Card
                  </span>
                </div>
                <span className="text-xs font-bold text-slate-300">
                  {DEVELOPER_DONATION_CARD.bankName}
                </span>
              </div>

              {/* 16-Digit Card Number */}
              <div className="my-3 text-center" dir="ltr">
                <span className="font-mono text-base md:text-lg font-bold tracking-widest text-emerald-400 drop-shadow">
                  {DEVELOPER_DONATION_CARD.cardNumber}
                </span>
              </div>

              {/* Card Footer */}
              <div className="flex items-end justify-between pt-1 border-t border-slate-700/50 text-[11px]">
                <div className="text-right">
                  <span className="text-[10px] text-emerald-300 font-semibold">کارت فعال شبکه شتاب</span>
                </div>
                <div className="text-left" dir="ltr">
                  <span className="text-[9px] text-slate-400 block mb-0.5">Developer Site:</span>
                  <a
                    href={DEVELOPER_DONATION_CARD.developerWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-emerald-300 hover:underline flex items-center gap-1"
                  >
                    <span>byhrsn.com</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Copy Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={handleCopyCard}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl text-xs font-semibold text-slate-200 transition active:scale-98 cursor-pointer"
              >
                {copiedType === 'card' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">{t.copiedSuccess}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>{t.copyCardNumber}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleCopyShaba}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl text-xs font-semibold text-slate-200 transition active:scale-98 cursor-pointer"
              >
                {copiedType === 'shaba' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">{t.copiedSuccess}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>{t.copyShaba}</span>
                  </>
                )}
              </button>
            </div>

            {/* Shaba display */}
            <div className="bg-slate-800/40 rounded-xl p-2.5 text-[11px] flex items-center justify-between border border-slate-800">
              <span className="text-slate-400">شماره شبا:</span>
              <span className="font-mono text-slate-300 font-semibold" dir="ltr">
                {DEVELOPER_DONATION_CARD.shabaNumber}
              </span>
            </div>

            {/* Simulated Payment / Support Form */}
            <form onSubmit={handleSimulateDonation} className="space-y-3 pt-1 border-t border-slate-800">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  {t.presetAmounts}
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[50000, 100000, 200000, 500000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => {
                        setSelectedAmount(amt);
                        setCustomAmount('');
                      }}
                      className={`py-2 px-1 text-center rounded-xl text-xs font-semibold transition cursor-pointer ${
                        selectedAmount === amt && !customAmount
                          ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-750 border border-slate-700'
                      }`}
                    >
                      {formatNumber(amt >= 1000 ? `${amt / 1000} هزار` : amt)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">
                  یا مبلغ دلخواه ({t.currency})
                </label>
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="مثال: 150000"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-xl text-xs transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>{t.simulateTransfer}</span>
              </button>
            </form>

            {/* Developer Site Outlink Banner */}
            <div className="pt-2 text-center">
              <a
                href={DEVELOPER_DONATION_CARD.developerWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 transition-colors font-semibold"
              >
                <span>{t.visitDeveloperSite}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
