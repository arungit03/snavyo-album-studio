import { useState, useEffect } from 'react';
import { useOrder } from '@/features/order-flow/OrderContext';
import { useCart } from '@/features/cart/CartContext';
import { Button } from '@/components/common/Button';
import SectionHeading from '@/components/SectionHeading';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/AuthContext';

export default function Checkout() {
  const { draft, placeOrder, placing, error, totals } = useOrder();
  const { user } = useAuth();
  const { items, removeItem, updateItemQty } = useCart();
  const navigate = useNavigate();

  if (!draft) {
    return null; // or <Navigate to="/create" replace />;
  }

  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [paymentError, setPaymentError] = useState('');
  const [paymentInProgress, setPaymentInProgress] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setPaymentError('Please sign in first.');
      return;
    }
    setPaymentInProgress(true);
    setPaymentError('');
    try {
      const result = await placeOrder();
      if (result?.ok) {
        // After placing, clear cart and redirect to thank you / order detail
        removeItem(result.snapshot.draftId);
        setTimeout(() => navigate('/orders'), 100);
      } else {
        setPaymentError(result?.error || 'Could not place order.');
      }
    } catch (err) {
      setPaymentError(err?.message || 'Could not place order. Try again.');
    } finally {
      setPaymentInProgress(false);
    }
  };

  return (
    <section className="max-w-2xl mx-auto py-12">
      <SectionHeading eyebrow="Checkout" title="Review & Pay" className="mb-6" />
      {error && (
        <p className="text-red-600 mb-4">{error}</p>
      )}
      {paymentError && (
        <p className="text-red-600 mb-4">{paymentError}</p>
      )}
      {placing && (
        <p className="text-center text-sm text-snavyo-text-secondary mt-4">Placing order…</p>
      )}
      {!placing && !paymentInProgress && (
        <>
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="font-medium mb-4">Order Summary</h3>
            <dl className="space-y-2 text-sm">
              <div>
                <dt>Product</dt>
                <dd>{draft.productType === 'wedding-album' ? 'Wedding Album' : 'Photo Book'}</dd>
              </div>
              <div>
                <dt>Sheets/Pages</dt>
                <dd>{draft.sheetsOrPages} sheets / {draft.pages?.length} pages</dd>
              </div>
              <div>
                <dt>Paper</dt>
                <dd>{draft.paper}</dd>
              </div>
              <div>
                <dt>Lamination</dt>
                <dd>{draft.lamination}</dd>
              </div>
              <div>
                <dt>Cover</dt>
                <dd>{draft.cover}</dd>
              </div>
              <div>
                <dt>Orientation</dt>
                <dd>{draft.orientation}</dd>
              </div>
              <div>
                <dt>Photos</dt>
                <dd>{(draft.photos || []).length}</dd>
              </div>
              <div>
                <dt>Subtotal</dt>
                <dd>${totals.subtotal.toFixed(2)}</dd>
              </div>
              {totals.shipping > 0 && (
                <div>
                  <dt>Shipping</dt>
                  <dd>${totals.shipping.toFixed(2)}</dd>
                </div>
              )}
              <div>
                <dt>Tax (8%)</dt>
                <dd>${totals.tax.toFixed(2)}</dd>
              </div>
              <div className="font-bold border-t pt-4">
                <dt>Total</dt>
                <dd>${totals.total.toFixed(2)}</dd>
              </div>
            </dl>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Shipping Address</h4>
              <input
                placeholder="Full name"
                value={address.fullName}
                onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                className="w-full p-2 rounded-lg border border-snavyo-lavender"
              />
              <input
                placeholder="Phone (with country code, e.g. +91)"
                type="tel"
                value={address.phone}
                onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                className="w-full p-2 rounded-lg border border-snavyo-lavender"
              />
              <input
                placeholder="Address line 1"
                value={address.addressLine1}
                onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
                className="w-full p-2 rounded-lg border border-snavyo-lavander"
              />
              <input
                placeholder="Address line 2 (optional)"
                value={address.addressLine2}
                onChange={(e) => setAddress({ ...address, addressLine2: e.target.value })}
                className="w-full p-2 rounded-lg border border-snavyo-lavender"
              />
              <input
                placeholder="City"
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                className="w-full p-2 rounded-lg border border-snavyo-lavender"
              />
              <select
                value={address.state}
                onChange={(e) => setAddress({ ...address, state: e.target.value })}
                className="w-full p-2 rounded-lg border border-snavyo-lavender"
              >
                <option value="">Select state</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Delhi">Delhi</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
              </select>
              <input
                placeholder="PIN / ZIP"
                type="text"
                value={address.pincode}
                onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                className="w-full p-2 rounded-lg border border-snavyo-lavender"
              />
            </div>

            <button
              type="submit"
              disabled={placing || paymentInProgress}
              className="w-full py-3 bg-snavyo-purple text-white rounded-lg hover:bg-snavyo-purple-dark transition-colors disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-snavyo-gold focus:ring-offset-2"
            >
              {placing ? 'Placing Order…' : paymentInProgress ? 'Processing Payment…' : 'Place Order'}
            </button>
          </form>
        </>
      )}
    </section>
  );
}
