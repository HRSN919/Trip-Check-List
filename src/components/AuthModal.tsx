import React, { useState, useEffect } from 'react';
import { Smartphone, CheckCircle, LogOut, ArrowRight, ArrowLeft, RefreshCw, User, ShieldCheck } from 'lucide-react';
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
  const { t, isRtl, formatNumber } = useLanguage();
  const [step, setStep] = useState<'phone' | 'otp' | 'profile'>(
    user.isLoggedIn ? 'profile' : 'phone'
  );
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || '');
  const [displayName, setDisplayName] = useState(user.displayName || '');
  const [otpCode, setOtpCode] = useState('');
  const [timer, setTimer] = useState(60);
  const [isSending, setIsSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (user.isLoggedIn) {
      setStep('profile');
      setDisplayName(user.displayName);
      setPhoneNumber(user.phoneNumber);
    } else {
      setStep('phone');
    }
  }, [user.isLoggedIn, user.displayName, user.phoneNumber]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  if (!isOpen) return null;

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const cleanPhone = phoneNumber.trim().replace(/\s+/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setErrorMsg(isRtl ? 'لطفاً یک شماره موبایل معتبر وارد کنید (مثال: 09121234567)' : 'Please enter a valid phone number');
      return;
    }

    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setStep('otp');
      setTimer(60);
      setOtpCode('');
    }, 600);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!otpCode || otpCode.trim().length < 4) {
      setErrorMsg(isRtl ? 'لطفاً کد تایید ۵ رقمی را وارد فرمایید.' : 'Please enter the 5-digit code');
      return;
    }

    // Accept any 4-5 digit or demo code 84920
    const updatedUser: UserProfile = {
      phoneNumber: phoneNumber.startsWith('09') ? `+98 ${phoneNumber.substring(1)}` : phoneNumber,
      displayName: displayName || (isRtl ? 'کوهنورد و مسافر' : 'Explorer Traveler'),
      isLoggedIn: true,
      joinDate: new Date().toLocaleDateString(isRtl ? 'fa-IR' : 'en-US'),
    };

    onUpdateUser(updatedUser);
    setStep('profile');
  };

  const handleLogout = () => {
    const loggedOutUser: UserProfile = {
      phoneNumber: '',
      displayName: '',
      isLoggedIn: false,
      joinDate: '',
    };
    onUpdateUser(loggedOutUser);
    setPhoneNumber('');
    setOtpCode('');
    setStep('phone');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      displayName: displayName.trim() || user.displayName,
    });
    onClose();
  };

  const BackIcon = isRtl ? ArrowRight : ArrowLeft;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 text-slate-100 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800"
          aria-label="Close"
        >
          ✕
        </button>

        {/* STEP 1: Phone Number Input */}
        {step === 'phone' && (
          <form onSubmit={handleSendCode} className="space-y-4 pt-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-2">
              <Smartphone className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-lg font-bold text-white">{t.mobileLoginTitle}</h3>
              <p className="text-xs text-slate-400 mt-1">{t.mobileLoginSubtitle}</p>
            </div>

            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-medium text-slate-300">
                {t.enterPhoneNumber}
              </label>
              <div className="relative flex items-center">
                <input
                  type="tel"
                  dir="ltr"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder={t.phonePlaceholder}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                  autoFocus
                />
              </div>
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl p-2.5">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={isSending}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSending ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <span>{t.sendVerificationCode}</span>
              )}
            </button>

            <div className="text-center pt-2">
              <span className="text-[11px] text-slate-400">
                توسعه یافته برای کاربران موبایل · byhrsn.com
              </span>
            </div>
          </form>
        )}

        {/* STEP 2: OTP Verification */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4 pt-2">
            <button
              type="button"
              onClick={() => setStep('phone')}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-emerald-400 mb-2 cursor-pointer"
            >
              <BackIcon className="w-3.5 h-3.5" />
              <span>ویرایش شماره ({formatNumber(phoneNumber)})</span>
            </button>

            <div className="text-center">
              <h3 className="text-lg font-bold text-white">{t.enterOtpCode}</h3>
              <p className="text-xs text-slate-400 mt-1">
                کد ارسال شده به شماره {formatNumber(phoneNumber)}
              </p>
            </div>

            <div className="space-y-1.5 pt-2">
              <input
                type="text"
                dir="ltr"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="84920"
                className="w-full text-center tracking-[0.5em] text-xl font-bold bg-slate-800 border border-slate-700 rounded-xl py-3 text-emerald-400 focus:outline-none focus:border-emerald-500 font-mono"
                autoFocus
              />
            </div>

            {/* Quick Demo Autofill */}
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-2.5 flex items-center justify-between text-xs">
              <span className="text-slate-400">{t.demoOtpHint}</span>
              <button
                type="button"
                onClick={() => setOtpCode('84920')}
                className="text-emerald-400 font-bold hover:underline cursor-pointer"
              >
                کد تستی
              </button>
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl p-2.5">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{t.verifyAndLogin}</span>
            </button>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              {timer > 0 ? (
                <span>ارسال مجدد تا {formatNumber(timer)} ثانیه دیگر</span>
              ) : (
                <button
                  type="button"
                  onClick={() => setTimer(60)}
                  className="text-emerald-400 hover:underline cursor-pointer"
                >
                  {t.resendCode}
                </button>
              )}
            </div>
          </form>
        )}

        {/* STEP 3: User Profile & Account Management */}
        {step === 'profile' && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-3 bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700/60">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 font-bold text-lg">
                <User className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold text-white truncate">
                    {user.displayName || (isRtl ? 'مسافر ماجراجو' : 'Adventurer')}
                  </h4>
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                </div>
                <p className="text-xs text-slate-400 font-mono mt-0.5 truncate" dir="ltr">
                  {user.phoneNumber}
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3 pt-1">
              <div>
                <label className="text-xs font-medium text-slate-300">
                  {t.editProfile}
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder={isRtl ? 'نام یا لقب مسافر' : 'Traveler Name'}
                  className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition cursor-pointer"
                >
                  ذخیره اطلاعات
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-3.5 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 font-medium rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{t.logout}</span>
                </button>
              </div>
            </form>

            <div className="pt-3 border-t border-slate-800 text-center">
              <span className="text-[11px] text-slate-400">
                طراحی شده توسط{' '}
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
        )}
      </div>
    </div>
  );
};
