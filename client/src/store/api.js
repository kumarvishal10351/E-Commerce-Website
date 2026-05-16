/** SECTION: HTTP client — axios instance, auth interceptors, and backend API helpers */

import axios from 'axios';

// ─── Axios instance (base URL from env, sends cookies) ───
const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api', withCredentials: true });

// ─── Request interceptor — attach JWT from localStorage ───
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── Response interceptor — clear session & redirect on 401 ───
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Auth API ───
export const registerAPI = (data) => API.post('/auth/register', data);
export const loginAPI = (data) => API.post('/auth/login', data);
export const logoutAPI = () => API.post('/auth/logout');
export const getMeAPI = () => API.get('/auth/me');
export const updateProfileAPI = (data) => API.put('/auth/profile', data);
export const updatePasswordAPI = (data) => API.put('/auth/password', data);
export const forgotPasswordAPI = (data) => API.post('/auth/forgot-password', data);
export const resetPasswordAPI = (token, data) => API.put(`/auth/reset-password/${token}`, data);
export const updateAddressAPI = (data) => API.put('/auth/address', data);
export const deleteAddressAPI = (id) => API.delete(`/auth/address/${id}`);
export const toggleWishlistAPI = (id) => API.put(`/auth/wishlist/${id}`);
export const getWishlistAPI = () => API.get('/auth/wishlist');

// ─── Products API ───
export const getProductsAPI = (params) => API.get('/products', { params });
export const getProductAPI = (id) => API.get(`/products/${id}`);
export const getTopProductsAPI = (limit) => API.get('/products/top', { params: { limit } });
export const getFeaturedProductsAPI = (limit) => API.get('/products/featured', { params: { limit } });
export const getProductsByCategoryAPI = (slug, params) => API.get(`/products/category/${slug}`, { params });
export const getRelatedProductsAPI = (id) => API.get(`/products/${id}/related`);
export const getBrandsAPI = () => API.get('/products/brands');
export const createProductAPI = (data) => API.post('/products', data);
export const updateProductAPI = (id, data) => API.put(`/products/${id}`, data);
export const deleteProductAPI = (id) => API.delete(`/products/${id}`);

// ─── Orders API ───
export const createOrderAPI = (data) => API.post('/orders', data);
export const getMyOrdersAPI = () => API.get('/orders/myorders');
export const getOrderAPI = (id) => API.get(`/orders/${id}`);
export const getAllOrdersAPI = (params) => API.get('/orders', { params });
export const updateOrderStatusAPI = (id, data) => API.put(`/orders/${id}/status`, data);
export const getDashboardStatsAPI = () => API.get('/orders/admin/stats');

// ─── Reviews API ───
export const createReviewAPI = (productId, data) => API.post(`/reviews/${productId}`, data);
export const updateReviewAPI = (id, data) => API.put(`/reviews/${id}`, data);
export const deleteReviewAPI = (id) => API.delete(`/reviews/${id}`);
export const getProductReviewsAPI = (productId) => API.get(`/reviews/product/${productId}`);

// ─── Categories API ───
export const getCategoriesAPI = () => API.get('/categories');
export const getAllCategoriesAPI = () => API.get('/categories/all');
export const createCategoryAPI = (data) => API.post('/categories', data);
export const updateCategoryAPI = (id, data) => API.put(`/categories/manage/${id}`, data);
export const deleteCategoryAPI = (id) => API.delete(`/categories/manage/${id}`);

// ─── Coupons API ───
export const applyCouponAPI = (data) => API.post('/coupons/apply', data);
export const getCouponsAPI = () => API.get('/coupons');
export const createCouponAPI = (data) => API.post('/coupons', data);
export const deleteCouponAPI = (id) => API.delete(`/coupons/${id}`);

// ─── Users API (admin) ───
export const getAllUsersAPI = (params) => API.get('/users', { params });
export const updateUserRoleAPI = (id, data) => API.put(`/users/${id}/role`, data);
export const toggleBlockUserAPI = (id) => API.put(`/users/${id}/block`);
export const deleteUserAPI = (id) => API.delete(`/users/${id}`);

// ─── Upload API ───
export const uploadImageAPI = (data) => API.post('/upload/image', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const uploadImagesAPI = (data) => API.post('/upload/images', data, { headers: { 'Content-Type': 'multipart/form-data' } });

// ─── Payment API ───
export const createPaymentIntentAPI = (data) => API.post('/payment/create-intent', data);

export default API;
