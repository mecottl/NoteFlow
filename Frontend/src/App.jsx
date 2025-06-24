import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import NoteEditor from './components/NoteEditor/NoteEditor';
import TitleDinamic from './components/NoteEditor/TitleDinamic';
import Sidebar from './components/sidebar/SideBar';
import AuthForm from './components/AuthForm/AuthForm';

function ProtectedNotes() {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('user_id'); // o 'userId' si así lo guardas

  const isAuthenticated = !!token && !!userId;

  if (!isAuthenticated) return <Navigate to="/auth" />;

  return (
    <>
      <TitleDinamic userId={userId} />
      <Sidebar userId={userId} />
      <NoteEditor userId={userId} />
    </>
  );
}

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <BrowserRouter>
      <Routes>
        {/* Redirige a /auth si no está autenticado, a /notes si sí */}
        <Route
          path="/"
          element={<Navigate to={isAuthenticated ? '/notes' : '/auth'} />}
        />
        <Route path="/auth" element={<AuthForm />} />
        <Route path="/notes" element={<ProtectedNotes />} />
        {/* Cualquier ruta no definida redirige a "/" */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
