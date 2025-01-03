// Login.tsx
import React, { useState } from "react";
import axios from "axios";
import "./Login.css";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"login" | "otp">("login");
  const [message, setMessage] = useState("");

  const handleSendOtp = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Validación básica del email
      if (!email || !email.includes('@')) {
        setError("Por favor, ingresa un correo electrónico válido");
        return;
      }

      const response = await axios.post("http://localhost:5000/send-otp", { 
        email 
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        setStep("otp");
        setMessage("OTP enviado a tu correo electrónico");
      }
    } catch (err: any) {
      console.error("Error al enviar OTP:", err);
      setError(err.response?.data?.error || "Error al enviar el código OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setLoading(true);
      setError("");

      if (!otp) {
        setError("Por favor, ingresa el código OTP");
        return;
      }

      const response = await axios.post("http://localhost:5000/verify-otp", {
        email,
        otp
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        setMessage("¡Verificación exitosa!");
        // Aquí podrías redirigir al usuario o establecer el estado de autenticación
      }
    } catch (err: any) {
      console.error("Error al verificar OTP:", err);
      setError(err.response?.data?.error || "Error al verificar el código OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === "login") {
      await handleSendOtp();
    } else {
      await handleVerifyOtp();
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h1 className="login-title">Bienvenido, Batman</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={step === "otp"}
              className="login-input"
              required
            />
          </div>

          {step === "otp" ? (
            <div className="input-group">
              <input
                type="text"
                placeholder="Ingresa el código OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="login-input"
                required
              />
            </div>
          ) : (
            <div className="input-group">
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input"
                required
              />
            </div>
          )}

          {error && <p className="error-message">{error}</p>}
          {message && <p className="success-message">{message}</p>}

          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading 
              ? "Procesando..." 
              : step === "login" 
                ? "Enviar OTP" 
                : "Verificar OTP"}
          </button>
        </form>

        <p className="login-footer">
          <a href="/forgot-password">¿Olvidaste tu contraseña?</a>
        </p>
      </div>
    </div>
  );
};

export default Login;