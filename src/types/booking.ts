import { Dish } from './index';

export type TimeSlot = {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
};

export type DayAvailability = {
  date: string;
  timeSlots: TimeSlot[];
};

export type BookingRequest = {
  chefId: string;
  date: string;
  startTime: string;
  endTime: string;
  numberOfGuests: number;
  selectedDishes: string[]; // Dish IDs
  specialRequests?: string;
  location: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  totalAmount: number;
};

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export type Booking = BookingRequest & {
  id: string;
  userId: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  review?: {
    rating: number;
    comment: string;
    createdAt: string;
  };
};