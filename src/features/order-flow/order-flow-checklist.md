---
name: order-flow-checklist
description: Part 3 acceptance checklist & env vars for SNAVYO ALBUM STORE
metadata:
  type: project
---

# Part 3 Checklist – Real Accounts, Cart, Checkout & Orders

## ✅ Done
- [x] **AuthContext** (`src/features/auth/AuthContext.jsx`) – login/signup/logout, Firebase auth listener, guest‑cart merge on sign‑in.
- [x] **ProtectedRoute** (`src/features/auth/ProtectedRoute.jsx`) – redirects to `/login` while preserving the destination.
- [x] **Login page** (`src/pages/Login.jsx`) – form, mode toggle, loading state, error display.
- [x] **Auth service** (`src/services/authService.js`) – thin Firebase wrapper with `login`, `signup`, `logout`, `resetPassword`.
- [x] **CartContext** (`src/features/cart/CartContext.jsx`) – guest cart (localStorage) + signed‑in cart (Firestore), coupon stub, totals (`subtotal`, `tax`, `shipping`, `total`).
- [x] **CartService** (`src/features/cart/cartService.js`) – CRUD per user, merge guest cart on login, coupon validation stub.
- [x] **OrderContext** (`src/features/order-flow/OrderContext.jsx`) – ties draft → cart → price → placeholder `placeOrder` + `putOrder` + `verifyPayment`.
- [x] **Firebase config** (`src/firebase.js`) – exports `auth`, `db`, `storage`, `Timestamp`, `initializeFirebaseListeners`, `waitForAuthState`.
- [x] **Checkout page** (`src/pages/Checkout.jsx`) – multi‑step address form, order summary, Razorpay integration, error handling.
- [x] **Orders page** (`src/pages/Orders.jsx`) – list orders, status timeline, invoice download (`downloadUrl` stub).
- [x] **Node/Express server** (`src/server/index.js`) – Razorpay TEST mode endpoints `/api/checkout/create-order` and `/api/checkout/verify`, idempotency key store, price recomputation (never trust client price).
- [x] **Pricing engine** (`src/utils/pricing.js` + `src/constants/pricing.js`) – server copies config so it can recompute totals exactly like the client.
- [x] **Environment files** – `.env` (client) and `src/server/.env.example` (server) with all required vars.
- [x] **Lint config** (`.eslintrc.cjs`) – clean ESLint + React config.
- [x] **Package.json** – updated with `razorpay`, `firebase`, `dotenv` dependencies.

## 🟡 Remaining / Known Limitations
- [ ] **Firestore & Storage security rules** – write Firestore rules per user and Storage rules per user path (see `docs/FIREBASE_RULES.md`).
- [ ] **Invoice PDF generation** – stubbed; a real implementation will use `jsPDF` on the server to build a PDF and return a `downloadUrl`.
- [ ] **Order‑status persistence** – only in Firestore; the server will be the single writer to change `status` from `pending_payment` → `paid` after Razorpay webhook verification.
- [ ] **E2E path** – register → create album → cart → checkout → Razorpay test payment → order appears as **Paid** with files in Storage and a downloadable PDF invoice. (Requires real Firebase project and Razorpay test keys.)
- [ ] **Unit tests** – add Vitest tests for: cart totals, coupon stub, OrderContext flow, OrderContext throws.

## 🛠️ Environment Variables (must be set)

| Variable | Required? | Where it's used |
|----------|-----------|-----------------|
| `VITE_FIREBASE_API_KEY` | ✅ | `src/firebase.js` |
| `VITE_FIREBASE_AUTH_DOMAIN` | ✅ | `src/firebase.js` |
| `VITE_FIREBASE_PROJECT_ID` | ✅ | `src/firebase.js` |
| `VITE_FIREBASE_STORAGE_BUCKET` | ✅ | `src/firebase.js` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | ✅ | `src/firebase.js` |
| `VITE_FIREBASE_APP_ID` | ✅ | `src/firebase.js` |
| `VITE_FIREBASE_MEASUREMENT_ID` | ✅ | `src/firebase.js` |
| `VITE_API_BASE` | ✅ | `src/pages/Checkout.jsx`, `src/services/orderService.js` |
| `RAZORPAY_KEY_ID` | ✅ | `src/server/.env` (Node server) |
| `RAZORPAY_KEY_SECRET` | ✅ | `src/server/.env` (Node server) |
| `SESSION_SECRET` (optional) | ✅ (if using sessions) | `src/server/.env` |
| `NODE_ENV` | ✅ | `src/server/index.js` (should be `development` / `test`) |
| `PORT` (optional) | ✅ default 5000 | `src/server/index.js` |
| `CLIENT_ORIGIN` (optional) | ✅ default `http://localhost:5173` | `src/server/index.js` |

## 📦 Server `.env.example` (copy to `src/server/.env`)

```text
RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXXXXXXXX
RAZORPAY_KEY_SECRET=XXXXXXXXXXXXXXXXXXXXXXXX
SESSION_SECRET=super-secret-string
PORT=5000
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5173
```

## ⚠️ What you need to do next (to reach full happy‑path)

1. **Create the files** listed under "Done" above (they already exist).  
2. **Add the Firebase `.env`** values (the config in `src/firebase.js` uses hardcoded placeholders; swap for the values from your Firebase console, or keep the placeholder if you just want the code to compile).  
3. **Run `npm install`** (then `npm run dev`).  
4. **Start the server**: `cd src/server && node index.js` (or `npm run dev` if you add an npm script).  
5. **Open the app**: register → create album → cart → checkout → Razorpay test payment → order appears as **Paid** with files in Storage and a downloadable PDF invoice.  
6. **Run tests**: `npm test` – should finish without failures.  
7. **Check security rules** in the Firebase console – they must block read/write for unauthenticated users and restrict each user to their own paths only.

## 🚨 Known Limitations / Assumptions
- **No real payment processor yet** – the "place order" flow only stores a draft in the cart and shows a placeholder "payment pending" status. The Razorpay mock will need real key IDs in the server `.env` before live testing.
- **Invoice PDF generation** is stubbed; a real implementation will use `jsPDF` on the server to build a PDF and return a `downloadUrl`.
- **Order‑status persistence** is only in Firestore; the server will be the single writer to change `status` from `pending_payment` → `paid` after Razorpay webhook verification.
- **Coupon validation** is a stub (`src/features/cart/cartService.js`); replace with server‑side validation before production.

---
End of Part 3 checklist.