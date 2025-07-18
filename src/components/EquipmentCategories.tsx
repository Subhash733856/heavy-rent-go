import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Truck, 
  Wrench, 
  Building, 
  Hammer, 
  Zap,
  Cog,
  MapPin,
  Clock,
  ArrowRight
} from "lucide-react";

const equipmentCategories = [
  {
    id: "earthmoving",
    title: "🚜 Earthmoving Equipment",
    icon: Truck,
    count: 20,
    popular: true,
    items: ["Excavator", "Mini Excavator", "Bulldozer", "Backhoe Loader", "Wheel Loader", "Track Loader"],
    description: "Heavy machinery for earth moving, digging, and material handling"
  },
  {
    id: "hauling",
    title: "🛻 Hauling & Dumping",
    icon: Truck,
    count: 15,
    popular: true,
    items: ["Dump Truck (Tipper)", "Articulated Dump Truck", "Site Dumper", "Haul Truck", "Flatbed Truck"],
    description: "Vehicles for transporting and dumping materials"
  },
  {
    id: "material-handling",
    title: "🧱 Material Handling",
    icon: Wrench,
    count: 12,
    popular: false,
    items: ["Mobile Crane", "Tower Crane", "Crawler Crane", "Telescopic Handler", "Forklift"],
    description: "Equipment for lifting and moving heavy materials"
  },
  {
    id: "concreting",
    title: "🧰 Concreting Equipment",
    icon: Building,
    count: 10,
    popular: false,
    items: ["Concrete Mixer Truck", "Concrete Pump Truck", "Boom Pump", "Concrete Paver", "Concrete Finisher"],
    description: "Specialized equipment for concrete work"
  },
  {
    id: "road-construction",
    title: "🛣 Road Construction",
    icon: Hammer,
    count: 8,
    popular: false,
    items: ["Asphalt Paver", "Pneumatic Roller", "Vibratory Roller", "Cold Planer", "Road Reclaimer"],
    description: "Equipment for road building and maintenance"
  },
  {
    id: "foundation",
    title: "🌉 Foundation & Piling",
    icon: Zap,
    count: 6,
    popular: false,
    items: ["Pile Driver", "Rotary Drilling Rig", "Hydraulic Hammer", "Bored Pile Rig", "Auger Drill Rig"],
    description: "Heavy equipment for foundation work"
  },
  {
    id: "compaction",
    title: "💧 Compaction & Soil",
    icon: Cog,
    count: 8,
    popular: false,
    items: ["Plate Compactor", "Jumping Jack", "Sheepsfoot Roller", "Soil Stabilizer", "Land Leveler"],
    description: "Equipment for soil compaction and preparation"
  },
  {
    id: "special-purpose",
    title: "🛠 Special Purpose",
    icon: MapPin,
    count: 15,
    popular: false,
    items: ["Water Tanker", "Man Lift", "Boom Lift", "Air Compressor Truck", "Mobile Workshop"],
    description: "Specialized construction vehicles"
  }
];

export const EquipmentCategories = () => {
  return (
    <section id="equipment" className="py-20 bg-gradient-steel">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            100+ Equipment Types Available
          </Badge>
          <h2 className="text-4xl font-heading font-bold mb-6">
            Professional Equipment Catalog
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From excavators to cranes, find the right heavy equipment for your project. 
            All equipment comes with certified operators and comprehensive insurance.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {equipmentCategories.map((category) => (
            <Card 
              key={category.id} 
              className="group p-6 hover:shadow-equipment transition-all duration-300 cursor-pointer border-2 hover:border-primary/30 hover:scale-105"
              onClick={() => {
                const element = document.getElementById('equipment-listing');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="bg-gradient-industrial p-3 rounded-lg shadow-lg">
                    <category.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div className="text-right">
                    {category.popular && (
                      <Badge variant="secondary" className="mb-2 text-xs">
                        Popular
                      </Badge>
                    )}
                    <div className="text-2xl font-bold text-primary">
                      {category.count}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      available
                    </div>
                  </div>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="font-heading font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {category.description}
                  </p>
                </div>

                {/* Equipment List */}
                <div className="space-y-2">
                  {category.items.slice(0, 3).map((item, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      <span className="text-muted-foreground">{item}</span>
                    </div>
                  ))}
                  {category.items.length > 3 && (
                    <div className="text-xs text-primary font-medium">
                      +{category.items.length - 3} more types
                    </div>
                  )}
                </div>

                {/* Quick Stats */}
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>Nearby</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>Available 24/7</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto p-8 bg-gradient-industrial text-primary-foreground shadow-glow">
            <h3 className="text-2xl font-heading font-bold mb-4">
              Need Equipment Right Now?
            </h3>
            <p className="mb-6 opacity-90">
              Our 24/7 dispatch team can have equipment at your site within the hour. 
              Professional operators included.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="outline" 
                size="lg" 
                className="bg-background/10 border-accent-foreground/30 text-primary-foreground hover:bg-background/20"
                onClick={() => window.open('tel:+918000000000', '_self')}
              >
                Call Emergency Dispatch
              </Button>
              <Button 
                variant="secondary" 
                size="lg" 
                className="group"
                onClick={() => {
                  const element = document.getElementById('equipment-listing');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Browse All Equipment
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};