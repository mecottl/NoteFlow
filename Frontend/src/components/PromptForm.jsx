import React, { useState } from 'react';

export default function PromptForm({ onPrediction }) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    onPrediction(''); // limpia la respuesta anterior

    try {
      const res = await fetch('http://localhost:3001/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();

      if (res.ok) {
        onPrediction(data.prediction);
      } else {
        setError(data.error || 'Error desconocido');
      }
    } catch {
      setError('Error al conectar con el servidor.');
    }

    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
      <textarea
        rows={4}
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
        placeholder="Escribe tu prompt aquí..."
        style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }}
        required
        disabled={loading}
      />
      <button type="submit" disabled={loading} style={{ marginTop: '0.5rem', padding: '0.5rem 1rem' }}>
        {loading ? 'Cargando...' : 'Enviar'}
      </button>
      {error && <p style={{ color: 'red', marginTop: '0.5rem' }}>{error}</p>}
    </form>
  );
}
