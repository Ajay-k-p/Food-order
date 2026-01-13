import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface RestaurantFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any, selectedFile?: File | null) => void;
  restaurant?: any;
  mode: 'add' | 'edit';
}

export const RestaurantForm = ({
  isOpen,
  onClose,
  onSave,
  restaurant,
  mode,
}: RestaurantFormProps) => {
  const [formData, setFormData] = useState({
    id: restaurant?.id,
    name: restaurant?.name || '',
    description: restaurant?.description || '',
    address: restaurant?.address || '',
    cuisine: restaurant?.cuisine || '',
    rating: restaurant?.rating || 0,
    deliveryTime: restaurant?.deliveryTime || '',
    deliveryFee: restaurant?.deliveryFee || 0,
    featured: restaurant?.featured ?? false,
    image: restaurant?.image || '',
    isActive: restaurant?.isActive ?? true,
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    restaurant?.image || null
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ================= EFFECT ================= */

  useEffect(() => {
    if (restaurant) {
      setFormData({
        id: restaurant.id,
        name: restaurant.name || '',
        description: restaurant.description || '',
        address: restaurant.address || '',
        cuisine: restaurant.cuisine || '',
        rating: restaurant.rating || 0,
        deliveryTime: restaurant.deliveryTime || '',
        deliveryFee: restaurant.deliveryFee || 0,
        featured: restaurant.featured ?? false,
        image: restaurant.image || '',
        isActive: restaurant.isActive ?? true,
      });
      setImagePreview(restaurant.image || null);
      setSelectedFile(null);
    }
  }, [restaurant]);

  /* ================= HANDLERS ================= */

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target.result === 'string') {
        setImagePreview(e.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData, selectedFile);
    onClose();
  };

  /* ================= RENDER ================= */

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {mode === 'add' ? 'Add New Restaurant' : 'Edit Restaurant'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'add'
              ? 'Fill in the details to add a new restaurant.'
              : 'Update the restaurant details below.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* NAME */}
          <div>
            <Label htmlFor="name">Restaurant Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="mt-1"
              required
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="mt-1"
              rows={2}
            />
          </div>

          {/* ADDRESS */}
          <div>
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              className="mt-1"
              rows={2}
              required
            />
          </div>

          {/* CUISINE */}
          <div>
            <Label htmlFor="cuisine">Cuisine</Label>
            <Input
              id="cuisine"
              value={formData.cuisine}
              onChange={(e) =>
                setFormData({ ...formData, cuisine: e.target.value })
              }
              className="mt-1"
              required
            />
          </div>

          {/* RATING */}
          <div>
            <Label htmlFor="rating">Rating</Label>
            <Input
              id="rating"
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={formData.rating}
              onChange={(e) =>
                setFormData({ ...formData, rating: parseFloat(e.target.value) || 0 })
              }
              className="mt-1"
              required
            />
          </div>

          {/* DELIVERY TIME */}
          <div>
            <Label htmlFor="deliveryTime">Delivery Time</Label>
            <Input
              id="deliveryTime"
              value={formData.deliveryTime}
              onChange={(e) =>
                setFormData({ ...formData, deliveryTime: e.target.value })
              }
              className="mt-1"
              placeholder="e.g., 30-45 mins"
              required
            />
          </div>

          {/* DELIVERY FEE */}
          <div>
            <Label htmlFor="deliveryFee">Delivery Fee</Label>
            <Input
              id="deliveryFee"
              type="number"
              min="0"
              step="0.01"
              value={formData.deliveryFee}
              onChange={(e) =>
                setFormData({ ...formData, deliveryFee: parseFloat(e.target.value) || 0 })
              }
              className="mt-1"
              required
            />
          </div>

          {/* IMAGE */}
          <div>
            <Label>Restaurant Image</Label>
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            <div
              className="mt-2 border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-gray-400"
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-32 mx-auto rounded"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Click to change image
                  </p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Click to upload image
                </p>
              )}
            </div>
          </div>

          {/* FEATURED SWITCH */}
          <div className="flex items-center gap-3 pt-2">
            <Switch
              id="featured"
              checked={formData.featured}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, featured: checked })
              }
            />
            <Label htmlFor="featured">Featured Restaurant</Label>
          </div>

          {/* ACTIVE SWITCH */}
          <div className="flex items-center gap-3 pt-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isActive: checked })
              }
            />
            <Label htmlFor="isActive">Restaurant Active</Label>
          </div>

          {/* ACTIONS */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {mode === 'add' ? 'Add Restaurant' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
