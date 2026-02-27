export type TabType = 'home' | 'charity' | 'goals' | 'booking' | 'pods' | 'nearby' | 'equipment';

export interface Venue {
  id: string;
  name: string;
  type: string;
  distance: string;
  price: number;
  image: string;
}

export interface Equipment {
  id: string;
  name: string;
  status: 'available' | 'rented' | 'repairing';
  price: number;
  image: string;
}

export interface Goal {
  id: string;
  title: string;
  points: number;
  completed: boolean;
  icon: string;
}
