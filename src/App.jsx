import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './features/auth/AuthContext';
import { CartProvider } from './features/cart/CartContext';
import { OrderDraftProvider } from './features/order-flow/OrderDraftContext';
import { OrderProvider } from './features/order-flow/OrderContext';
import Header from './components/Header';
import Home from './pages/Home';
import Create from './pages/Create';
import Dashboard from './pages/Dashboard';
import NewProject from './pages/NewProject';
import AlbumSizeGuide from './pages/AlbumSizeGuide';
import AlbumEditor from './pages/AlbumEditor';
import ComingSoon from './pages/ComingSoon';
import Login from './pages/Login';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';

function AppContent() {
  return (
    <div className="min-h-screen flex flex-col bg-snavyo-background text-snavyo-text-main">
      <Header />
      <main className="flex-grow flex flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<Create />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/new-project" element={<NewProject />} />
          <Route path="/album-size-guide" element={<AlbumSizeGuide />} />
          <Route path="/editor/:projectId" element={<AlbumEditor />} />
          <Route path="/import-psd" element={<ComingSoon label="Import PSD" stage="Stage 9: PSD System" />} />
          <Route path="/exported-albums" element={<Navigate to="/dashboard" replace />} />
          {/* Part 3: Auth & Order flows */}
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard/orders" element={<Orders />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <OrderDraftProvider>
            <OrderProvider>
              <AppContent />
            </OrderProvider>
          </OrderDraftProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
