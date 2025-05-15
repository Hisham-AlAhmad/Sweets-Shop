import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if there's an existing token on initial load
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const expiresAt = localStorage.getItem('expiresAt');
    let timeout;

    if (token && expiresAt && Date.now() < parseInt(expiresAt)) {
      setIsAuthenticated(true);

      timeout = setTimeout(() => {
        logout();
      }, parseInt(expiresAt) - Date.now());
    }

    setIsLoading(false);

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, []);


  const login = async (username, password) => {
    try {
      const response = await fetch('http://localhost:8000/src/backend/api/admin.php?action=login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Save authentication data
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('expiresAt', data.expires * 1000); // Convert to milliseconds
        localStorage.setItem('username', data.username);
        localStorage.setItem('image', data.image);

        console.log('Login successful:', data);
        setIsAuthenticated(true);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('expiresAt');
    localStorage.removeItem('username');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);