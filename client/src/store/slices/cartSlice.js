import { createSlice } from '@reduxjs/toolkit';

const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

const calculateTotals = (items) => {
  const itemsPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingPrice = itemsPrice > 999 || itemsPrice === 0 ? 0 : 99;
  const taxPrice = Number((0.18 * itemsPrice).toFixed(0));
  const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));
  return { itemsPrice: Number(itemsPrice.toFixed(2)), shippingPrice, taxPrice, totalPrice, totalItems: items.reduce((acc, item) => acc + item.quantity, 0) };
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: cartItems, ...calculateTotals(cartItems), discount: 0, couponCode: '', shippingAddress: JSON.parse(localStorage.getItem('shippingAddress')) || null },
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existing = state.items.find((i) => i.product === item.product);
      if (existing) { existing.quantity = Math.min(existing.quantity + (item.quantity || 1), item.stock); }
      else { state.items.push({ ...item, quantity: item.quantity || 1 }); }
      Object.assign(state, calculateTotals(state.items));
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((i) => i.product !== action.payload);
      Object.assign(state, calculateTotals(state.items));
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    updateQuantity: (state, action) => {
      const { product, quantity } = action.payload;
      const item = state.items.find((i) => i.product === product);
      if (item) item.quantity = quantity;
      Object.assign(state, calculateTotals(state.items));
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      state.discount = 0;
      state.couponCode = '';
      Object.assign(state, calculateTotals([]));
      localStorage.removeItem('cartItems');
    },
    applyDiscount: (state, action) => {
      state.discount = action.payload.discount;
      state.couponCode = action.payload.couponCode;
      state.totalPrice = Number((state.itemsPrice + state.shippingPrice + state.taxPrice - action.payload.discount).toFixed(2));
    },
    setShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem('shippingAddress', JSON.stringify(action.payload));
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, applyDiscount, setShippingAddress } = cartSlice.actions;
export default cartSlice.reducer;
