import { Link } from 'react-router-dom';
import { ShoppingBag, Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

export const CartSidebar = () => {
  const { items, restaurantName, updateQuantity, removeItem, totalAmount, totalItems } = useCart();

  if (totalItems === 0) {
    return null;
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:hidden">
          <Button className="w-full justify-between gap-2 h-14 text-base shadow-lg" size="lg">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              <span>{totalItems} items</span>
            </div>
            <div className="flex items-center gap-2">
              <span>₹{totalAmount}</span>
              <ArrowRight className="h-5 w-5" />
            </div>
          </Button>
        </div>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl">
        <SheetHeader className="pb-4 border-b border-border">
          <SheetTitle className="flex items-center gap-2 font-display">
            <ShoppingBag className="h-5 w-5 text-primary" />
            Your Cart
          </SheetTitle>
          {restaurantName && (
            <p className="text-sm text-muted-foreground">from {restaurantName}</p>
          )}
        </SheetHeader>

        <div className="flex flex-col h-full">
          {/* Cart Items */}
          <div className="flex-1 overflow-auto py-4 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-xl bg-secondary/50 p-3"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-16 w-16 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-foreground truncate">{item.name}</h4>
                  <p className="text-sm font-semibold text-primary">₹{item.price}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 rounded-lg border border-border bg-background p-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="h-7 w-7"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="min-w-[20px] text-center text-sm font-medium">
                      {item.quantity}
                    </span>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="h-7 w-7"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => removeItem(item.id)}
                    className="h-7 w-7 text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout */}
          <div className="border-t border-border pt-4 pb-8 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Subtotal</span>
              <span className="font-semibold">₹{totalAmount}</span>
            </div>
            <Link to="/checkout">
              <Button className="w-full h-12 text-base" size="lg">
                Proceed to Checkout
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
