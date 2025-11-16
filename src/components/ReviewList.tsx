import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  profiles: {
    name: string;
  };
}

interface ReviewListProps {
  equipmentId?: string;
  operatorId?: string;
}

export const ReviewList = ({ equipmentId, operatorId }: ReviewListProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
    
    const channel = supabase
      .channel('reviews-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reviews',
          filter: equipmentId ? `equipment_id=eq.${equipmentId}` : operatorId ? `operator_id=eq.${operatorId}` : undefined,
        },
        () => {
          fetchReviews();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [equipmentId, operatorId]);

  const fetchReviews = async () => {
    try {
      let query = supabase
        .from("reviews")
        .select(`
          id,
          rating,
          comment,
          created_at,
          profiles!reviewer_id (
            name
          )
        `)
        .order("created_at", { ascending: false });

      if (equipmentId) {
        query = query.eq("equipment_id", equipmentId);
      } else if (operatorId) {
        query = query.eq("operator_id", operatorId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-muted-foreground">Loading reviews...</div>;
  }

  if (reviews.length === 0) {
    return <div className="text-muted-foreground">No reviews yet</div>;
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Card key={review.id}>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-semibold">{review.profiles.name}</p>
                <div className="flex gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= review.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <span className="text-sm text-muted-foreground">
                {new Date(review.created_at).toLocaleDateString()}
              </span>
            </div>
            {review.comment && (
              <p className="text-muted-foreground mt-3">{review.comment}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
