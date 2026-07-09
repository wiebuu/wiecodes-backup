import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import '@fontsource/bebas-neue';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext'; // ✅ import CartProvider

const rootElement = document.getElementById('root') as HTMLElement;

createRoot(rootElement).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider> {/* ✅ wrap App with CartProvider */}
        <App />
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);
