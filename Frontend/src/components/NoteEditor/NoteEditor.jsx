import { useState, useEffect } from 'react';
import Checkbox from './CheckboxIA';
import useSuggestion from './useSuggestion';
import SuggestLoader from './SuggestLoader';
import '../../styles/NoteEditor.css';

export default function NoteEditor({ userId, onSave }) {
  const [iaActiva, setIaActiva] = useState(true);
  const [title, setTitle] = useState('');
  const [noteId, setNoteId] = useState(null);

  const {
    prompt,
    suggestion,
    loading,
    handleChange,
    handleKeyDown,
    setPrompt
  } = useSuggestion(iaActiva);

  const frases = [
    '¿En qué estás pensando hoy?',
    '¿Qué quieres escribir?',
    'Cuéntame algo interesante...',
    '¿Qué notas quieres tomar?',
    'Exprésate con palabras...',
    'Hagamos un poema',
    'Escribe algo que te inspire',
    '¿Qué te gustaría recordar?',
    '¿Qué te gustaría explorar hoy?',
    '¿Qué historia quieres contar?',
  ];
  const [frase, setFrase] = useState(frases[0]);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * frases.length);
    setFrase(frases[randomIndex]);
  }, []);

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
        if (!noteId) {
          const data = await res.json();
          setNoteId(data.id);
          alert('Nota guardada correctamente!');
        } else {
          alert('Nota actualizada.');
        }
        if (onSave) onSave()
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
              value={prompt + ' ' + suggestion + (suggestion ? ' ⇥TAB' : '')}
              readOnly
              tabIndex={-1}
            ></textarea>
            <textarea
              className="editable-layer"
              value={prompt}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder={frase}
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
