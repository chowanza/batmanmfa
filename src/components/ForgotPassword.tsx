import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";
import "./ForgotPassword.css";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Correo de recuperación enviado. Revisa tu bandeja de entrada.");
    } catch (error) {
      setError("Hubo un problema enviando el correo. Verifica tu email.");
    }
  };

  const handleBackToLogin = () => {
    navigate("/");
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-box">
        <h1 className="forgot-password-title">¿Olvidaste tu contraseña?</h1>
        <p className="forgot-password-subtitle">
          Ingresa tu correo electrónico y te enviaremos un enlace para restablecerla.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="forgot-password-input"
            placeholder="Correo Electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="forgot-password-button">
            Enviar correo
          </button>
        </form>

        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}

        <button onClick={handleBackToLogin} className="back-to-login-button">
          Volver al Login
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
