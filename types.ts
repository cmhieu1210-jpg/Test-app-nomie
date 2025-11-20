
export interface Charm {
  id: string;
  name: string;
  category: 'symbol' | 'letter' | 'stone' | 'flag' | 'animal' | 'custom';
  imageUrl: string;
  price: number;
  isGold?: boolean;
  isFullLink?: boolean; // New property: If true, this image replaces the base link entirely
}

export interface BraceletSize {
  id: string;
  name: string;
  links: number;
  description: string;
}

export interface BraceletLink {
  id: string; // Unique ID for the slot position
  charm: Charm | null; // Null means it's a blank base link
}

export enum AppMode {
  BUILDER = 'BUILDER',
  AI_STUDIO = 'AI_STUDIO'
}
