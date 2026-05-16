import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { registerAPI, loginAPI, logoutAPI, getMeAPI, updateProfileAPI } from '../api';

const user = JSON.parse(localStorage.getItem('user'));
const token = localStorage.getItem('token');

export const register = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try { const res = await registerAPI(data); localStorage.setItem('token', res.data.token); localStorage.setItem('user', JSON.stringify(res.data.user)); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Registration failed'); }
});

export const login = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  try { const res = await loginAPI(data); localStorage.setItem('token', res.data.token); localStorage.setItem('user', JSON.stringify(res.data.user)); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Login failed'); }
});

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try { await logoutAPI(); localStorage.removeItem('token'); localStorage.removeItem('user'); }
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Logout failed'); }
});

export const loadUser = createAsyncThunk('auth/loadUser', async (_, { rejectWithValue }) => {
  try { const res = await getMeAPI(); return res.data; }
  catch (err) { localStorage.removeItem('token'); localStorage.removeItem('user'); return rejectWithValue(err.response?.data?.message || 'Session expired'); }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (data, { rejectWithValue }) => {
  try { const res = await updateProfileAPI(data); localStorage.setItem('user', JSON.stringify(res.data.user)); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Update failed'); }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: user || null, token: token || null, isAuthenticated: !!token, loading: false, error: null },
  reducers: { clearError: (state) => { state.error = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(register.fulfilled, (state, action) => { state.loading = false; state.isAuthenticated = true; state.user = action.payload.user; state.token = action.payload.token; })
      .addCase(register.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(login.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(login.fulfilled, (state, action) => { state.loading = false; state.isAuthenticated = true; state.user = action.payload.user; state.token = action.payload.token; })
      .addCase(login.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(logout.fulfilled, (state) => { state.user = null; state.token = null; state.isAuthenticated = false; })
      .addCase(loadUser.fulfilled, (state, action) => { state.user = action.payload.user; state.isAuthenticated = true; state.loading = false; })
      .addCase(loadUser.rejected, (state) => { state.user = null; state.token = null; state.isAuthenticated = false; state.loading = false; })
      .addCase(updateProfile.fulfilled, (state, action) => { state.user = action.payload.user; });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
