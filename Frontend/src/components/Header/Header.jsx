// components/Header/Header.jsx
import './Header.css';
import AvatarToggle from './AvatarToggle';
import HeaderActions from './HeaderActions';
import HeaderTitle from './HeaderTitle'; // Nuevo componente para animar el título

export default function Header({
  sidebarOpen,
  onToggleSidebar,
  onCreateNote,
}) {
  const username = localStorage.getItem('username') || 'User';

  return (
    <header className="card-header">
      {/* Avatar toggle a la izquierda */}
      <AvatarToggle username={username} onClick={onToggleSidebar} />

      {/* Título SIEMPRE centrado */}
      <div className="header-center-title-absolute">
        <HeaderTitle username={username} />
      </div>

      {/* Acciones a la derecha */}
      <HeaderActions onCreateNote={onCreateNote} />
    </header>
  );
}
