import React, { useState } from 'react';
import { Compass, Plus, Calendar, MapPin, Check, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Trip } from '../types';

interface TripSelectorProps {
  trips: Trip[];
  activeTripId: string;
  onSelectTrip: (tripId: string) => void;
  onCreateTrip: (newTrip: Omit<Trip, 'id' | 'items'>) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const TripSelector: React.FC<TripSelectorProps> = ({
  trips,
  activeTripId,
  onSelectTrip,
  onCreateTrip,
  isOpen,
  onClose,
}) => {
  const { t, isRtl, formatNumber } = useLanguage();
  const [isCreating, setIsCreating] = useState(false);
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-5 md:p-6 text-slate-100 relative my-auto max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">مدیریت سفرهای من</h3>
            <p className="text-[11px] text-slate-400">انتخاب سفر جاری یا ایجاد سفر جدید</p>
          </div>
        </div>

        {!isCreating ? (
          <div className="space-y-3">
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {trips.map((trip) => {
                const isActive = trip.id === activeTripId;
                const packed = trip.items.filter((i) => i.isPacked).length;
                const total = trip.items.length;
                return (
                  <button
                    key={trip.id}
                    onClick={() => {
                      onSelectTrip(trip.id);
                      onClose();
                    }}
                    className={`w-full text-right p-3.5 rounded-2xl border transition flex items-center justify-between cursor-pointer ${
                      isActive
                        ? 'bg-emerald-500/15 border-emerald-500 text-white'
                        : 'bg-slate-800/70 border-slate-750 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs truncate">{trip.title}</span>
                        {isActive && (
                          <span className="text-[10px] bg-emerald-500 text-slate-950 font-extrabold px-1.5 py-0.2 rounded-md">
                            فعال
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">{trip.destination}</span>
                        </span>
                        <span>·</span>
                        <span className="text-emerald-400">
                          {formatNumber(packed)}/{formatNumber(total)} وسیله
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
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
