import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { useAuth } from '@/features/auth/AuthContext';
import { getCart, addCartItem, removeCartItem, updateCartItem, validateCoupon } from './cartService';
import { calculatePrice } from '@/utils/pricing';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user, loading } = useAuth();
  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const isGuest = !user;

  // Load cart whenever the user changes (or on guest load).
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoadingItems(true);
      try {
        const data = await getCart(user?.uid, !user);
        if (!cancelled) setItems(data);
      } finally {
        if (!cancelled) setLoadingItems(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [user?.uid, user]);

  const addDraftToCart = useCallback(
    async (draft) => {
      const next = await addCartItem(user?.uid, isGuest, { ...draft, quantity: 1 });
      setItems(next);
      return next;
    },
    [user?.uid, isGuest],
  );

  const removeItem = useCallback(
    async (itemId) => {
      const next = await removeCartItem(user?.uid, isGuest, itemId);
      setItems(next);
      return next;
    },
    [user?.uid, isGuest],
  );

  const updateItemQty = useCallback(
    async (itemId, qty) => {
      const next = await updateCartItem(user?.uid, isGuest, itemId, { quantity: qty });
      setItems(next);
      return next;
    },
    [user?.uid, isGuest],
  );

  const itemPrice = (item) => {
    const { draftId, productType, size, sheetsOrPages, paper, lamination, cover, orientation } = item;
    const result = calculatePrice({
      productType,
      sizeOrSpread: size,
      sheetsOrPages,
      paper,
      lamination,
      cover,
      orientation,
    });
    return { unitPrice: parseFloat(result.total), total: parseFloat((result.total * (item.quantity || 1)).toFixed(2)) };
  };

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + itemPrice(item).total, 0);
    const shipping = subtotal >= 500 ? 0 : 12.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;
    return { subtotal, shipping, tax, total };
  }, [items]);

  const cartValue = useMemo(
    () => ({
      items,
      loadingItems,
      isGuest,
      addDraftToCart,
      removeItem,
      updateItemQty,
      itemPrice,
      totals,
      applyCoupon: async (code) => {
        const result = validateCoupon(code);
        if (!result.valid) return { ok: false, error: result.error };
        return { ok: true, discount: result.discount, label: result.label };
      },
    }),
    [items, loadingItems, isGuest, addDraftToCart, removeItem, updateItemQty, itemPrice, totals],
  );

  return <CartContext.Provider value={cartValue}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
