import React from 'react';

export default function PredictionResult({ prediction }) {
  if (!prediction) return null;

  return (
    <div style={{
      whiteSpace: 'pre-wrap',
      backgroundColor: '#f0f0f0',
      padding: '1rem',
      borderRadius: '5px',
      marginTop: '1rem',
    }}>
      <strong>Respuesta:</strong>
      <p>{prediction}</p>
    </div>
  );
}
