import { useState, useRef } from 'react';

export default function useSuggestion(iaActiva) {
  const [prompt, setPrompt] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef(null);

  async function getSuggestion(text) {
    if (!text || !iaActiva) {
      setSuggestion('');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('http://localhost:3001/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text }),
      });

      const data = await res.json();

      if (res.ok) {
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

  function handleChange(e) {
    const value = e.target.value;
    setPrompt(value);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => getSuggestion(value), 1000);
  }

  function handleKeyDown(e) {
    if (e.key === 'Tab' && suggestion) {
      e.preventDefault();
      setPrompt(prev => prev + suggestion);
      setSuggestion('');
    }
  }

  return {
    prompt,
    suggestion,
    loading,
    handleChange,
    handleKeyDown,
  };
}
