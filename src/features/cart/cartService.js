//
// Cart persistence + operations.
// Guest cart lives in localStorage; signed-in cart lives in Firestore at users/{uid}/cart/{itemId}.
// Both paths expose the same functions so CartContext does not branch on auth state.
//

import { db } from '@/firebase';
import { collection, doc, setDoc, deleteDoc, getDocs, updateDoc } from 'firebase/firestore';

const GUEST_KEY = 'snavyo_guest_cart';

function guestItems() {
  try {
    const raw = localStorage.getItem(GUEST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
}

function saveGuestItems(items) {
  try {
    localStorage.setItem(GUEST_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Guest cart save failed:', err);
  }
}

/** Coupon validation stub — Part 4 will replace this with a server call. */
export function validateCoupon(code) {
  const normalised = String(code || '').trim().toUpperCase();
  if (!normalised) return { valid: false, error: 'Enter a coupon code' };
  if (normalised === 'SNAVYO10') return { valid: true, discount: 0.1, label: '10% off' };
  if (normalised === 'WELCOME5') return { valid: true, discount: 0.05, label: '5% off' };
  return { valid: false, error: 'Invalid coupon code' };
}

export async function getCart(userId, isGuest) {
  if (isGuest || !userId) return guestItems();
  const snap = await getDocs(collection(db, 'users', userId, 'cart'));
  return snap.docs.map((d) => ({ ...d.data(), itemId: d.id }));
}

export async function addCartItem(userId, isGuest, item) {
  if (isGuest || !userId) {
    const items = guestItems();
    const existing = items.find((i) => i.draftId === item.draftId);
    let next;
    if (existing) {
      next = items.map((i) =>
        i.draftId === item.draftId ? { ...i, quantity: i.quantity + (item.quantity || 1) } : i,
      );
    } else {
      next = [...items, item];
    }
    saveGuestItems(next);
    return next;
  }
  // Signed-in: use draftId as the document id so duplicates merge instead of stacking.
  const ref = doc(db, 'users', userId, 'cart', item.draftId);
  await setDoc(ref, { ...item, updatedAt: new Date().toISOString() }, { merge: true });
  return getCart(userId, false);
}

export async function removeCartItem(userId, isGuest, itemId) {
  if (isGuest || !userId) {
    const next = guestItems().filter((i) => i.itemId !== itemId && i.draftId !== itemId);
    saveGuestItems(next);
    return next;
  }
  await deleteDoc(doc(db, 'users', userId, 'cart', itemId));
  return getCart(userId, false);
}

export async function updateCartItem(userId, isGuest, itemId, patch) {
  if (isGuest || !userId) {
    const next = guestItems().map((i) =>
      i.itemId === itemId || i.draftId === itemId ? { ...i, ...patch } : i,
    );
    saveGuestItems(next);
    return next;
  }
  await updateDoc(doc(db, 'users', userId, 'cart', itemId), patch);
  return getCart(userId, false);
}

/** Merge the guest cart into a user's Firestore cart after login. */
export async function mergeGuestCart(userId) {
  const items = guestItems();
  if (!items.length) return;
  await Promise.all(
    items.map((item) =>
      setDoc(doc(db, 'users', userId, 'cart', item.draftId), {
        ...item,
        updatedAt: new Date().toISOString(),
      }),
    ),
  );
  saveGuestItems([]);
}