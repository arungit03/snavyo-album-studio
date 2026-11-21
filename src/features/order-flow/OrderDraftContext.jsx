import { createContext, useContext, useEffect, useMemo, useReducer, useRef } from 'react';
import { DraftService } from '@/services/draftService';
import { StorageService } from '@/services/storageService';
import { getDefaultOptions, calculatePrice } from '@/utils/pricing';
import { moveItem } from '@/services/photoService';

const OrderDraftContext = createContext(null);

const STORAGE_KEY = 'snavyo_order_draft';

function freshDraft() {
  const defaults = getDefaultOptions('wedding-album');
  return {
    id: 'draft_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
    productType: defaults.productType,
    themeId: null,
    orientation: defaults.orientation,
    size: defaults.sizeOrSpread,
    customWidth: 36,
    customHeight: 12,
    paper: defaults.paper,
    lamination: defaults.lamination,
    cover: defaults.cover,
    sheetsOrPages: defaults.sheetsOrPages,
    photos: [],
    pages: [],
    pricing: null,
    step: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'hydrate':
      return action.draft;
    case 'patch':
      return { ...state, ...action.patch, updatedAt: new Date().toISOString() };
    case 'setPhotos':
      return { ...state, photos: action.photos, updatedAt: new Date().toISOString() };
    case 'removePhoto':
      return {
        ...state,
        photos: state.photos.filter((p) => p.id !== action.id),
        updatedAt: new Date().toISOString(),
      };
    case 'setPages':
      return { ...state, pages: action.pages, updatedAt: new Date().toISOString() };
    case 'setPricing':
      return { ...state, pricing: action.pricing, updatedAt: new Date().toISOString() };
    case 'setStep':
      return { ...state, step: action.step, updatedAt: new Date().toISOString() };
    case 'reset':
      return freshDraft();
    default:
      return state;
  }
}

export function OrderDraftProvider({ children }) {
  const [draft, dispatch] = useReducer(reducer, undefined, freshDraft);

  // Load persisted draft once on mount, then rehydrate blob URLs from IndexedDB.
  const hydratedRef = useRef(false);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const saved = DraftService.load();
      if (!saved) return;
      if (saved.photos && saved.photos.length) {
        const hydrated = await StorageService.hydrateProjectAssets({ photos: saved.photos });
        saved.photos = hydrated.photos.map((p) => ({
          ...p,
          previewUrl: p.previewUrl || '',
          file: null, // blob is restored as previewUrl only
        }));
      }
      if (!cancelled) dispatch({ type: 'hydrate', draft: saved });
      hydratedRef.current = true;
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Persist on every change (debounced slightly to avoid thrash during drag).
  useEffect(() => {
    const t = setTimeout(() => DraftService.save(draft), 300);
    return () => clearTimeout(t);
  }, [draft]);

  const value = useMemo(() => {
    const setField = (patch) => dispatch({ type: 'patch', patch });

    const recalcPrice = (overrides = {}) => {
      const merged = { ...draft, ...overrides };
      const pricing = calculatePrice({
        productType: merged.productType,
        sizeOrSpread: merged.size,
        sheetsOrPages: merged.sheetsOrPages,
        paper: merged.paper,
        lamination: merged.lamination,
        cover: merged.cover,
        orientation: merged.orientation,
      });
      dispatch({ type: 'setPricing', pricing });
      return pricing;
    };

    return {
      draft,
      setField,
      setPhotos: (photos) => dispatch({ type: 'setPhotos', photos }),
      removePhoto: (id) => dispatch({ type: 'removePhoto', id }),
      setPages: (pages) => dispatch({ type: 'setPages', pages }),
      movePhoto: (from, to) =>
        dispatch({
          type: 'setPhotos',
          photos: moveItem(draft.photos, from, to),
        }),
      setStep: (step) => dispatch({ type: 'setStep', step }),
      recalcPrice,
      resetDraft: () => {
        DraftService.delete();
        dispatch({ type: 'reset' });
      },
      refreshPricing: () => recalcPrice(),
    };
  }, [draft]);

  return <OrderDraftContext.Provider value={value}>{children}</OrderDraftContext.Provider>;
}

export function useOrderDraft() {
  const ctx = useContext(OrderDraftContext);
  if (!ctx) throw new Error('useOrderDraft must be used inside <OrderDraftProvider>');
  return ctx;
}

export { STORAGE_KEY };