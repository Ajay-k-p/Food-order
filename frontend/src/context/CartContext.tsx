import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { CartItem, MenuItem } from '@/types';

interface CartState {
  items: CartItem[];
  restaurantId: string | null;
  restaurantName: string | null;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { item: MenuItem; restaurantId: string; restaurantName: string } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartState };

interface CartContextType {
  items: CartItem[];
  restaurantId: string | null;
  restaurantName: string | null;
  addItem: (item: MenuItem, restaurantId: string, restaurantName: string) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { item, restaurantId, restaurantName } = action.payload;
      
      // If cart has items from different restaurant, clear it first
      if (state.restaurantId && state.restaurantId !== restaurantId) {
        return {
          items: [{ ...item, quantity: 1 }],
          restaurantId,
          restaurantName,
        };
      }

      const existingItem = state.items.find((i) => i.id === item.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }

      return {
        items: [...state.items, { ...item, quantity: 1 }],
        restaurantId,
        restaurantName,
      };
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter((i) => i.id !== action.payload);
      return {
        items: newItems,
        restaurantId: newItems.length > 0 ? state.restaurantId : null,
        restaurantName: newItems.length > 0 ? state.restaurantName : null,
      };
    }

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        const newItems = state.items.filter((i) => i.id !== id);
        return {
          items: newItems,
          restaurantId: newItems.length > 0 ? state.restaurantId : null,
          restaurantName: newItems.length > 0 ? state.restaurantName : null,
        };
      }
      return {
        ...state,
        items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
      };
    }

    case 'CLEAR_CART':
      return { items: [], restaurantId: null, restaurantName: null };

    case 'LOAD_CART':
      return action.payload;

    default:
      return state;
  }
};

const initialState: CartState = {
  items: [],
  restaurantId: null,
  restaurantName: null,
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('foodapp_cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: parsedCart });
      } catch (error) {
        console.error('Failed to load cart from localStorage');
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('foodapp_cart', JSON.stringify(state));
  }, [state]);

  const addItem = (item: MenuItem, restaurantId: string, restaurantName: string) => {
    dispatch({ type: 'ADD_ITEM', payload: { item, restaurantId, restaurantName } });
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = state.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        restaurantId: state.restaurantId,
        restaurantName: state.restaurantName,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
