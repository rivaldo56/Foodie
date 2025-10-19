import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import ShimmerImage from '@/components/ui/ShimmerImage';
import type { Dish } from '@/types/index';

type Props = {
  dishes: Dish[];
  onAddDish: (dish: Omit<Dish, 'id' | 'chef_id'>) => Promise<void>;
  onUpdateDish: (id: string, updates: Partial<Dish>) => Promise<void>;
  onDeleteDish: (id: string) => Promise<void>;
};

export default function MenuManager({ dishes, onAddDish, onUpdateDish, onDeleteDish }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newDish, setNewDish] = useState(false);
  const [loading, setLoading] = useState(false);

  const initialDishState = {
    name: '',
    description: '',
    price: 0,
    image_url: '',
    cuisine_type: [],
    dietary_info: [],
    prep_time: 30,
    serves: 1,
  };

  const [formData, setFormData] = useState(initialDishState);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        await onUpdateDish(editingId, formData);
      } else if (newDish) {
        await onAddDish(formData);
      }
      setEditingId(null);
      setNewDish(false);
      setFormData(initialDishState);
    } catch (error) {
      console.error('Failed to save dish:', error);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (dish: Dish) => {
    setEditingId(dish.id);
    setFormData({
      name: dish.name,
      description: dish.description,
      price: dish.price,
      image_url: dish.image_url,
      cuisine_type: dish.cuisine_type,
      dietary_info: dish.dietary_info,
      prep_time: dish.prep_time,
      serves: dish.serves,
    });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this dish?')) return;
    setLoading(true);
    try {
      await onDeleteDish(id);
    } catch (error) {
      console.error('Failed to delete dish:', error);
    } finally {
      setLoading(false);
    }
  };

  const DishForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          rows={3}
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Price ($)</label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            min="0"
            step="0.01"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Image URL</label>
          <input
            type="url"
            value={formData.image_url}
            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Prep Time (minutes)</label>
          <input
            type="number"
            value={formData.prep_time}
            onChange={(e) => setFormData({ ...formData, prep_time: Number(e.target.value) })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            min="1"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Serves</label>
          <input
            type="number"
            value={formData.serves}
            onChange={(e) => setFormData({ ...formData, serves: Number(e.target.value) })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            min="1"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Cuisine Types (comma-separated)</label>
        <input
          type="text"
          value={formData.cuisine_type.join(', ')}
          onChange={(e) => setFormData({ ...formData, cuisine_type: e.target.value.split(',').map(s => s.trim()) })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          placeholder="Italian, Mediterranean"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Dietary Info (comma-separated)</label>
        <input
          type="text"
          value={formData.dietary_info.join(', ')}
          onChange={(e) => setFormData({ ...formData, dietary_info: e.target.value.split(',').map(s => s.trim()) })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          placeholder="Vegetarian, Gluten-free"
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          variant="outline"
          onClick={() => {
            setEditingId(null);
            setNewDish(false);
            setFormData(initialDishState);
          }}
        >
          Cancel
        </Button>
        <Button type="submit" isLoading={loading}>
          {editingId ? 'Update Dish' : 'Add Dish'}
        </Button>
      </div>
    </form>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold">Menu Items</h2>
        <Button onClick={() => setNewDish(true)} disabled={newDish || editingId !== null}>
          Add New Dish
        </Button>
      </div>

      {newDish && (
        <Card className="p-4">
          <DishForm />
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {dishes.map((dish) => (
          <Card key={dish.id} className="overflow-hidden">
            {editingId === dish.id ? (
              <div className="p-4">
                <DishForm />
              </div>
            ) : (
              <>
                <div className="relative h-48">
                  <ShimmerImage
                    src={dish.image_url}
                    alt={dish.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium">{dish.name}</h3>
                  <p className="mt-1 text-sm text-gray-600">{dish.description}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="font-medium">${dish.price}</div>
                    <div className="text-sm text-gray-500">{dish.prep_time}min</div>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {dish.cuisine_type.map((type) => (
                      <span
                        key={type}
                        className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-end space-x-2">
                    <Button variant="outline" size="sm" onClick={() => startEdit(dish)}>
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(dish.id)}
                      disabled={loading}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}