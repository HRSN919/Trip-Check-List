import React, { useState } from 'react';
import { ExternalLink, Heart, X, Globe, Mail, Copy, Check, MessageSquare } from 'lucide-react';
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
  const [copiedEmail, setCopiedEmail] = useState(false);

  if (!isOpen) return null;

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(DEVELOPER_DONATION_CARD.contactEmail);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 text-slate-100 relative my-auto space-y-5">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition cursor-pointer"
          aria-label="بستن"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shadow-inner">
            <Heart className="w-6 h-6 fill-amber-400/20 text-amber-400" />
          </div>
          <div>
            <h3 className="text-base md:text-lg font-bold text-white">{t.donateTitle}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{t.donateSubtitle}</p>
          </div>
        </div>

        {/* Content Box */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-850 via-slate-900 to-emerald-950/40 p-5 md:p-6 border border-emerald-500/25 shadow-xl text-slate-200 space-y-4">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Top Badge */}
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-semibold text-emerald-400">
              <Globe className="w-3.5 h-3.5" />
              <span>وب‌سایت رسمی سازنده</span>
            </span>
            <span className="text-xs font-mono text-slate-400 tracking-wider">
              {DEVELOPER_DONATION_CARD.developerDomain}
            </span>
          </div>

          {/* Persian Polite Statement */}
          <div className="text-sm leading-relaxed text-slate-300 space-y-3 pt-1">
            <p className="font-semibold text-emerald-300">
              کاربر و همراه گرامی،
            </p>
            <p className="text-justify leading-7 text-xs md:text-sm">
              اپلیکیشن چک‌لیست تجهیزات سفر و کمپینگ (TripPack) با هدف ایجاد ابزاری دقیق، سریع و رایگان برای دوست‌داران طبیعت‌گردی، سفر و کوهنوردی توسعه یافته است.
            </p>
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs md:text-sm leading-6 text-amber-200/90 flex items-start gap-2.5">
              <MessageSquare className="w-4 h-4 text-amber-400 mt-1 shrink-0" />
              <p>
                در صورتی که علاقه‌مند به <strong>حمایت مالی</strong>، مشارکت در نگهداری سرور یا ارائه پیشنهادات همکاری هستید، خواهشمندیم از طریق <strong>وب‌سایت رسمی ما</strong> پیام ارسال فرمایید تا هماهنگی‌های لازم با کمال میل خدمت شما انجام شود.
              </p>
            </div>
          </div>

          {/* Website Action Button */}
          <div className="pt-2">
            <a
              href={DEVELOPER_DONATION_CARD.developerWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-2xl text-sm transition shadow-lg shadow-emerald-500/20 active:scale-98 cursor-pointer"
            >
              <Globe className="w-4 h-4" />
              <span>ارتباط و ارسال پیام در وب‌سایت byhrsn.com</span>
              <ExternalLink className="w-4 h-4 mr-1" />
            </a>
          </div>
        </div>

        {/* Email Direct Contact Option */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800/80 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Mail className="w-4 h-4 text-slate-400" />
            <span>ایمیل مستقیم:</span>
            <span className="font-mono text-emerald-400 font-semibold dir-ltr">{DEVELOPER_DONATION_CARD.contactEmail}</span>
          </div>
          <button
            type="button"
            onClick={handleCopyEmail}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition cursor-pointer"
          >
            {copiedEmail ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">کپی شد!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>کپی ایمیل</span>
              </>
            )}
          </button>
        </div>

        {/* Thank You Note */}
        <div className="text-center pt-1 text-slate-400 text-xs">
          <span>با سپاس صمیمانه از حسن توجه و همراهی ارزشمند شما ❤️</span>
        </div>
      </div>
    </div>
  );
};
