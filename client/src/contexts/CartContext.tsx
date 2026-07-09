import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export interface CartItem {
  id: string;
  title: string;
  price: number | null;
  previewImageUrl: string;
  category?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  setCartFromServer: (items: CartItem[]) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { token } = useAuth();

  // ✅ Fetch cart from server
  useEffect(() => {
    const fetchCart = async () => {
      if (!token) return;

      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (Array.isArray(res.data.cart)) {
          const items = res.data.cart
            .filter(item => item.template && item.template._id)
            .map((item: any) => ({
              id: item.template._id,
              title: item.template.title,
              price: item.template.estimatedPrice,
              previewImageUrl: item.template.previewImageUrl,
              category: item.template.framework,
            }));

          setCart(items);
        } else {
          console.error('Unexpected cart data:', res.data);
        }
      } catch (error) {
        console.error('Failed to fetch cart:', error);
      }
    };

    fetchCart();
  }, [token]);

  const addToCart = async (item: CartItem) => {
    if (!token) {
      toast.error('Please sign in to add items to your cart');
      return;
    }

    const exists = cart.some(p => p.id === item.id);
    if (exists) {
      toast.info('Template is already in your cart');
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/cart`,
        { templateId: item.id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setCart(prev => [...prev, item]);
      toast.success('Added to cart');
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  const removeFromCart = async (id: string) => {
    if (!token) return;

    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/users/cart/remove/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCart(prev => prev.filter(p => p.id !== id));
      toast.success('Removed from cart');
    } catch (error) {
      console.error('Failed to remove item from cart:', error);
      toast.error('Failed to remove from cart');
    }
  };

  const clearCart = async () => {
    if (!token) return;

    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/users/cart/clear`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCart([]);
    } catch (error) {
      console.error('Failed to clear cart:', error);
    }
  };

  const setCartFromServer = (items: CartItem[]) => {
    const safeItems = items.filter(
      item => item.id && item.title && item.price !== undefined
    );
    setCart(safeItems);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        setCartFromServer,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
