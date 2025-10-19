export type User = {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  created_at: string;
  preferences?: {
    cuisines: string[];
    dietary: string[];
    budget: string;
  };
};

export type Chef = {
  id: string;
  user_id: string;
  name: string;
  bio: string;
  specialties: string[];
  rating: number;
  price_range: {
    min: number;
    max: number;
  };
  availability?: {
    days: string[];
    hours: string[];
  };
  image_url: string;
  gallery?: string[];
};

export type Dish = {
  id: string;
  chef_id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  cuisine_type: string[];
  dietary_info: string[];
  prep_time: number;
  serves: number;
};

export type Review = {
  id: string;
  user_id: string;
  chef_id: string;
  rating: number;
  comment: string;
  created_at: string;
};

export type Booking = {
  id: string;
  user_id: string;
  chef_id: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  guests: number;
  total_amount: number;
  special_requests?: string;
  menu_items: string[]; // dish IDs
};