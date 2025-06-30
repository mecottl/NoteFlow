import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Checkbox from './CheckboxIA';
import useSuggestion from './useSuggestion';
import SuggestLoader from './SuggestLoader';
import '../../styles/NoteEditor.css';

export default function NoteEditor({ userId, note, onSave }) {
  const [iaActiva, setIaActiva] = useState(true);
  const [title, setTitle] = useState('');
  const [noteId, setNoteId] = useState(null);
  const navigate = useNavigate();

  // Hook IA maneja el prompt y lo expone con setPrompt
  const {
    prompt,
    suggestion,
    loading,
    handleChange,
    handleKeyDown,
    setPrompt,
  } = useSuggestion(iaActiva);

  // Cuando cambia la nota seleccionada, sincroniza los campos
  useEffect(() => {
    setTitle(note?.title || '');
    setPrompt(note?.content || '');
    setNoteId(note?.id || null);
  }, [note, setPrompt]);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/auth');
  };

  // Botón para limpiar campos y crear nota nueva
  const handleNuevaNota = () => {
    setTitle('');
    setPrompt('');
    setNoteId(null);
  };

  // Guardar o actualizar nota, manteniendo el focus sobre la nota editada
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !prompt.trim()) {
      alert('Por favor, ingresa un título y contenido para la nota.');
      return;
    }

    const method = noteId ? 'PUT' : 'POST';
    const endpoint = noteId
      ? `http://localhost:3001/notes/${noteId}`
      : 'http://localhost:3001/notes';

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          title,
          content: prompt,
        }),
      });

      if (res.ok) {
        let idToStay = noteId;
        if (!noteId) {
          const data = await res.json();
          setNoteId(data.id);
          idToStay = data.id;
          alert('Nota guardada correctamente!');
        } else {
          alert('Nota actualizada.');
        }
        if (onSave) onSave(idToStay); // <-- QUEDA SOBRE LA NOTA EDITADA O NUEVA
      } else {
        alert('Error al guardar o actualizar la nota.');
      }
    } catch (error) {
      console.error('Error al guardar nota:', error);
      alert('Error al guardar o actualizar la nota.');
    }
  };

  return (
    <div className="center-page">
      {/* Botones de sesión y nueva nota */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginBottom: 10 }}>
        <button className="logout-btn" onClick={handleLogout}>
          Cerrar sesión
        </button>
      
      </div>

      <input
        className="title-input"
        type="text"
        placeholder="Título de la nota"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <div className="note-container">
        <Checkbox iaActiva={iaActiva} setIaActiva={setIaActiva} />

        <form className="form" onSubmit={handleSubmit}>
          <div className="textarea-wrapper">
            <textarea
              className="suggestion-layer"
              value={prompt + (suggestion ? ' ' + suggestion + ' ⇥TAB' : '')}
              readOnly
              tabIndex={-1}
            ></textarea>
            <textarea
              className="editable-layer"
              value={prompt}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder={'Escribe tu nota aquí...'}
              rows={6}
            ></textarea>
          </div>

          <button className="form-submit-btn" type="submit">
            {noteId ? 'Actualizar NFlow' : 'Guardar NFlow'}
          </button>
        </form>

        {loading && <SuggestLoader />}
      </div>
    </div>
  );
}
