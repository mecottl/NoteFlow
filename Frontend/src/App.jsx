import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import TitleDinamic from './components/NoteEditor/TitleDinamic';
import Sidebar from './components/sidebar/SideBar';
import NoteEditor from './components/NoteEditor/NoteEditor';
import AuthForm from './components/AuthForm/AuthForm';

function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('token') && !!localStorage.getItem('userId');
  });
  useEffect(() => {
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

function ProtectedRoute({ children }) {
  const isAuthenticated = useAuth();
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  return children;
}

function NotesDashboard() {
  const userId = localStorage.getItem('userId');
  const [notes, setNotes] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Cargar notas al iniciar y cuando cambie el userId
  useEffect(() => {
    if (!userId) return;
    fetch(`http://localhost:3001/notes/user/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setNotes(data || []);
        setSelectedIndex(0);
      });
  }, [userId]);

  // Selección de nota
  const handleSelect = (idx) => setSelectedIndex(idx);

  // Eliminar nota
  const handleDelete = async (id) => {
    await fetch(`http://localhost:3001/notes/${id}`, { method: "DELETE" });
    const data = await fetch(`http://localhost:3001/notes/user/${userId}`).then((r) => r.json());
    setNotes(data || []);
    setSelectedIndex(0);
  };

  // Cuando se crea o actualiza una nota
  // ------> MODIFICADO: acepta noteId, selecciona la nota correcta
  const reloadNotes = async (noteIdToStay) => {
    const data = await fetch(`http://localhost:3001/notes/user/${userId}`).then((r) => r.json());
    setNotes(data || []);
    if (noteIdToStay) {
      const idx = data.findIndex(n => n.id === noteIdToStay);
      setSelectedIndex(idx !== -1 ? idx : 0);
    } else {
      setSelectedIndex(0);
    }
  };

  const selectedNote = notes[selectedIndex] || { title: "", content: "" };

  return (
    <>
      <TitleDinamic userId={userId} />
      <Sidebar
        notes={notes}
        selectedIndex={selectedIndex}
        onSelect={handleSelect}
        onDelete={handleDelete}
      />
      <NoteEditor
        userId={userId}
        note={selectedNote}
        onSave={reloadNotes} // <- ya acepta el noteId
      />
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
              <NotesDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
