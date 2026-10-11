import React, { useState } from 'react';
import { Smartphone, Download, ExternalLink, Check, Copy, Package, ShieldCheck, HelpCircle, X, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface ApkDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApkDownloadModal: React.FC<ApkDownloadModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t, isRtl, formatNumber } = useLanguage();
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [copiedUrl, setCopiedUrl] = useState(false);

  if (!isOpen) return null;

  const currentAppUrl = window.location.origin;
  const pwabuilderUrl = `https://www.pwabuilder.com/reportcard?site=${encodeURIComponent(currentAppUrl)}`;

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(currentAppUrl);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleInstallNow = async () => {
    if (isInstallable) {
      await install();
    } else {
      alert(
        isRtl
          ? 'برای نصب مستقیم روی گوشی اندروید:\n۱. منوی مرورگر کروم (سه نقطه بالا سمت راست) را باز کنید.\n۲. گزینه «نصب برنامه» یا «افزودن به صفحه اصلی» (Install app / Add to Home screen) را بزنید.'
          : 'To install on Android:\n1. Tap the browser menu (3 dots in Chrome)\n2. Select "Install app" or "Add to Home screen".'
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-5 md:p-6 text-slate-100 relative my-auto max-h-[92vh] overflow-y-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">نصب و دریافت فایل APK اندروید</h3>
              <p className="text-[11px] text-slate-400">اپلیکیشن تریپ‌پک · توسعه‌دهنده byhrsn.com</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* METHOD 1: Instant Native Android Install (WebAPK) */}
        <div className="bg-gradient-to-br from-emerald-950/40 to-slate-850 p-4 rounded-2xl border border-emerald-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-500 text-slate-950 text-xs font-black flex items-center justify-center">
                ۱
              </span>
              <h4 className="text-sm font-bold text-emerald-300">
                نصب مستقیم به عنوان برنامه اندروید (پیشنهادی)
              </h4>
            </div>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-semibold border border-emerald-500/30">
              بدون نیاز به دانلود
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            سیستم‌عامل اندروید به‌طور خودکار بسته اختصاصی WebAPK برنامه را روی گوشی شما نصب می‌کند و آیکون آن مانند برنامه‌های کافه‌بازار و گوگل‌پلی در منوی برنامه‌ها قرار می‌گیرد.
          </p>

          <button
            onClick={handleInstallNow}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <Smartphone className="w-4 h-4" />
            <span>نصب آنی برنامه روی گوشی اندروید</span>
          </button>
        </div>

        {/* METHOD 2: PWABuilder Direct APK Generation */}
        <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-750 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-slate-700 text-slate-200 text-xs font-black flex items-center justify-center">
                ۲
              </span>
              <h4 className="text-sm font-bold text-white">
                تولید و دانلود فایل مستقل APK با PWABuilder
              </h4>
            </div>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-[11px] text-amber-300 leading-relaxed space-y-1">
            <strong>نکته مهم در مورد خطای ۴۰۴ در PWABuilder:</strong>
            <p>
              لینک‌های پیش‌نمایش کلودران به دلیل قرار داشتن در محیط امن و خصوصی، توسط ربات‌های خارجی اسکنر مانند PWABuilder قابل دسترسی مستقیم نیستند و خطای 404 می‌دهند. برای رفع این مورد:
            </p>
            <ul className="list-disc list-inside space-y-0.5 pr-1 text-slate-300">
              <li>برای استفاده فوری، از <strong>روش شماره ۱ (نصب مستقیم در کروم گوشی)</strong> استفاده فرمایید.</li>
              <li>یا پس از قرار دادن پروژه روی دامنه اختصاصی خود (مثل byhrsn.com)، لینک دامنه خود را در PWABuilder وارد نمایید.</li>
            </ul>
          </div>

          <a
            href={pwabuilderUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 bg-slate-750 hover:bg-slate-700 border border-slate-650 text-slate-100 font-semibold rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>تولید و دانلود فایل خام APK با PWABuilder</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
        </div>

        {/* METHOD 3: Android Studio & Source Package */}
        <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-800 space-y-2.5">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-slate-700 text-slate-300 text-xs font-black flex items-center justify-center">
              ۳
            </span>
            <h4 className="text-xs font-bold text-slate-300">
              مشخصات پکیج پروژه اندروید استودیو (Native Wrapper)
            </h4>
          </div>

          <div className="text-[11px] text-slate-400 space-y-1 font-mono bg-slate-950/60 p-2.5 rounded-xl border border-slate-800" dir="ltr">
            <div>Package: com.byhrsn.trippack</div>
            <div>Min SDK: 21 (Android 5.0+)</div>
            <div>Target SDK: 34 (Android 14)</div>
            <div>Manifest: /public/twa-manifest.json</div>
            <div>AssetLinks: /.well-known/assetlinks.json</div>
          </div>
        </div>

        {/* Android Installation Instructions */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 text-xs text-slate-400 space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-slate-300 text-xs">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>راهنمای نصب دستی در مرورگر کروم موبایل:</span>
          </div>
          <ol className="list-decimal list-inside space-y-1 text-[11px] leading-relaxed pr-1 text-slate-300">
            <li>آدرس سایت را در مرورگر کروم یا سامسونگ اینترنت گوشی خود باز کنید.</li>
            <li>روی منوی ۳ نقطه در گوشه بالا یا پایین مرورگر بزنید.</li>
            <li>گزینه «نصب برنامه» یا «افزودن به صفحه اصلی (Add to Home screen)» را لمس کنید.</li>
            <li>برنامه به صورت مستقل و بدون نوار آدرس مرورگر فعال می‌شود.</li>
          </ol>
        </div>

        {/* Footer Credit */}
        <div className="pt-2 text-center border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <a
            href="https://byhrsn.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 hover:underline font-semibold"
          >
            توسعه‌دهنده: byhrsn.com
          </a>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-xl transition cursor-pointer"
          >
            بستن پنجره
          </button>
        </div>
      </div>
    </div>
  );
};
