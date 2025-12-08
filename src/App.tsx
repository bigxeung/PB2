import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/ProtectedRoute';
import { isAuthenticated } from './utils/auth';

// Pages
import SignIn from './pages/SignIn';
import Home from './pages/Home';
import Popular from './pages/Popular';
import Search from './pages/Search';
import Wishlist from './pages/Wishlist';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <TransitionGroup>
      <CSSTransition
        key={location.pathname}
        timeout={300}
        classNames="page"
        unmountOnExit
      >
        <div className="page">
          <Routes location={location}>
            {/* 공개 라우트 - 로그인 페이지 */}
            <Route
              path="/signin"
              element={
                isAuthenticated() ? (
                  <Navigate to="/" replace />
                ) : (
                  <SignIn />
                )
              }
            />

            {/* 보호된 라우트들 */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />

            <Route
              path="/popular"
              element={
                <ProtectedRoute>
                  <Popular />
                </ProtectedRoute>
              }
            />

            <Route
              path="/search"
              element={
                <ProtectedRoute>
                  <Search />
                </ProtectedRoute>
              }
            />

            <Route
              path="/wishlist"
              element={
                <ProtectedRoute>
                  <Wishlist />
                </ProtectedRoute>
              }
            />

            {/* 404 처리 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </CSSTransition>
    </TransitionGroup>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;
