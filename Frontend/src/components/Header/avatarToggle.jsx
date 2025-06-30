// components/Header/AvatarToggle.jsx
import React from "react";

export default function AvatarToggle({ username, onClick }) {
  // Toma iniciales del username
  const initials = username
    ? username
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  return (
    <button
      aria-label="Abrir menú lateral"
      onClick={onClick}
      style={{
        width: 44,
        height: 44,
        borderRadius: "50%",
        background: "#61dafb",
        color: "#20232a",
        border: "none",
        boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
        fontWeight: 800,
        fontSize: "1.3rem",
        position: "fixed",
        top: "10px",
        left: "10px",
        zIndex: 1300,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background 0.2s",
      }}
    >
      {initials}
    </button>
  );
}
