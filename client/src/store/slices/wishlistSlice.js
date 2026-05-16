/** SECTION: Wishlist slice — saved products (client-side, synced to localStorage) */

import { createSlice } from '@reduxjs/toolkit';

// ─── Restore wishlist from localStorage ───
const wishlistItems = JSON.parse(localStorage.getItem('wishlistItems')) || [];

// ─── Slice: toggle / remove items and persist ───
const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: { items: wishlistItems },
  reducers: {
    toggleWishlistItem: (state, action) => {
      const idx = state.items.findIndex((i) => i.product === action.payload.product);
      if (idx > -1) state.items.splice(idx, 1);
      else state.items.push(action.payload);
      localStorage.setItem('wishlistItems', JSON.stringify(state.items));
    },
    removeWishlistItem: (state, action) => {
      state.items = state.items.filter((i) => i.product !== action.payload);
      localStorage.setItem('wishlistItems', JSON.stringify(state.items));
    },
    clearWishlist: (state) => {
      state.items = [];
      localStorage.removeItem('wishlistItems');
    },
  },
});

export const { toggleWishlistItem, removeWishlistItem, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
