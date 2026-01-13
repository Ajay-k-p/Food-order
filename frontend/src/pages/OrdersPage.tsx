import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Clock, CheckCircle2, Truck, ChefHat, ArrowLeft } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Order } from '@/types';
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';




const getStatusIcon = (status: Order['orderStatus']) => {
  switch (status) {
    case 'pending_payment':
      return <Clock className="h-5 w-5" />;
    case 'confirmed':
      return <CheckCircle2 className="h-5 w-5" />;
    case 'preparing':
      return <ChefHat className="h-5 w-5" />;
    case 'out_for_delivery':
      return <Truck className="h-5 w-5" />;
    case 'delivered':
      return <Package className="h-5 w-5" />;
    default:
      return <Clock className="h-5 w-5" />;
  }
};

const getStatusColor = (status: Order['orderStatus']) => {
  switch (status) {
    case 'pending_payment':
      return 'bg-warning/10 text-warning';
    case 'confirmed':
      return 'bg-primary/10 text-primary';
    case 'preparing':
      return 'bg-accent/10 text-accent';
    case 'out_for_delivery':
      return 'bg-primary/10 text-primary';
    case 'delivered':
      return 'bg-success/10 text-success';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const getStatusLabel = (status: Order['orderStatus']) => {
  switch (status) {
    case 'pending_payment':
      return 'Pending Payment';
    case 'confirmed':
      return 'Order Confirmed';
    case 'preparing':
      return 'Being Prepared';
    case 'out_for_delivery':
      return 'Out for Delivery';
    case 'delivered':
      return 'Delivered';
    default:
      return status;
  }
};

const OrdersPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 🔗 BACKEND URL
  const API = axios.create({
    baseURL: `${API_BASE_URL}/api`
  });

  // Add auth token to requests
  API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Fetch user orders from backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const response = await API.get('/orders/my-orders');
        const ordersData = response.data.map((order: any) => ({
          id: order._id,
          userId: order.user._id,
          restaurantId: order.restaurantId,
          restaurantName: order.restaurantName,
          items: order.items,
          totalAmount: order.totalAmount,
          paymentStatus: order.paymentStatus,
          orderStatus: order.orderStatus,
          createdAt: order.createdAt,
          deliveryAddress: order.deliveryAddress,
          expectedDeliveryDate: order.expectedDeliveryDate,
          expectedDeliveryTime: order.expectedDeliveryTime,
          isRead: order.isRead
        }));
        setOrders(ordersData);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        // Keep empty array on error
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated && user) {
      fetchOrders();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container flex flex-col items-center justify-center px-4 py-20">
          <h1 className="mb-4 font-display text-2xl font-bold">Please login to view orders</h1>
          <Button onClick={() => navigate('/auth')}>Login / Sign Up</Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container px-4 py-8">
        <Button variant="ghost" className="mb-6 gap-2" onClick={() => navigate('/')}>
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>

        <h1 className="mb-8 font-display text-3xl font-bold">My Orders</h1>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 rounded-full bg-muted p-6">
              <Package className="h-10 w-10 text-muted-foreground animate-pulse" />
            </div>
            <h2 className="mb-2 font-display text-xl font-semibold">Loading orders...</h2>
            <p className="text-muted-foreground">
              Please wait while we fetch your orders.
            </p>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 rounded-full bg-muted p-6">
              <Package className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="mb-2 font-display text-xl font-semibold">No orders yet</h2>
            <p className="mb-6 text-muted-foreground">
              Start ordering delicious food from your favorite restaurants!
            </p>
            <Button onClick={() => navigate('/')}>Browse Restaurants</Button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="overflow-hidden rounded-2xl border border-border bg-card"
              >
                {/* Order Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border bg-secondary/30 px-6 py-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-display font-bold text-foreground">
                        #{order.id}
                      </span>
                      <div
                        className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(
                          order.orderStatus
                        )}`}
                      >
                        {getStatusIcon(order.orderStatus)}
                        {getStatusLabel(order.orderStatus)}
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {order.restaurantName} • {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                    {order.expectedDeliveryDate && order.expectedDeliveryTime && (
                      <p className="mt-1 text-sm text-primary font-medium">
                        Expected Delivery: {order.expectedDeliveryDate} at {order.expectedDeliveryTime}
                      </p>
                    )}
                  </div>
                  <p className="font-display text-xl font-bold text-primary">
                    ₹{order.totalAmount}
                  </p>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-16 w-16 rounded-xl object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            ₹{item.price} × {item.quantity}
                          </p>
                        </div>
                        <p className="font-medium">₹{item.price * item.quantity}</p>
                      </div>
                    ))}
                  </div>

                  {/* Order Progress (for active orders) */}
                  {order.orderStatus !== 'delivered' && order.orderStatus !== 'pending_payment' && (
                    <div className="mt-6 border-t border-border pt-6">
                      <h4 className="mb-4 font-medium text-foreground">Order Progress</h4>
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success text-success-foreground">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <div className="h-1 flex-1 rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-success transition-all"
                            style={{
                              width:
                                order.orderStatus === 'confirmed'
                                  ? '33%'
                                  : order.orderStatus === 'preparing'
                                  ? '66%'
                                  : '100%',
                            }}
                          />
                        </div>
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full ${
                            order.orderStatus === 'out_for_delivery'
                              ? 'bg-success text-success-foreground'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          <Truck className="h-4 w-4" />
                        </div>
                      </div>
                      <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                        <span>Confirmed</span>
                        <span>Preparing</span>
                        <span>Out for Delivery</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default OrdersPage;
