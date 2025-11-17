// src/pages/AuthPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Принимаем пропс onAuthChange от App.js
const AuthPage = ({ onAuthChange }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Вместо локального состояния, просто читаем из localStorage для рендера
  const isAuthenticated = !!localStorage.getItem('sessionId');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleLogout = () => {
    localStorage.removeItem('sessionId');
    // Сообщаем родительскому компоненту (App.js) об изменении
    if (onAuthChange) onAuthChange();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('https://localhost:7507/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          login: credentials.username,
          password: credentials.password
        })
      });

      if (response.status === 401) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Неверный логин или пароль');
      }

      if (!response.ok) {
        throw new Error(`Ошибка сервера: ${response.status}`);
      }

      const data = await response.json();
      if (!data?.sessionId) {
        throw new Error('Сервер не вернул токен сессии');
      }

      localStorage.setItem('sessionId', data.sessionId);
      // Сообщаем родительскому компоненту об изменении
      if (onAuthChange) onAuthChange();
      navigate('/users', { replace: true });

    } catch (err) {
      console.error('Ошибка авторизации:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2>Вы уже авторизованы!</h2>
          <p>Ваш сеанс активен.</p>
          <button 
            onClick={handleLogout} 
            className="auth-button" 
            style={{ backgroundColor: '#d32f2f' }}
          >
            Выйти
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Вход в систему</h2>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <input name="username" placeholder="Логин" onChange={handleChange} required />
          <input name="password" type="password" placeholder="Пароль" onChange={handleChange} required />
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Вход...' : 'Войти'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;