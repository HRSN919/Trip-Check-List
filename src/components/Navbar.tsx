import React from 'react';
import {
  CheckSquare,
  Compass,
  Plus,
  Printer,
  CreditCard,
  User,
  Globe,
  Download,
  Share2,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Trip, UserProfile } from '../types';

interface NavbarProps {
  activeTab: 'equipment' | 'trips' | 'pdf' | 'donate' | 'profile';
  onChangeTab: (tab: 'equipment' | 'trips' | 'pdf' | 'donate' | 'profile') => void;
  onOpenAddModal: () => void;
  onOpenTripModal: () => void;
  onOpenAuthModal: () => void;
  activeTrip: Trip;
  user: UserProfile;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onChangeTab,
  onOpenAddModal,
  onOpenTripModal,
  onOpenAuthModal,
  activeTrip,
  user,
}) => {
  const { t, language, setLanguage, isRtl, formatNumber } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'fa' ? 'en' : 'fa');
  };

  return (
    <>
      {/* ANDROID TOP APP BAR */}
      <header className="no-print sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={onOpenTripModal}
            className="flex items-center gap-1.5 p-1.5 -mr-1.5 rounded-xl hover:bg-slate-800 transition min-w-0 text-right cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Compass className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] text-slate-400 block leading-tight truncate">
                سفر جاری (تغییر)
              </span>
              <h1 className="text-xs font-bold text-white truncate max-w-[150px] md:max-w-[260px]">
                {activeTrip.title}
              </h1>
            </div>
          </button>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-[11px] font-semibold border border-slate-750 transition cursor-pointer"
            title="تغییر زبان (FA / EN)"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>{language === 'fa' ? 'EN' : 'فا'}</span>
          </button>

          {/* User Profile / Mobile Auth */}
          <button
            onClick={onOpenAuthModal}
            className={`flex items-center gap-1.5 p-1.5 rounded-xl border transition cursor-pointer ${
              user.isLoggedIn
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            title={user.isLoggedIn ? user.phoneNumber : t.mobileLoginTitle}
          >
            <div className="w-6 h-6 rounded-lg bg-slate-700/80 flex items-center justify-center">
              <User className="w-3.5 h-3.5" />
            </div>
            {user.isLoggedIn ? (
              <span className="text-[10px] font-mono hidden sm:inline max-w-[80px] truncate">
                {user.displayName || user.phoneNumber}
              </span>
            ) : (
              <span className="text-[10px] font-medium hidden sm:inline">ورود</span>
            )}
          </button>
        </div>
      </header>

      {/* ANDROID BOTTOM TAB BAR */}
      <nav
        className="no-print fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800/80 max-w-[430px] md:max-w-4xl mx-auto shadow-2xl"
        aria-label="Bottom Navigation"
      >
        <div className="grid grid-cols-5 items-center h-16 px-1">
          {/* Tab 1: Equipment */}
          <button
            onClick={() => onChangeTab('equipment')}
            className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] rounded-xl transition cursor-pointer ${
              activeTab === 'equipment' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckSquare className="w-5 h-5" />
            <span className="text-[10px] mt-1">{t.tabEquipment}</span>
          </button>

          {/* Tab 2: Trips */}
          <button
            onClick={() => {
              onChangeTab('trips');
              onOpenTripModal();
            }}
            className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] rounded-xl transition cursor-pointer ${
              activeTab === 'trips' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-5 h-5" />
            <span className="text-[10px] mt-1">{t.tabTrips}</span>
          </button>

          {/* Center Floating Action Button: Add Item */}
          <div className="flex items-center justify-center -mt-5">
            <button
              onClick={onOpenAddModal}
              className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/30 active:scale-95 transition cursor-pointer"
              aria-label={t.tabAdd}
            >
              <Plus className="w-6 h-6 stroke-[2.5]" />
            </button>
          </div>

          {/* Tab 4: PDF Print */}
          <button
            onClick={() => onChangeTab('pdf')}
            className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] rounded-xl transition cursor-pointer ${
              activeTab === 'pdf' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Printer className="w-5 h-5" />
            <span className="text-[10px] mt-1">{t.tabPdf}</span>
          </button>

          {/* Tab 5: Donate Card */}
          <button
            onClick={() => onChangeTab('donate')}
            className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] rounded-xl transition cursor-pointer ${
              activeTab === 'donate' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CreditCard className="w-5 h-5" />
            <span className="text-[10px] mt-1">{t.tabDonate}</span>
          </button>
        </div>
      </nav>
    </>
  );
};
