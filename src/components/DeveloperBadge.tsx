import React from 'react';
import { ExternalLink, Heart, Shield } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface DeveloperBadgeProps {
  onOpenDonate: () => void;
  onOpenApk: () => void;
}

export const DeveloperBadge: React.FC<DeveloperBadgeProps> = ({ onOpenDonate, onOpenApk }) => {
  const { t } = useLanguage();

  return (
    <div className="no-print mx-4 my-6 p-4 rounded-3xl bg-slate-900/60 border border-slate-800/80 text-center space-y-2">
      <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
        <span>توسعه‌دهنده رسمی:</span>
        <a
          href="https://byhrsn.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-400 font-bold hover:underline inline-flex items-center gap-1"
        >
          <span>byhrsn.com</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      <p className="text-[11px] text-slate-400 leading-relaxed">
        تریپ‌پک ابزاری سبک و سریع برای مدیریت تجهیزات کمپینگ، کوهنوردی و سفرهای ماجراجویانه است.
      </p>

      <div className="pt-1 flex items-center justify-center gap-3 text-xs">
        <button
          onClick={onOpenApk}
          className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer"
        >
          <span>دریافت و نصب APK</span>
        </button>
        <span className="text-slate-600">·</span>
        <button
          onClick={onOpenDonate}
          className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
        >
          <Heart className="w-3.5 h-3.5 fill-amber-400/20" />
          <span>حمایت مالی به شماره کارت</span>
        </button>
        <span className="text-slate-600">·</span>
        <a
          href="https://byhrsn.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-400 hover:text-white"
        >
          سایت سازنده
        </a>
      </div>
    </div>
  );
};
