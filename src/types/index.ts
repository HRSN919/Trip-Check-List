export type CategoryId =
  | 'shelter'
  | 'sleep'
  | 'clothing'
  | 'cooking'
  | 'electronics'
  | 'medical'
  | 'navigation'
  | 'hygiene'
  | 'documents'
  | 'misc';

export type PriorityLevel = 'essential' | 'recommended' | 'optional';

export interface TripItem {
  id: string;
  name: string;
  category: CategoryId;
  quantity: number;
  isPacked: boolean;
  weightGrams?: number;
  priority: PriorityLevel;
  notes?: string;
  createdAt: number;
}

export interface Trip {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  tripType: 'camping' | 'hiking' | 'backpacking' | 'roadtrip' | 'climbing';
  items: TripItem[];
  notes?: string;
}

export interface UserProfile {
  phoneNumber: string;
  displayName: string;
  isLoggedIn: boolean;
  avatarUrl?: string;
  joinDate: string;
}

export interface DeveloperSupportDetails {
  developerWebsite: string;
  developerDomain: string;
  developerName: string;
  contactEmail: string;
}

export interface DonationRecord {
  id: string;
  amount: number;
  donorName: string;
  date: string;
  referenceCode: string;
  note?: string;
}
