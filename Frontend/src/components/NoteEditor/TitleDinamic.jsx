import '../../styles/TitleDinamic.css';

export default function TitleDinamic({ onOpenUserMenu, onCreateNote }) {
  const username = localStorage.getItem('username') || 'User';

  return (
    <header className="card-header">
      {/* Izquierda: espacio reservado (del tamaño del toggle) */}
      <div className="header-space"></div>

      {/* Centro: título animado */}
      <div className="loader">
        <p>Note</p>
        <div className="words">
          <span className="word">Flow</span>
          <span className="word">AI</span>
          <span className="word">{username}</span>
        </div>
      </div>

      {/* Derecha: botones (puedes conectar aquí tus handlers) */}
      <div className="header-actions">
        <button className="user-btn" onClick={onOpenUserMenu}>Usuario</button>
        <button className="new-btn" onClick={onCreateNote}>Crear nota</button>
      </div>
    </header>
  );
}
