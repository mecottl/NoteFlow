// Importamos dos hooks de React:
// - useState: para manejar el estado interno del componente.
// - useRef: para guardar una referencia mutable (en este caso, un temporizador).
import { useState, useRef } from 'react';
import '../styles/NoteEditor.css'; // Importamos los estilos del componente


// Componente principal de la aplicación
export default function NoteEditor() {
    // Estado que guarda el texto que el usuario está escribiendo
    const [prompt, setPrompt] = useState('');
    // Estado que guarda la sugerencia que devuelve la IA
    const [suggestion, setSuggestion] = useState('');
    // Estado booleano para mostrar si se está cargando la respuesta de la IA
    const [loading, setLoading] = useState(false);
    // Referencia para manejar el temporizador del debounce
    const timeoutRef = useRef(null);

    // Función asincrónica que hace la solicitud al backend para obtener la predicción
    async function getSuggestion(text) {
        // Si no hay texto, limpiar la sugerencia y salir
        if (!text) {
            setSuggestion('');
            return;
        }

        setLoading(true); // Activamos el indicador de carga

        try {
            // Hacemos la solicitud POST al servidor que está escuchando en http://localhost:3001/predict
            const res = await fetch('http://localhost:3001/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: text }) // Enviamos el texto actual como "prompt"
            });

            // Obtenemos la respuesta en formato JSON
            const data = await res.json();

            // Si la respuesta fue exitosa (código 200)
            if (res.ok) {
                // Eliminamos el texto original del resultado para quedarnos solo con la continuación sugerida
                const continuation = data.prediction.replace(text, '').trim();
                setSuggestion(continuation); // Guardamos la sugerencia
            } else {
                setSuggestion(''); // Si hubo error en la respuesta, vaciamos la sugerencia
            }
        } catch {
            // Si hubo un error en la solicitud (por ejemplo, no hay conexión), vaciamos la sugerencia
            setSuggestion('');
        }

        setLoading(false); // Desactivamos el indicador de carga
    }

    // Esta función se llama cada vez que el usuario escribe algo en el textarea
    function handleChange(e) {
        const value = e.target.value; // Obtenemos el nuevo valor del textarea
        setPrompt(value); // Actualizamos el estado del texto

        clearTimeout(timeoutRef.current); // Cancelamos cualquier temporizador anterior

        // Creamos un nuevo temporizador que se ejecuta 400ms después del último cambio
        // Esto evita hacer una solicitud en cada tecla presionada (técnica llamada "debounce")
        timeoutRef.current = setTimeout(() => {
            getSuggestion(value); // Llamamos a la función que obtiene la predicción
        }, 1000);
    }
    
// Esta función se llama cuando el usuario presiona una tecla
function handleKeyDown(e) {
    if (e.key === 'Tab' && suggestion) {
        e.preventDefault(); // Evita que cambie de campo
        setPrompt(prev => prev + suggestion); // Pegamos la sugerencia
        setSuggestion(''); // Limpiamos la sugerencia
    }
}

    return (
        <div className="center-page">

            <div className="note-container">
                <form className="form">
                    <label htmlFor="textarea">¿En que estás pensando hoy?</label>

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
                        Guardar tu NFlow
                    </button>
                </form>
                    {loading && <p className="loading-text">Cargando sugerencia...</p>}

            </div>
        </div>
    );
}
