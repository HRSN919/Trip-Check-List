import React, { useState } from 'react';
import { Copy, Check, ExternalLink, Heart, X } from 'lucide-react';
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
  const { t } = useLanguage();
  const [copiedCard, setCopiedCard] = useState(false);

  if (!isOpen) return null;

  const handleCopyCard = async () => {
    try {
      await navigator.clipboard.writeText(DEVELOPER_DONATION_CARD.cardNumber.replace(/-/g, ''));
      setCopiedCard(true);
      setTimeout(() => setCopiedCard(false), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-5 md:p-6 text-slate-100 relative my-auto space-y-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title Header */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
            <Heart className="w-5 h-5 fill-amber-400/20 text-amber-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">{t.donateTitle}</h3>
            <p className="text-[11px] text-slate-400">{t.donateSubtitle}</p>
          </div>
        </div>

        {/* SHETAB BANK CARD UI */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 via-slate-850 to-emerald-950 p-5 border border-emerald-500/30 shadow-xl text-white">
          <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

          {/* Card Top Header: Gold Chip & Network */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-6 bg-amber-400/80 rounded-md flex items-center justify-center shadow-inner">
                <div className="w-6 h-4 border border-amber-800/40 rounded-xs grid grid-cols-2 gap-0.5 p-0.5">
                  <div className="bg-amber-300/40"></div>
                  <div className="bg-amber-300/40"></div>
                </div>
              </div>
              <span className="text-[11px] tracking-wider text-emerald-300 font-semibold uppercase">
                Shetab Card
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">کارت بانکی</span>
          </div>

          {/* 16-Digit Card Number */}
          <div className="my-5 text-center" dir="ltr">
            <span className="font-mono text-lg md:text-xl font-bold tracking-widest text-emerald-400 drop-shadow">
              {DEVELOPER_DONATION_CARD.cardNumber}
            </span>
          </div>

          {/* Card Footer: Developer Site */}
          <div className="flex items-end justify-between pt-2 border-t border-slate-700/50 text-[11px]">
            <div className="text-right">
              <span className="text-[10px] text-emerald-300/80 font-medium">عضو شبکه شتاب</span>
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

        {/* Copy Card Number Button */}
        <button
          type="button"
          onClick={handleCopyCard}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-2xl text-xs transition active:scale-98 shadow-lg shadow-emerald-500/20 cursor-pointer"
        >
          {copiedCard ? (
            <>
              <Check className="w-4 h-4 text-slate-950" />
              <span>{t.copiedSuccess}</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-slate-950" />
              <span>{t.copyCardNumber}</span>
            </>
          )}
        </button>

        {/* Informational Support Note */}
        <div className="bg-slate-800/40 rounded-2xl p-3.5 text-xs text-slate-400 border border-slate-800 text-center leading-relaxed">
          <p>
            با انتقال وجه به شماره کارت فوق، از توسعه، نگهداری و به‌روزرسانی ابزارهای رایگان سفر و کوهنوردی حمایت می‌کنید.
          </p>
        </div>

        {/* Developer Site Outlink Banner */}
        <div className="pt-2 text-center border-t border-slate-800">
          <a
            href={DEVELOPER_DONATION_CARD.developerWebsite}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 transition-colors font-semibold"
          >
            <span>مشاهده وب‌سایت توسعه‌دهنده (byhrsn.com)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
