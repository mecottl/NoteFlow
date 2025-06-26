import { useEffect, useState } from "react";
import "../../styles/sidebar.css";

export default function Sidebar({ userId }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notes, setNotes] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);         // <--- nuevo
  const [error, setError] = useState(null);              // <--- nuevo

  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    const fetchNotes = async () => {
      try {
        const res = await fetch(`http://localhost:3001/notes/user/${userId}`);
        const data = await res.json();

        if (!data || data.length === 0) {
          setNotes([{ id: "fake", title: "Sin notas" }]);
        } else {
          setNotes(data);
        }
        setSelectedIndex(0);
      } catch (err) {
        setError("Error al obtener notas.");
        setNotes([{ id: "fake", title: "Sin notas" }]);
        setSelectedIndex(0);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [userId]);

  return (
    <div className={`layout ${sidebarOpen ? "sidebar-open" : ""}`}>
      <div
        className={`background ${sidebarOpen ? "open" : ""}`}
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <button className="menu__icon" aria-label="Toggle sidebar" type="button">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <div className="sidebar">
        {loading && <div className="loading">Cargando notas...</div>}
        {error && <div className="error">{error}</div>}
        <div
          className="radio-container"
          style={{ "--total-radio": notes.length }}
        >
          {notes.map((note, index) => (
            <div key={note.id}>
              <input
                id={`note-${note.id}`}
                type="radio"
                name="radio"
                checked={selectedIndex === index}
                onChange={() => setSelectedIndex(index)}
              />
              <label htmlFor={`note-${note.id}`}>
                {note.title || `Nota ${index + 1}`}
              </label>
            </div>
          ))}
          <div className="glider-container">
            <div
              className="glider"
              style={{
                transform: `translateY(${selectedIndex * 100}%)`,
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
