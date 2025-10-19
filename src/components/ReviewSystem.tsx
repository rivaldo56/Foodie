import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { Review } from '@/types/index';

type Props = {
  chefId: string;
  onSubmitReview: (review: Omit<Review, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  existingReviews: Review[];
  userHasBooked?: boolean;
};

export default function ReviewSystem({ chefId, onSubmitReview, existingReviews, userHasBooked }: Props) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmitReview({
        chef_id: chefId,
        rating,
        comment,
      });
      setRating(5);
      setComment('');
    } catch (error) {
      console.error('Failed to submit review:', error);
    } finally {
      setLoading(false);
    }
  };

  const averageRating = existingReviews.length
    ? (existingReviews.reduce((sum, r) => sum + r.rating, 0) / existingReviews.length).toFixed(1)
    : 'No ratings yet';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Reviews</h2>
        <div className="text-lg font-medium">
          Average Rating: <span className="text-yellow-500">{averageRating}</span>
        </div>
      </div>

      {userHasBooked && (
        <Card className="p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Rating</label>
              <div className="mt-1 flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`text-2xl ${
                      star <= rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Comment</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                rows={3}
                required
                minLength={10}
              />
            </div>

            <Button type="submit" isLoading={loading}>
              Submit Review
            </Button>
          </form>
        </Card>
      )}

      <div className="space-y-4">
        {existingReviews.map((review) => (
          <Card key={review.id} className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={`text-lg ${
                        i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <p className="mt-2 text-gray-700">{review.comment}</p>
              </div>
              <div className="text-sm text-gray-500">
                {new Date(review.created_at).toLocaleDateString()}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}