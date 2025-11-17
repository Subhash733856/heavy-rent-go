import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart3, Users, Package, DollarSign, TrendingUp, Activity } from "lucide-react";
import { toast } from "sonner";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    totalOperators: 0,
    totalClients: 0,
    totalEquipment: 0,
    activeBookings: 0,
  });
  const [bookings, setBookings] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [equipment, setEquipment] = useState<any[]>([]);
  const [operatorRevenue, setOperatorRevenue] = useState<any[]>([]);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Please log in to access admin dashboard");
        navigate("/client-login");
        return;
      }

      // Check if user has admin role
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .single();

      if (roleError || !roleData) {
        toast.error("Access denied. Admin privileges required.");
        navigate("/");
        return;
      }

      await loadDashboardData();
    } catch (error) {
      console.error('Error checking admin access:', error);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const loadDashboardData = async () => {
    try {
      // Load analytics
      const [bookingsRes, usersRes, equipmentRes, paymentsRes] = await Promise.all([
        supabase.from('bookings').select('*', { count: 'exact' }),
        supabase.from('profiles').select('*', { count: 'exact' }),
        supabase.from('equipment').select('*', { count: 'exact' }),
        supabase.from('payments').select('amount, status'),
      ]);

      const { data: operatorRoles } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'operator');

      const { data: clientRoles } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'client');

      const activeBookings = bookingsRes.data?.filter(
        b => b.status === 'confirmed' || b.status === 'in_progress'
      ).length || 0;

      const totalRevenue = paymentsRes.data
        ?.filter(p => p.status === 'completed')
        .reduce((sum, p) => sum + Number(p.amount), 0) || 0;

      setAnalytics({
        totalBookings: bookingsRes.count || 0,
        totalRevenue,
        totalOperators: operatorRoles?.length || 0,
        totalClients: clientRoles?.length || 0,
        totalEquipment: equipmentRes.count || 0,
        activeBookings,
      });

      // Load detailed data with joins
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select(`
          *,
          equipment(name),
          profiles!client_id(name, email),
          operator:profiles!operator_id(name)
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      setBookings(bookingsData || []);

      const { data: usersData } = await supabase
        .from('profiles')
        .select('*, user_roles(role)')
        .order('created_at', { ascending: false });

      setUsers(usersData || []);

      const { data: equipmentData } = await supabase
        .from('equipment')
        .select('*, profiles(name)')
        .order('created_at', { ascending: false });

      setEquipment(equipmentData || []);

      // Calculate operator revenue
      const { data: operatorRevenueData } = await supabase
        .from('bookings')
        .select(`
          operator_id,
          total_amount,
          operator_fee,
          profiles!operator_id(name)
        `)
        .eq('status', 'completed');

      const revenueByOperator = operatorRevenueData?.reduce((acc: any, booking: any) => {
        const operatorId = booking.operator_id;
        const operatorName = booking.profiles?.name || 'Unknown';
        
        if (!acc[operatorId]) {
          acc[operatorId] = {
            name: operatorName,
            totalRevenue: 0,
            totalFees: 0,
            bookingsCount: 0,
          };
        }
        
        acc[operatorId].totalRevenue += Number(booking.total_amount);
        acc[operatorId].totalFees += Number(booking.operator_fee || 0);
        acc[operatorId].bookingsCount += 1;
        
        return acc;
      }, {});

      setOperatorRevenue(Object.values(revenueByOperator || {}));

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error("Failed to load dashboard data");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Loading Admin Dashboard...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your platform and monitor performance</p>
        </div>

        {/* Analytics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{analytics.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">From all completed bookings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalBookings}</div>
              <p className="text-xs text-muted-foreground">{analytics.activeBookings} currently active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Equipment Listed</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalEquipment}</div>
              <p className="text-xs text-muted-foreground">Available for rent</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Operators</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalOperators}</div>
              <p className="text-xs text-muted-foreground">Registered operators</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalClients}</div>
              <p className="text-xs text-muted-foreground">Registered clients</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.activeBookings}</div>
              <p className="text-xs text-muted-foreground">In progress or confirmed</p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Tables */}
        <Tabs defaultValue="bookings" className="space-y-4">
          <TabsList>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="equipment">Equipment</TabsTrigger>
            <TabsTrigger value="revenue">Operator Revenue</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>Latest 10 bookings across the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Equipment</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Operator</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell>{booking.equipment?.name}</TableCell>
                        <TableCell>{booking.profiles?.name}</TableCell>
                        <TableCell>{booking.operator?.name}</TableCell>
                        <TableCell>₹{booking.total_amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={
                            booking.status === 'confirmed' ? 'default' :
                            booking.status === 'completed' ? 'secondary' :
                            booking.status === 'cancelled' ? 'destructive' : 'outline'
                          }>
                            {booking.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(booking.created_at).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>All registered users on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Joined</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.phone || 'N/A'}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {user.user_roles?.[0]?.role || 'client'}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.rating?.toFixed(1) || 'N/A'}</TableCell>
                        <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="equipment" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Equipment Listings</CardTitle>
                <CardDescription>All equipment available on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Daily Rate</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Location</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {equipment.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>{item.profiles?.name}</TableCell>
                        <TableCell>₹{item.daily_rate.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={item.status === 'available' ? 'default' : 'secondary'}>
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{item.city}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="revenue" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Operator Revenue Tracking</CardTitle>
                <CardDescription>Revenue generated by each operator</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Operator</TableHead>
                      <TableHead>Total Bookings</TableHead>
                      <TableHead>Total Revenue</TableHead>
                      <TableHead>Operator Fees</TableHead>
                      <TableHead>Avg per Booking</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {operatorRevenue.map((op: any, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{op.name}</TableCell>
                        <TableCell>{op.bookingsCount}</TableCell>
                        <TableCell>₹{op.totalRevenue.toLocaleString()}</TableCell>
                        <TableCell>₹{op.totalFees.toLocaleString()}</TableCell>
                        <TableCell>₹{(op.totalRevenue / op.bookingsCount).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Platform Health
            </CardTitle>
            <CardDescription>Quick overview of platform performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span>Average Booking Value:</span>
              <span className="font-bold">
                ₹{analytics.totalBookings > 0 
                  ? (analytics.totalRevenue / analytics.totalBookings).toLocaleString() 
                  : 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Equipment per Operator:</span>
              <span className="font-bold">
                {analytics.totalOperators > 0 
                  ? (analytics.totalEquipment / analytics.totalOperators).toFixed(1) 
                  : 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Active Booking Rate:</span>
              <span className="font-bold">
                {analytics.totalBookings > 0 
                  ? ((analytics.activeBookings / analytics.totalBookings) * 100).toFixed(1) 
                  : 0}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
