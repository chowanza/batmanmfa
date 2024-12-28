import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";

const Dashboard: React.FC = () => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Sesión cerrada.");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Bienvenido al Dashboard</h1>
      <p>Aquí puedes gestionar tus datos como Batman.</p>
      <button onClick={handleLogout} style={{ padding: "10px 20px", marginTop: "20px" }}>
        Cerrar Sesión
      </button>
    </div>
  );
};

export default Dashboard;
