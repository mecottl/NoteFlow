import { useState, useEffect, useCallback } from 'react';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import NoteEditor from '../NoteEditor/NoteEditor';

export default function NotesDashboard() {
  const userId = localStorage.getItem('userId');
  const [notes, setNotes] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // --- SIDEBAR HANDLERS ---
  const handleToggleSidebar = useCallback(() => setSidebarOpen(prev => !prev), []);
  const handleCloseSidebar = useCallback(() => setSidebarOpen(false), []);

  // CREAR NOTA
  const handleCreateNote = async () => {
    if (!userId) return;
    const res = await fetch('http://localhost:3001/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, title: '', content: '' })
    });
    if (res.ok) {
      const { id } = await res.json();
      const data = await fetch(`http://localhost:3001/notes/user/${userId}`).then(r => r.json());
      setNotes(data || []);
      const idx = data.findIndex(n => n.id === id);
      setSelectedIndex(idx !== -1 ? idx : 0);
      setSidebarOpen(false);
    }
  };

  const handleOpenUserMenu = () => {
    alert('Aquí pondrás el menú de usuario.');
  };

  useEffect(() => {
    if (!userId) return;
    fetch(`http://localhost:3001/notes/user/${userId}`)
      .then(res => res.json())
      .then(data => {
        setNotes(data || []);
        setSelectedIndex(0);
      });
  }, [userId]);

  const handleSelect = idx => setSelectedIndex(idx);

  const handleDelete = async (id) => {
    await fetch(`http://localhost:3001/notes/${id}`, { method: "DELETE" });
    const data = await fetch(`http://localhost:3001/notes/user/${userId}`).then((r) => r.json());
    setNotes(data || []);
    setSelectedIndex(0);
  };

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
      <Header
        sidebarOpen={sidebarOpen}
        onToggleSidebar={handleToggleSidebar}
        onOpenUserMenu={handleOpenUserMenu}
        onCreateNote={handleCreateNote}
      />
      <Sidebar
        notes={notes}
        selectedIndex={selectedIndex}
        onSelect={handleSelect}
        onDelete={handleDelete}
        open={sidebarOpen}
        onClose={handleCloseSidebar}
      />
      <NoteEditor
        userId={userId}
        note={selectedNote}
        onSave={reloadNotes}
      />
    </>
  );
}
