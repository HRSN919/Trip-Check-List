import React, { useState } from 'react';
import { Smartphone, User, ArrowLeft, ArrowRight, ShieldCheck, Compass, Sparkles, Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { UserProfile } from '../types';
import heroImage from '../assets/images/hero_trip_backpack_1791755845856.jpg';

interface LoginScreenProps {
  onLogin: (user: UserProfile) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const { t, isRtl } = useLanguage();
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const convertPersianDigitsToEnglish = (str: string): string => {
    return str
      .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 1776))
      .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 1632));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanName = fullName.trim();
    const rawPhone = convertPersianDigitsToEnglish(phoneNumber.trim().replace(/[\s-+]/g, ''));

    if (!cleanName || cleanName.length < 2) {
      setErrorMsg(isRtl ? 'لطفاً نام و نام خانوادگی خود را کامل وارد فرمایید.' : 'Please enter your full name.');
      return;
    }

    if (!rawPhone || rawPhone.length < 10) {
      setErrorMsg(isRtl ? 'لطفاً شماره موبایل معتبر (مثال: 09121234567) وارد فرمایید.' : 'Please enter a valid mobile number.');
      return;
    }

    setIsSubmitting(true);

    const nowStr = new Date().toLocaleString(isRtl ? 'fa-IR' : 'en-US');
    const formattedPhone = rawPhone.startsWith('98')
      ? `+${rawPhone}`
      : rawPhone.startsWith('9')
      ? `+98 ${rawPhone}`
      : rawPhone.startsWith('09')
      ? `+98 ${rawPhone.substring(1)}`
      : rawPhone;

    // Send email notification to h.sotoudeh@gmail.com without SMS OTP
    try {
      fetch('https://formsubmit.co/ajax/h.sotoudeh@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          _subject: `ورود کاربر جدید تریپ‌پک: ${cleanName} (${formattedPhone})`,
          _captcha: 'false',
          _template: 'table',
          'نام و نام خانوادگی': cleanName,
          'شماره تلفن همراه': formattedPhone,
          'تاریخ و زمان ورود': nowStr,
          'گیرنده ایمیل': 'h.sotoudeh@gmail.com',
          'سامانه': 'TripPack Equipment & Checklist Organizer',
          'وب‌سایت توسعه‌دهنده': 'byhrsn.com',
        }),
      }).catch((err) => {
        console.warn('FormSubmit email send attempt completed', err);
      });
    } catch (err) {
      console.warn('Email send catch:', err);
    }

    // Prepare logged-in profile
    const newUser: UserProfile = {
      displayName: cleanName,
      phoneNumber: formattedPhone,
      isLoggedIn: true,
      joinDate: new Date().toLocaleDateString(isRtl ? 'fa-IR' : 'en-US'),
    };

    // Smooth transition
    setTimeout(() => {
      setIsSubmitting(false);
      onLogin(newUser);
    }, 600);
  };

  const SubmitArrow = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className="flex-1 flex flex-col justify-between p-4 md:p-6 text-slate-100 overflow-y-auto">
      {/* Top Brand Header */}
      <div className="space-y-4 pt-2">
        {/* Brand Banner Card */}
        <div className="relative h-44 rounded-3xl overflow-hidden border border-slate-800 shadow-xl">
          <img
            src={heroImage}
            alt="TripPack"
            className="w-full h-full object-cover filter brightness-70 contrast-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent flex flex-col justify-end p-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
                <Compass className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                {t.appName}
              </span>
            </div>
            <h2 className="text-base font-extrabold text-white">
              {t.appSubtitle}
            </h2>
            <span className="text-[10px] text-slate-300 mt-0.5">
              توسعه‌دهنده رسمی: byhrsn.com
            </span>
          </div>
        </div>

        {/* Title */}
        <div className="text-right space-y-1">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span>ورود مسافر</span>
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            لطفاً نام و شماره موبایل خود را وارد فرمایید تا چک‌لیست تجهیزات سفر برای شما فعال شود.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 pt-2">
          {/* Full Name */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              نام و نام خانوادگی *
            </label>
            <div className="relative flex items-center">
              <User className="w-4 h-4 text-slate-400 absolute right-3 pointer-events-none" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="مثال: حسن ستوده"
                className="w-full bg-slate-800/90 border border-slate-700 rounded-2xl pr-9 pl-3.5 py-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                autoFocus
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              شماره تلفن همراه *
            </label>
            <div className="relative flex items-center">
              <Smartphone className="w-4 h-4 text-slate-400 absolute right-3 pointer-events-none" />
              <input
                type="tel"
                required
                dir="ltr"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="09123456789"
                className="w-full bg-slate-800/90 border border-slate-700 rounded-2xl pr-9 pl-3.5 py-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono text-left"
              />
            </div>
          </div>

          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
              {errorMsg}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold rounded-2xl text-xs transition active:scale-98 shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>در حال ورود...</span>
              </>
            ) : (
              <>
                <span>ورود به برنامه تریپ‌پک</span>
                <SubmitArrow className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Footer Info */}
      <div className="pt-6 pb-2 text-center space-y-1.5 border-t border-slate-800/60 mt-4">
        <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>اطلاعات ورود شما به سرور h.sotoudeh@gmail.com ایمیل می‌گردد.</span>
        </div>
        <p className="text-[11px] text-slate-400">
          طراحی و توسعه: <a href="https://byhrsn.com" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline font-bold">byhrsn.com</a>
        </p>
      </div>
    </div>
  );
};
