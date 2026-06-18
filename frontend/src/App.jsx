import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('userId', userData.id);
    localStorage.setItem('username', userData.username);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
  };

  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1e293b',
            color: '#ffffff',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            padding: '12px 20px',
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
          },
        }}
      />
      
      {user ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </>
  );
}

export default App;