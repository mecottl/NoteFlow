import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";
import ModalConfirmDelete from "./ModalConfirmDelete"; // Ajusta la ruta

export default function Sidebar({
  notes, selectedIndex, onSelect, onDelete,
  open, onClose
}) {
  // Modal de confirmación
  const [showModal, setShowModal] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);

  // Cerrar con ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && open) onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  // Cuando se confirma borrar
  const handleConfirmDelete = () => {
    if (pendingDelete) onDelete(pendingDelete); // Aquí solo manda el id al padre
    setShowModal(false);
    setPendingDelete(null);
  };

  // Cuando se da cancelar
  const handleCancelDelete = () => {
    setShowModal(false);
    setPendingDelete(null);
  };
    const navigate = useNavigate();

   const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/auth');
  };

  return (
    <>
      {open && (
        <div className="sidebar-overlay" onClick={onClose}></div>
      )}
      <div className={`sidebar${open ? " open" : ""}`}>
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
                  className="delete-btn"
                  onClick={() => {
                    setShowModal(true);
                    setPendingDelete(note.id);
                  }}
                >
                  <svg
                    className="delete-btn-icon"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    width="20"
                    height="20"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 012-2h2a2 2 0 012 2v2"
                    />
                  </svg>
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
      <div className="logout-container">
        <button className="logout-btn" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
      </div>
      <ModalConfirmDelete
        open={showModal}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
