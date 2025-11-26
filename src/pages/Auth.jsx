// src/pages/AuthPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthPage = ({ onAuthChange }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // --- ЕДИНЫЙ ИСТОЧНИК ИСТИНЫ: JWT-токен ---
  const isAuthenticated = !!localStorage.getItem('token');

  useEffect(() => {
    // Если пользователь уже авторизован, перенаправляем
    if (isAuthenticated) {
      navigate('/users', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  // --- Обработчик классического входа ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Отправляем запрос на ваш AuthService
      const response = await fetch('https://localhost:7204/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          login: credentials.username,
          password: credentials.password
        })
      });

      if (response.status === 401) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Неверный логин или пароль');
      }

      if (!response.ok) {
        throw new Error(`Ошибка сервера: ${response.status}`);
      }

      const data = await response.json();
      if (!data?.token) {
        throw new Error('Сервер не вернул JWT-токен');
      }

      localStorage.setItem('token', data.token);
      if (onAuthChange) onAuthChange();
      navigate('/users', { replace: true });

    } catch (err) {
      console.error('Ошибка авторизации:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Обработчик входа через Google ---
  const handleGoogleLogin = () => {
    // Перенаправляем на ваш бэкенд для начала OAuth-флоу
    window.location.href = 'https://localhost:7204/login-google';
  };

  if (isAuthenticated) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2>Вы уже авторизованы!</h2>
          <p>Ваш сеанс активен.</p>
          <button 
            onClick={() => {
              localStorage.removeItem('token');
              if (onAuthChange) onAuthChange();
            }}
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
        
        {/* Форма классического входа */}
        <form onSubmit={handleSubmit} className="auth-form">
          <input name="username" placeholder="Логин" onChange={handleChange} required />
          <input name="password" type="password" placeholder="Пароль" onChange={handleChange} required />
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Вход...' : 'Войти'}
          </button>
        </form>

        {/* Разделитель */}
        <div style={{ textAlign: 'center', margin: '1rem 0', color: '#888' }}>или</div>

        {/* Кнопка входа через Google */}
        <button 
          type="button"
          onClick={handleGoogleLogin}
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: '#4285f4',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          Войти через Google
        </button>
      </div>
    </div>
  );
};

export default AuthPage;