import { useEffect, useState,  } from "react";
import "../../styles/sidebar.css";

export default function Sidebar({
  notes,
  selectedIndex,
  onSelect,
  onDelete
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Cerrar sidebar con ESC (opcional)
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && sidebarOpen) setSidebarOpen(false);
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [sidebarOpen]);

  // Para mostrar/ocultar sidebar en móvil, podrías iniciar en false
  // const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={`layout ${sidebarOpen ? "sidebar-open" : ""}`}>
      {/* BOTÓN MENÚ SIEMPRE VISIBLE */}
      <div
        className={`background${sidebarOpen ? " open" : ""}`} style={{ zIndex: 1100 }}
      >
        <button
          className="menu__icon"
          aria-label="Toggle sidebar"
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* OVERLAY SÓLO CUANDO EL SIDEBAR ESTÁ ABIERTO */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <div className="sidebar">
        <div
          className="radio-container"
          style={{ "--total-radio": notes.length }}
        >
          {notes.map((note, index) => (
            <div key={note.id} style={{ display: "flex", alignItems: "center" }}>
              <input
                id={`note-${note.id}`}
                type="radio"
                name="radio"
                checked={selectedIndex === index}
                onChange={() => onSelect(index)}
              />
              <label htmlFor={`note-${note.id}`}>
                {note.title || `Nota ${index + 1}`}
              </label>
              {note.id !== "fake" && (
                <button
                  onClick={() => onDelete(note.id)}
                  style={{
                    marginLeft: 8,
                    color: "red",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  borrar
                </button>
              )}
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
