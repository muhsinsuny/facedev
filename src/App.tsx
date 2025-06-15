import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import {
  AnimatePresence,
  motion,
  type TargetAndTransition,
  type VariantLabels,
} from 'framer-motion';

import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ProtectedRoute from './pages/ProtectedRoute';
import WritePage from './pages/WritePage';
import RegisterPage from './pages/RegisterPage';
import SearchPage from './pages/SearchPage';
import DetailPost from './pages/DetailPost';
import ProfileUpdate from './pages/ProfileUpdate';
import ProfileEdit from './pages/EditProfile';
import UpdatePost from './pages/partials/UpdatePost';
import YourPosts from './pages/YourPosts';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './components/layout/theme-provider';
import { Toaster } from 'sonner';
import {
  fadeOut,
  fadeSlide,
  fadeSlideDown,
  fadeSlideUp,
  slideDown,
  slideLeft,
  zoomIn,
  zoomOut,
} from './hooks/animations/pageAnimations';

const queryClient = new QueryClient();

type AnimatedPageProps = {
  children: React.ReactNode;
  animation?: {
    initial?: boolean | TargetAndTransition | VariantLabels | undefined;
    animate?: object;
    exit?: object;
    transition?: object;
  };
};

function AnimatedPage({ children, animation }: AnimatedPageProps) {
  return (
    <motion.div
      initial={animation?.initial ?? { opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode='wait'>
      <Routes location={location} key={location.pathname}>
        <Route
          path='/'
          element={
            <AnimatedPage animation={fadeSlide}>
              <HomePage />
            </AnimatedPage>
          }
        />
        <Route
          path='/login'
          element={
            <AnimatedPage animation={zoomIn}>
              <LoginPage />
            </AnimatedPage>
          }
        />
        <Route
          path='/register'
          element={
            <AnimatedPage animation={slideLeft}>
              <RegisterPage />
            </AnimatedPage>
          }
        />
        <Route
          path='/search'
          element={
            <AnimatedPage animation={fadeOut}>
              <SearchPage />
            </AnimatedPage>
          }
        />
        <Route
          path='/my-posts'
          element={
            <AnimatedPage animation={fadeSlideDown}>
              <YourPosts />
            </AnimatedPage>
          }
        />
        <Route
          path='/detail/:id'
          element={
            <AnimatedPage animation={zoomOut}>
              <DetailPost />
            </AnimatedPage>
          }
        />
        <Route
          path='/profile'
          element={
            <AnimatedPage animation={slideDown}>
              <ProfileUpdate />
            </AnimatedPage>
          }
        />
        <Route
          path='/profileedit'
          element={
            <AnimatedPage animation={fadeSlideUp}>
              <ProfileEdit
                open={true}
                onOpenChange={() => console.log('Open change')}
              />
            </AnimatedPage>
          }
        />
        <Route
          path='/write'
          element={
            <ProtectedRoute>
              <AnimatedPage>
                <WritePage />
              </AnimatedPage>
            </ProtectedRoute>
          }
        />
        <Route
          path='/update-post/:id'
          element={
            <ProtectedRoute>
              <AnimatedPage>
                <UpdatePost />
              </AnimatedPage>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme='light' storageKey='facedev-theme'>
        <Router>
          <AnimatedRoutes />
        </Router>
        <Toaster position='top-right' />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
