import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { BookingRequest } from '@/types/booking';

type Props = {
  chefId: string;
  onSubmit: (booking: BookingRequest) => Promise<void>;
  availableDates: string[];
  menuItems: Array<{
    id: string;
    name: string;
    price: number;
  }>;
};

export default function BookingForm({ chefId, onSubmit, availableDates, menuItems }: Props) {
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [guests, setGuests] = useState(2);
  const [selectedDishes, setSelectedDishes] = useState<Set<string>>(new Set());
  const [address, setAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) return;

    setLoading(true);
    try {
      const total = calculateTotal();
      await onSubmit({
        chefId,
        date: selectedDate,
        startTime: selectedTime,
        endTime: '', // Calculate based on selected dishes/service
        numberOfGuests: guests,
        selectedDishes: Array.from(selectedDishes),
        location: address,
        totalAmount: total,
      });
    } catch (error) {
      console.error('Booking failed:', error);
      // Handle error - show toast/notification
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    const dishesTotal = Array.from(selectedDishes).reduce((sum, dishId) => {
      const dish = menuItems.find(d => d.id === dishId);
      return sum + (dish?.price || 0);
    }, 0);
    return dishesTotal * guests; // Add service fee, taxes etc.
  };

  const toggleDish = (dishId: string) => {
    const newSelection = new Set(selectedDishes);
    if (newSelection.has(dishId)) {
      newSelection.delete(dishId);
    } else {
      newSelection.add(dishId);
    }
    setSelectedDishes(newSelection);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <div className="space-y-4 p-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            >
              <option value="">Select date</option>
              {availableDates.map((date) => (
                <option key={date} value={date}>
                  {new Date(date).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Time</label>
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            >
              <option value="">Select time</option>
              {/* Add time slots based on selected date */}
              {['18:00', '19:00', '20:00'].map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Number of Guests</label>
            <input
              type="number"
              min="1"
              max="20"
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Select Dishes</label>
            <div className="mt-2 space-y-2">
              {menuItems.map((dish) => (
                <label key={dish.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedDishes.has(dish.id)}
                    onChange={() => toggleDish(dish.id)}
                    className="rounded border-gray-300"
                  />
                  <span>{dish.name} - ${dish.price}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              placeholder="Address"
              value={address.address}
              onChange={(e) => setAddress({ ...address, address: e.target.value })}
              className="block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
            <input
              type="text"
              placeholder="City"
              value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
              className="block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
            <input
              type="text"
              placeholder="Postal Code"
              value={address.postalCode}
              onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
              className="block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
            <input
              type="text"
              placeholder="Country"
              value={address.country}
              onChange={(e) => setAddress({ ...address, country: e.target.value })}
              className="block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div className="border-t pt-4">
            <div className="text-lg font-medium">Total: ${calculateTotal()}</div>
          </div>

          <Button type="submit" disabled={loading} isLoading={loading} fullWidth>
            {loading ? 'Processing...' : 'Book Now'}
          </Button>
        </div>
      </Card>
    </form>
  );
}