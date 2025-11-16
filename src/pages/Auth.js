import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  // Состояния для полей формы
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  // Состояние для сообщений об ошибках
  const [error, setError] = useState('');
  // Состояние для индикации загрузки (отправки запроса)
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  

  // Обработчик изменения полей формы
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
    // Очищаем ошибку при изменении полей
    if (error) setError('');
  };

  // Функция-заглушка для отправки данных на сервер
  const mockLoginAPI = async (data) => {
    // Имитируем задержку сети (1.5 секунды)
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Простая логика для демонстрации:
    // Если логин и пароль совпадают, возвращаем успех
    if (data.username === data.password) {
      return { success: true, token: 'mock_jwt_token_123' };
    } else {
      // Иначе возвращаем ошибку
      throw new Error('Неверный логин или пароль');
    }
  };

  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Отправляем данные в нашу "заглушку" API
      const response = await mockLoginAPI(credentials);
      console.log('Успешная авторизация:', response);

      // Здесь обычно мы бы сохранили токен (например, в localStorage)
      // и перенаправили пользователя в личный кабинет.
      // Для примера просто покажем алерт.
      alert('Авторизация успешна! Токен сохранён.');
      navigate('/'); // Перенаправляем на главную
    } catch (err) {
      console.error('Ошибка авторизации:', err);
      setError(err.message || 'Произошла ошибка при входе');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Вход в систему</h2>
        <p>Форма для хранителей Тайн.</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Логин</label>
            <input
              id="username"
              name="username"
              type="text"
              value={credentials.username}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input
              id="password"
              name="password"
              type="password"
              value={credentials.password}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          <button 
            type="submit" 
            className="auth-button"
            disabled={isLoading}
          >
            {isLoading ? 'Вход...' : 'Войти'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;