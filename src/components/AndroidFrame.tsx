import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, Smartphone, Monitor } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface AndroidFrameProps {
  children: React.ReactNode;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({ children }) => {
  const { t, formatNumber } = useLanguage();
  const [currentTime, setCurrentTime] = useState('');
  const [isPhoneFrame, setIsPhoneFrame] = useState(true);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateClock();
    const interval = setInterval(updateClock, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start p-0 md:py-6 md:px-4">
      {/* Top Floating Viewport Mode Switcher (visible on desktop md:screens) */}
      <div className="no-print hidden md:flex items-center justify-between w-full max-w-4xl mb-4 px-3 py-2 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 shadow-lg">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-emerald-400">Android OS Simulation</span>
          <span className="text-xs text-slate-400">·</span>
          <a
            href="https://byhrsn.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-slate-300 hover:text-emerald-400 transition-colors underline decoration-slate-600 underline-offset-4"
          >
            byhrsn.com
          </a>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-xl">
          <button
            onClick={() => setIsPhoneFrame(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              isPhoneFrame
                ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>{t.androidMode}</span>
          </button>
          <button
            onClick={() => setIsPhoneFrame(false)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              !isPhoneFrame
                ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>{t.fullScreenMode}</span>
          </button>
        </div>
      </div>

      {/* Main Container: either simulated Android chassis or full-width responsive */}
      <div
        className={`w-full transition-all duration-300 ${
          isPhoneFrame
            ? 'max-w-[430px] min-h-[900px] h-[92vh] md:h-[880px] rounded-none md:rounded-[44px] shadow-2xl border-0 md:border-[10px] md:border-slate-800 ring-1 md:ring-slate-700/50 flex flex-col relative overflow-hidden bg-slate-900'
            : 'max-w-4xl min-h-screen md:min-h-[90vh] rounded-none md:rounded-3xl shadow-xl border-0 md:border border-slate-800 flex flex-col relative overflow-hidden bg-slate-900'
        }`}
      >
        {/* Android Punch Hole Camera (only in phone frame on md+) */}
        {isPhoneFrame && (
          <div className="no-print absolute top-2.5 left-1/2 -translate-x-1/2 z-50 hidden md:block">
            <div className="w-3.5 h-3.5 bg-slate-950 rounded-full border border-slate-800 ring-1 ring-slate-900/80"></div>
          </div>
        )}

        {/* Android Status Bar */}
        <header
          className="no-print w-full h-8 px-5 flex items-center justify-between text-xs font-medium text-slate-300 bg-slate-900/95 border-b border-slate-800/40 select-none shrink-0 z-40"
          dir="ltr"
        >
          <div className="flex items-center gap-1.5">
            <span className="font-semibold tracking-tight text-[11px] text-slate-200">
              {currentTime ? formatNumber(currentTime) : '12:00'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-400">
            <span className="text-[10px] font-bold text-slate-300">5G</span>
            <Wifi className="w-3.5 h-3.5 text-slate-300" />
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-mono text-slate-400">92%</span>
              <BatteryMedium className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
        </header>

        {/* Scrollable Screen Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col relative">
          {children}
        </div>

        {/* Android Home Navigation Bar / Pill */}
        <footer
          className="no-print w-full h-4 bg-slate-900/95 flex items-center justify-center shrink-0 z-40"
          aria-hidden="true"
        >
          <div className="w-28 h-1 bg-slate-600/70 rounded-full transition-transform active:scale-95"></div>
        </footer>
      </div>
    </div>
  );
};
