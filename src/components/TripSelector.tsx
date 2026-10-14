import React, { useState } from 'react';
import { Compass, Plus, MapPin, X, Trash2, AlertTriangle, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Trip } from '../types';

interface TripSelectorProps {
  trips: Trip[];
  activeTripId: string;
  onSelectTrip: (tripId: string) => void;
  onCreateTrip: (newTrip: Omit<Trip, 'id' | 'items'>) => void;
  onDeleteTrip: (tripId: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const TripSelector: React.FC<TripSelectorProps> = ({
  trips,
  activeTripId,
  onSelectTrip,
  onCreateTrip,
  onDeleteTrip,
  isOpen,
  onClose,
}) => {
  const { t, isRtl, formatNumber } = useLanguage();
  const [isCreating, setIsCreating] = useState(false);
  const [tripToDelete, setTripToDelete] = useState<Trip | null>(null);
  const [title, setTitle] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [tripType, setTripType] = useState<Trip['tripType']>('camping');

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onCreateTrip({
      title: title.trim(),
      destination: destination.trim(),
      startDate: startDate || new Date().toLocaleDateString(isRtl ? 'fa-IR' : 'en-US'),
      endDate: endDate || '',
      tripType,
      notes: '',
    });

    setTitle('');
    setDestination('');
    setStartDate('');
    setEndDate('');
    setIsCreating(false);
    onClose();
  };

  const handleConfirmDelete = () => {
    if (!tripToDelete) return;
    const idToDelete = tripToDelete.id;
    setTripToDelete(null);
    onDeleteTrip(idToDelete);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-5 md:p-6 text-slate-100 relative my-auto max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => {
            setTripToDelete(null);
            setIsCreating(false);
            onClose();
          }}
          className="absolute top-4 left-4 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 cursor-pointer transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              {tripToDelete ? t.confirmDeleteTripTitle : t.tripsManagement}
            </h3>
            <p className="text-[11px] text-slate-400">
              {tripToDelete ? t.confirmDeleteTripPrompt : t.tripsSubtitle}
            </p>
          </div>
        </div>

        {/* DIALOG 1: CONFIRMATION TO DELETE TRIP */}
        {tripToDelete ? (
          <div className="space-y-4 pt-1 animate-fadeIn">
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-center space-y-2.5">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto shadow-inner">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-rose-200">
                {t.confirmDeleteTripPrompt}
              </h4>
              <p className="text-xs font-extrabold text-white bg-slate-950/40 py-1.5 px-3 rounded-lg inline-block border border-rose-500/20">
                «{tripToDelete.title}»
              </p>
              <p className="text-[11px] text-slate-300 leading-relaxed text-right md:text-center">
                {t.confirmDeleteTripWarning}
              </p>
              <div className="text-[11px] text-slate-400 pt-1">
                تعداد اقلام این سفر:{' '}
                <span className="text-amber-400 font-bold">
                  {formatNumber(tripToDelete.items.length)}
                </span>{' '}
                وسیله
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setTripToDelete(null)}
                className="w-1/2 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold rounded-xl text-xs transition cursor-pointer border border-slate-750"
              >
                {t.cancel}
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="w-1/2 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-rose-950/50 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>{t.confirmDeleteTripBtn}</span>
              </button>
            </div>
          </div>
        ) : !isCreating ? (
          /* LIST OF TRIPS */
          <div className="space-y-3">
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {trips.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400 bg-slate-800/40 rounded-2xl border border-slate-800">
                  هیچ سفری یافت نشد. می‌توانید با دکمه زیر سفر جدیدی ایجاد کنید.
                </div>
              ) : (
                trips.map((trip) => {
                  const isActive = trip.id === activeTripId;
                  const packed = trip.items.filter((i) => i.isPacked).length;
                  const total = trip.items.length;
                  return (
                    <div
                      key={trip.id}
                      className={`w-full p-3 rounded-2xl border transition flex items-center justify-between gap-2.5 ${
                        isActive
                          ? 'bg-emerald-500/15 border-emerald-500/70 text-white'
                          : 'bg-slate-800/70 border-slate-750 text-slate-300 hover:bg-slate-800/90'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          onSelectTrip(trip.id);
                          onClose();
                        }}
                        className="flex-1 text-right space-y-1 min-w-0 cursor-pointer"
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs truncate">{trip.title}</span>
                          {isActive && (
                            <span className="text-[10px] bg-emerald-500 text-slate-950 font-extrabold px-1.5 py-0.2 rounded-md shrink-0">
                              فعال
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400">
                          <span className="flex items-center gap-1 min-w-0 truncate">
                            <MapPin className="w-3 h-3 shrink-0" />
                            <span className="truncate">{trip.destination || 'بدون مقصد'}</span>
                          </span>
                          <span>·</span>
                          <span className="text-emerald-400 shrink-0 font-medium">
                            {formatNumber(packed)}/{formatNumber(total)} وسیله
                          </span>
                        </div>
                      </button>

                      {/* Delete Trip Button with Confirm Prompt */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setTripToDelete(trip);
                        }}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/15 transition cursor-pointer shrink-0"
                        title={t.deleteTrip}
                        aria-label={`${t.deleteTrip} ${trip.title}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            <button
              onClick={() => setIsCreating(true)}
              className="w-full py-3 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-400 font-bold rounded-2xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>ایجاد سفر و چک‌لیست جدید</span>
            </button>
          </div>
        ) : (
          /* CREATE TRIP FORM */
          <form onSubmit={handleCreate} className="space-y-3 pt-1">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                عنوان سفر *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثال: صعود زمستانه توچال یا کمپینگ شمال"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                autoFocus
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                مقصد
              </label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="مثال: ییلاقات ماسال یا قله دماوند"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  تاریخ حرکت
                </label>
                <input
                  type="text"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  placeholder="۱۴۰۳/۰۹/۰۱"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  تاریخ برگشت
                </label>
                <input
                  type="text"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  placeholder="۱۴۰۳/۰۹/۰۴"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="w-1/3 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold rounded-xl text-xs transition cursor-pointer"
              >
                انصراف
              </button>
              <button
                type="submit"
                className="w-2/3 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                ایجاد و شروع چک‌لیست
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
