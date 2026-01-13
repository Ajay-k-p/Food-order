import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { Header } from '@/components/layout/Header';
import { RestaurantCard } from '@/components/restaurant/RestaurantCard';
import { RestaurantForm } from '@/components/admin/RestaurantForm';
import { RestaurantAdminCard } from '@/components/admin/RestaurantAdminCard';
import { ProductForm } from '@/components/admin/ProductForm';
import { ProductCard } from '@/components/admin/ProductCard';
import { OrderCard } from '@/components/admin/OrderCard';
import DailyReport from '@/components/admin/DailyReport';
import MonthlyReport from '@/components/admin/MonthlyReport';

import { useAuth } from '@/context/AuthContext';
import { MenuItem, Order } from '@/types';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

import { toast } from 'sonner';

import {
  BarChart3,
  Package,
  ShoppingCart,
  Plus,
  IndianRupee,
  ShoppingBag,
  Store,
  FileText,
} from 'lucide-react';

/* ================= API ================= */

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/* ================= COMPONENT ================= */

const AdminPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  /* ================= STATE ================= */

  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<MenuItem[]>([]);
  const [restaurants, setRestaurants] = useState<any[]>([]);

  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isLoadingRestaurants, setIsLoadingRestaurants] = useState(true);

  const [activeTab, setActiveTab] =
    useState<'dashboard' | 'orders' | 'products' | 'restaurants' | 'reports'>('dashboard');

  const [productFormOpen, setProductFormOpen] = useState(false);
  const [restaurantFormOpen, setRestaurantFormOpen] = useState(false);

  const [editingProduct, setEditingProduct] = useState<MenuItem | undefined>();
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [searchTerm, setSearchTerm] = useState('');

  const [editingRestaurant, setEditingRestaurant] = useState<any | undefined>();
  const [restaurantFormMode, setRestaurantFormMode] = useState<'add' | 'edit'>('add');

  /* ================= MEMO ================= */

  const filteredProducts = useMemo(() => {
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter(
      (r) =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [restaurants, searchTerm]);

  const stats = useMemo(() => {
    return [
      {
        title: 'Total Orders',
        value: orders.length.toString(),
        icon: Package,
      },
      {
        title: 'Total Revenue',
        value: `₹${orders
          .reduce((sum, o) => sum + o.totalAmount, 0)
          .toLocaleString()}`,
        icon: IndianRupee,
      },
      {
        title: 'Products',
        value: products.length.toString(),
        icon: ShoppingBag,
      },
      {
        title: 'Out of Stock',
        value: products.filter((p) => !p.available).length.toString(),
        icon: Store,
      },
    ];
  }, [orders, products]);

  /* ================= FETCH DATA ================= */

  const fetchProducts = async () => {
    try {
      setIsLoadingProducts(true);
      const { data } = await API.get('/admin/products');

      const normalized = data.map((p: any) => ({
        id: p._id,
        restaurantId: Array.isArray(p.restaurantId) ? p.restaurantId : (p.restaurantId ? [p.restaurantId] : []),
        name: p.name,
        description: p.description,
        price: p.price,
        image: p.image,
        available: p.available,
        category: p.category,
        isVeg: p.isVeg,
        isBestseller: p.isBestseller,
      }));

      setProducts(normalized);
    } catch (err) {
      toast.error('Failed to load products');
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setIsLoadingOrders(true);
      const { data } = await API.get('/admin/orders');
      setOrders(
        data.map((o: any) => ({
          id: o._id,
          ...o,
        }))
      );
    } catch {
      toast.error('Failed to load orders');
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const fetchRestaurants = async () => {
    try {
      setIsLoadingRestaurants(true);
      const { data } = await API.get('/restaurants');
      // Handle both direct array response and wrapped response
      const restaurantsData = data.data || data;
      const normalized = Array.isArray(restaurantsData)
        ? restaurantsData.map((r: any) => ({
            id: r._id || r.id,
            ...r,
          }))
        : [];
      setRestaurants(normalized);
    } catch {
      toast.error('Failed to load restaurants');
      setRestaurants([]);
    } finally {
      setIsLoadingRestaurants(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      fetchProducts();
      fetchOrders();
      fetchRestaurants();
    }
  }, [isAuthenticated, user]);

  /* ================= PRODUCT ACTIONS ================= */

  const handleAddProduct = () => {
    setEditingProduct(undefined);
    setFormMode('add');
    setProductFormOpen(true);
  };

  const handleEditProduct = (product: MenuItem) => {
    setEditingProduct(product);
    setFormMode('edit');
    setProductFormOpen(true);
  };

  const handleSaveProduct = async (
    productData: Omit<MenuItem, 'id'> & { id?: string },
    selectedFile?: File | null
  ) => {
    try {
      const formData = new FormData();

      Object.entries(productData).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            value.forEach(item => formData.append(key, item));
          } else {
            formData.append(key, String(value));
          }
        }
      });

      if (selectedFile) {
        formData.append('image', selectedFile);
      }

      if (formMode === 'add') {
        const { data } = await API.post('/admin/products', formData);
        setProducts((prev) => [...prev, { ...data, id: data._id }]);
        toast.success('Product added');
      } else if (editingProduct) {
        const { data } = await API.put(
          `/admin/products/${editingProduct.id}`,
          formData
        );
        setProducts((prev) =>
          prev.map((p) =>
            p.id === editingProduct.id ? { ...data, id: data._id } : p
          )
        );
        toast.success('Product updated');
      }

      setProductFormOpen(false);
    } catch {
      toast.error('Failed to save product');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await API.delete(`/menu/${id}`);
      setProducts((p) => p.filter((x) => x.id !== id));
      toast.success('Product deleted');
    } catch {
      toast.error('Delete failed');
    }
  };

  const handleToggleStock = async (id: string, available: boolean) => {
    try {
      const { data } = await API.put(`/menu/${id}/toggle`);
      setProducts((p) =>
        p.map((x) => (x.id === id ? { ...data, id: data._id } : x))
      );
    } catch {
      toast.error('Stock update failed');
    }
  };

  const handleAddRestaurant = () => {
    setEditingRestaurant(undefined);
    setRestaurantFormMode('add');
    setRestaurantFormOpen(true);
  };

  const handleEditRestaurant = (restaurant: any) => {
    setEditingRestaurant(restaurant);
    setRestaurantFormMode('edit');
    setRestaurantFormOpen(true);
  };

  const handleSaveRestaurant = async (
    restaurantData: any,
    selectedFile?: File | null
  ) => {
    try {
      const formData = new FormData();

      Object.entries(restaurantData).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          formData.append(key, String(value));
        }
      });

      if (selectedFile) {
        formData.append('image', selectedFile);
      }

      if (restaurantFormMode === 'add') {
        const { data } = await API.post('/admin/restaurants', formData);
        // Refresh restaurants list to show the new restaurant
        await fetchRestaurants();
        toast.success('Restaurant added');
      } else if (editingRestaurant) {
        const { data } = await API.put(
          `/admin/restaurants/${editingRestaurant.id}`,
          formData
        );
        setRestaurants((prev) =>
          prev.map((r) =>
            r.id === editingRestaurant.id ? { ...data, id: data._id } : r
          )
        );
        toast.success('Restaurant updated');
      }

      setRestaurantFormOpen(false);
    } catch {
      toast.error('Failed to save restaurant');
    }
  };

  const handleDeleteRestaurant = async (id: string) => {
    try {
      await API.delete(`/admin/restaurants/${id}`);
      setRestaurants((r) => r.filter((x) => x.id !== id));
      toast.success('Restaurant deleted');
    } catch {
      toast.error('Delete failed');
    }
  };

  /* ================= ORDER ACTIONS ================= */

  const handleOrderStatusChange = async (
    orderId: string,
    status: Order['orderStatus']
  ) => {
    try {
      await API.put(`/orders/${orderId}/status`, { status });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, orderStatus: status } : o))
      );
      toast.success('Order status updated');
    } catch {
      toast.error('Failed to update order status');
    }
  };

  const handleExpectedDeliveryChange = async (
    orderId: string,
    date: string,
    time: string
  ) => {
    try {
      await API.put(`/orders/${orderId}/delivery`, {
        expectedDeliveryDate: date,
        expectedDeliveryTime: time,
      });
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? { ...o, expectedDeliveryDate: date, expectedDeliveryTime: time }
            : o
        )
      );
    } catch {
      toast.error('Failed to update delivery time');
    }
  };

  const handleMarkAsRead = async (orderId: string) => {
    try {
      await API.put(`/orders/${orderId}/read`);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, isRead: true } : o))
      );
    } catch {
      toast.error('Failed to mark as read');
    }
  };

  /* ================= RENDER ================= */

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {!isAuthenticated || user?.role !== 'admin' ? (
        <main className="container py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="mb-6 text-muted-foreground">
            Admin privileges required
          </p>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </main>
      ) : (
        <main className="container px-4 py-8">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
            <TabsList className="grid grid-cols-5">
              <TabsTrigger value="dashboard">
                <BarChart3 className="h-4 w-4 mr-2" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="orders">
                <Package className="h-4 w-4 mr-2" />
                Orders
              </TabsTrigger>
              <TabsTrigger value="products">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Products
              </TabsTrigger>
              <TabsTrigger value="restaurants">
                <Store className="h-4 w-4 mr-2" />
                Restaurants
              </TabsTrigger>
              <TabsTrigger value="reports">
                <FileText className="h-4 w-4 mr-2" />
                Reports
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {stats.map((s, i) => (
                <Card key={i}>
                  <CardHeader className="flex justify-between items-center">
                    <CardTitle className="text-sm">{s.title}</CardTitle>
                    <s.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent className="text-2xl font-bold">
                    {s.value}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="products" className="space-y-6">
              <div className="flex justify-between">
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
                <Button onClick={handleAddProduct}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onEdit={handleEditProduct}
                    onDelete={handleDeleteProduct}
                    onToggleStock={handleToggleStock}
                    restaurants={restaurants}
                  />
                ))}
              </div>

              <ProductForm
                isOpen={productFormOpen}
                onClose={() => setProductFormOpen(false)}
                onSave={handleSaveProduct}
                product={editingProduct}
                mode={formMode}
                restaurants={restaurants}
              />
            </TabsContent>

            <TabsContent value="orders">
              {orders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onStatusChange={handleOrderStatusChange}
                  onExpectedDeliveryChange={handleExpectedDeliveryChange}
                  onMarkAsRead={handleMarkAsRead}
                />
              ))}
            </TabsContent>

            <TabsContent value="restaurants" className="space-y-6">
              <div className="flex justify-between">
                <Input
                  placeholder="Search restaurants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
                <Button onClick={handleAddRestaurant}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Restaurant
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredRestaurants.map((restaurant) => (
                  <RestaurantAdminCard
                    key={restaurant.id}
                    restaurant={restaurant}
                    onEdit={handleEditRestaurant}
                    onDelete={handleDeleteRestaurant}
                  />
                ))}
              </div>

              <RestaurantForm
                isOpen={restaurantFormOpen}
                onClose={() => setRestaurantFormOpen(false)}
                onSave={handleSaveRestaurant}
                restaurant={editingRestaurant}
                mode={restaurantFormMode}
              />
            </TabsContent>

            <TabsContent value="reports" className="space-y-6">
              <Tabs defaultValue="daily" className="w-full">
                <TabsList>
                  <TabsTrigger value="daily">Daily Report</TabsTrigger>
                  <TabsTrigger value="monthly">Monthly Report</TabsTrigger>
                </TabsList>
                <TabsContent value="daily">
                  <DailyReport />
                </TabsContent>
                <TabsContent value="monthly">
                  <MonthlyReport />
                </TabsContent>
              </Tabs>
            </TabsContent>
          </Tabs>
        </main>
      )}
    </div>
  );
};

export default AdminPage;
