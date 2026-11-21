//
// Express server for SNAVYO ALBUM STUDIO – Razorpay TEST mode.
// All pricing is recomputed on the server; the client never controls the final amount.
//
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import Razorpay from 'razorpay';
import crypto from 'crypto';

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173', credentials: true }));
app.use(bodyParser.json());

// Razorpay client (TEST keys only)
const rzp = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ---- Helper: recompute price exactly like the client ----
const PRICING = {
  weddingAlbum: {
    basePerSheet: 29.99,
    minSheets: 1,
    maxSheets: 100,
    defaultSheets: 30,
  },
  photobook: {
    basePerPage: 9.99,
    minPages: 24,
    maxPages: 100,
    defaultPages: 80,
  },
  paper: {
    'premium-photo': { modifier: 0.15, label: 'Premium Photo Paper' },
    'non-tearable': { modifier: 0.25, label: 'Non-Tearable Paper' },
  },
  cover: {
    hardcover: { modifier: 40.00, label: 'Hardcover' },
    softcover: { modifier: 0.00, label: 'Softcover' },
  },
  lamination: {
    gloss: { modifier: 20.00, label: 'Gloss' },
    matte: { modifier: 20.00, label: 'Matte' },
  },
  orientation: {
    horizontal: { modifier: 0.00, label: 'Horizontal' },
    vertical: { modifier: 0.05, label: 'Vertical' },
    square: { modifier: 0.05, label: 'Square' },
  },
  shipping: {
    flat: 12.99,
    freeThreshold: 500.00,
  },
  tax: {
    rate: 0.08,
    enabled: true,
  },
};

function recomputePrice(opts) {
  const { productType, sizeOrSpread, sheetsOrPages, paper, lamination, cover, orientation } = opts;
  const product = PRICING[productType === 'wedding-album' ? 'weddingAlbum' : 'photobook'];
  if (!product) throw new Error('Invalid product type');

  const baseUnit = productType === 'wedding-album' ? PRICING.weddingAlbum.basePerSheet : PRICING.photobook.basePerPage;
  let sheetCost = baseUnit * sheetsOrPages;
  let extras = 0;

  const paperOpt = PRICING.paper[paper];
  if (paperOpt) extras += sheetCost * paperOpt.modifier;

  const coverOpt = PRICING.cover[cover];
  if (coverOpt) extras += coverOpt.modifier;

  const laminationOpt = PRICING.lamination[lamination];
  if (laminationOpt) extras += laminationOpt.modifier;

  const orientationOpt = PRICING.orientation[orientation];
  if (orientationOpt && orientationOpt.modifier > 0) extras += sheetCost * orientationOpt.modifier;

  const subtotal = parseFloat((sheetCost + extras).toFixed(2));
  let shipping = PRICING.shipping.flat;
  if (subtotal >= PRICING.shipping.freeThreshold) shipping = 0;
  let tax = 0;
  if (PRICING.tax.enabled) tax = parseFloat(((subtotal + shipping) * PRICING.tax.rate).toFixed(2));
  const total = parseFloat((subtotal + shipping + tax).toFixed(2));

  return { subtotal, shipping, tax, total };
}

// ---- Idempotency store (in-memory for test; use Redis in prod) ----
const idempotencyStore = new Map();

// ---- Routes ----
app.get('/api/health', (req, res) => res.json({ ok: true }));

// Create Razorpay order
app.post('/api/checkout/create-order', async (req, res) => {
  try {
    const { productType, sizeOrSpread, sheetsOrPages, paper, lamination, cover, orientation, idempotencyKey } = req.body;

    // Idempotency: if we've seen this key, return the cached order id
    if (idempotencyKey && idempotencyStore.has(idempotencyKey)) {
      return res.json(idempotencyStore.get(idempotencyKey));
    }

    // Recompute total on server (never trust client)
    const { total } = recomputePrice(req.body);
    const amountPaise = Math.round(total * 100);

    const order = await rzp.orders.create({
      amount: amountPaise,
      currency: 'INR',
      receipt: `snavyo_${Date.now()}`,
      notes: {
        productType,
        sizeOrSpread: String(sizeOrSpread),
        sheetsOrPages: String(sheetsOrPages),
        paper,
        lamination,
        cover,
        orientation,
      },
    });

    const response = {
      razorpayOrderId: order.id,
      amount: amountPaise,
      currency: order.currency,
      serverOrderId: order.id,
    };

    if (idempotencyKey) idempotencyStore.set(idempotencyKey, response);
    res.json(response);
  } catch (err) {
    console.error('create-order error:', err);
    res.status(500).json({ error: err.message || 'Failed to create payment order' });
  }
});

// Verify Razorpay signature
app.post('/api/checkout/verify', async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, idempotencyKey } = req.body;

    // Idempotency check
    if (idempotencyKey && idempotencyStore.has(`verify_${idempotencyKey}`)) {
      return res.json({ success: true, cached: true });
    }

    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const expected = hmac.digest('hex');

    if (expected !== razorpay_signature) {
      return res.status(400).json({ error: 'Invalid signature' });
    }

    // Signature is valid — in a real app you would:
    // 1. Update Firestore order status to 'paid'
    // 2. Send confirmation email / webhook
    // 3. Trigger album production queue

    const response = { success: true };
    if (idempotencyKey) idempotencyStore.set(`verify_${idempotencyKey}`, response);
    res.json(response);
  } catch (err) {
    console.error('verify error:', err);
    res.status(500).json({ error: err.message || 'Verification failed' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`SNAVYO server listening on http://localhost:${PORT}`));