import { MenuItem } from '@/types';
import { restaurants } from '@/data/restaurants';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Pencil, Leaf, Star, Trash2, ImageOff } from 'lucide-react';
import { useState } from 'react';

interface ProductCardProps {
  product: MenuItem;
  onEdit: (product: MenuItem) => void;
  onToggleStock: (productId: string, available: boolean) => void;
  onDelete: (productId: string) => void;
  restaurants?: any[];
}

export const ProductCard = ({
  product,
  onEdit,
  onToggleStock,
  onDelete,
  restaurants = [],
}: ProductCardProps) => {
  const [imgError, setImgError] = useState(false);

  // Get restaurant names from the array of restaurant IDs
  const restaurantNames = Array.isArray(product.restaurantId)
    ? product.restaurantId
        .map((id) => restaurants.find((r) => r.id === id)?.name)
        .filter(Boolean)
        .join(', ')
    : restaurants.find((r) => r.id === product.restaurantId)?.name || '—';

  const restaurantName = restaurantNames || '—';

  // ✅ ALWAYS use normalized frontend id
  const productId = product.id;

  return (
    <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-4 hover:shadow-sm transition-shadow">
      {/* IMAGE */}
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
        {!imgError && typeof product.image === 'string' && product.image ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            crossOrigin="anonymous"
            onError={() => setImgError(true)}
            className={`h-full w-full object-cover transition ${
              !product.available ? 'grayscale opacity-50' : ''
            }`}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <ImageOff className="h-6 w-6" />
          </div>
        )}

        {!product.available && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-xs font-semibold text-white">
            OUT OF STOCK
          </div>
        )}
      </div>

      {/* DETAILS */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold truncate">{product.name}</h3>

              {product.isVeg && (
                <Leaf className="h-4 w-4 text-success flex-shrink-0" />
              )}

              {product.isBestseller && (
                <Star className="h-4 w-4 fill-warning text-warning flex-shrink-0" />
              )}
            </div>

            <p className="text-xs text-muted-foreground mt-0.5">
              {restaurantName}
            </p>

            {product.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                {product.description}
              </p>
            )}
          </div>

          <p className="font-display font-bold text-primary whitespace-nowrap">
            ₹{product.price}
          </p>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
          <div className="flex items-center gap-2">
            <Switch
              id={`stock-${productId}`}
              checked={!!product.available}
              onCheckedChange={(checked) =>
                onToggleStock(productId, checked)
              }
            />
            <label
              htmlFor={`stock-${productId}`}
              className="text-sm text-muted-foreground"
            >
              {product.available ? 'In Stock' : 'Out of Stock'}
            </label>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(product)}
              className="gap-1.5"
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => onDelete(productId)}
              className="gap-1.5 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
