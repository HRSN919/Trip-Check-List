import React, { useState, useMemo } from 'react';
import {
  Search,
  CheckCircle2,
  Circle,
  Trash2,
  Plus,
  Weight,
  Sparkles,
  RotateCcw,
  CheckCheck,
  ChevronDown,
  Info,
  Layers,
  X,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { TripItem, CategoryId, PriorityLevel } from '../types';
import { CATEGORY_METADATA, QUICK_ADD_SUGGESTIONS } from '../data/initialData';

interface EquipmentListProps {
  items: TripItem[];
  onTogglePacked: (itemId: string) => void;
  onRemoveItem: (itemId: string) => void;
  onUpdateQuantity: (itemId: string, delta: number) => void;
  onQuickAddItem: (suggestion: typeof QUICK_ADD_SUGGESTIONS[0]) => void;
  onOpenAddModal: () => void;
  onMarkAllPacked: () => void;
  onResetStatus: () => void;
  onRemoveCompleted: () => void;
}

export const EquipmentList: React.FC<EquipmentListProps> = ({
  items,
  onTogglePacked,
  onRemoveItem,
  onUpdateQuantity,
  onQuickAddItem,
  onOpenAddModal,
  onMarkAllPacked,
  onResetStatus,
  onRemoveCompleted,
}) => {
  const { t, isRtl, formatNumber } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');
  const [filterPacked, setFilterPacked] = useState<'all' | 'packed' | 'unpacked'>('all');
  const [showBatchMenu, setShowBatchMenu] = useState(false);

  // Filtered Items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      // Status filter
      if (filterPacked === 'packed' && !item.isPacked) return false;
      if (filterPacked === 'unpacked' && item.isPacked) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesNotes = item.notes?.toLowerCase().includes(query);
        if (!matchesName && !matchesNotes) return false;
      }

      return true;
    });
  }, [items, selectedCategory, filterPacked, searchQuery]);

  // Statistics
  const totalCount = items.length;
  const packedCount = items.filter((i) => i.isPacked).length;
  const readyPercent = totalCount > 0 ? Math.round((packedCount / totalCount) * 100) : 0;
  const totalWeightKg = (
    items.reduce((sum, i) => sum + (i.weightGrams || 0), 0) / 1000
  ).toFixed(1);
  const packedWeightKg = (
    items
      .filter((i) => i.isPacked)
      .reduce((sum, i) => sum + (i.weightGrams || 0), 0) / 1000
  ).toFixed(1);

  const getPriorityBadge = (priority: PriorityLevel) => {
    switch (priority) {
      case 'essential':
        return {
          text: t.essential,
          class: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
        };
      case 'recommended':
        return {
          text: t.recommended,
          class: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
        };
      case 'optional':
        return {
          text: t.optional,
          class: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
        };
    }
  };

  return (
    <div className="flex-1 p-4 pb-24 space-y-4">
      {/* PACKING READINESS HERO CARD */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-850 to-slate-900 border border-slate-800 p-4 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-[11px] text-slate-400 font-medium block">
              {t.readyPercentage}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-white font-mono">
                {formatNumber(readyPercent)}٪
              </span>
              <span className="text-xs text-emerald-400 font-semibold">
                {packedCount === totalCount && totalCount > 0
                  ? 'کوله کاملاً آماده حرکت است! 🚀'
                  : `${formatNumber(packedCount)} از ${formatNumber(totalCount)} قلم`}
              </span>
            </div>
          </div>

          <div className="text-left" dir="ltr">
            <span className="text-[11px] text-slate-400 font-medium block">
              وزن جمع‌آوری شده
            </span>
            <span className="text-xs font-mono font-bold text-slate-200">
              {formatNumber(packedWeightKg)} / {formatNumber(totalWeightKg)} kg
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden p-0.5 border border-slate-700/60">
          <div
            className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${readyPercent}%` }}
          ></div>
        </div>

        {/* Batch Operations Bar */}
        <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-800/80 text-xs">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setFilterPacked('all')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition cursor-pointer ${
                filterPacked === 'all'
                  ? 'bg-slate-700 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              همه ({formatNumber(totalCount)})
            </button>
            <button
              onClick={() => setFilterPacked('unpacked')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition cursor-pointer ${
                filterPacked === 'unpacked'
                  ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              باقی‌مانده ({formatNumber(totalCount - packedCount)})
            </button>
            <button
              onClick={() => setFilterPacked('packed')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition cursor-pointer ${
                filterPacked === 'packed'
                  ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              جمع‌شده ({formatNumber(packedCount)})
            </button>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowBatchMenu(!showBatchMenu)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer flex items-center gap-1"
              title="عملیات گروهی"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {showBatchMenu && (
              <div className="absolute left-0 mt-1 w-44 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-1 z-30 text-xs">
                <button
                  onClick={() => {
                    onMarkAllPacked();
                    setShowBatchMenu(false);
                  }}
                  className="w-full text-right px-3 py-2 text-slate-200 hover:bg-slate-700 rounded-lg flex items-center gap-2 cursor-pointer"
                >
                  <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t.markAllPacked}</span>
                </button>
                <button
                  onClick={() => {
                    onResetStatus();
                    setShowBatchMenu(false);
                  }}
                  className="w-full text-right px-3 py-2 text-slate-200 hover:bg-slate-700 rounded-lg flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t.resetAllStatus}</span>
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(t.confirmRemoveCompleted)) {
                      onRemoveCompleted();
                    }
                    setShowBatchMenu(false);
                  }}
                  className="w-full text-right px-3 py-2 text-rose-300 hover:bg-rose-500/10 rounded-lg flex items-center gap-2 cursor-pointer border-t border-slate-700/60"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                  <span>{t.removeCompleted}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SEARCH INPUT */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 right-3 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="w-full bg-slate-900 border border-slate-800 rounded-2xl pr-9 pl-9 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute top-1/2 -translate-y-1/2 left-3 text-slate-400 hover:text-white p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* CATEGORY SELECTOR CAROUSEL */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          {t.allCategories}
        </button>

        {(Object.keys(CATEGORY_METADATA) as CategoryId[]).map((catKey) => {
          const meta = CATEGORY_METADATA[catKey];
          const isSelected = selectedCategory === catKey;
          const countInCat = items.filter((i) => i.category === catKey).length;
          return (
            <button
              key={catKey}
              onClick={() => setSelectedCategory(catKey)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap shrink-0 transition flex items-center gap-1.5 cursor-pointer ${
                isSelected
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <span>{isRtl ? meta.faLabel : meta.enLabel}</span>
              {countInCat > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {formatNumber(countInCat)}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* QUICK PRESETS BANNER (when list is small or user wants suggestions) */}
      {items.length < 18 && (
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-emerald-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>پیشنهاد لوازم ضروری سفر</span>
            </span>
            <span className="text-[10px] text-slate-500">یک کلیک برای افزودن</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {QUICK_ADD_SUGGESTIONS.slice(0, 8).map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => onQuickAddItem(suggestion)}
                className="whitespace-nowrap shrink-0 px-2.5 py-1 text-[11px] bg-slate-800 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 border border-slate-700/80 rounded-lg transition active:scale-95 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3 text-emerald-400" />
                <span>{isRtl ? suggestion.name : suggestion.enName}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ITEMS LIST */}
      <div className="space-y-2.5">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 px-4 bg-slate-900/40 rounded-3xl border border-slate-800/60 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-300">{t.noItemsFound}</p>
              <p className="text-xs text-slate-500 mt-1">با دکمه زیر وسیله جدید اضافه کنید</p>
            </div>
            <button
              onClick={onOpenAddModal}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition cursor-pointer"
            >
              {t.addFirstItem}
            </button>
          </div>
        ) : (
          filteredItems.map((item) => {
            const catMeta = CATEGORY_METADATA[item.category];
            const priorityBadge = getPriorityBadge(item.priority);

            return (
              <div
                key={item.id}
                className={`group relative rounded-2xl border transition-all duration-200 p-3.5 flex items-center gap-3 ${
                  item.isPacked
                    ? 'bg-slate-900/60 border-slate-800/80 opacity-75'
                    : 'bg-slate-900 border-slate-800 shadow-md hover:border-slate-700'
                }`}
              >
                {/* Touch Checkbox */}
                <button
                  type="button"
                  onClick={() => onTogglePacked(item.id)}
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition active:scale-90 cursor-pointer"
                  aria-label={item.isPacked ? t.unpacked : t.packed}
                >
                  {item.isPacked ? (
                    <div className="w-7 h-7 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center shadow-md shadow-emerald-500/20">
                      <CheckCircle2 className="w-5 h-5 text-slate-950" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-lg border-2 border-slate-600 hover:border-emerald-400 flex items-center justify-center">
                      <Circle className="w-4 h-4 text-transparent" />
                    </div>
                  )}
                </button>

                {/* Main Content */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-semibold truncate ${
                        item.isPacked ? 'line-through text-slate-400' : 'text-slate-100'
                      }`}
                    >
                      {item.name}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                    {/* Category Label */}
                    <span className="text-slate-400">
                      {isRtl ? catMeta?.faLabel : catMeta?.enLabel}
                    </span>

                    <span>·</span>

                    {/* Weight */}
                    {item.weightGrams ? (
                      <span className="text-slate-400 font-mono" dir="ltr">
                        {formatNumber(item.weightGrams >= 1000 ? `${(item.weightGrams / 1000).toFixed(1)}kg` : `${item.weightGrams}g`)}
                      </span>
                    ) : (
                      <span>وزن ثبت‌نشده</span>
                    )}

                    <span>·</span>

                    {/* Priority Text */}
                    <span className={priorityBadge.class}>
                      {priorityBadge.text}
                    </span>
                  </div>

                  {/* Notes / Reminders if available */}
                  {item.notes && (
                    <div className="text-[11px] text-emerald-400/90 flex items-center gap-1 pt-0.5">
                      <Info className="w-3 h-3 shrink-0" />
                      <span className="truncate">{item.notes}</span>
                    </div>
                  )}
                </div>

                {/* Quantity Controls & Delete Action */}
                <div className="flex items-center gap-2 shrink-0">
                  {/* Quantity Stepper */}
                  <div className="flex items-center bg-slate-800/80 border border-slate-700/70 rounded-xl overflow-hidden h-8">
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.id, -1)}
                      className="w-6 h-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 cursor-pointer text-xs"
                      aria-label="Decrease"
                    >
                      -
                    </button>
                    <span className="px-2 text-xs font-bold text-slate-200 font-mono">
                      {formatNumber(item.quantity)}
                    </span>
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.id, 1)}
                      className="w-6 h-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 cursor-pointer text-xs"
                      aria-label="Increase"
                    >
                      +
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.id)}
                    className="w-8 h-8 rounded-xl bg-slate-800/50 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 flex items-center justify-center transition cursor-pointer"
                    title={t.removeItem}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
