import { Plus, Minus, Leaf, Star } from 'lucide-react';
import { MenuItem } from '@/types';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { Badge } from '@/components/ui/badge';

interface MenuItemCardProps {
  item: MenuItem;
  restaurantId: string;
  restaurantName: string;
}

export const MenuItemCard = ({ item, restaurantId, restaurantName }: MenuItemCardProps) => {
  const { items, addItem, updateQuantity } = useCart();
  
  const cartItem = items.find((i) => i.id === item.id);
  const quantity = cartItem?.quantity || 0;

  const handleAdd = () => {
    addItem(item, restaurantId, restaurantName);
  };

  const handleIncrease = () => {
    updateQuantity(item.id, quantity + 1);
  };

  const handleDecrease = () => {
    updateQuantity(item.id, quantity - 1);
  };

  return (
    <div className="group flex gap-4 rounded-xl border border-border/50 bg-card p-4 transition-all duration-200 hover:border-primary/20 hover:shadow-card">
      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="mb-1 flex items-center gap-2">
          {item.isVeg && (
            <div className="flex h-4 w-4 items-center justify-center rounded border border-success">
              <div className="h-2 w-2 rounded-full bg-success" />
            </div>
          )}
          {!item.isVeg && (
            <div className="flex h-4 w-4 items-center justify-center rounded border border-destructive">
              <div className="h-2 w-2 rounded-full bg-destructive" />
            </div>
          )}
          {item.isBestseller && (
            <Badge variant="secondary" className="gap-1 bg-warning/10 text-warning">
              <Star className="h-3 w-3 fill-warning" />
              Bestseller
            </Badge>
          )}
        </div>

        <h4 className="font-display font-semibold text-foreground">
          {item.name}
        </h4>
        <p className="mt-1 text-lg font-semibold text-foreground">
          ₹{item.price}
        </p>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
          {item.description}
        </p>
      </div>

      {/* Image & Add Button */}
      <div className="relative flex-shrink-0">
        <div className="h-24 w-24 sm:h-28 sm:w-28 overflow-hidden rounded-xl">
          <img
            src={item.image}
            alt={item.name}
            crossOrigin="anonymous"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>

        {/* Add/Quantity Button */}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
          {quantity === 0 ? (
            <Button
              size="sm"
              onClick={handleAdd}
              disabled={!item.available}
              className="h-9 px-6 font-semibold shadow-md"
            >
              ADD
            </Button>
          ) : (
            <div className="flex items-center gap-1 rounded-lg bg-primary p-1 shadow-md">
              <Button
                size="icon"
                variant="ghost"
                onClick={handleDecrease}
                className="h-7 w-7 text-primary-foreground hover:bg-primary-foreground/20"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="min-w-[24px] text-center font-semibold text-primary-foreground">
                {quantity}
              </span>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleIncrease}
                className="h-7 w-7 text-primary-foreground hover:bg-primary-foreground/20"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
