import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Star, Clock, Bike, MapPin } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MenuItemCard } from '@/components/restaurant/MenuItemCard';
import { CartSidebar } from '@/components/cart/CartSidebar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCart } from '@/context/CartContext';
import { Link } from 'react-router-dom';
import { MenuItem } from '@/types';
import { API_BASE_URL } from '@/config/api';


const RestaurantPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { totalItems, totalAmount } = useCart();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoadingMenu, setIsLoadingMenu] = useState(true);
  const [restaurant, setRestaurant] = useState<any>(null);
  const [isLoadingRestaurant, setIsLoadingRestaurant] = useState(true);

  // 🔗 BACKEND URL
  const API = axios.create({
    baseURL: `${API_BASE_URL}/api`
  });

  // Fetch restaurant from backend
  const fetchRestaurant = async () => {
    try {
      setIsLoadingRestaurant(true);
      const response = await API.get(`/restaurants/${id}`);
      const restaurantData = {
        id: response.data.data._id,
        ...response.data.data,
      };
      setRestaurant(restaurantData);
    } catch (error) {
      console.error('Failed to fetch restaurant:', error);
    } finally {
      setIsLoadingRestaurant(false);
    }
  };

  // Fetch menu items from backend
  const fetchMenuItems = async () => {
    try {
      setIsLoadingMenu(true);
      const response = await API.get(`/menu/restaurant/${id}`);
      const menuData = response.data.map((item: any) => ({
        id: item._id,
        restaurantId: item.restaurantId,
        name: item.name,
        description: item.description,
        price: item.price,
        image: item.image,
        available: item.available,
        category: item.category,
        isVeg: item.isVeg,
        isBestseller: item.isBestseller
      }));
      setMenuItems(menuData);
    } catch (error) {
      console.error('Failed to fetch menu items:', error);
    } finally {
      setIsLoadingMenu(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchRestaurant();
      fetchMenuItems();
    }
  }, [id]);

  // Get unique categories from menu items, with "All" added
  const categories = ["All", ...new Set(menuItems.map(item => item.category))];

  if (isLoadingRestaurant || isLoadingMenu) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading restaurant...</p>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="mb-4 text-2xl font-bold">Restaurant not found</h1>
        <Button onClick={() => navigate('/')}>Go Home</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pb-24 md:pb-12">
        {/* Hero Banner */}
        <div className="relative h-48 sm:h-64 md:h-80 overflow-hidden">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          
          {/* Back Button */}
          <Button
            variant="secondary"
            size="icon"
            className="absolute left-4 top-4 rounded-full shadow-md"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>

        {/* Restaurant Info */}
        <div className="container px-4 -mt-16 relative z-10">
          <div className="rounded-2xl bg-card p-6 shadow-card">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">
                  {restaurant.name}
                </h1>
                <p className="mt-1 text-muted-foreground">{restaurant.cuisine}</p>
                
                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1">
                    <Star className="h-4 w-4 fill-success text-success" />
                    <span className="font-semibold text-success">{restaurant.rating}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {restaurant.deliveryTime}
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Bike className="h-4 w-4" />
                    ₹{restaurant.deliveryFee} delivery
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                2.5 km away
              </div>
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className="container px-4 mt-8">
          <h2 className="mb-6 font-display text-xl font-bold text-foreground">Menu</h2>

          {isLoadingMenu ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading menu...</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No menu items available</p>
            </div>
          ) : (
            <Tabs defaultValue={categories[0]} className="w-full">
              <TabsList className="mb-6 flex h-auto w-full justify-start gap-2 overflow-x-auto bg-transparent p-0">
                {categories.map((category) => (
                  <TabsTrigger
                    key={category}
                    value={category}
                    className="flex-shrink-0 rounded-full border border-border bg-card px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>

              {categories.map((category) => (
                <TabsContent key={category} value={category} className="mt-0">
                  <div className="grid gap-4 md:grid-cols-2">
                    {(category === "All" ? menuItems : menuItems.filter((item) => item.category === category))
                      .map((item) => (
                        <MenuItemCard
                          key={item.id}
                          item={item}
                          restaurantId={restaurant.id}
                          restaurantName={restaurant.name}
                        />
                      ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </div>

        {/* Fixed Cart Bar (Desktop) */}
        {totalItems > 0 && (
          <div className="fixed bottom-6 left-1/2 z-50 hidden -translate-x-1/2 md:block">
            <Link to="/checkout">
              <Button size="lg" className="gap-4 rounded-full px-8 py-6 shadow-lg hover:shadow-glow">
                <span className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-foreground/20 text-sm font-bold">
                    {totalItems}
                  </span>
                  View Cart
                </span>
                <span className="font-bold">₹{totalAmount}</span>
              </Button>
            </Link>
          </div>
        )}
      </main>

      <Footer />
      <CartSidebar />
    </div>
  );
};

export default RestaurantPage;
