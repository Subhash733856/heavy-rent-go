import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BookingModal from "@/components/BookingModal";
import { MapPin, Clock, Star, Fuel, Shield, Users } from "lucide-react";

const equipmentListings = [
  {
    id: 1,
    name: "CAT 320D Excavator",
    category: "Earthmoving",
    price: "₹2,500",
    image: "🚜",
    rating: 4.8,
    reviews: 156,
    location: "Andheri, Mumbai",
    distance: "2.3 km away",
    operator: "Raj Construction Services",
    available: true,
    specifications: {
      weight: "20 tons",
      power: "122 HP",
      bucket: "1.2 m³"
    },
    features: ["GPS Tracking", "Fuel Efficient", "Certified Operator", "Insurance Included"]
  },
  {
    id: 2,
    name: "Tata Prima Dump Truck",
    category: "Hauling",
    price: "₹1,500",
    image: "🛻",
    rating: 4.6,
    reviews: 89,
    location: "Gurgaon, Delhi NCR",
    distance: "1.8 km away",
    operator: "Delhi Transport Co.",
    available: true,
    specifications: {
      capacity: "25 tons",
      power: "280 HP",
      fuel: "Diesel"
    },
    features: ["24/7 Available", "Experienced Driver", "Route Optimization", "Live Tracking"]
  },
  {
    id: 3,
    name: "Ashok Leyland Mobile Crane",
    category: "Material Handling",
    price: "₹4,500",
    image: "🧱",
    rating: 4.9,
    reviews: 234,
    location: "Electronic City, Bangalore",
    distance: "3.1 km away",
    operator: "Bangalore Lifting Solutions",
    available: false,
    specifications: {
      capacity: "50 tons",
      boom: "45 meters",
      power: "350 HP"
    },
    features: ["Certified Operator", "Safety Certified", "Emergency Response", "Full Insurance"]
  },
  {
    id: 4,
    name: "Schwing Concrete Pump",
    category: "Concreting",
    price: "₹2,400",
    image: "🧰",
    rating: 4.7,
    reviews: 98,
    location: "Koramangala, Bangalore",
    distance: "1.2 km away",
    operator: "Concrete Masters Ltd",
    available: true,
    specifications: {
      output: "90 m³/hr",
      reach: "32 meters",
      power: "240 HP"
    },
    features: ["High Output", "Remote Control", "Expert Operator", "Quality Assured"]
  },
  {
    id: 5,
    name: "JCB Road Roller",
    category: "Road Construction",
    price: "₹1,400",
    image: "🛣",
    rating: 4.5,
    reviews: 67,
    location: "Powai, Mumbai",
    distance: "4.5 km away",
    operator: "Mumbai Road Works",
    available: true,
    specifications: {
      weight: "12 tons",
      width: "2.1 meters",
      power: "140 HP"
    },
    features: ["Vibration Control", "Fuel Efficient", "Smooth Operation", "Daily Maintenance"]
  },
  {
    id: 6,
    name: "Hydraulic Pile Driver",
    category: "Foundation",
    price: "₹5,500",
    image: "🌉",
    rating: 4.9,
    reviews: 145,
    location: "Bandra Kurla, Mumbai",
    distance: "5.2 km away",
    operator: "Foundation Experts Pvt Ltd",
    available: true,
    specifications: {
      force: "800 kN",
      depth: "30 meters",
      power: "400 HP"
    },
    features: ["Precision Control", "Safety Certified", "Expert Team", "Project Management"]
  }
];

export const EquipmentListing = () => {
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

        {/* Equipment Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {equipmentListings.map((equipment) => (
            <Card 
              key={equipment.id} 
              className="group overflow-hidden hover:shadow-equipment transition-all duration-300 hover:scale-105"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-6xl">{equipment.image}</div>
                  <div className="text-right">
                    <Badge 
                      variant={equipment.available ? "default" : "secondary"}
                      className={equipment.available ? "bg-green-500 hover:bg-green-600" : "bg-red-500"}
                    >
                      {equipment.available ? "Available" : "Busy"}
                    </Badge>
                  </div>
                </div>
                
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {equipment.name}
                </CardTitle>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="outline" className="text-xs">
                    {equipment.category}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Rating & Reviews */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="font-semibold">{equipment.rating}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ({equipment.reviews} reviews)
                  </span>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{equipment.location}</div>
                    <div className="text-muted-foreground">{equipment.distance}</div>
                  </div>
                </div>

                {/* Operator */}
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{equipment.operator}</span>
                </div>

                {/* Specifications */}
                <div className="bg-muted/30 p-3 rounded-lg space-y-2">
                  <h4 className="font-semibold text-sm">Specifications</h4>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {Object.entries(equipment.specifications).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <div className="font-medium capitalize">{key}</div>
                        <div className="text-muted-foreground">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Features</h4>
                  <div className="flex flex-wrap gap-1">
                    {equipment.features.map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Price & Actions */}
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-2xl font-bold text-primary">
                        {equipment.price}
                      </div>
                      <div className="text-sm text-muted-foreground">per hour</div>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Min 4hrs</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      disabled={!equipment.available}
                    >
                      View Details
                    </Button>
                    <BookingModal 
                      equipment={equipment}
                      trigger={
                        <Button 
                          size="sm" 
                          className="flex-1"
                          disabled={!equipment.available}
                        >
                          {equipment.available ? "Book Now" : "Unavailable"}
                        </Button>
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

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