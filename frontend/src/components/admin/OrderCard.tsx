import { useState } from 'react';
import { Clock, CheckCircle2, ChefHat, Truck, Package, CalendarDays, Bell } from 'lucide-react';
import { Order } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface OrderCardProps {
  order: Order;
  onStatusChange: (orderId: string, status: Order['orderStatus']) => void;
  onExpectedDeliveryChange: (orderId: string, date: string, time: string) => void;
  onMarkAsRead: (orderId: string) => void;
}

const getStatusIcon = (status: Order['orderStatus']) => {
  switch (status) {
    case 'pending_payment':
      return <Clock className="h-4 w-4" />;
    case 'confirmed':
      return <CheckCircle2 className="h-4 w-4" />;
    case 'preparing':
      return <ChefHat className="h-4 w-4" />;
    case 'out_for_delivery':
      return <Truck className="h-4 w-4" />;
    case 'delivered':
      return <Package className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

const getStatusColor = (status: Order['orderStatus']) => {
  switch (status) {
    case 'pending_payment':
      return 'text-warning';
    case 'confirmed':
      return 'text-primary';
    case 'preparing':
      return 'text-accent';
    case 'out_for_delivery':
      return 'text-info';
    case 'delivered':
      return 'text-success';
    default:
      return 'text-muted-foreground';
  }
};

const convertTo24Hour = (timeStr: string) => {
  if (!timeStr) return '';
  const [time, modifier] = timeStr.split(' ');
  let [hours, minutes] = time.split(':');
  if (modifier === 'pm' && hours !== '12') {
    hours = String(parseInt(hours, 10) + 12);
  }
  if (modifier === 'am' && hours === '12') {
    hours = '00';
  }
  return `${hours.padStart(2, '0')}:${minutes}`;
};

export const OrderCard = ({ order, onStatusChange, onExpectedDeliveryChange, onMarkAsRead }: OrderCardProps) => {
  const [date, setDate] = useState(order.expectedDeliveryDate || '');
  const [time, setTime] = useState(convertTo24Hour(order.expectedDeliveryTime || ''));

  const handleSaveDelivery = () => {
    onExpectedDeliveryChange(order.id, date, time);
    toast.success('Expected delivery time updated');
  };

  const handleCardClick = () => {
    if (!order.isRead) {
      onMarkAsRead(order.id);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`rounded-2xl border bg-card p-6 transition-all hover:shadow-md ${
        !order.isRead ? 'border-success border-2 ring-2 ring-success/20' : 'border-border'
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <span className="font-display text-lg font-bold">#{order.id}</span>
            {!order.isRead && (
              <span className="flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-xs font-semibold text-success animate-pulse">
                <Bell className="h-3 w-3" />
                NEW
              </span>
            )}
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">{order.restaurantName}</span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {order.deliveryAddress}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Customer: {order.user?.name} {order.user?.phone && `(${order.user.phone})`}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {order.items.map((item) => (
              <span
                key={item.id}
                className="rounded-full bg-secondary px-3 py-1 text-sm"
              >
                {item.name} × {item.quantity}
              </span>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Ordered: {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="flex flex-col items-end gap-4">
          <p className="font-display text-xl font-bold text-primary">
            ₹{order.totalAmount}
          </p>
          
          <div className={`flex items-center gap-2 ${getStatusColor(order.orderStatus)}`}>
            {getStatusIcon(order.orderStatus)}
            <span className="text-sm font-medium capitalize">
              {order.orderStatus.replace(/_/g, ' ')}
            </span>
          </div>

          <Select
            value={order.orderStatus}
            onValueChange={(value) => onStatusChange(order.id, value as Order['orderStatus'])}
          >
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="confirmed">Order Received</SelectItem>
              <SelectItem value="preparing">Preparing</SelectItem>
              <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Expected Delivery Date & Time */}
      <div className="mt-6 border-t border-border pt-4">
        <div className="flex items-center gap-2 mb-3 text-sm font-medium text-muted-foreground">
          <CalendarDays className="h-4 w-4" />
          Expected Delivery
        </div>
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[150px]">
            <Label htmlFor={`date-${order.id}`} className="text-xs">Date</Label>
            <Input
              id={`date-${order.id}`}
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1"
            />
          </div>
          <div className="flex-1 min-w-[120px]">
            <Label htmlFor={`time-${order.id}`} className="text-xs">Time</Label>
            <Input
              id={`time-${order.id}`}
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="mt-1"
            />
          </div>
          <Button size="sm" onClick={handleSaveDelivery}>
            Save
          </Button>
        </div>
        {order.expectedDeliveryDate && order.expectedDeliveryTime && (
          <p className="mt-2 text-sm text-success">
            Scheduled: {order.expectedDeliveryDate} at {order.expectedDeliveryTime}
          </p>
        )}
      </div>
    </div>
  );
};
