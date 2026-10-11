import React, { useState } from 'react';
import { Smartphone, Download, X, ExternalLink } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useLanguage } from '../context/LanguageContext';

export const PWAInstallBanner: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const { t } = useLanguage();
  const [dismissed, setDismissed] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled || dismissed) return null;

  return (
    <>
      {/* Android / Chromium Install Bar */}
      {isInstallable && (
        <div className="no-print bg-gradient-to-r from-emerald-600/20 to-teal-600/20 border-b border-emerald-500/30 px-3.5 py-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-200 font-medium">
              نصب نسخه اندروید تریپ‌پک روی گوشی
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={install}
              className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs transition cursor-pointer"
            >
              نصب برنامه
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* iOS Safari banner */}
      {isIOS && !isInstallable && (
        <div className="no-print bg-slate-800/80 border-b border-slate-700/80 px-3.5 py-2 flex items-center justify-between text-xs">
          <span className="text-slate-300">افزودن به صفحه اصلی گوشی</span>
          <button
            onClick={() => setShowIOSGuide(true)}
            className="text-emerald-400 hover:underline font-semibold cursor-pointer"
          >
            راهنمای نصب
          </button>
        </div>
      )}

      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-2xl text-slate-100">
            <h4 className="text-sm font-bold text-white mb-2">نصب روی صفحه اصلی</h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              ۱. در منوی مرورگر سافاری روی آیکون <strong>اشتراک‌گذاری (Share)</strong> بزنید.<br />
              ۲. گزینه <strong>Add to Home Screen</strong> را انتخاب فرمایید.
            </p>
            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-xl text-xs font-semibold cursor-pointer"
            >
              متوجه شدم
            </button>
          </div>
        </div>
      )}
    </>
  );
};
