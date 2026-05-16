/** SECTION: Application entry point — mounts React into #root and wraps the app with global providers */

// ─── Dependencies & app shell ───
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { store } from './store/store';
import SmoothScroll from './providers/SmoothScroll';
import CustomCursor from './components/layout/CustomCursor';
import { PageSkeleton } from './components/ui/Skeleton';
import './index.css';

// ─── Global UI defaults ───
document.documentElement.classList.add('dark');

// ─── Render tree (outer → inner: Redux → Router → scroll → app) ───
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <SmoothScroll>
          <CustomCursor />
          <Suspense fallback={<PageSkeleton />}>
            <App />
          </Suspense>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: { background: '#12121A', color: '#F8F8FF', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' },
              success: { iconTheme: { primary: '#C9A84C', secondary: '#12121A' } },
            }}
          />
        </SmoothScroll>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
