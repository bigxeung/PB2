import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/ProtectedRoute';
import { useAppSelector } from './store/hooks';

// Pages
import SignIn from './pages/SignIn';
import Home from './pages/Home';
import Popular from './pages/Popular';
import Search from './pages/Search';
import Wishlist from './pages/Wishlist';

const basename = import.meta.env.BASE_URL;

function AppRoutes() {
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);

  return (
    <Routes>
      {/* 공개 라우트 - 로그인 페이지 */}
      <Route
        path="/signin"
        element={
          isLoggedIn ? (
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
  );
}

function App() {
  return (
    <BrowserRouter basename={basename}>
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
      <div className="page-wrapper">
        <AppRoutes />
      </div>
    </BrowserRouter>
  );
}

export default App;
