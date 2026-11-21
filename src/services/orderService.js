//
// Order service. Talks to our Express server (which owns Razorpay keys)
// and to Firestore for the order documents the client is allowed to read.
//

import { db } from '@/firebase';
import { collection, addDoc, doc, getDocs, query, where, orderBy } from 'firebase/firestore';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

/**
 * Ask our server to create a Razorpay order for this draft.
 * Server recomputes the price — never trust the client number.
 * @param {Object} payload
 * @returns {Promise<{razorpayOrderId:string, amount:number, currency:string, serverOrderId:string}>}
 */
export async function initiatePayment(payload) {
  const res = await fetch(`${API_BASE}/checkout/create-order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Payment init failed (${res.status})`);
  }
  return res.json();
}

/**
 * Verify the payment signature returned by Razorpay checkout.
 * @param {Object} params - { razorpay_payment_id, razorpay_order_id, razorpay_signature }
 */
export async function verifyPayment(params) {
  const res = await fetch(`${API_BASE}/checkout/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Verification failed (${res.status})`);
  }
  return res.json();
}

/** Fetch orders for a signed-in user, newest first. */
export async function getOrders(userId) {
  const q = query(collection(db, 'orders'), where('userId', '==', userId), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/** Read a single order by id. */
export async function getOrder(orderId) {
  const snap = await getDocs(query(collection(db, 'orders'), where('id', '==', orderId)));
  const d = snap.docs[0];
  return d ? { id: d.id, ...d.data() } : null;
}

/**
 * Create an order record in Firestore (server is the one that writes it after
 * payment; the client calls this only for guest checkout stubs).
 */
export async function createOrderRecord(order) {
  return addDoc(collection(db, 'orders'), { ...order, createdAt: new Date().toISOString() });
}