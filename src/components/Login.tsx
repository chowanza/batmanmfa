import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import "./Login.css";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Hook para redirigir

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Inicio de sesión exitoso");
    } catch (error) {
      setError("Credenciales inválidas, por favor intenta nuevamente.");
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password"); // Redirige a la página de recuperación
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h1 className="login-title">Bienvenido, Batman</h1>
        <p className="login-subtitle">Por favor, ingresa tus credenciales</p>

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

        <div className="divider"></div>

        <p className="login-footer">
          ¿Olvidaste tu contraseña?{" "}
          <button onClick={handleForgotPassword} className="forgot-password-link">
            Recuperar contraseña
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
