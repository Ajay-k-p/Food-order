import { useState, useRef, useEffect } from 'react';
import { MenuItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { X } from 'lucide-react';

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Omit<MenuItem, 'id'> & { id?: string }, selectedFile?: File | null) => void;
  product?: MenuItem;
  mode: 'add' | 'edit';
  restaurants: any[];
}

export const ProductForm = ({ isOpen, onClose, onSave, product, mode, restaurants }: ProductFormProps) => {
  const [formData, setFormData] = useState<Omit<MenuItem, 'id'> & { id?: string }>({
    id: product?.id,
    restaurantId: product?.restaurantId || [],
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || 0,
    image: product?.image || '',
    available: product?.available ?? true,
    category: product?.category || '',
    isVeg: product?.isVeg || false,
    isBestseller: product?.isBestseller || false,
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(product?.image || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (product && isOpen) {
      setFormData({
        id: product.id,
        restaurantId: Array.isArray(product.restaurantId) ? product.restaurantId : (product.restaurantId ? [product.restaurantId] : []),
        name: product.name || '',
        description: product.description || '',
        price: product.price || 0,
        image: product.image || '',
        available: product.available ?? true,
        category: product.category || '',
        isVeg: product.isVeg || false,
        isBestseller: product.isBestseller || false,
      });
      setImagePreview(product.image || null);
      setSelectedFile(null); // Reset selected file when switching products
    } else if (!product && isOpen && mode === 'add') {
      // Reset form for add mode
      setFormData({
        restaurantId: [],
        name: '',
        description: '',
        price: 0,
        image: '',
        available: true,
        category: '',
        isVeg: false,
        isBestseller: false,
      });
      setImagePreview(null);
      setSelectedFile(null);
    }
  }, [product, isOpen, mode]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSave = {
      ...formData,
      restaurantId: Array.isArray(formData.restaurantId) ? formData.restaurantId : [formData.restaurantId]
    };
    onSave(dataToSave, selectedFile);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {mode === 'add' ? 'Add New Product' : 'Edit Product'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'add' ? 'Fill in the details to add a new product to the menu.' : 'Update the product details below.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Restaurants</Label>
            <div className="mt-2 space-y-2 max-h-32 overflow-y-auto border rounded-md p-3">
              {restaurants.map((r) => (
                <div key={r.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`restaurant-${r.id}`}
                    checked={Array.isArray(formData.restaurantId) && formData.restaurantId.includes(r.id)}
                    onCheckedChange={(checked) => {
                      const currentIds = Array.isArray(formData.restaurantId) ? formData.restaurantId : [];
                      if (checked) {
                        setFormData({ ...formData, restaurantId: [...currentIds, r.id] });
                      } else {
                        setFormData({ ...formData, restaurantId: currentIds.filter(id => id !== r.id) });
                      }
                    }}
                  />
                  <Label htmlFor={`restaurant-${r.id}`} className="text-sm font-normal">
                    {r.name}
                  </Label>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Select the restaurants where this product should be available
            </p>
          </div>

          <div>
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price (₹)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="mt-1"
                min={0}
                required
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="mt-1"
                placeholder="e.g. Burgers, Pizza"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="image">Product Image</Label>
            <div className="mt-1">
              <Input
                ref={fileInputRef}
                id="image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {imagePreview ? (
                  <div className="space-y-2">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-w-full max-h-32 mx-auto rounded"
                    />
                    <p className="text-sm text-gray-600">Click to change image</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-gray-400">
                      <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-600">Click to upload image</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 pt-2">
            <div className="flex items-center gap-3">
              <Switch
                id="available"
                checked={formData.available}
                onCheckedChange={(checked) => setFormData({ ...formData, available: checked })}
              />
              <Label htmlFor="available">In Stock</Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                id="isVeg"
                checked={formData.isVeg}
                onCheckedChange={(checked) => setFormData({ ...formData, isVeg: checked })}
              />
              <Label htmlFor="isVeg">Vegetarian</Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                id="isBestseller"
                checked={formData.isBestseller}
                onCheckedChange={(checked) => setFormData({ ...formData, isBestseller: checked })}
              />
              <Label htmlFor="isBestseller">Bestseller</Label>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {mode === 'add' ? 'Add Product' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
