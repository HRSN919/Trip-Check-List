/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AndroidFrame } from './components/AndroidFrame';
import { Navbar } from './components/Navbar';
import { EquipmentList } from './components/EquipmentList';
import { AddItemModal } from './components/AddItemModal';
import { TripSelector } from './components/TripSelector';
import { AuthModal } from './components/AuthModal';
import { CardDonationModal } from './components/CardDonationModal';
import { PdfExportModal } from './components/PdfExportModal';
import { ApkDownloadModal } from './components/ApkDownloadModal';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { DeveloperBadge } from './components/DeveloperBadge';
import { INITIAL_TRIPS, QUICK_ADD_SUGGESTIONS } from './data/initialData';
import { Trip, TripItem, UserProfile } from './types';
import heroImage from './assets/images/hero_trip_backpack_1791755845856.jpg';

function MainApp() {
  const { t, isRtl, formatNumber } = useLanguage();

  // Trips State
  const [trips, setTrips] = useState<Trip[]>(() => {
    const saved = localStorage.getItem('trippack_trips');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_TRIPS;
      }
    }
    return INITIAL_TRIPS;
  });

  const [activeTripId, setActiveTripId] = useState<string>(() => {
    const savedId = localStorage.getItem('trippack_active_trip_id');
    return savedId && trips.some((t) => t.id === savedId) ? savedId : trips[0]?.id || 'trip-1';
  });

  // User Profile (Mobile Login)
  const [user, setUser] = useState<UserProfile>(() => {
    const savedUser = localStorage.getItem('trippack_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        // default guest
      }
    }
    return {
      phoneNumber: '09123456789',
      displayName: 'حسن (مسافر کوهستان)',
      isLoggedIn: true,
      joinDate: '۱۴۰۳/۰۸/۰۱',
    };
  });

  // Active Tab
  const [activeTab, setActiveTab] = useState<'equipment' | 'trips' | 'pdf' | 'donate' | 'profile'>('equipment');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isTripModalOpen, setIsTripModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  const [isApkModalOpen, setIsApkModalOpen] = useState(false);

  // Undo Toast state
  const [deletedItemUndo, setDeletedItemUndo] = useState<{
    item: TripItem;
    tripId: string;
  } | null>(null);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('trippack_trips', JSON.stringify(trips));
  }, [trips]);

  useEffect(() => {
    localStorage.setItem('trippack_active_trip_id', activeTripId);
  }, [activeTripId]);

  useEffect(() => {
    localStorage.setItem('trippack_user', JSON.stringify(user));
  }, [user]);

  // Current active trip
  const activeTrip = trips.find((t) => t.id === activeTripId) || trips[0];

  // Equipment Item Operations
  const handleTogglePacked = (itemId: string) => {
    setTrips((prevTrips) =>
      prevTrips.map((trip) => {
        if (trip.id !== activeTripId) return trip;
        return {
          ...trip,
          items: trip.items.map((item) =>
            item.id === itemId ? { ...item, isPacked: !item.isPacked } : item
          ),
        };
      })
    );
  };

  const handleRemoveItem = (itemId: string) => {
    const itemToRemove = activeTrip.items.find((i) => i.id === itemId);
    if (!itemToRemove) return;

    // Set undo
    setDeletedItemUndo({ item: itemToRemove, tripId: activeTripId });
    setTimeout(() => {
      setDeletedItemUndo((prev) => (prev?.item.id === itemId ? null : prev));
    }, 4500);

    setTrips((prevTrips) =>
      prevTrips.map((trip) => {
        if (trip.id !== activeTripId) return trip;
        return {
          ...trip,
          items: trip.items.filter((item) => item.id !== itemId),
        };
      })
    );
  };

  const handleUndoRemove = () => {
    if (!deletedItemUndo) return;
    const { item, tripId } = deletedItemUndo;
    setTrips((prevTrips) =>
      prevTrips.map((trip) => {
        if (trip.id !== tripId) return trip;
        return {
          ...trip,
          items: [item, ...trip.items],
        };
      })
    );
    setDeletedItemUndo(null);
  };

  const handleUpdateQuantity = (itemId: string, delta: number) => {
    setTrips((prevTrips) =>
      prevTrips.map((trip) => {
        if (trip.id !== activeTripId) return trip;
        return {
          ...trip,
          items: trip.items.map((item) => {
            if (item.id !== itemId) return item;
            const newQty = Math.max(1, item.quantity + delta);
            return { ...item, quantity: newQty };
          }),
        };
      })
    );
  };

  const handleAddItem = (newItemData: Omit<TripItem, 'id' | 'createdAt'>) => {
    const newItem: TripItem = {
      ...newItemData,
      id: 'item-' + Date.now(),
      createdAt: Date.now(),
    };

    setTrips((prevTrips) =>
      prevTrips.map((trip) => {
        if (trip.id !== activeTripId) return trip;
        return {
          ...trip,
          items: [newItem, ...trip.items],
        };
      })
    );
  };

  const handleQuickAddItem = (suggestion: typeof QUICK_ADD_SUGGESTIONS[0]) => {
    // Check if item already exists
    const exists = activeTrip.items.some(
      (i) => i.name.toLowerCase() === (isRtl ? suggestion.name : suggestion.enName).toLowerCase()
    );
    if (exists) {
      handleUpdateQuantity(
        activeTrip.items.find(
          (i) => i.name.toLowerCase() === (isRtl ? suggestion.name : suggestion.enName).toLowerCase()
        )!.id,
        1
      );
      return;
    }

    const newItem: TripItem = {
      id: 'item-' + Date.now(),
      name: isRtl ? suggestion.name : suggestion.enName,
      category: suggestion.category as any,
      quantity: 1,
      isPacked: false,
      weightGrams: suggestion.weightGrams,
      priority: suggestion.priority as any,
      createdAt: Date.now(),
    };

    setTrips((prevTrips) =>
      prevTrips.map((trip) => {
        if (trip.id !== activeTripId) return trip;
        return {
          ...trip,
          items: [newItem, ...trip.items],
        };
      })
    );
  };

  const handleMarkAllPacked = () => {
    setTrips((prevTrips) =>
      prevTrips.map((trip) => {
        if (trip.id !== activeTripId) return trip;
        return {
          ...trip,
          items: trip.items.map((i) => ({ ...i, isPacked: true })),
        };
      })
    );
  };

  const handleResetStatus = () => {
    setTrips((prevTrips) =>
      prevTrips.map((trip) => {
        if (trip.id !== activeTripId) return trip;
        return {
          ...trip,
          items: trip.items.map((i) => ({ ...i, isPacked: false })),
        };
      })
    );
  };

  const handleRemoveCompleted = () => {
    setTrips((prevTrips) =>
      prevTrips.map((trip) => {
        if (trip.id !== activeTripId) return trip;
        return {
          ...trip,
          items: trip.items.filter((i) => !i.isPacked),
        };
      })
    );
  };

  const handleCreateTrip = (newTripData: Omit<Trip, 'id' | 'items'>) => {
    const newId = 'trip-' + Date.now();
    const newTrip: Trip = {
      ...newTripData,
      id: newId,
      items: [],
    };
    setTrips((prev) => [newTrip, ...prev]);
    setActiveTripId(newId);
  };

  const handleTabChange = (tab: 'equipment' | 'trips' | 'pdf' | 'donate' | 'profile') => {
    setActiveTab(tab);
    if (tab === 'pdf') {
      setIsPdfModalOpen(true);
    } else if (tab === 'donate') {
      setIsDonateModalOpen(true);
    } else if (tab === 'trips') {
      setIsTripModalOpen(true);
    } else if (tab === 'profile') {
      setIsAuthModalOpen(true);
    }
  };

  return (
    <AndroidFrame>
      {/* PWA Install Banner */}
      <PWAInstallBanner />

      {/* Android Top App Bar */}
      <Navbar
        activeTab={activeTab}
        onChangeTab={handleTabChange}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenTripModal={() => setIsTripModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenApkModal={() => setIsApkModalOpen(true)}
        activeTrip={activeTrip}
        user={user}
      />

      {/* Hero Visual Header Banner */}
      <div className="relative h-32 md:h-36 w-full shrink-0 overflow-hidden no-print">
        <img
          src={heroImage}
          alt="Trip Equipment"
          className="w-full h-full object-cover object-center filter brightness-75 contrast-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent flex flex-col justify-end p-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">
                {t.appName}
              </span>
              <h2 className="text-sm md:text-base font-extrabold text-white truncate max-w-[260px] md:max-w-md">
                {activeTrip.title}
              </h2>
            </div>
            <span className="text-[11px] text-slate-300 font-medium bg-slate-950/60 backdrop-blur-md px-2.5 py-1 rounded-xl border border-slate-700/60">
              {formatNumber(activeTrip.items.length)} قلم وسیله
            </span>
          </div>
        </div>
      </div>

      {/* MAIN EQUIPMENT LIST VIEW */}
      <main className="flex-1 flex flex-col">
        <EquipmentList
          items={activeTrip.items}
          onTogglePacked={handleTogglePacked}
          onRemoveItem={handleRemoveItem}
          onUpdateQuantity={handleUpdateQuantity}
          onQuickAddItem={handleQuickAddItem}
          onOpenAddModal={() => setIsAddModalOpen(true)}
          onMarkAllPacked={handleMarkAllPacked}
          onResetStatus={handleResetStatus}
          onRemoveCompleted={handleRemoveCompleted}
        />

        {/* Developer Credit and byhrsn.com Badge */}
        <DeveloperBadge
          onOpenDonate={() => setIsDonateModalOpen(true)}
          onOpenApk={() => setIsApkModalOpen(true)}
        />
      </main>

      {/* Undo Item Removed Floating Toast */}
      {deletedItemUndo && (
        <div className="no-print fixed bottom-20 left-4 right-4 max-w-sm mx-auto z-50 bg-slate-800 border border-slate-700 text-slate-100 rounded-2xl p-3 shadow-2xl flex items-center justify-between text-xs animate-slide-up">
          <span className="truncate">
            «{deletedItemUndo.item.name}» {t.itemRemoved}
          </span>
          <button
            onClick={handleUndoRemove}
            className="text-emerald-400 font-bold hover:underline px-2 py-1 shrink-0 cursor-pointer"
          >
            {t.undo}
          </button>
        </div>
      )}

      {/* MODALS */}
      <AddItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddItem={handleAddItem}
      />

      <TripSelector
        trips={trips}
        activeTripId={activeTripId}
        onSelectTrip={(id) => setActiveTripId(id)}
        onCreateTrip={handleCreateTrip}
        isOpen={isTripModalOpen}
        onClose={() => setIsTripModalOpen(false)}
      />

      <AuthModal
        user={user}
        onUpdateUser={(updated) => setUser(updated)}
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <CardDonationModal
        isOpen={isDonateModalOpen}
        onClose={() => {
          setIsDonateModalOpen(false);
          setActiveTab('equipment');
        }}
      />

      <PdfExportModal
        trip={activeTrip}
        user={user}
        isOpen={isPdfModalOpen}
        onClose={() => {
          setIsPdfModalOpen(false);
          setActiveTab('equipment');
        }}
      />

      <ApkDownloadModal
        isOpen={isApkModalOpen}
        onClose={() => setIsApkModalOpen(false)}
      />
    </AndroidFrame>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <MainApp />
    </LanguageProvider>
  );
}
