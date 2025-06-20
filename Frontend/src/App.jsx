import { useState, useRef } from 'react';

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef(null);

  async function getSuggestion(text) {
    if (!text) {
      setSuggestion('');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text })
      });
      const data = await res.json();
      if (res.ok) {
        // Solo la continuación, sin repetir el texto original
        const continuation = data.prediction.replace(text, '').trim();
        setSuggestion(continuation);
      } else {
        setSuggestion('');
      }
    } catch {
      setSuggestion('');
    }
    setLoading(false);
  }

  // Ejecutar getSuggestion con debounce mientras escribes
  function handleChange(e) {
    const value = e.target.value;
    setPrompt(value);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      getSuggestion(value);
    }, 400);
  }

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', fontFamily: 'Arial, sans-serif', position: 'relative' }}>
      <h1>NoteFlow IA</h1>

      <div style={{ position: 'relative' }}>
        {/* Textarea de sugerencia (solo lectura, texto gris claro) */}
        <textarea
          value={prompt + suggestion}
          readOnly
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '120px',
            padding: '0.5rem',
            fontSize: '1rem',
            color: '#aaa',
            backgroundColor: 'transparent',
            borderColor: 'transparent',
            resize: 'none',
            overflow: 'hidden',
            pointerEvents: 'none',
            whiteSpace: 'pre-wrap',
            fontFamily: 'inherit',
            zIndex: 1,
          }}
          tabIndex={-1}
        />

        {/* Textarea editable */}
        <textarea
          rows={6}
          value={prompt}
          onChange={handleChange}
          placeholder="Escribe tu nota aquí..."
          style={{
            position: 'relative',
            width: '100%',
            height: '120px',
            padding: '0.5rem',
            fontSize: '1rem',
            color: '#000',
            backgroundColor: 'transparent',
            resize: 'none',
            whiteSpace: 'pre-wrap',
            fontFamily: 'inherit',
            zIndex: 2,
          }}
        />
      </div>

      {loading && <p>Cargando sugerencia...</p>}
    </div>
  );
}
