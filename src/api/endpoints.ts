import { apiClient } from './client';

// Auth
export const auth = {
  signup: (data: { name: string; email: string; password: string }) =>
    apiClient.post('/signup', data),
  login: (data: { email: string; password: string }) =>
    apiClient.post('/login', data),
};

// Products
export const products = {
  list: (query?: string) =>
    apiClient.get('/products/search', { params: { q: query || '' } }),
  get: (id: number) => apiClient.get(`/products/${id}`),
};

// Cart
export const cart = {
  add: (data: { product_id: number; quantity: number }) =>
    apiClient.post('/cart', data),
  list: () => apiClient.get('/cart'),
  remove: (productId: number) =>
    apiClient.delete(`/cart/${productId}`),
};

// Wishlist
export const wishlist = {
  add: (productId: number) =>
    apiClient.post(`/wishlist/${productId}`),
  remove: (productId: number) =>
    apiClient.delete(`/wishlist/${productId}`),
  list: () => apiClient.get('/wishlist'),
};

// Addresses
export const addresses = {
  upsert: (data: any) => apiClient.put('/addresses', data),
  delete: (id: number) => apiClient.delete(`/addresses/${id}`),
};

// Checkout
export const checkout = {
  create: (addressId: number) =>
    apiClient.post('/checkout', { address_id: addressId }),
};