import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, CreditCard, QrCode, CheckCircle2, Loader2 } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { API_BASE_URL } from '@/config/api';


const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, restaurantId, restaurantName, totalAmount, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  
  const [step, setStep] = useState<'address' | 'payment' | 'confirm'>('address');
  const [address, setAddress] = useState({
    fullAddress: '',
    landmark: '',
    phone: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const deliveryFee = 40;
  const taxes = Math.round(totalAmount * 0.05);
  const grandTotal = totalAmount + deliveryFee + taxes;

  // Generate UPI QR code URL
  const upiId = 'merchant@upi';
  const merchantName = 'FoodHub';
  const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&am=${grandTotal}&cu=INR`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUrl)}`;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container flex flex-col items-center justify-center px-4 py-20">
          <h1 className="mb-4 font-display text-2xl font-bold">Please login to checkout</h1>
          <Button onClick={() => navigate('/auth')}>Login / Sign Up</Button>
        </main>
        <Footer />
      </div>
    );
  }

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.fullAddress || !address.phone) {
      toast.error('Please fill in all required fields');
      return;
    }
    setStep('payment');
  };

  const handlePaymentConfirm = async () => {
    setIsProcessing(true);

    try {
      // Calculate expected delivery time (30 minutes from now)
      const now = new Date();
      const expectedDeliveryTime = new Date(now.getTime() + 30 * 60 * 1000); // 30 minutes from now
      const expectedDeliveryDate = expectedDeliveryTime.toLocaleDateString();
      const expectedDeliveryTimeString = expectedDeliveryTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // Create order in backend
      const orderData = {
        restaurantId: restaurantId,
        restaurantName: restaurantName,
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
          image: item.image,
          available: item.available,
          category: item.category,
          quantity: item.quantity
        })),
        totalAmount: grandTotal,
        deliveryAddress: `${address.fullAddress}${address.landmark ? `, ${address.landmark}` : ''}`,
        expectedDeliveryDate: expectedDeliveryDate,
        expectedDeliveryTime: expectedDeliveryTimeString
      };

      console.log('Sending order data:', orderData);

      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(orderData)
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const order = await response.json();

      setIsProcessing(false);
      setStep('confirm');

      // Clear cart and show success
      setTimeout(() => {
        clearCart();
        toast.success('Order placed successfully!');
        navigate('/orders');
      }, 2000);

    } catch (error) {
      console.error('Order creation failed:', error);
      toast.error('Failed to place order. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container px-4 py-8">
        <Button variant="ghost" className="mb-6 gap-2" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Progress Steps */}
            <div className="mb-8 flex items-center justify-center gap-4">
              <div className={`flex items-center gap-2 ${step === 'address' ? 'text-primary' : 'text-success'}`}>
                <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  step === 'address' ? 'bg-primary text-primary-foreground' : 'bg-success text-success-foreground'
                }`}>
                  {step === 'address' ? '1' : <CheckCircle2 className="h-5 w-5" />}
                </div>
                <span className="hidden font-medium sm:inline">Address</span>
              </div>
              <div className="h-px w-12 bg-border" />
              <div className={`flex items-center gap-2 ${
                step === 'payment' ? 'text-primary' : step === 'confirm' ? 'text-success' : 'text-muted-foreground'
              }`}>
                <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  step === 'payment' ? 'bg-primary text-primary-foreground' : 
                  step === 'confirm' ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  {step === 'confirm' ? <CheckCircle2 className="h-5 w-5" /> : '2'}
                </div>
                <span className="hidden font-medium sm:inline">Payment</span>
              </div>
              <div className="h-px w-12 bg-border" />
              <div className={`flex items-center gap-2 ${step === 'confirm' ? 'text-success' : 'text-muted-foreground'}`}>
                <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  step === 'confirm' ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  3
                </div>
                <span className="hidden font-medium sm:inline">Confirm</span>
              </div>
            </div>

            {/* Address Step */}
            {step === 'address' && (
              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-bold">Delivery Address</h2>
                    <p className="text-sm text-muted-foreground">Where should we deliver your order?</p>
                  </div>
                </div>

                <form onSubmit={handleAddressSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="fullAddress">Full Address *</Label>
                    <Textarea
                      id="fullAddress"
                      placeholder="Enter your complete address with building name, street, etc."
                      value={address.fullAddress}
                      onChange={(e) => setAddress({ ...address, fullAddress: e.target.value })}
                      className="mt-1.5"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="landmark">Landmark (Optional)</Label>
                    <Input
                      id="landmark"
                      placeholder="Near metro station, opposite mall, etc."
                      value={address.landmark}
                      onChange={(e) => setAddress({ ...address, landmark: e.target.value })}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="10-digit mobile number"
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      className="mt-1.5"
                    />
                  </div>
                  <Button type="submit" className="w-full" size="lg">
                    Continue to Payment
                  </Button>
                </form>
              </div>
            )}

            {/* Payment Step */}
            {step === 'payment' && (
              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-bold">Payment</h2>
                    <p className="text-sm text-muted-foreground">Scan QR code to pay via UPI</p>
                  </div>
                </div>

                <div className="flex flex-col items-center py-6">
                  <div className="mb-4 rounded-2xl border-2 border-border bg-background p-4">
                    <img
                      src={qrCodeUrl}
                      alt="UPI Payment QR Code"
                      className="h-48 w-48"
                    />
                  </div>
                  <div className="mb-2 flex items-center gap-2">
                    <QrCode className="h-5 w-5 text-primary" />
                    <span className="font-medium">Scan with any UPI app</span>
                  </div>
                  <p className="mb-6 text-center text-sm text-muted-foreground">
                    Google Pay, PhonePe, Paytm, or any UPI app
                  </p>

                  <div className="mb-6 w-full rounded-xl bg-secondary/50 p-4 text-center">
                    <p className="text-sm text-muted-foreground">Amount to Pay</p>
                    <p className="font-display text-3xl font-bold text-primary">₹{grandTotal}</p>
                  </div>

                  <Button
                    onClick={handlePaymentConfirm}
                    className="w-full gap-2"
                    size="lg"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Verifying Payment...
                      </>
                    ) : (
                      'I Have Paid'
                    )}
                  </Button>
                  <p className="mt-3 text-center text-xs text-muted-foreground">
                    Click only after completing payment via UPI
                  </p>
                </div>
              </div>
            )}

            {/* Confirm Step */}
            {step === 'confirm' && (
              <div className="rounded-2xl border border-border bg-card p-8 text-center">
                <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
                  <CheckCircle2 className="h-10 w-10 text-success" />
                </div>
                <h2 className="mb-2 font-display text-2xl font-bold text-success">Order Confirmed!</h2>
                <p className="mb-6 text-muted-foreground">
                  Your order has been placed successfully. Redirecting to orders...
                </p>
                <div className="animate-pulse-soft">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-border bg-card p-6">
              <h2 className="mb-4 font-display text-lg font-bold">Order Summary</h2>
              {restaurantName && (
                <p className="mb-4 text-sm text-muted-foreground">from {restaurantName}</p>
              )}

              <div className="mb-4 max-h-48 space-y-3 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">x{item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium">₹{item.price * item.quantity}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-2 border-t border-border pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{totalAmount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery</span>
                  <span>₹{deliveryFee}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Taxes</span>
                  <span>₹{taxes}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-2 font-bold">
                  <span>Total</span>
                  <span className="text-primary">₹{grandTotal}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CheckoutPage;
