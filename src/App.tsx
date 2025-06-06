import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';

import LoginPage from '../src/pages/LoginPage';

import './index.css';
import HomePage from './pages/HomePage';
import ProtectedRoute from './pages/ProtectedRoute';
import WritePage from './pages/WritePage';
import RegisterPage from './pages/RegisterPage';
import SearchPage from './pages/SearchPage';
import { ThemeProvider } from './components/layout/theme-provider';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme='light' storageKey='facedev-theme'>
        <Router>
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route
              path='/write'
              element={
                <ProtectedRoute>
                  <WritePage />
                </ProtectedRoute>
              }
            />
            <Route path='/register' element={<RegisterPage />} />
            <Route path='/search' element={<SearchPage />} />

            {/* <Route path='/profile' element={<ProfilePage />} /> */}
          </Routes>
        </Router>
        <Toaster position='top-right' />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
