export interface Workshop {
  id: string | number;
  title: string;
  description: string;
  category: 'Painting' | 'Digital Sculpting' | 'Photography' | 'Curator Talks' | 'Sculpture' | 'Drawing' | string;
  artist_name: string;
  artist_role?: string;
  image_url: string;
  date: string;          // e.g. "OCT 28, 2024" or ISO date string
  time?: string;          // e.g. "10:00 AM" or "14:00 - 18:00 EST"
  location?: string;
  price: number;         // 0 for Free
  capacity: number;      // Total seats
  seats_left: number;    // Remaining seats
  difficulty?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  status?: 'AVAILABLE' | 'FEW_SEATS' | 'SOLD_OUT';
  is_featured?: boolean;
  featured_details?: string;
}

export interface WorkshopFilterState {
  category: string;
  searchQuery: string;
}
