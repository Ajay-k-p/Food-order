import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Minus, Plus, Trash2, ArrowRight, ArrowLeft } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';

const CartPage = () => {
  const navigate = useNavigate();
  const { items, restaurantName, updateQuantity, removeItem, clearCart, totalAmount, totalItems } = useCart();

  if (totalItems === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container flex flex-col items-center justify-center px-4 py-20">
          <div className="mb-6 rounded-full bg-muted p-8">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
          </div>
          <h1 className="mb-2 font-display text-2xl font-bold">Your cart is empty</h1>
          <p className="mb-8 text-muted-foreground">Add some delicious food to get started!</p>
          <Button onClick={() => navigate('/')} size="lg">
            Browse Restaurants
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const deliveryFee = 40;
  const taxes = Math.round(totalAmount * 0.05);
  const grandTotal = totalAmount + deliveryFee + taxes;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6 gap-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h1 className="font-display text-2xl font-bold">Your Cart</h1>
                  {restaurantName && (
                    <p className="text-muted-foreground">from {restaurantName}</p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearCart}
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  Clear All
                </Button>
              </div>

              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 rounded-xl bg-secondary/50 p-4 transition-all hover:bg-secondary"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-20 w-20 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground">{item.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {item.description}
                      </p>
                      <p className="mt-1 text-lg font-bold text-primary">
                        ₹{item.price * item.quantity}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 rounded-lg border border-border bg-background p-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="h-8 w-8"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="min-w-[32px] text-center font-semibold">
                          {item.quantity}
                        </span>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="h-8 w-8"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => removeItem(item.id)}
                        className="text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-border bg-card p-6">
              <h2 className="mb-6 font-display text-xl font-bold">Order Summary</h2>
              
              <div className="space-y-3 border-b border-border pb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal ({totalItems} items)</span>
                  <span className="font-medium">₹{totalAmount}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span className="font-medium">₹{deliveryFee}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Taxes & Charges</span>
                  <span className="font-medium">₹{taxes}</span>
                </div>
              </div>

              <div className="flex items-center justify-between py-4">
                <span className="font-display text-lg font-bold">Total</span>
                <span className="font-display text-xl font-bold text-primary">₹{grandTotal}</span>
              </div>

              <Link to="/checkout">
                <Button className="w-full gap-2" size="lg">
                  Proceed to Checkout
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CartPage;
