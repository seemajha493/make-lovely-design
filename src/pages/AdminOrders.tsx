import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  Package, Clock, CheckCircle, Truck, XCircle, Search, 
  ArrowLeft, ShoppingBag, Filter, RefreshCw, User, MapPin, Phone 
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { toast } from "sonner";

interface OrderItem {
  id: string;
  quantity: number;
  unit_price: number;
  medicine: {
    name: string;
    dosage_form: string;
    strength: string | null;
  };
}

interface Order {
  id: string;
  user_id: string;
  status: string;
  total_amount: number;
  shipping_address: string;
  shipping_city: string;
  shipping_phone: string;
  notes: string | null;
  created_at: string;
  items: OrderItem[];
  profile?: {
    full_name: string | null;
    email?: string;
  };
}

const statusOptions = [
  { value: "pending", label: "Pending", icon: Clock, color: "bg-warning text-warning-foreground" },
  { value: "confirmed", label: "Confirmed", icon: CheckCircle, color: "bg-primary text-primary-foreground" },
  { value: "processing", label: "Processing", icon: Package, color: "bg-secondary text-secondary-foreground" },
  { value: "shipped", label: "Shipped", icon: Truck, color: "bg-teal text-teal-foreground" },
  { value: "delivered", label: "Delivered", icon: CheckCircle, color: "bg-success text-success-foreground" },
  { value: "cancelled", label: "Cancelled", icon: XCircle, color: "bg-destructive text-destructive-foreground" }
];

const getStatusConfig = (status: string) => {
  return statusOptions.find(s => s.value === status) || statusOptions[0];
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      checkAdminAndFetch();
    }
  }, [user]);

  const checkAdminAndFetch = async () => {
    if (!user) return;
    
    const { data: isAdminData } = await supabase.rpc('has_role', { 
      _user_id: user.id, 
      _role: 'admin' 
    });
    
    setIsAdmin(!!isAdminData);
    
    if (isAdminData) {
      await fetchOrders();
    } else {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      // Fetch order items and user profiles for each order
      const ordersWithDetails = await Promise.all(
        (ordersData || []).map(async (order) => {
          // Fetch order items
          const { data: itemsData } = await supabase
            .from('order_items')
            .select(`
              id,
              quantity,
              unit_price,
              medicines:medicine_id (
                name,
                dosage_form,
                strength
              )
            `)
            .eq('order_id', order.id);

          // Fetch user profile
          const { data: profileData } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('user_id', order.user_id)
            .maybeSingle();

          return {
            ...order,
            items: itemsData?.map(item => ({
              ...item,
              medicine: item.medicines as OrderItem['medicine']
            })) || [],
            profile: profileData
          };
        })
      );

      setOrders(ordersWithDetails);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingOrderId(orderId);
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      // Find the order to get customer details for email
      const order = orders.find(o => o.id === orderId);
      
      // Send email notification
      if (order) {
        // Get user email from auth
        const { data: userData } = await supabase.auth.admin.getUserById(order.user_id).catch(() => ({ data: null }));
        
        // Try to get email from profiles or use a fallback approach
        const customerEmail = order.profile?.email;
        
        if (customerEmail) {
          try {
            await supabase.functions.invoke('send-order-notification', {
              body: {
                orderId: order.id,
                newStatus,
                customerEmail,
                customerName: order.profile?.full_name || 'Customer',
                orderTotal: order.total_amount
              }
            });
            console.log('Email notification sent successfully');
          } catch (emailError) {
            console.error('Failed to send email notification:', emailError);
            // Don't fail the status update if email fails
          }
        }
      }

      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.shipping_city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.profile?.full_name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const orderStats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => ['confirmed', 'processing'].includes(o.status)).length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-16 text-center">
          <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Sign in required</h1>
          <p className="text-muted-foreground mb-6">Admin access required to manage orders</p>
          <Button onClick={() => navigate('/auth')}>Sign In</Button>
        </main>
        <Footer />
      </div>
    );
  }

  if (!loading && !isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-16 text-center">
          <XCircle className="h-16 w-16 mx-auto text-destructive mb-4" />
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-6">You don't have permission to access this page</p>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/admin')}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Admin Dashboard
        </Button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Order Management</h1>
            <p className="text-muted-foreground">View and manage all customer orders</p>
          </div>
          <Button onClick={fetchOrders} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-foreground">{orderStats.total}</p>
              <p className="text-sm text-muted-foreground">Total Orders</p>
            </CardContent>
          </Card>
          <Card className="border-warning/30 bg-warning/5">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-warning">{orderStats.pending}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </CardContent>
          </Card>
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-primary">{orderStats.processing}</p>
              <p className="text-sm text-muted-foreground">Processing</p>
            </CardContent>
          </Card>
          <Card className="border-teal/30 bg-teal/5">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-teal">{orderStats.shipped}</p>
              <p className="text-sm text-muted-foreground">Shipped</p>
            </CardContent>
          </Card>
          <Card className="border-success/30 bg-success/5">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-success">{orderStats.delivered}</p>
              <p className="text-sm text-muted-foreground">Delivered</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by order ID, customer name, or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {statusOptions.map(status => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-muted rounded w-1/4 mb-4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <Card className="p-12 text-center">
            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No orders found</h2>
            <p className="text-muted-foreground">
              {searchQuery || statusFilter !== "all" 
                ? "Try adjusting your search or filter criteria"
                : "No orders have been placed yet"}
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map(order => {
              const status = getStatusConfig(order.status);
              const StatusIcon = status.icon;

              return (
                <Card key={order.id}>
                  <CardHeader className="pb-2">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <CardTitle className="text-lg">
                            Order #{order.id.slice(0, 8).toUpperCase()}
                          </CardTitle>
                          <Badge className={status.color}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {status.label}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Placed on {format(new Date(order.created_at), 'PPP p')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select 
                          value={order.status} 
                          onValueChange={(value) => updateOrderStatus(order.id, value)}
                          disabled={updatingOrderId === order.id}
                        >
                          <SelectTrigger className="w-[160px]">
                            <SelectValue placeholder="Update status" />
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map(s => (
                              <SelectItem key={s.value} value={s.value}>
                                {s.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Customer & Delivery Info */}
                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">
                              {order.profile?.full_name || 'Customer'}
                            </p>
                            <p className="text-xs text-muted-foreground">Customer</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-sm">{order.shipping_address}</p>
                            <p className="text-xs text-muted-foreground">{order.shipping_city}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <p className="text-sm">{order.shipping_phone}</p>
                        </div>
                        {order.notes && (
                          <div className="bg-muted/50 rounded p-2 text-sm">
                            <span className="font-medium">Note:</span> {order.notes}
                          </div>
                        )}
                      </div>

                      {/* Order Items */}
                      <div>
                        <p className="text-sm font-medium mb-2">Order Items</p>
                        <div className="space-y-1 text-sm">
                          {order.items.map(item => (
                            <div key={item.id} className="flex justify-between">
                              <span className="text-muted-foreground">
                                {item.medicine.name} × {item.quantity}
                              </span>
                              <span>₹{(item.unit_price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                        <Separator className="my-2" />
                        <div className="flex justify-between font-semibold">
                          <span>Total</span>
                          <span className="text-primary">₹{order.total_amount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
