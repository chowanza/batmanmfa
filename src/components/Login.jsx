import React, { useState } from 'react';
import './Login.css'; // Asegúrate de que esté apuntando al archivo CSS correcto
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase'; // Asegúrate de la ruta correcta

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Para manejar los errores de autenticación

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Intenta iniciar sesión con correo y contraseña
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Autenticado con éxito');
      // Redirigir al usuario a la página principal o dashboard
      // Por ejemplo, con react-router puedes hacer: history.push('/dashboard');
    } catch (err) {
      console.error('Error de autenticación: ', err.message);
      setError('Correo o contraseña incorrectos');
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h1 className="login-title">Bienvenido, Batman</h1>
        <p className="login-subtitle">Por favor, ingresa tus credenciales</p>

        {/* Mostrar mensaje de error si hay uno */}
        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="login-input"
            placeholder="Correo Electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="login-input"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-button">
            Iniciar Sesión
          </button>
        </form>

        <div className="divider">u</div>

        <p className="login-footer">
          ¿Olvidaste tu contraseña? <a href="#">Recuperar</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
