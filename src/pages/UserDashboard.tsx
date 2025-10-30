import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Calendar, DollarSign, Clock, MapPin, Phone, Mail, Star } from "lucide-react";

// Mock data for demonstration
const mockBookings = [
  {
    id: "1",
    equipment: {
      name: "CAT 320D Excavator",
      category: "excavators",
      operator_name: "Heavy Equipment Co.",
      operator_phone: "+91 98765 43210"
    },
    start_date: "2024-01-15",
    end_date: "2024-01-20",
    status: "active",
    total_amount: 6000,
    location: "Mumbai",
    duration: 5
  },
  {
    id: "2",
    equipment: {
      name: "JCB 3DX Backhoe",
      category: "backhoes", 
      operator_name: "Metro Equipment Rentals",
      operator_phone: "+91 87654 32109"
    },
    start_date: "2024-01-10",
    end_date: "2024-01-25",
    status: "completed",
    total_amount: 12000,
    location: "Delhi",
    duration: 15
  },
  {
    id: "3",
    equipment: {
      name: "Komatsu PC200 Excavator",
      category: "excavators",
      operator_name: "BuildTech Machines",
      operator_phone: "+91 76543 21098"
    },
    start_date: "2024-02-01",
    end_date: "2024-02-05",
    status: "upcoming",
    total_amount: 4800,
    location: "Bangalore",
    duration: 4
  }
];

const spendingData = [
  { month: 'Jan', amount: 18000, bookings: 2 },
  { month: 'Feb', amount: 4800, bookings: 1 },
  { month: 'Mar', amount: 15600, bookings: 3 },
  { month: 'Apr', amount: 22000, bookings: 4 },
  { month: 'May', amount: 8900, bookings: 2 },
  { month: 'Jun', amount: 16500, bookings: 3 }
];

const categoryData = [
  { name: 'Excavators', count: 8, amount: 45000 },
  { name: 'Backhoes', count: 3, amount: 18000 },
  { name: 'Cranes', count: 2, amount: 25000 },
  { name: 'Dozers', count: 1, amount: 8000 }
];

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

export default function UserDashboard() {
  const { user, profile, isClient } = useAuth();
  const [bookings, setBookings] = useState(mockBookings);

  if (!user || !isClient) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You need to be logged in as a client to access this dashboard.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const handleCancelBooking = (id: string) => {
    setBookings(bookings.map(booking => 
      booking.id === id ? { ...booking, status: 'cancelled' } : booking
    ));
    toast.success("Booking cancelled successfully!");
  };

  const totalSpent = spendingData.reduce((sum, month) => sum + month.amount, 0);
  const totalBookings = bookings.length;
  const activeBookings = bookings.filter(b => b.status === 'active').length;
  const avgSpending = Math.round(totalSpent / spendingData.length);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {profile?.name}! Track your bookings and equipment usage.</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalSpent.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Last 6 months</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalBookings}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeBookings}</div>
              <p className="text-xs text-muted-foreground">Currently active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Monthly Spend</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{avgSpending.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Last 6 months</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="bookings">My Bookings</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">My Bookings</h2>
              <Button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                Book New Equipment
              </Button>
            </div>

            <div className="space-y-4">
              {bookings.map((booking) => (
                <Card key={booking.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{booking.equipment.name}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <MapPin className="h-4 w-4" />
                          {booking.location}
                        </CardDescription>
                      </div>
                      <Badge 
                        variant={
                          booking.status === 'active' ? 'default' : 
                          booking.status === 'completed' ? 'secondary' : 
                          booking.status === 'upcoming' ? 'outline' : 'destructive'
                        }
                      >
                        {booking.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <span className="text-sm font-medium">Start Date:</span>
                        <p className="text-sm text-muted-foreground">{booking.start_date}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium">End Date:</span>
                        <p className="text-sm text-muted-foreground">{booking.end_date}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Duration:</span>
                        <p className="text-sm text-muted-foreground">{booking.duration} days</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Total Amount:</span>
                        <p className="text-sm text-muted-foreground">₹{booking.total_amount.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="text-sm font-medium mb-2">Operator Details:</h4>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{booking.equipment.operator_name}</p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {booking.equipment.operator_phone}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {booking.status === 'upcoming' && (
                            <Button variant="outline" size="sm" onClick={() => handleCancelBooking(booking.id)}>
                              Cancel
                            </Button>
                          )}
                          <Button variant="outline" size="sm">
                            Contact Operator
                          </Button>
                          {booking.status === 'completed' && (
                            <Button variant="outline" size="sm">
                              <Star className="h-4 w-4 mr-1" />
                              Rate
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Spending Trend</CardTitle>
                  <CardDescription>Monthly spending over the last 6 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={spendingData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`₹${value}`, 'Amount']} />
                      <Bar dataKey="amount" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Equipment Categories</CardTitle>
                  <CardDescription>Spending by equipment type</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="amount"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`₹${value}`, 'Amount']} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Usage Statistics</CardTitle>
                <CardDescription>Your equipment rental patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {categoryData.map((category) => (
                    <div key={category.name} className="text-center">
                      <div className="text-2xl font-bold">{category.count}</div>
                      <div className="text-sm text-muted-foreground">{category.name}</div>
                      <div className="text-xs text-muted-foreground">₹{category.amount.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="favorites" className="space-y-6">
            <h2 className="text-2xl font-bold">Favorite Equipment</h2>
            <Card>
              <CardContent className="py-8">
                <div className="text-center text-muted-foreground">
                  <p>You haven't added any equipment to favorites yet.</p>
                  <p className="text-sm mt-2">Browse equipment and click the heart icon to save favorites.</p>
                  <Button className="mt-4" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    Browse Equipment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Manage your account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium">Name:</span>
                    <p className="text-sm text-muted-foreground">{profile?.name}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Email:</span>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Role:</span>
                    <p className="text-sm text-muted-foreground capitalize">{isClient ? 'client' : 'operator'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Member Since:</span>
                    <p className="text-sm text-muted-foreground">January 2024</p>
                  </div>
                </div>
                <div className="pt-4">
                  <Button>Edit Profile</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">{totalBookings}</div>
                    <div className="text-sm text-muted-foreground">Total Bookings</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">₹{totalSpent.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Total Spent</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">4.8</div>
                    <div className="text-sm text-muted-foreground">Average Rating</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}