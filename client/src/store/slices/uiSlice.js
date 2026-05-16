/** SECTION: UI slice — theme, drawers, search overlay, and cart panel state */

import { createSlice } from '@reduxjs/toolkit';

// ─── Default theme (app also reads/writes document class + localStorage) ───
const getInitialTheme = () => 'dark';

// ─── Slice: global chrome toggles (not tied to server data) ───
const uiSlice = createSlice({
  name: 'ui',
  initialState: { theme: getInitialTheme(), sidebarOpen: false, searchOpen: false, cartOpen: false, cartBounce: false },
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', state.theme);
      if (state.theme === 'dark') document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem('theme', state.theme);
      if (state.theme === 'dark') document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    },
    toggleSidebar: (state) => { state.sidebarOpen = !state.sidebarOpen; },
    closeSidebar: (state) => { state.sidebarOpen = false; },
    toggleSearch: (state) => { state.searchOpen = !state.searchOpen; },
    closeSearch: (state) => { state.searchOpen = false; },
    openCart: (state) => { state.cartOpen = true; },
    closeCart: (state) => { state.cartOpen = false; },
    toggleCart: (state) => { state.cartOpen = !state.cartOpen; },
    triggerCartBounce: (state) => { state.cartBounce = true; },
    resetCartBounce: (state) => { state.cartBounce = false; },
  },
});

export const { toggleTheme, setTheme, toggleSidebar, closeSidebar, toggleSearch, closeSearch, openCart, closeCart, toggleCart, triggerCartBounce, resetCartBounce } = uiSlice.actions;
export default uiSlice.reducer;
