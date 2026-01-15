import { Link } from 'react-router-dom';
import { Star, Clock, Bike } from 'lucide-react';
import { Restaurant } from '@/types';
import { Badge } from '@/components/ui/badge';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export const RestaurantCard = ({ restaurant }: RestaurantCardProps) => {
  return (
    <Link to={`/restaurant/${restaurant.id}`}>
      <div className="group relative overflow-hidden rounded-2xl bg-card shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1">
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            crossOrigin="anonymous"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
          
          {/* Featured Badge */}
          {restaurant.featured && (
            <Badge className="absolute left-3 top-3 bg-primary text-primary-foreground">
              Featured
            </Badge>
          )}

          {/* Delivery Time Badge */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-background/95 px-2.5 py-1 text-xs font-medium shadow-sm backdrop-blur-sm">
            <Clock className="h-3.5 w-3.5 text-primary" />
            {restaurant.deliveryTime}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="mb-2 flex items-start justify-between">
            <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              {restaurant.name}
            </h3>
            <div className="flex items-center gap-1 rounded-md bg-success/10 px-2 py-0.5">
              <Star className="h-3.5 w-3.5 fill-success text-success" />
              <span className="text-sm font-semibold text-success">{restaurant.rating}</span>
            </div>
          </div>
          
          <p className="mb-3 text-sm text-muted-foreground line-clamp-1">
            {restaurant.cuisine}
          </p>

          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Bike className="h-4 w-4" />
            <span>₹{restaurant.deliveryFee} delivery</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
