import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Package, Clock, CheckCircle, Truck, XCircle, ArrowLeft, ShoppingBag, Banknote, CreditCard } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
  status: string;
  total_amount: number;
  shipping_address: string;
  shipping_city: string;
  shipping_phone: string;
  notes: string | null;
  created_at: string;
  payment_method: string;
  payment_status: string;
  items: OrderItem[];
}

const statusConfig: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  pending: { icon: Clock, color: "bg-warning text-warning-foreground", label: "Pending" },
  confirmed: { icon: CheckCircle, color: "bg-primary text-primary-foreground", label: "Confirmed" },
  processing: { icon: Package, color: "bg-secondary text-secondary-foreground", label: "Processing" },
  shipped: { icon: Truck, color: "bg-teal text-teal-foreground", label: "Shipped" },
  delivered: { icon: CheckCircle, color: "bg-success text-success-foreground", label: "Delivered" },
  cancelled: { icon: XCircle, color: "bg-destructive text-destructive-foreground", label: "Cancelled" }
};

  export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      // Fetch order items for each order
      const ordersWithItems = await Promise.all(
        (ordersData || []).map(async (order) => {
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

          return {
            ...order,
            items: itemsData?.map(item => ({
              ...item,
              medicine: item.medicines as OrderItem['medicine']
            })) || []
          };
        })
      );

      setOrders(ordersWithItems);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
    setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    setCancellingOrderId(orderId);
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('id', orderId)
        .eq('user_id', user?.id);

      if (error) throw error;

      setOrders(prev => 
        prev.map(order => 
          order.id === orderId ? { ...order, status: 'cancelled' } : order
        )
      );
      toast.success('Order cancelled successfully');
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error('Failed to cancel order');
    } finally {
      setCancellingOrderId(null);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-16 text-center">
          <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Sign in to view your orders</h1>
          <p className="text-muted-foreground mb-6">Track your orders and view order history</p>
          <Button onClick={() => navigate('/auth')}>Sign In</Button>
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
          onClick={() => navigate('/medicines')}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Continue Shopping
        </Button>

        <h1 className="text-3xl font-bold text-foreground mb-8">My Orders</h1>

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
        ) : orders.length === 0 ? (
          <Card className="p-12 text-center">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
            <p className="text-muted-foreground mb-6">
              Start shopping to place your first order
            </p>
            <Button onClick={() => navigate('/medicines')}>
              Browse Medicines
            </Button>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map(order => {
              const status = statusConfig[order.status] || statusConfig.pending;
              const StatusIcon = status.icon;

              return (
                <Card key={order.id}>
                  <CardHeader className="pb-2">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <CardTitle className="text-lg">
                          Order #{order.id.slice(0, 8).toUpperCase()}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Placed on {format(new Date(order.created_at), 'PPP')}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={status.color}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {status.label}
                        </Badge>
                        {order.status === 'pending' && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Cancel
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Cancel Order?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to cancel this order? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Keep Order</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleCancelOrder(order.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  disabled={cancellingOrderId === order.id}
                                >
                                  {cancellingOrderId === order.id ? 'Cancelling...' : 'Yes, Cancel Order'}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Order Items */}
                      <div className="space-y-2">
                        {order.items.map(item => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              {item.medicine.name} ({item.medicine.dosage_form}
                              {item.medicine.strength && ` ${item.medicine.strength}`}) × {item.quantity}
                            </span>
                            <span className="font-medium">
                              ₹{(item.unit_price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>

                      <Separator />

                      {/* Order Total & Payment */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {order.payment_method === 'online' ? (
                            <div className="flex items-center gap-1.5 text-sm">
                              <CreditCard className="h-4 w-4 text-primary" />
                              <span className="font-medium">Online Payment</span>
                              <Badge variant={order.payment_status === 'paid' ? 'default' : 'secondary'} className="text-xs">
                                {order.payment_status === 'paid' ? 'Paid' : 'Pending'}
                              </Badge>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 text-sm">
                              <Banknote className="h-4 w-4 text-amber-600" />
                              <span className="font-medium">Cash on Delivery</span>
                              <Badge variant="secondary" className="text-xs">
                                {order.payment_status === 'paid' ? 'Paid' : 'Pay on Delivery'}
                              </Badge>
                            </div>
                          )}
                        </div>
                        <div className="font-semibold">
                          <span className="text-muted-foreground mr-2">Total:</span>
                          <span className="text-primary">₹{order.total_amount.toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Delivery Info */}
                      <div className="bg-muted/50 rounded-lg p-4 text-sm">
                        <p className="font-medium mb-1">Delivery Address</p>
                        <p className="text-muted-foreground">
                          {order.shipping_address}, {order.shipping_city}
                        </p>
                        <p className="text-muted-foreground">
                          Phone: {order.shipping_phone}
                        </p>
                        {order.notes && (
                          <p className="text-muted-foreground mt-2">
                            <span className="font-medium">Note:</span> {order.notes}
                          </p>
                        )}
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
