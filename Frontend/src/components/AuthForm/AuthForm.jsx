import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuthForm() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const endpoint = isRegister
      ? 'http://localhost:3001/auth/register'
      : 'http://localhost:3001/auth/login';

    const body = isRegister
      ? { username, email, password }
      : { email, password };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        if (data.username) localStorage.setItem('username', data.username); // <--- AQUÍ
        // Limpia campos tras registro/login
        setUsername('');
        setEmail('');
        setPassword('');
        navigate('/notes');
      } else {
        setErrorMsg(data.message || data.error || 'Error de autenticación');
      }
    } catch (error) {
      setErrorMsg('Error de conexión con el servidor');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <h2>{isRegister ? 'Crear cuenta' : 'Iniciar sesión'}</h2>
      <form onSubmit={handleSubmit}>
        {isRegister && (
          <input
            type="text"
            placeholder="Nombre de usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoFocus
          />
        )}
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoFocus={!isRegister}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading
            ? 'Procesando...'
            : isRegister
            ? 'Registrarse'
            : 'Entrar'}
        </button>
        {errorMsg && <div className="error-msg">{errorMsg}</div>}
      </form>
      <button onClick={() => setIsRegister(!isRegister)} disabled={loading}>
        {isRegister ? 'Ya tengo cuenta' : 'Crear cuenta nueva'}
      </button>
    </div>
  );
}

// --- Cambios clave ---
// - Guarda el username en localStorage si viene en la respuesta (login o registro)
// - Así podrás mostrar el nombre en cualquier parte del frontend
