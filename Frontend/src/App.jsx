import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import useAuth from './components/hooks/useAuth';
import NotesDashboard from './components/pages/NotesDashboard';
import AuthForm from './components/AuthForm/AuthForm';

function ProtectedRoute({ children }) {
  const isAuthenticated = useAuth();
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  return children;
}

export default function App() {
  const isAuthenticated = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to={isAuthenticated ? '/notes' : '/auth'} replace />}
        />
        <Route path="/auth" element={<AuthForm />} />
        <Route
          path="/notes"
          element={
            <ProtectedRoute>
              <NotesDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
