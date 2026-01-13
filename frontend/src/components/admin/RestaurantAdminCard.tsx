import { Restaurant } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Star, MapPin, ImageOff } from 'lucide-react';
import { useState } from 'react';

interface RestaurantAdminCardProps {
  restaurant: Restaurant;
  onEdit: (restaurant: Restaurant) => void;
  onDelete: (restaurantId: string) => void;
}

export const RestaurantAdminCard = ({
  restaurant,
  onEdit,
  onDelete,
}: RestaurantAdminCardProps) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-4 hover:shadow-sm transition-shadow">
      {/* IMAGE */}
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
        {!imgError && restaurant.image ? (
          <img
            src={restaurant.image}
            alt={restaurant.name}
            loading="lazy"
            crossOrigin="anonymous"
            onError={() => setImgError(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <ImageOff className="h-6 w-6" />
          </div>
        )}
      </div>

      {/* DETAILS */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold truncate">{restaurant.name}</h3>

              {restaurant.featured && (
                <Star className="h-4 w-4 fill-warning text-warning flex-shrink-0" />
              )}

              {restaurant.isActive === false && (
                <Badge variant="secondary" className="text-xs">
                  Inactive
                </Badge>
              )}
            </div>

            <p className="text-xs text-muted-foreground mt-0.5">
              {restaurant.cuisine}
            </p>

            {restaurant.address && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                <MapPin className="h-3 w-3" />
                <span className="line-clamp-1">{restaurant.address}</span>
              </div>
            )}

            {restaurant.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                {restaurant.description}
              </p>
            )}
          </div>

          <div className="text-right">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              {restaurant.rating}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              ₹{restaurant.deliveryFee} delivery
            </p>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {restaurant.deliveryTime}
            </Badge>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(restaurant)}
              className="gap-1.5"
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => onDelete(restaurant.id)}
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
