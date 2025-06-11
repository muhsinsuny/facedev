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
import DetailPost from './pages/DetailPost';
import ProfileUpdate from './pages/ProfileUpdate';
import ProfileEdit from './pages/EditProfile';
import UpdatePost from './pages/partials/UpdatePost';

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
            <Route
              path='/update-post/:id'
              element={
                <ProtectedRoute>
                  <UpdatePost />
                </ProtectedRoute>
              }
            />
            <Route path='/register' element={<RegisterPage />} />
            <Route path='/search' element={<SearchPage />} />
            <Route path='/detail/:id' element={<DetailPost />} />

            <Route path='/profile' element={<ProfileUpdate />} />
            {/* <Route path='/profileedit' element={<ProfileEdit />} /> */}
            <Route
              path='/profileedit'
              element={
                <ProfileEdit
                  open={true}
                  onOpenChange={() => console.log('Open change')}
                />
              }
            />
          </Routes>
        </Router>
        <Toaster position='top-right' />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
