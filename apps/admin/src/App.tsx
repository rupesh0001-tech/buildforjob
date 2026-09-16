import React, { useState, useEffect } from 'react';
import './index.css';
import { Login } from './Login';
import { Dashboard } from './Dashboard';
import api from './axiosInstance';

interface AdminInfo {
  email: string;
  name: string;
}

export function App() {
  const [token, setToken] = useState<string | null>(null);
  const [adminInfo, setAdminInfo] = useState<AdminInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore session on load by calling the /admin/me endpoint
    const restoreSession = async () => {
      try {
        const res = await api.get('/admin/me');
        if (res.data?.success) {
          setAdminInfo(res.data.data.admin);
          setToken('authenticated'); // set dummy token state indicating logged-in
        }
      } catch (err) {
        console.warn('No active admin session detected');
      } finally {
        setLoading(false);
      }
    };

    restoreSession();

    // Event listener for global authentication failures (401/403)
    const handleAuthFailed = () => {
      handleLogout();
    };

    window.addEventListener('auth-failed', handleAuthFailed);
    return () => {
      window.removeEventListener('auth-failed', handleAuthFailed);
    };
  }, []);

  const handleLoginSuccess = (newAdminInfo: AdminInfo) => {
    setToken('authenticated');
    setAdminInfo(newAdminInfo);
  };

  const handleLogout = () => {
    setToken(null);
    setAdminInfo(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 flex items-center justify-center font-semibold">
        Loading Admin Panel...
      </div>
    );
  }

  if (!token || !adminInfo) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <Dashboard 
      adminInfo={adminInfo} 
      onLogout={handleLogout} 
    />
  );
}

export default App;
