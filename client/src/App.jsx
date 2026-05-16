import { useEffect, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AnimatePresence } from 'framer-motion';
import { loadUser } from './store/slices/authSlice';
import { setTheme } from './store/slices/uiSlice';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import MobileNav from './components/layout/MobileNav';
import CartDrawer from './components/layout/CartDrawer';
import PageTransition from './components/layout/PageTransition';
import AdminLayout from './components/layout/AdminLayout';
import { PageSkeleton } from './components/ui/Skeleton';

const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Checkout = lazy(() => import('./pages/Checkout'));
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'));
const MyOrders = lazy(() => import('./pages/MyOrders'));
const OrderDetail = lazy(() => import('./pages/OrderDetail'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Profile = lazy(() => import('./pages/Profile'));
const Search = lazy(() => import('./pages/Search'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const ProductsList = lazy(() => import('./pages/admin/ProductsList'));
const ProductForm = lazy(() => import('./pages/admin/ProductForm'));
const OrdersList = lazy(() => import('./pages/admin/OrdersList'));
const UsersList = lazy(() => import('./pages/admin/UsersList'));
const CouponsList = lazy(() => import('./pages/admin/CouponsList'));
const Categories = lazy(() => import('./pages/admin/Categories'));

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((s) => s.auth);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { theme } = useSelector((s) => s.ui);
  const { token } = useSelector((s) => s.auth);
  const isAdmin = location.pathname.startsWith('/admin');

  useEffect(() => { dispatch(setTheme(theme || 'dark')); }, [dispatch, theme]);
  useEffect(() => { if (token) dispatch(loadUser()); }, [dispatch, token]);

  return (
    <div className="min-h-screen flex flex-col bg-luxury-bg">
      {!isAdmin && <Header />}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <PageTransition>
            <Suspense fallback={<PageSkeleton />}>
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/search" element={<Search />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
                <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                <Route path="/order-success/:id" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
                <Route path="/orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
                <Route path="/orders/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="products" element={<ProductsList />} />
                  <Route path="products/new" element={<ProductForm />} />
                  <Route path="products/edit/:id" element={<ProductForm />} />
                  <Route path="orders" element={<OrdersList />} />
                  <Route path="users" element={<UsersList />} />
                  <Route path="coupons" element={<CouponsList />} />
                  <Route path="categories" element={<Categories />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </PageTransition>
        </AnimatePresence>
      </main>
      {!isAdmin && <Footer />}
      {!isAdmin && <MobileNav />}
      {!isAdmin && <CartDrawer />}
    </div>
  );
}

export default App;
