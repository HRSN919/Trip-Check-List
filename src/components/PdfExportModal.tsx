import React, { useState } from 'react';
import { Printer, Download, CheckSquare, Square, FileText, X, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Trip, UserProfile } from '../types';
import { CATEGORY_METADATA } from '../data/initialData';
import { generateTripPdf, triggerBrowserPrint } from '../utils/pdfGenerator';

interface PdfExportModalProps {
  trip: Trip;
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
}

export const PdfExportModal: React.FC<PdfExportModalProps> = ({
  trip,
  user,
  isOpen,
  onClose,
}) => {
  const { t, isRtl, formatNumber } = useLanguage();
  const [includeOnlyUnpacked, setIncludeOnlyUnpacked] = useState(false);

  if (!isOpen) return null;

  const filteredItems = includeOnlyUnpacked
    ? trip.items.filter((item) => !item.isPacked)
    : trip.items;

  const packedCount = trip.items.filter((i) => i.isPacked).length;
  const totalCount = trip.items.length;
  const totalWeightKg = (
    trip.items.reduce((sum, i) => sum + (i.weightGrams || 0), 0) / 1000
  ).toFixed(1);

  const handleDownloadPdf = () => {
    generateTripPdf(trip, {
      includePacked: !includeOnlyUnpacked,
      includeWeights: true,
      includeNotes: true,
      language: isRtl ? 'fa' : 'en',
    });
  };

  const handlePrint = () => {
    triggerBrowserPrint();
  };

  // Group items by category
  const groupedItems = filteredItems.reduce<Record<string, typeof trip.items>>((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-5 md:p-6 text-slate-100 relative my-auto max-h-[94vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0 no-print">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{t.printPdfTitle}</h3>
              <p className="text-xs text-slate-400">{t.printPdfSubtitle}</p>
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

        {/* Action Buttons Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 py-3 border-b border-slate-800 shrink-0 no-print">
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition shadow-md shadow-emerald-500/20 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{t.downloadPdfButton}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-semibold rounded-xl text-xs transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>{t.browserPrintButton}</span>
            </button>
          </div>

          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={includeOnlyUnpacked}
              onChange={(e) => setIncludeOnlyUnpacked(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-500 accent-emerald-500 cursor-pointer"
            />
            <span>فقط اقلام باقی‌مانده ({formatNumber(totalCount - packedCount)})</span>
          </label>
        </div>

        {/* Scrollable Printable A4 Sheet Preview */}
        <div className="flex-1 overflow-y-auto my-3 p-4 md:p-6 bg-white text-slate-900 rounded-2xl shadow-inner border border-slate-300 print-page-container">
          {/* Header */}
          <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-950">
                  TRIPPACK · چک‌لیست تجهیزات سفر
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                توسعه‌دهنده: byhrsn.com · سامانه هوشمند مدیریت کوله‌پشتی
              </p>
            </div>
            <div className="text-left text-xs text-slate-600 font-mono" dir="ltr">
              <div>{new Date().toLocaleDateString('fa-IR')}</div>
              <div className="text-[10px] text-slate-400 font-sans">byhrsn.com</div>
            </div>
          </div>

          {/* Trip Info Strip */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 mb-4 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            <div>
              <span className="text-slate-500 block text-[10px]">عنوان سفر:</span>
              <strong className="text-slate-900 truncate block">{trip.title}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">مقصد:</span>
              <span className="text-slate-800">{trip.destination || '-'}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">مسافر / سرپرست:</span>
              <span className="text-slate-800">{user.displayName || user.phoneNumber || 'مسافر'}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">وضعیت کوله:</span>
              <span className="text-emerald-700 font-bold">
                {formatNumber(packedCount)}/{formatNumber(totalCount)} مورد ({formatNumber(totalWeightKg)} کیلوگرم)
              </span>
            </div>
          </div>

          {/* Grouped Table */}
          <div className="space-y-4">
            {Object.keys(groupedItems).map((catKey) => {
              const meta = CATEGORY_METADATA[catKey as keyof typeof CATEGORY_METADATA];
              const items = groupedItems[catKey];
              return (
                <div key={catKey} className="print-page-break">
                  <div className="flex items-center justify-between border-b border-slate-300 pb-1 mb-2">
                    <span className="text-xs font-bold text-slate-800">
                      {isRtl ? meta?.faLabel : meta?.enLabel} ({formatNumber(items.length)})
                    </span>
                  </div>

                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="text-slate-500 text-[10px] border-b border-slate-200">
                        <th className="w-8 py-1">تایید</th>
                        <th className="py-1">عنوان تجهیزات</th>
                        <th className="w-12 text-center py-1">تعداد</th>
                        <th className="w-16 text-center py-1">وزن</th>
                        <th className="w-20 text-center py-1">اهمیت</th>
                        <th className="py-1">یادداشت</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {items.map((item) => (
                        <tr key={item.id} className="py-1.5">
                          <td className="py-1.5 align-middle">
                            <span className="w-4 h-4 border border-slate-400 inline-block text-center text-[10px] leading-tight font-bold rounded-xs">
                              {item.isPacked ? '✓' : ''}
                            </span>
                          </td>
                          <td className="py-1.5 font-medium text-slate-900">
                            {item.name}
                          </td>
                          <td className="py-1.5 text-center font-mono" dir="ltr">
                            {formatNumber(item.quantity)}
                          </td>
                          <td className="py-1.5 text-center font-mono text-slate-600" dir="ltr">
                            {item.weightGrams ? `${formatNumber(item.weightGrams)}g` : '-'}
                          </td>
                          <td className="py-1.5 text-center">
                            <span className="text-[10px] text-slate-600">
                              {item.priority === 'essential'
                                ? 'ضروری'
                                : item.priority === 'recommended'
                                ? 'پیشنهادی'
                                : 'اختیاری'}
                            </span>
                          </td>
                          <td className="py-1.5 text-slate-500 text-[11px]">
                            {item.notes || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })}
          </div>

          {/* Footer Notes & Credit */}
          <div className="mt-6 pt-3 border-t border-slate-300 flex justify-between items-center text-[11px] text-slate-500">
            <div>
              <span>چک‌لیست رسمی سفر · تهیه شده با تریپ‌پک</span>
            </div>
            <div className="font-semibold text-slate-700">
              وب‌سایت توسعه‌دهنده: byhrsn.com
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-2 flex justify-between items-center text-xs text-slate-400 no-print">
          <span>برای چاپ با کیفیت بالا می‌توانید مستقیماً دکمه دانلود PDF را بزنید.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-xl transition cursor-pointer"
          >
            بستن پنجره
          </button>
        </div>
      </div>
    </div>
  );
};
