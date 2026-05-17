import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { CategoryPage } from './pages/CategoryPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { MyOrders } from './pages/MyOrders';
import { ProfilePage } from './pages/ProfilePage';
import { WishlistPage } from './pages/WishlistPage';
import { AuthPage } from './pages/AuthPage';
import { AdminLayout } from './components/AdminLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminUsers } from './pages/AdminUsers';
import { AdminOrders } from './pages/AdminOrders';
import { AdminProducts } from './pages/AdminProducts';
import { AdminSettings } from './pages/AdminSettings';

export const router = createBrowserRouter([
  {
    path: '/login',
    Component: AuthPage,
  },
  {
    path: '/register',
    Component: AuthPage,
  },
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: HomePage },
      { path: 'category/:category', Component: CategoryPage },
      { path: 'product/:id', Component: ProductDetailPage },
      { path: 'cart', Component: CartPage },
      { path: 'checkout', Component: CheckoutPage },
      { path: 'wishlist', Component: WishlistPage },
      { path: 'my-orders', Component: MyOrders },
      { path: 'profile', Component: ProfilePage },
    ],
  },
  {
    path: '/admin',
    element: <ProtectedRoute allowedRoles={['admin', 'super_admin']} />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, Component: AdminDashboard },
          { 
            path: 'users',
            element: <ProtectedRoute allowedRoles={['admin', 'super_admin']} />,
            children: [{ index: true, Component: AdminUsers }] 
          },
          { path: 'products', Component: AdminProducts },
          { path: 'orders', Component: AdminOrders },
          { path: 'settings', Component: AdminSettings },
        ],
      }
    ],
  },
]);

