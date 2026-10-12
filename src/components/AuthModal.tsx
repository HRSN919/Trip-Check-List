import React, { useState } from 'react';
import { LogOut, User, ShieldCheck, X, Smartphone, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { UserProfile } from '../types';

interface AuthModalProps {
  user: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  user,
  onUpdateUser,
  isOpen,
  onClose,
}) => {
  const { t, isRtl } = useLanguage();
  const [displayName, setDisplayName] = useState(user.displayName || '');
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleLogout = () => {
    const loggedOutUser: UserProfile = {
      phoneNumber: '',
      displayName: '',
      isLoggedIn: false,
      joinDate: '',
    };
    onUpdateUser(loggedOutUser);
    onClose();
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      displayName: displayName.trim() || user.displayName,
      phoneNumber: phoneNumber.trim() || user.phoneNumber,
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 text-slate-100 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-4 pt-2">
          {/* Header Card */}
          <div className="flex items-center gap-3 bg-slate-800/70 p-3.5 rounded-2xl border border-slate-700/60">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 font-bold text-lg">
              <User className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-bold text-white truncate">
                  {user.displayName || (isRtl ? 'مسافر تریپ‌پک' : 'Traveler')}
                </h4>
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5 truncate" dir="ltr">
                {user.phoneNumber}
              </p>
            </div>
          </div>

          {/* Edit Form */}
          <form onSubmit={handleSaveProfile} className="space-y-3 pt-1">
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">
                نام و نام خانوادگی
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="نام مسافر"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">
                شماره تلفن همراه
              </label>
              <input
                type="tel"
                dir="ltr"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="0912..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 font-mono text-left"
              />
            </div>

            {savedSuccess && (
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center justify-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>اطلاعات مسافر به‌روز شد</span>
              </div>
            )}

            <div className="pt-2 flex items-center gap-2">
              <button
                type="submit"
                className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition cursor-pointer"
              >
                ذخیره تغییرات
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="px-3.5 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 font-medium rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>خروج از حساب</span>
              </button>
            </div>
          </form>

          <div className="pt-3 border-t border-slate-800 text-center">
            <span className="text-[11px] text-slate-400">
              طراحی و توسعه توسط{' '}
              <a
                href="https://byhrsn.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:underline font-semibold"
              >
                byhrsn.com
              </a>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
