import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css'
// -----------------------------------------------------------------------------
// 1. Configure TanStack Query client with caching defaults
// -----------------------------------------------------------------------------
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes – data is considered fresh
      gcTime: 10 * 60 * 1000,   // 10 minutes – cache stays in memory
      retry: 2,
      refetchOnWindowFocus: false, // avoids refetching when user switches tabs
    },
  },
});

// -----------------------------------------------------------------------------
// 2. ProtectedRoute component – redirects to login if not authenticated
// -----------------------------------------------------------------------------
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token, isLoading } = useAuth();
  if (isLoading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// -----------------------------------------------------------------------------
// 3. Main App component with all providers and routes
// -----------------------------------------------------------------------------
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes – accessible without login */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes – require authentication */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Home />} />
              <Route path="products/:id" element={<ProductDetails />} />
              <Route path="cart" element={<Cart />} />
              <Route path="wishlist" element={<Wishlist />} />
            </Route>

            {/* Catch-all – redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}

export default App;