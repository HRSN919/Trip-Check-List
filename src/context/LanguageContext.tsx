import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'fa' | 'en';

interface Translations {
  appName: string;
  appSubtitle: string;
  developerWebsite: string;
  developerCredit: string;
  // Tabs
  tabEquipment: string;
  tabTrips: string;
  tabAdd: string;
  tabPdf: string;
  tabDonate: string;
  tabProfile: string;
  // Equipment
  allCategories: string;
  searchPlaceholder: string;
  packed: string;
  unpacked: string;
  addItem: string;
  removeItem: string;
  itemRemoved: string;
  undo: string;
  noItemsFound: string;
  noItemsCategory: string;
  addFirstItem: string;
  totalItems: string;
  totalWeight: string;
  readyPercentage: string;
  markAllPacked: string;
  resetAllStatus: string;
  removeCompleted: string;
  confirmRemoveCompleted: string;
  quickAddPresets: string;
  // Priority
  essential: string;
  recommended: string;
  optional: string;
  // Categories
  cat_shelter: string;
  cat_sleep: string;
  cat_clothing: string;
  cat_cooking: string;
  cat_electronics: string;
  cat_medical: string;
  cat_navigation: string;
  cat_hygiene: string;
  cat_documents: string;
  cat_misc: string;
  // Add Modal
  addNewEquipment: string;
  itemNamePlaceholder: string;
  categoryLabel: string;
  quantityLabel: string;
  weightLabel: string;
  priorityLabel: string;
  notesLabel: string;
  notesPlaceholder: string;
  cancel: string;
  save: string;
  // PDF
  printPdfTitle: string;
  printPdfSubtitle: string;
  downloadPdfButton: string;
  browserPrintButton: string;
  pdfTripDetails: string;
  pdfChecklist: string;
  pdfGeneratedOn: string;
  pdfStatusPacked: string;
  pdfStatusPending: string;
  // Donation
  donateTitle: string;
  donateSubtitle: string;
  cardNumberLabel: string;
  cardHolderLabel: string;
  bankNameLabel: string;
  shabaLabel: string;
  copyCardNumber: string;
  copyShaba: string;
  copiedSuccess: string;
  presetAmounts: string;
  customAmount: string;
  currency: string;
  simulateTransfer: string;
  supportSuccessMessage: string;
  transferReceipt: string;
  refCode: string;
  visitDeveloperSite: string;
  // Auth
  mobileLoginTitle: string;
  mobileLoginSubtitle: string;
  enterPhoneNumber: string;
  phonePlaceholder: string;
  sendVerificationCode: string;
  enterOtpCode: string;
  otpPlaceholder: string;
  verifyAndLogin: string;
  demoOtpHint: string;
  resendCode: string;
  loggedInAs: string;
  logout: string;
  editProfile: string;
  // Android Frame
  androidMode: string;
  fullScreenMode: string;
  installPwa: string;
  pwaInstalled: string;
}

const translationsFa: Translations = {
  appName: 'تریپ‌پک (TripPack)',
  appSubtitle: 'مدیریت هوشمند لوازم و تجهیزات سفر',
  developerWebsite: 'byhrsn.com',
  developerCredit: 'طراحی و توسعه توسط byhrsn.com',
  // Tabs
  tabEquipment: 'تجهیزات',
  tabTrips: 'سفرها',
  tabAdd: 'افزودن',
  tabPdf: 'خروجی PDF',
  tabDonate: 'حمایت مالی',
  tabProfile: 'پروفایل',
  // Equipment
  allCategories: 'همه دسته‌ها',
  searchPlaceholder: 'جستجو در تجهیزات سفر...',
  packed: 'جمع‌آوری شد',
  unpacked: 'باقی‌مانده',
  addItem: 'افزودن قلم جدید',
  removeItem: 'حذف',
  itemRemoved: 'مورد با موفقیت حذف شد',
  undo: 'بازگردانی',
  noItemsFound: 'وسیله‌ای با این مشخصات یافت نشد.',
  noItemsCategory: 'در این دسته‌بندی هنوز وسیله‌ای اضافه نشده است.',
  addFirstItem: 'افزودن اولین وسیله به چک‌لیست',
  totalItems: 'کل اقلام',
  totalWeight: 'وزن تقریبی',
  readyPercentage: 'میزان آمادگی کوله',
  markAllPacked: 'جمع‌آوری همه',
  resetAllStatus: 'بازنشانی وضعیت‌ها',
  removeCompleted: 'حذف موارد جمع‌شده',
  confirmRemoveCompleted: 'آیا از حذف تمام اقلام جمع‌آوری شده مطمئن هستید؟',
  quickAddPresets: 'افزودن سریع تجهیزات متداول',
  // Priority
  essential: 'حیاتی و ضروری',
  recommended: 'پیشنهادی',
  optional: 'اختیاری و رفاهی',
  // Categories
  cat_shelter: 'اقامت و سرپناه',
  cat_sleep: 'خواب و استراحت',
  cat_clothing: 'پوشاک و کفش',
  cat_cooking: 'پخت‌وپز و تغذیه',
  cat_electronics: 'لوازم الکترونیک و نور',
  cat_medical: 'کمک‌های اولیه و سلامت',
  cat_navigation: 'ناوبری و ایمنی',
  cat_hygiene: 'بهداشت فردی',
  cat_documents: 'مدارک و شناسایی',
  cat_misc: 'متفرقه و ابزار',
  // Add Modal
  addNewEquipment: 'افزودن وسیله جدید به کوله',
  itemNamePlaceholder: 'نام وسیله (مثلاً: چادر ۲ نفره ضدآب)',
  categoryLabel: 'دسته‌بندی وسیله',
  quantityLabel: 'تعداد',
  weightLabel: 'وزن تقریبی (گرم)',
  priorityLabel: 'درجه اهمیت',
  notesLabel: 'یادداشت یا توضیحات خاص',
  notesPlaceholder: 'مثلاً: نیاز به باتری یدکی دارد، باتری نو خریده شود...',
  cancel: 'انصراف',
  save: 'ثبت در چک‌لیست',
  // PDF
  printPdfTitle: 'خروجی و چاپ PDF تجهیزات',
  printPdfSubtitle: 'برگه چاپی رسمی با فرمت A4 جهت بررسی پیش از سفر',
  downloadPdfButton: 'دانلود فایل مستقیم PDF',
  browserPrintButton: 'چاپ مستقیم با پرینتر (Print)',
  pdfTripDetails: 'مشخصات سفر و مسافر',
  pdfChecklist: 'فهرست تجهیزات سفر',
  pdfGeneratedOn: 'تاریخ صدور چک‌لیست',
  pdfStatusPacked: 'آماده شده [✓]',
  pdfStatusPending: 'نیاز به بررسی [ ]',
  // Donation
  donateTitle: 'حمایت مالی به شماره کارت',
  donateSubtitle: 'پشتیبانی از توسعه‌دهنده برنامه (سایت: byhrsn.com)',
  cardNumberLabel: 'شماره کارت بانکی (شتاب)',
  cardHolderLabel: 'نام دارنده کارت',
  bankNameLabel: 'بانک صادرکننده',
  shabaLabel: 'شماره شبا (IBAN)',
  copyCardNumber: 'کپی شماره کارت',
  copyShaba: 'کپی شماره شبا',
  copiedSuccess: 'در حافظه کپی شد!',
  presetAmounts: 'مبالغ پیشنهادی (تومان)',
  customAmount: 'مبلغ دلخواه',
  currency: 'تومان',
  simulateTransfer: 'ثبت رسید و پرداخت شبیه‌سازی شده',
  supportSuccessMessage: 'از حمایت ارزشمند شما بسیار سپاسگزاریم!',
  transferReceipt: 'رسید تراکنش بانکی',
  refCode: 'کد پیگیری تراکنش',
  visitDeveloperSite: 'مشاهده وب‌سایت توسعه‌دهنده (byhrsn.com)',
  // Auth
  mobileLoginTitle: 'ورود به حساب با شماره موبایل',
  mobileLoginSubtitle: 'برای ذخیره‌سازی ابری و همگام‌سازی تجهیزات در تمام دستگاه‌ها',
  enterPhoneNumber: 'شماره تلفن همراه خود را وارد کنید',
  phonePlaceholder: '09123456789 یا 98912...',
  sendVerificationCode: 'دریافت کد تایید یکبار مصرف (SMS)',
  enterOtpCode: 'کد تایید پیامک‌شده را وارد نمایید',
  otpPlaceholder: 'کد ۵ رقمی',
  verifyAndLogin: 'تایید و ورود به اپلیکیشن',
  demoOtpHint: 'کد تستی جهت ورود سریع: 84920',
  resendCode: 'ارسال مجدد کد',
  loggedInAs: 'کاربر فعال',
  logout: 'خروج از حساب',
  editProfile: 'ویرایش نام مسافر',
  // Android Frame
  androidMode: 'نمای گوشی اندروید',
  fullScreenMode: 'نمای تمام صفحه',
  installPwa: 'نصب نسخه اندروید (PWA)',
  pwaInstalled: 'اپلیکیشن نصب شده است',
};

const translationsEn: Translations = {
  appName: 'TripPack',
  appSubtitle: 'Smart Trip Equipment & Packing Manager',
  developerWebsite: 'byhrsn.com',
  developerCredit: 'Designed & developed by byhrsn.com',
  // Tabs
  tabEquipment: 'Equipment',
  tabTrips: 'Trips',
  tabAdd: 'Add Item',
  tabPdf: 'PDF & Print',
  tabDonate: 'Donate Card',
  tabProfile: 'Profile',
  // Equipment
  allCategories: 'All Categories',
  searchPlaceholder: 'Search trip gear...',
  packed: 'Packed',
  unpacked: 'Remaining',
  addItem: 'Add New Item',
  removeItem: 'Remove',
  itemRemoved: 'Item removed successfully',
  undo: 'Undo',
  noItemsFound: 'No equipment matches your search.',
  noItemsCategory: 'No gear added to this category yet.',
  addFirstItem: 'Add the first item to your checklist',
  totalItems: 'Total Items',
  totalWeight: 'Est. Weight',
  readyPercentage: 'Pack Readiness',
  markAllPacked: 'Mark All Packed',
  resetAllStatus: 'Reset Status',
  removeCompleted: 'Remove Packed Items',
  confirmRemoveCompleted: 'Are you sure you want to remove all packed items?',
  quickAddPresets: 'Quick Add Popular Gear',
  // Priority
  essential: 'Essential',
  recommended: 'Recommended',
  optional: 'Optional',
  // Categories
  cat_shelter: 'Shelter & Tent',
  cat_sleep: 'Sleep & Rest',
  cat_clothing: 'Clothing & Footwear',
  cat_cooking: 'Cooking & Nutrition',
  cat_electronics: 'Electronics & Lights',
  cat_medical: 'First Aid & Health',
  cat_navigation: 'Navigation & Safety',
  cat_hygiene: 'Personal Care',
  cat_documents: 'Documents & IDs',
  cat_misc: 'Tools & Miscellaneous',
  // Add Modal
  addNewEquipment: 'Add New Gear Item',
  itemNamePlaceholder: 'Item name (e.g., 2-Person Waterproof Tent)',
  categoryLabel: 'Category',
  quantityLabel: 'Quantity',
  weightLabel: 'Est. Weight (grams)',
  priorityLabel: 'Priority Level',
  notesLabel: 'Notes or Reminders',
  notesPlaceholder: 'e.g., Check battery level, waterproof treated...',
  cancel: 'Cancel',
  save: 'Add to Checklist',
  // PDF
  printPdfTitle: 'Export & Print Trip Equipment',
  printPdfSubtitle: 'Official A4 checklist printable format for travel readiness',
  downloadPdfButton: 'Download Standalone PDF',
  browserPrintButton: 'Print with System Dialog',
  pdfTripDetails: 'Trip & Traveler Summary',
  pdfChecklist: 'Trip Gear Checklist',
  pdfGeneratedOn: 'Checklist Date',
  pdfStatusPacked: 'Packed [✓]',
  pdfStatusPending: 'Pending [ ]',
  // Donation
  donateTitle: 'Donate to Card',
  donateSubtitle: 'Support the developer directly (website: byhrsn.com)',
  cardNumberLabel: 'Bank Card Number (Shetab)',
  cardHolderLabel: 'Card Holder Name',
  bankNameLabel: 'Issuing Bank',
  shabaLabel: 'IBAN / Shaba Number',
  copyCardNumber: 'Copy Card Number',
  copyShaba: 'Copy Shaba',
  copiedSuccess: 'Copied to clipboard!',
  presetAmounts: 'Suggested Amounts (Tomans)',
  customAmount: 'Custom Amount',
  currency: 'Tomans',
  simulateTransfer: 'Submit Simulated Card Transfer',
  supportSuccessMessage: 'Thank you very much for supporting our development!',
  transferReceipt: 'Payment Transfer Receipt',
  refCode: 'Reference Code',
  visitDeveloperSite: 'Visit Developer Site (byhrsn.com)',
  // Auth
  mobileLoginTitle: 'Mobile Phone Login',
  mobileLoginSubtitle: 'Sync trip gear and packing history across all your devices',
  enterPhoneNumber: 'Enter your mobile phone number',
  phonePlaceholder: '+98 912 345 6789 or mobile number',
  sendVerificationCode: 'Send OTP Verification SMS',
  enterOtpCode: 'Enter the verification code',
  otpPlaceholder: '5-digit code',
  verifyAndLogin: 'Verify and Sign In',
  demoOtpHint: 'Quick demo OTP code: 84920',
  resendCode: 'Resend Code',
  loggedInAs: 'Logged In User',
  logout: 'Sign Out',
  editProfile: 'Edit Traveler Name',
  // Android Frame
  androidMode: 'Android Phone View',
  fullScreenMode: 'Full Screen View',
  installPwa: 'Install Android App (PWA)',
  pwaInstalled: 'App is Installed',
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  isRtl: boolean;
  formatNumber: (n: number | string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default language is Persian 'fa' as requested by user!
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('trippack_lang');
    return saved === 'en' ? 'en' : 'fa';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('trippack_lang', lang);
  };

  const isRtl = language === 'fa';
  const t = language === 'fa' ? translationsFa : translationsEn;

  useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [isRtl, language]);

  const toPersianDigits = (numStr: string | number): string => {
    const pDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return String(numStr).replace(/[0-9]/g, (w) => pDigits[+w]);
  };

  const formatNumber = (val: number | string): string => {
    if (language === 'fa') {
      return toPersianDigits(val);
    }
    return String(val);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRtl, formatNumber }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
