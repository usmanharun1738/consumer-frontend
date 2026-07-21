/**
 * Product – an item available for purchase.
 * Matches the backend `Product` model.
 */
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  created_at: string; // ISO date string
}

/**
 * CartItem – an item in the user's cart, enriched with product details.
 * Returned by the GET /cart endpoint.
 */
export interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  name: string;       // product name
  price: number;      // product price
  subtotal: number;   // price * quantity
  stock: number;      // current stock available
}

/**
 * WishlistItem – a saved product in the user's wishlist.
 * Returned by GET /wishlist.
 */
export interface WishlistItem {
  id: number;
  product_id: number;
  name: string;
  price: number;
  stock_quantity: number;
  created_at: string;
}

/**
 * User – represents an authenticated user.
 * Returned during signup and used in the auth context.
 */
export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

/**
 * AuthState – the shape of the authentication context.
 */
export interface AuthState {
  user: User | null;       // current user, or null if not authenticated
  token: string | null;   // JWT token, stored in localStorage
  isLoading: boolean;     // true while checking initial auth status
}