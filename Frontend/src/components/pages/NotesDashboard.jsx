import { useState, useEffect, useCallback } from "react";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import NoteEditor from "../NoteEditor/NoteEditor";
import CustomAlert from "../NoteEditor/CustomAlert";
import API_ENDPOINTS from "../../config/api.js";

export default function NotesDashboard() {
  const userId = localStorage.getItem('userId');
  const [notes, setNotes] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ALERTAS CENTRALIZADAS
  const [alertas, setAlertas] = useState([]);
  const lanzarAlerta = (tipo, mensaje) => setAlertas((prev) => [...prev, { tipo, mensaje }]);
  const closeAlerta = (idx) => setAlertas((prev) => prev.filter((_, i) => i !== idx));

  // Handlers Sidebar/Header
  const handleToggleSidebar = useCallback(() => setSidebarOpen((prev) => !prev), []);
  const handleCloseSidebar = useCallback(() => setSidebarOpen(false), []);

  // CREAR NOTA
  const handleCreateNote = async () => {
    if (!userId) return;
    const res = await fetch(API_ENDPOINTS.NOTES.CREATE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, title: '', content: '' })
    });
    if (res.ok) {
      const { id } = await res.json();
      const data = await fetch(API_ENDPOINTS.NOTES.GET_ALL(userId)).then(r => r.json());
      setNotes(data || []);
      const idx = data.findIndex(n => n.id === id);
      setSelectedIndex(idx !== -1 ? idx : 0);
      setSidebarOpen(false);
      lanzarAlerta("guardado", "¡Nota guardada correctamente!");
    }
  };

  // Menú usuario (pendiente, solo demo)
  const handleOpenUserMenu = () => lanzarAlerta("info", "¡Aquí pondrás tu menú de usuario!");

  // CARGAR NOTAS
  useEffect(() => {
    if (!userId) return;
    fetch(API_ENDPOINTS.NOTES.GET_ALL(userId))
      .then((res) => res.json())
      .then((data) => {
        setNotes(data || []);
        setSelectedIndex(0);
      });
  }, [userId]);

  // Selección de nota
  const handleSelect = (idx) => setSelectedIndex(idx);

  // ELIMINAR NOTA y alerta
  const handleDelete = async (id) => {
    await fetch(API_ENDPOINTS.NOTES.DELETE(id), { method: "DELETE" });
    const data = await fetch(API_ENDPOINTS.NOTES.GET_ALL(userId)).then((r) => r.json());
    setNotes(data || []);
    setSelectedIndex(0);
    lanzarAlerta("eliminado", "Nota eliminada.");
  };

  // Guardar/actualizar (recibe noteId para mantener selección)
  const reloadNotes = async (noteIdToStay, tipoAlerta = null) => {
    const data = await fetch(API_ENDPOINTS.NOTES.GET_ALL(userId)).then((r) => r.json());
    setNotes(data || []);
    if (noteIdToStay) {
      const idx = data.findIndex(n => n.id === noteIdToStay);
      setSelectedIndex(idx !== -1 ? idx : 0);
    } else {
      setSelectedIndex(0);
    }
    if (tipoAlerta === "guardado") lanzarAlerta("guardado", "¡Nota guardada correctamente!");
    if (tipoAlerta === "actualizado") lanzarAlerta("actualizado", "Nota actualizada.");
  };

  const selectedNote = notes[selectedIndex] || { title: "", content: "" };

  return (
    <>
      {/* ALERTAS */}
      <div style={{ position: "fixed", top: 25, right: 30, zIndex: 2003 }}>
        {alertas.map((alerta, idx) => (
          <CustomAlert
            key={idx}
            tipo={alerta.tipo}
            mensaje={alerta.mensaje}
            onClose={() => closeAlerta(idx)}
          />
        ))}
      </div>
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
        onSave={(noteId, type) => reloadNotes(noteId, type)}
        lanzarAlerta={lanzarAlerta}
      />
    </>
  );
}
