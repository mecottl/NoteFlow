import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Checkbox from './CheckboxIA';
import useSuggestion from './useSuggestion';
import SuggestLoader from './SuggestLoader';
import API_ENDPOINTS from '../../config/api.js';
import '../../styles/NoteEditor.css';

export default function NoteEditor({ userId, note, onSave, lanzarAlerta }) {
  const [iaActiva, setIaActiva] = useState(true);
  const [title, setTitle] = useState('');
  const [noteId, setNoteId] = useState(null);

  const navigate = useNavigate();

  // Referencias para autosize sincronizado
  const ghostRef = useRef();
  const textareaRef = useRef();

  const {
    prompt,
    suggestion,
    loading,
    handleChange,
    handleKeyDown,
    setPrompt,
  } = useSuggestion(iaActiva);

  // Sincroniza el tamaño de ambas capas
  useEffect(() => {
    if (!ghostRef.current || !textareaRef.current) return;
    ghostRef.current.style.height = 'auto';
    textareaRef.current.style.height = 'auto';
    const maxH = Math.max(
      ghostRef.current.scrollHeight,
      textareaRef.current.scrollHeight,
      400
    );
    ghostRef.current.style.height = maxH + 'px';
    textareaRef.current.style.height = maxH + 'px';
  }, [prompt, suggestion]);

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

  // Guardar o actualizar nota, manteniendo el focus sobre la nota editada
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !prompt.trim()) {
      lanzarAlerta("error", "Por favor, ingresa un título y contenido para la nota.");
      return;
    }
    const method = noteId ? 'PUT' : 'POST';
    const endpoint = noteId
      ? API_ENDPOINTS.NOTES.UPDATE(noteId)
      : API_ENDPOINTS.NOTES.CREATE;

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
          onSave && onSave(idToStay, "guardado");
        } else {
          onSave && onSave(idToStay, "actualizado");
        }
      } else {
        lanzarAlerta("error", "Error al guardar o actualizar la nota.");
      }
    } catch (e) {
      lanzarAlerta("error", "Error al guardar o actualizar la nota.");
    }
  };

  return (
    <div className="center-page">
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
            <div
              className="ghost-input"
              ref={ghostRef}
              aria-hidden="true"
            >
              <span style={{ opacity: 0 }}>{prompt}</span>
              <span className="ghost-suggest">{suggestion}</span>
              {suggestion && " ⇥TAB"}
            </div>
            <textarea
              ref={textareaRef}
              className="editable-layer"
              value={prompt}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Escribe tu nota aquí... La IA te ayudará a completar tus ideas ✨"
              rows={4}
              autoFocus
            />
          </div>

          <div className="form-actions">
            <button className="form-submit-btn" type="submit">
              {noteId ? '💾 Actualizar NFlow' : '💾 Guardar NFlow'}
            </button>
            {loading && <SuggestLoader />}
          </div>
        </form>
      </div>
    </div>
  );
}
