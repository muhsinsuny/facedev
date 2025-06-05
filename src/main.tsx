import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import 'tailwindcss';
import Home from './App.tsx';
import {AuthProvider} from './context/AuthContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
    <Home />
    </AuthProvider>
  </StrictMode>
);
