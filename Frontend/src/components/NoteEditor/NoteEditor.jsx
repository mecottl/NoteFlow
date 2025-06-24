import { useState, useEffect } from 'react';
import Checkbox from './CheckboxIA';
import useSuggestion from './useSuggestion';
import SuggestLoader from './SuggestLoader';
import '../../styles/NoteEditor.css';
import '../../styles/loadingSuggest.css';
import '../../styles/checkboxIA.css';

export default function NoteEditor() {
    const [iaActiva, setIaActiva] = useState(true);

    const {
        prompt,
        suggestion,
        loading,
        handleChange,
        handleKeyDown
    } = useSuggestion(iaActiva);

    const frases = [
        '¿En qué estás pensando hoy?',
        '¿Qué quieres escribir?',
        'Cuéntame algo interesante...',
        '¿Qué notas quieres tomar?',
        'Exprésate con palabras...'
    ]
    const [frase, setFrase] = useState(frases[0]);
    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * frases.length);
        setFrase(frases[randomIndex]);
    }, []);

    return (
        <div className="center-page">
            <div className="note-container">
                <Checkbox iaActiva={iaActiva} setIaActiva={setIaActiva} />

                <form className="form">
                    <label htmlFor="textarea">{frase}</label>
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
                            placeholder="Escribe tu nota aquí..."
                            rows={6}
                        ></textarea>
                    </div>

                    <button className="form-submit-btn" type="submit">
                        Guarda tu NFlow
                    </button>
                </form>

                {loading && <SuggestLoader />}
            </div>
        </div>
    );
}
