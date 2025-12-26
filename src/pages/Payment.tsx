import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, Lock, CheckCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const amount = location.state?.amount || 0;
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'cardNumber') {
      const cleaned = value.replace(/\D/g, '').slice(0, 16);
      const formatted = cleaned.replace(/(.{4})/g, '$1 ').trim();
      setFormData(prev => ({ ...prev, [name]: formatted }));
    } else if (name === 'expiry') {
      const cleaned = value.replace(/\D/g, '').slice(0, 4);
      const formatted = cleaned.length > 2 ? `${cleaned.slice(0, 2)}/${cleaned.slice(2)}` : cleaned;
      setFormData(prev => ({ ...prev, [name]: formatted }));
    } else if (name === 'cvv') {
      setFormData(prev => ({ ...prev, [name]: value.replace(/\D/g, '').slice(0, 3) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    setShowSuccess(true);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    navigate('/orders');
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-md mx-auto px-4">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <CreditCard className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Payment Details</CardTitle>
            <p className="text-muted-foreground text-sm mt-2">
              Demo payment - No real charges
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePayment} className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg mb-6">
                <p className="text-sm text-muted-foreground">Amount to Pay</p>
                <p className="text-2xl font-bold text-primary">₹{amount.toFixed(2)}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  name="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardName">Cardholder Name</Label>
                <Input
                  id="cardName"
                  name="cardName"
                  placeholder="John Doe"
                  value={formData.cardName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input
                    id="expiry"
                    name="expiry"
                    placeholder="MM/YY"
                    value={formData.expiry}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    name="cvv"
                    type="password"
                    placeholder="123"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>Processing...</>
                ) : (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Pay ₹{amount.toFixed(2)}
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
                <Lock className="h-3 w-3" />
                Secure demo payment
              </p>
            </form>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="text-center">
          <DialogHeader>
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <DialogTitle className="text-2xl">Payment Successful!</DialogTitle>
            <DialogDescription className="text-base mt-2">
              Your payment of ₹{amount.toFixed(2)} has been processed successfully.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={handleSuccessClose} className="w-full mt-4">
            View Orders
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Payment;
