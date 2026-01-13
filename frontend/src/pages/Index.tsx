import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Utensils, Pizza, Soup, IceCream, Sandwich, ChefHat, Flame } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { RestaurantCard } from '@/components/restaurant/RestaurantCard';
import { CartSidebar } from '@/components/cart/CartSidebar';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const categories = [
  { name: 'All', icon: Utensils },
  { name: 'Burgers', icon: Sandwich },
  { name: 'Pizza', icon: Pizza },
  { name: 'Indian', icon: Soup },
  { name: 'Desserts', icon: IceCream },
  { name: 'Asian', icon: ChefHat },
];

const Index = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeCategory === 'All') return matchesSearch;
    
    return matchesSearch && restaurant.cuisine.toLowerCase().includes(activeCategory.toLowerCase());
  });

  const featuredRestaurants = restaurants.filter((r) => r.featured);

  /* ================= FETCH RESTAURANTS ================= */

  const fetchRestaurants = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get('http://localhost:5000/api/restaurants');
      // Handle both direct array response and wrapped response
      const restaurantsData = data.data || data;
      const normalized = Array.isArray(restaurantsData)
        ? restaurantsData.map((r: any) => ({
            id: r._id || r.id,
            ...r,
          }))
        : [];
      setRestaurants(normalized);
    } catch (error) {
      toast.error('Failed to load restaurants');
      setRestaurants([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading restaurants...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden px-4 py-12 md:py-20">
          <div className="container relative z-10">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                <Flame className="h-4 w-4" />
                Free delivery on first order
              </div>
              <h1 className="mb-6 font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
                Delicious Food,{' '}
                <span className="text-gradient">Delivered Fast</span>
              </h1>
              <p className="mb-8 text-lg text-muted-foreground md:text-xl">
                Order from the best restaurants near you and get fresh food delivered to your doorstep in minutes.
              </p>
              
              {/* Search Bar */}
              <div className="relative mx-auto max-w-xl">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search for restaurants, cuisines, or dishes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-2xl border-2 border-border bg-card py-4 pl-12 pr-4 text-base shadow-card placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-accent/5 blur-3xl" />
        </section>

        {/* Categories */}
        <section className="px-4 pb-8">
          <div className="container">
            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
              {categories.map((category) => {
                const Icon = category.icon;
                const isActive = activeCategory === category.name;
                return (
                  <Button
                    key={category.name}
                    variant={isActive ? 'default' : 'outline'}
                    className={`flex-shrink-0 gap-2 rounded-full px-5 ${
                      isActive ? 'shadow-md' : ''
                    }`}
                    onClick={() => setActiveCategory(category.name)}
                  >
                    <Icon className="h-4 w-4" />
                    {category.name}
                  </Button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Featured Restaurants */}
        {activeCategory === 'All' && !searchQuery && (
          <section className="px-4 pb-12">
            <div className="container">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="font-display text-2xl font-bold text-foreground">
                    Featured Restaurants
                  </h2>
                  <p className="text-muted-foreground">Top picks for you</p>
                </div>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {featuredRestaurants.map((restaurant) => (
                  <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* All Restaurants */}
        <section className="px-4 pb-20">
          <div className="container">
            <div className="mb-6">
              <h2 className="font-display text-2xl font-bold text-foreground">
                {activeCategory === 'All' ? 'All Restaurants' : `${activeCategory} Restaurants`}
              </h2>
              <p className="text-muted-foreground">
                {filteredRestaurants.length} restaurants available
              </p>
            </div>

            {filteredRestaurants.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredRestaurants.map((restaurant, index) => (
                  <div
                    key={restaurant.id}
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <RestaurantCard restaurant={restaurant} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="mb-4 rounded-full bg-muted p-6">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mb-2 font-display text-xl font-semibold">No restaurants found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filter to find what you're looking for.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
      <CartSidebar />
    </div>
  );
};

export default Index;
