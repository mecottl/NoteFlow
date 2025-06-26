import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import NoteEditor from './components/NoteEditor/NoteEditor';
import TitleDinamic from './components/NoteEditor/TitleDinamic';
import Sidebar from './components/sidebar/SideBar';
import AuthForm from './components/AuthForm/AuthForm';
import { useEffect, useState } from 'react';

// --- NOTA: Hook de autenticación reactivo ---
function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('token') && !!localStorage.getItem('userId');
  });
  useEffect(() => {
    // Permite refrescar el auth cuando cambia localStorage
    const handler = () => {
      setIsAuthenticated(
        !!localStorage.getItem('token') && !!localStorage.getItem('userId')
      );
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);
  return isAuthenticated;
}

// --- NOTA: Componente protegido para rutas privadas ---
function ProtectedRoute({ children }) {
  const isAuthenticated = useAuth();
  const location = useLocation();
  if (!isAuthenticated) {
    // Guarda la ruta actual para redirect después del login (opcional)
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  return children;
}

// --- NOTA: Página principal de notas, recibe userId globalmente ---
function NotesPage() {
  const userId = localStorage.getItem('userId');
  return (
    <>
      <TitleDinamic userId={userId} />
      <Sidebar userId={userId} />
      <NoteEditor userId={userId} />
    </>
  );
}

function App() {
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
              <NotesPage />
            </ProtectedRoute>
          }
        />
        {/* Cualquier ruta no definida redirige a "/" */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

// --- CAMBIOS Y NOTAS ---
// 1. Se usa 'userId' siempre (no 'user_id') para total consistencia.
// 2. Nuevo hook 'useAuth' para que la autenticación sea reactiva (se actualiza si cambian los datos en localStorage).
// 3. Nuevo componente 'ProtectedRoute' para proteger cualquier ruta privada fácil y extensible.
// 4. Todo más organizado y fácil de leer.
// 5. 'replace' en Navigate para no llenar el historial de redirecciones.
// 6. Ahora puedes expandir fácilmente el número de rutas privadas si creces la app.
