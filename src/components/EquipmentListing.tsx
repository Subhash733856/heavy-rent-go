import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BookingModal from "@/components/BookingModal";
import { MapPin, Clock, Star, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Equipment {
  id: string;
  name: string;
  type: string;
  category: string;
  daily_rate: number;
  location: string;
  city: string;
  description: string | null;
  images: string[] | null;
  status: string;
  specifications: any;
  owner_id: string;
  profiles?: {
    name: string;
  };
}

export const EquipmentListing = () => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEquipment();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('equipment-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'equipment'
        },
        () => {
          fetchEquipment();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchEquipment = async () => {
    try {
      const { data, error } = await supabase
        .from('equipment')
        .select(`
          *,
          profiles:owner_id (
            name
          )
        `)
        .eq('status', 'available')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEquipment(data || []);
    } catch (error: any) {
      toast.error("Failed to load equipment");
      console.error("Error fetching equipment:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">Loading equipment...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            Available Near You
          </Badge>
          <h2 className="text-4xl font-heading font-bold mb-6">
            Ready-to-Deploy Equipment
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Professional equipment with certified operators available for immediate booking. 
            All prices include operator, fuel, and basic insurance.
          </p>
        </div>

        {equipment.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground text-lg">No equipment available at the moment.</p>
            <p className="text-sm text-muted-foreground mt-2">Check back later for new listings!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {equipment.map((item) => (
              <Card 
                key={item.id} 
                className="group overflow-hidden hover:shadow-equipment transition-all duration-300 hover:scale-105"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-6xl">
                      {item.images && item.images[0] ? (
                        <img src={item.images[0]} alt={item.name} className="w-16 h-16 object-cover rounded" />
                      ) : (
                        <span>🚜</span>
                      )}
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant="default"
                        className="bg-green-500 hover:bg-green-600"
                      >
                        Available
                      </Badge>
                    </div>
                  </div>
                  
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {item.name}
                  </CardTitle>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant="outline" className="text-xs">
                      {item.category}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Location */}
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{item.location}</div>
                      <div className="text-muted-foreground">{item.city}</div>
                    </div>
                  </div>

                  {/* Operator */}
                  {item.profiles && (
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{item.profiles.name}</span>
                    </div>
                  )}

                  {/* Description */}
                  {item.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {item.description}
                    </p>
                  )}

                  {/* Specifications */}
                  {item.specifications && Object.keys(item.specifications).length > 0 && (
                    <div className="bg-muted/30 p-3 rounded-lg space-y-2">
                      <h4 className="font-semibold text-sm">Specifications</h4>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        {Object.entries(item.specifications).slice(0, 3).map(([key, value]) => (
                          <div key={key} className="text-center">
                            <div className="font-medium capitalize">{key}</div>
                            <div className="text-muted-foreground">{String(value)}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Price & Actions */}
                  <div className="pt-4 border-t border-border">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-2xl font-bold text-primary">
                          ₹{item.daily_rate}
                        </div>
                        <div className="text-sm text-muted-foreground">per day</div>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Min 1 day</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                      >
                        View Details
                      </Button>
                      <BookingModal 
                        equipment={item}
                        trigger={
                          <Button 
                            size="sm" 
                            className="flex-1"
                          >
                            Book Now
                          </Button>
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Load More Equipment
          </Button>
        </div>
      </div>
    </section>
  );
};