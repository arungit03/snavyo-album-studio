import { useEffect, useState } from 'react';
import { useAuth } from '@/features/auth/AuthContext';
import { getOrders } from '@/services/orderService';
import SectionHeading from '@/components/SectionHeading';

export default function Orders() {
  const { user, loading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && user?.uid) {
      setLoadingOrders(true);
      getOrders(user.uid)
        .then((data) => setOrders(data))
        .catch((err) => setError(err.message || err))
        .finally(() => setLoadingOrders(false));
    }
  }, [user, loading]);

  if (loading) {
    return null; // or <Navigate to="/login" replace />;
  }

  return (
    <section className="max-w-3xl mx-auto py-12">
      <SectionHeading eyebrow="Orders" title="Your Album Orders" className="mb-6" />
      {error && (
        <p className="text-red-600 mb-4">Error loading orders: {error}</p>
      )}
      {loadingOrders && <p className="text-center py-8">Loading orders…</p>}
      {!loadingOrders && orders.length === 0 && (
        <p className="text-center py-8 text-snavyo-text-secondary">You haven’t placed any orders yet.</p>
      )}
      {!loadingOrders && orders.length > 0 && (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li key={order.id} className="border rounded-lg bg-white shadow p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">
                    Order #{order.id.slice(-6)} – {order.status || 'pending_payment'}
                  </h3>
                  <p className="text-sm text-snavyo-text-secondary">
                    Placed: {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${order.total || '0.00'}</p>
                  <button
                    onClick={() => window.open(order.invoiceUrl || '#', '_blank')}
                    className="text-sm text-snavyo-purple underline hover:text-snavyo-purple-dark"
                  >
                    Download Invoice
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
