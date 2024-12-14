import React from 'react';
import Login from './components/Login';

const App = () => {
  const handleLogin = (data) => {
    console.log('Datos enviados:', data);
    // Aquí se manejará la lógica de autenticación (simulación o conexión con backend)
  };

  return (
    <div>
      <Login onLogin={handleLogin} />
    </div>
  );
};

export default App;
