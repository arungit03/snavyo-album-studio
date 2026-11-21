//
// OrderContext — thin orchestration layer over the cart + draft + pricing.
// It does NOT talk to a backend yet; Part 3 keeps checkout server-side via /api.
//
import { createContext, useContext, useMemo, useState, useCallback } from 'react';
import { useAuth } from '@/features/auth/AuthContext';
import { useCart } from '@/features/cart/CartContext';
import { useOrderDraft } from './OrderDraftContext';
import { calculatePrice } from '@/utils/pricing';

const OrderContext = createContext(null);

export function OrderProvider({ children }) {
  const { user } = useAuth();
  const { draft, setField, setPhotos, setPages, setStep, recalcPrice, resetDraft } = useOrderDraft();
  const { addDraftToCart, totals } = useCart();

  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');

  const priceFor = useCallback(
    (overrides = {}) => {
      const merged = { ...draft, ...overrides };
      return calculatePrice({
        productType: merged.productType,
        sizeOrSpread: merged.size,
        sheetsOrPages: merged.sheetsOrPages,
        paper: merged.paper,
        lamination: merged.lamination,
        cover: merged.cover,
        orientation: merged.orientation,
      });
    },
    [draft],
  );

  const placeOrder = useCallback(async () => {
    if (!user) {
      setError('Please sign in to place an order.');
      return null;
    }
    setPlacing(true);
    setError('');
    try {
      // Build a snapshot of the draft to store in the cart.
      const snapshot = {
        draftId: draft.id,
        productType: draft.productType,
        themeId: draft.themeId,
        orientation: draft.orientation,
        size: draft.size,
        customWidth: draft.customWidth,
        customHeight: draft.customHeight,
        paper: draft.paper,
        lamination: draft.lamination,
        cover: draft.cover,
        sheetsOrPages: draft.sheetsOrPages,
        photoCount: (draft.photos || []).length,
        pageCount: (draft.pages || []).length,
        pricing: draft.pricing,
        createdAt: new Date().toISOString(),
      };
      await addDraftToCart(snapshot);
      // Refresh pricing after adding (server may apply discounts later).
      const pricing = recalcPrice();
      return { ok: true, pricing, snapshot };
    } catch (err) {
      setError(err?.message || 'Could not place order. Try again.');
      return null;
    } finally {
      setPlacing(false);
    }
  }, [user, draft, addDraftToCart, recalcPrice]);

  const value = useMemo(
    () => ({
      draft,
      setField,
      setPhotos,
      setPages,
      setStep,
      recalcPrice,
      resetDraft,
      priceFor,
      placeOrder,
      placing,
      error,
      totals,
    }),
    [draft, setField, setPhotos, setPages, setStep, recalcPrice, resetDraft, priceFor, placeOrder, placing, error, totals],
  );

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrder() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrder must be used inside <OrderProvider>');
  return ctx;
}