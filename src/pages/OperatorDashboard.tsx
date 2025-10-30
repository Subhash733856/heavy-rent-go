import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Construction, DollarSign, Calendar, TrendingUp, Plus, Edit, Eye, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const revenueData = [
  { month: 'Jan', revenue: 25000, bookings: 8 },
  { month: 'Feb', revenue: 32000, bookings: 12 },
  { month: 'Mar', revenue: 28000, bookings: 10 },
  { month: 'Apr', revenue: 35000, bookings: 15 },
  { month: 'May', revenue: 42000, bookings: 18 },
  { month: 'Jun', revenue: 38000, bookings: 14 }
];

const equipmentData = [
  { name: 'Excavators', count: 5, revenue: 45000 },
  { name: 'Backhoes', count: 3, revenue: 28000 },
  { name: 'Cranes', count: 2, revenue: 35000 },
  { name: 'Dozers', count: 4, revenue: 32000 }
];

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

interface Equipment {
  id: string;
  name: string;
  type: string;
  category: string;
  daily_rate: number;
  location: string;
  city: string;
  description: string | null;
  status: string;
  specifications: any;
}

interface Booking {
  id: string;
  equipment_id: string;
  client_name: string;
  start_time: string;
  end_time: string;
  status: string;
  total_amount: number;
  equipment?: {
    name: string;
  };
}

export default function OperatorDashboard() {
  const { user, profile, isOperator } = useAuth();
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [showAddEquipment, setShowAddEquipment] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newEquipment, setNewEquipment] = useState({
    name: "",
    type: "",
    category: "",
    daily_rate: "",
    location: "",
    city: "",
    description: "",
    specifications: {}
  });

  useEffect(() => {
    if (user && isOperator && profile?.id) {
      fetchEquipment();
      fetchBookings();
    }
  }, [user, isOperator, profile]);

  const fetchEquipment = async () => {
    try {
      const { data, error } = await supabase
        .from('equipment')
        .select('*')
        .eq('owner_id', profile?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEquipment(data || []);
    } catch (error: any) {
      toast.error("Failed to load equipment");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          equipment:equipment_id (
            name
          )
        `)
        .eq('operator_id', profile?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error: any) {
      console.error("Failed to load bookings:", error);
    }
  };

  if (!user || !isOperator) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You need to be logged in as an operator to access this dashboard.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const handleAddEquipment = async () => {
    if (!newEquipment.name || !newEquipment.category || !newEquipment.daily_rate || !newEquipment.location || !newEquipment.city) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const { data, error } = await supabase
        .from('equipment')
        .insert([{
          owner_id: profile?.id,
          name: newEquipment.name,
          type: newEquipment.type || newEquipment.category,
          category: newEquipment.category,
          daily_rate: Number(newEquipment.daily_rate),
          location: newEquipment.location,
          city: newEquipment.city,
          description: newEquipment.description || null,
          specifications: newEquipment.specifications,
          status: 'available'
        }])
        .select();

      if (error) throw error;

      toast.success("Equipment added successfully!");
      setNewEquipment({ name: "", type: "", category: "", daily_rate: "", location: "", city: "", description: "", specifications: {} });
      setShowAddEquipment(false);
      fetchEquipment();
    } catch (error: any) {
      toast.error("Failed to add equipment: " + error.message);
      console.error(error);
    }
  };

  const handleDeleteEquipment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('equipment')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success("Equipment deleted successfully!");
      fetchEquipment();
    } catch (error: any) {
      toast.error("Failed to delete equipment");
      console.error(error);
    }
  };

  const handleUpdateBookingStatus = async (id: string, status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled') => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      toast.success(`Booking status updated to ${status}`);
      fetchBookings();
    } catch (error: any) {
      toast.error("Failed to update booking status");
      console.error(error);
    }
  };

  const totalRevenue = revenueData.reduce((sum, month) => sum + month.revenue, 0);
  const totalBookings = revenueData.reduce((sum, month) => sum + month.bookings, 0);
  const avgRevenue = Math.round(totalRevenue / revenueData.length);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Operator Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {profile?.name}! Manage your equipment and bookings.</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Equipment</CardTitle>
              <Construction className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{equipment.length}</div>
              <p className="text-xs text-muted-foreground">2 currently booked</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalBookings}</div>
              <p className="text-xs text-muted-foreground">+8% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Monthly Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{avgRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Last 6 months</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="equipment">Equipment</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trend</CardTitle>
                  <CardDescription>Monthly revenue over the last 6 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`₹${value}`, 'Revenue']} />
                      <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Equipment Performance</CardTitle>
                  <CardDescription>Revenue by equipment category</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={equipmentData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="revenue"
                      >
                        {equipmentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`₹${value}`, 'Revenue']} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Monthly Bookings</CardTitle>
                  <CardDescription>Number of bookings per month</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="bookings" fill="hsl(var(--secondary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="equipment" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">My Equipment</h2>
              <Dialog open={showAddEquipment} onOpenChange={setShowAddEquipment}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Equipment
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add New Equipment</DialogTitle>
                    <DialogDescription>Fill in the details to add new equipment to your fleet.</DialogDescription>
                  </DialogHeader>
                    <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Equipment Name *</Label>
                      <Input
                        id="name"
                        value={newEquipment.name}
                        onChange={(e) => setNewEquipment({...newEquipment, name: e.target.value})}
                        placeholder="e.g., CAT 320D Excavator"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select value={newEquipment.category} onValueChange={(value) => setNewEquipment({...newEquipment, category: value, type: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="excavators">Excavators</SelectItem>
                          <SelectItem value="backhoes">Backhoes</SelectItem>
                          <SelectItem value="cranes">Cranes</SelectItem>
                          <SelectItem value="dozers">Dozers</SelectItem>
                          <SelectItem value="loaders">Loaders</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="daily_rate">Daily Rate (₹) *</Label>
                      <Input
                        id="daily_rate"
                        type="number"
                        value={newEquipment.daily_rate}
                        onChange={(e) => setNewEquipment({...newEquipment, daily_rate: e.target.value})}
                        placeholder="1200"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="location">Address *</Label>
                      <Input
                        id="location"
                        value={newEquipment.location}
                        onChange={(e) => setNewEquipment({...newEquipment, location: e.target.value})}
                        placeholder="Street address"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={newEquipment.city}
                        onChange={(e) => setNewEquipment({...newEquipment, city: e.target.value})}
                        placeholder="Mumbai"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newEquipment.description}
                        onChange={(e) => setNewEquipment({...newEquipment, description: e.target.value})}
                        placeholder="Equipment details and specifications"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowAddEquipment(false)}>Cancel</Button>
                    <Button onClick={handleAddEquipment}>Add Equipment</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading equipment...</p>
              </div>
            ) : equipment.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No equipment added yet. Click "Add Equipment" to get started!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {equipment.map((item) => (
                  <Card key={item.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{item.name}</CardTitle>
                          <CardDescription>{item.city}</CardDescription>
                        </div>
                        <Badge variant={item.status === 'available' ? 'secondary' : 'default'}>
                          {item.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {item.description && (
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{item.description}</p>
                      )}
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Daily Rate:</span>
                          <span className="text-sm">₹{item.daily_rate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Category:</span>
                          <span className="text-sm capitalize">{item.category}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Location:</span>
                          <span className="text-sm">{item.location}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDeleteEquipment(item.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <h2 className="text-2xl font-bold">Booking Management</h2>
            {bookings.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No bookings yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <Card key={booking.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{booking.equipment?.name || 'Equipment'}</CardTitle>
                          <CardDescription>Client: {booking.client_name}</CardDescription>
                        </div>
                      <Badge variant={booking.status === 'active' ? 'default' : booking.status === 'completed' ? 'secondary' : 'outline'}>
                        {booking.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <span className="text-sm font-medium">Start Date:</span>
                        <p className="text-sm text-muted-foreground">{new Date(booking.start_time).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium">End Date:</span>
                        <p className="text-sm text-muted-foreground">{new Date(booking.end_time).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Total Amount:</span>
                        <p className="text-sm text-muted-foreground">₹{booking.total_amount}</p>
                      </div>
                      <div className="flex gap-2">
                        {booking.status === 'active' && (
                          <Button size="sm" onClick={() => handleUpdateBookingStatus(booking.id, 'completed')}>
                            Complete
                          </Button>
                        )}
                        {booking.status !== 'cancelled' && (
                          <Button variant="outline" size="sm" onClick={() => handleUpdateBookingStatus(booking.id, 'cancelled')}>
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Manage your operator profile details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Name</Label>
                    <p className="text-sm text-muted-foreground">{profile?.name}</p>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                  <div>
                    <Label>Role</Label>
                    <p className="text-sm text-muted-foreground capitalize">{isOperator ? 'operator' : 'client'}</p>
                  </div>
                  <div>
                    <Label>Rating</Label>
                    <p className="text-sm text-muted-foreground">{profile?.rating || 'Not rated'}</p>
                  </div>
                </div>
                <Button>Edit Profile</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}