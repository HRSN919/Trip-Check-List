import React, { useState } from 'react';
import { Plus, X, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { CategoryId, PriorityLevel, TripItem } from '../types';
import { CATEGORY_METADATA, QUICK_ADD_SUGGESTIONS } from '../data/initialData';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (item: Omit<TripItem, 'id' | 'createdAt'>) => void;
}

export const AddItemModal: React.FC<AddItemModalProps> = ({
  isOpen,
  onClose,
  onAddItem,
}) => {
  const { t, isRtl, formatNumber } = useLanguage();
  const [name, setName] = useState('');
  const [category, setCategory] = useState<CategoryId>('shelter');
  const [quantity, setQuantity] = useState(1);
  const [weightGrams, setWeightGrams] = useState<string>('500');
  const [priority, setPriority] = useState<PriorityLevel>('essential');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddItem({
      name: name.trim(),
      category,
      quantity: Math.max(1, quantity),
      weightGrams: weightGrams ? parseInt(weightGrams, 10) : undefined,
      priority,
      isPacked: false,
      notes: notes.trim() || undefined,
    });

    // Reset & close
    setName('');
    setNotes('');
    setQuantity(1);
    onClose();
  };

  const handleSelectQuickSuggestion = (suggestion: typeof QUICK_ADD_SUGGESTIONS[0]) => {
    setName(isRtl ? suggestion.name : suggestion.enName);
    setCategory(suggestion.category as CategoryId);
    setWeightGrams(String(suggestion.weightGrams));
    setPriority(suggestion.priority as PriorityLevel);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-5 md:p-6 text-slate-100 relative my-auto max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Plus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">{t.addNewEquipment}</h3>
            <p className="text-[11px] text-slate-400">تجهیزات را دقیق مشخص کنید تا وزن و کوله دقیق محاسبه شود</p>
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="mb-4">
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.quickAddPresets}</span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
            {QUICK_ADD_SUGGESTIONS.slice(0, 6).map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectQuickSuggestion(item)}
                className="whitespace-nowrap shrink-0 px-2.5 py-1 text-[11px] bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-emerald-300 border border-slate-700 rounded-lg transition active:scale-95 cursor-pointer"
              >
                {isRtl ? item.name : item.enName}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Item Name */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              نام وسیله *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.itemNamePlaceholder}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              autoFocus
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              {t.categoryLabel}
            </label>
            <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-1">
              {(Object.keys(CATEGORY_METADATA) as CategoryId[]).map((catKey) => {
                const meta = CATEGORY_METADATA[catKey];
                const isSelected = category === catKey;
                return (
                  <button
                    key={catKey}
                    type="button"
                    onClick={() => setCategory(catKey)}
                    className={`flex items-center gap-2 p-2 rounded-xl text-[11px] font-medium text-right transition cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-500/20 border border-emerald-500 text-white font-bold'
                        : 'bg-slate-800/80 border border-slate-750 text-slate-400 hover:bg-slate-750'
                    }`}
                  >
                    <span className={meta.color}>•</span>
                    <span className="truncate">{isRtl ? meta.faLabel : meta.enLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity & Weight */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                {t.quantityLabel}
              </label>
              <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-9 flex items-center justify-center text-slate-300 hover:bg-slate-700 cursor-pointer"
                >
                  -
                </button>
                <span className="flex-1 text-center font-bold text-xs text-emerald-400 font-mono">
                  {formatNumber(quantity)}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-8 h-9 flex items-center justify-center text-slate-300 hover:bg-slate-700 cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                {t.weightLabel}
              </label>
              <input
                type="number"
                value={weightGrams}
                onChange={(e) => setWeightGrams(e.target.value)}
                placeholder="500"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              {t.priorityLabel}
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['essential', 'recommended', 'optional'] as PriorityLevel[]).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setPriority(lvl)}
                  className={`py-2 px-1 text-center rounded-xl text-[11px] font-semibold transition cursor-pointer ${
                    priority === lvl
                      ? lvl === 'essential'
                        ? 'bg-rose-500 text-white font-bold'
                        : lvl === 'recommended'
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-blue-500 text-white font-bold'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-750 border border-slate-700'
                  }`}
                >
                  {t[lvl]}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              {t.notesLabel}
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t.notesPlaceholder}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold rounded-xl text-xs transition cursor-pointer"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="w-2/3 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              {t.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
