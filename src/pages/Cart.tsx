import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft, Package, CreditCard } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

const checkoutSchema = z.object({
  address: z.string().min(10, "Address must be at least 10 characters"),
  city: z.string().min(2, "City is required"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  notes: z.string().optional()
});

export default function Cart() {
  const { items, loading, updateQuantity, removeFromCart, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    phone: "",
    notes: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-16 text-center">
          <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Sign in to view your cart</h1>
          <p className="text-muted-foreground mb-6">You need to be signed in to add items to cart and place orders</p>
          <Button onClick={() => navigate('/auth')}>Sign In</Button>
        </main>
        <Footer />
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    const validation = checkoutSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.errors.forEach(err => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsProcessing(true);
    setErrors({});

    try {
      // Get user email for notifications
      const { data: { user: authUser } } = await supabase.auth.getUser();
      const userEmail = authUser?.email || '';
      
      // Get user's name from profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('user_id', user.id)
        .maybeSingle();
      
      const userName = profileData?.full_name || 'Customer';

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: totalAmount,
          shipping_address: formData.address,
          shipping_city: formData.city,
          shipping_phone: formData.phone,
          notes: formData.notes || null,
          status: 'pending',
          customer_email: userEmail,
          customer_name: userName
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        medicine_id: item.medicine_id,
        quantity: item.quantity,
        unit_price: item.medicine.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Clear cart
      await clearCart();

      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded-lg" />
            ))}
          </div>
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

        <h1 className="text-3xl font-bold text-foreground mb-8">Shopping Cart</h1>

        {items.length === 0 ? (
          <Card className="p-12 text-center">
            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">
              Browse our medicine store and add items to your cart
            </p>
            <Button onClick={() => navigate('/medicines')}>
              Browse Medicines
            </Button>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map(item => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="h-20 w-20 rounded-lg bg-primary/5 flex items-center justify-center flex-shrink-0">
                        <Package className="h-8 w-8 text-primary/30" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground line-clamp-1">
                          {item.medicine.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {item.medicine.dosage_form}
                          {item.medicine.strength && ` • ${item.medicine.strength}`}
                        </p>
                        <p className="text-primary font-medium mt-1">
                          ₹{item.medicine.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <div className="flex items-center border rounded-lg">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center text-sm">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {items.map(item => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-muted-foreground line-clamp-1 flex-1">
                          {item.medicine.name} × {item.quantity}
                        </span>
                        <span className="font-medium ml-2">
                          ₹{(item.medicine.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span className="text-primary">₹{totalAmount.toFixed(2)}</span>
                  </div>

                  {!isCheckingOut ? (
                    <Button 
                      className="w-full gap-2"
                      onClick={() => setIsCheckingOut(true)}
                    >
                      <CreditCard className="h-4 w-4" />
                      Proceed to Checkout
                    </Button>
                  ) : (
                    <div className="space-y-4 pt-4">
                      <Separator />
                      <h3 className="font-semibold">Delivery Details</h3>
                      
                      <div className="space-y-2">
                        <Label htmlFor="address">Delivery Address *</Label>
                        <Textarea
                          id="address"
                          value={formData.address}
                          onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                          placeholder="Enter your full delivery address"
                          className={errors.address ? "border-destructive" : ""}
                        />
                        {errors.address && (
                          <p className="text-xs text-destructive">{errors.address}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                          placeholder="Enter city"
                          className={errors.city ? "border-destructive" : ""}
                        />
                        {errors.city && (
                          <p className="text-xs text-destructive">{errors.city}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="Enter phone number"
                          className={errors.phone ? "border-destructive" : ""}
                        />
                        {errors.phone && (
                          <p className="text-xs text-destructive">{errors.phone}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="notes">Order Notes (Optional)</Label>
                        <Textarea
                          id="notes"
                          value={formData.notes}
                          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                          placeholder="Any special instructions..."
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          variant="outline"
                          className="flex-1"
                          onClick={() => setIsCheckingOut(false)}
                        >
                          Back
                        </Button>
                        <Button 
                          className="flex-1"
                          onClick={handlePlaceOrder}
                          disabled={isProcessing}
                        >
                          {isProcessing ? "Processing..." : "Place Order"}
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
