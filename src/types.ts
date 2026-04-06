export type Role = 'Farmer' | 'Tractor Driver' | 'Fertilizer Provider' | 'Agronomist' | 'Water Supplier';

export type Language = 'en' | 'ru' | 'uz';

export interface User {
  name: string;
  surname: string;
  age: number;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  experience: number;
  role: Role;
  // Role-specific fields
  serviceType?: string;
  equipment?: string;
  workingHours?: string;
  minLandSize?: number;
  maxLandSize?: number;
  price?: number;
  extraConditions?: string;
  profilePhoto?: string;
}

export interface CropData {
  type: string;
  plantingDate: string;
  landSize: number;
  soilType: string;
  irrigationMethod: string;
  expectedAmount: number;
}

export interface Task {
  id: string;
  date: string;
  type: 'plowing' | 'watering' | 'planting' | 'harvesting';
  explanation: string;
  growthStage: string;
  weatherInfluence: string;
  riskIfSkipped: string;
  status: 'pending' | 'completed' | 'accepted';
}

export interface Order {
  id: string;
  farmerName: string;
  location: string;
  typeOfWork: string;
  time: string;
  date: string;
  landSize: number;
  notes: string;
  status: 'pending' | 'accepted' | 'completed';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'other';
  text: string;
  timestamp: string;
}

export interface Provider {
  id: string;
  name: string;
  role: Role;
  rating: number;
  location: string;
  services: string[];
  price: string;
  photo: string;
}
