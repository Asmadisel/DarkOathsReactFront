// src/pages/UsersListPage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Используем Link для навигации без перезагрузки

const UsersListPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      const sessionId = localStorage.getItem('sessionId');
      
      // --- Проверка авторизации ---
      if (!sessionId) {
        setLoading(false);
        // Не перенаправляем, а просто завершаем выполнение.
        // Состояние `loading` станет false, и отрендерится сообщение.
        return;
      }

      try {
        const response = await fetch('https://localhost:7507/api/users', {
          headers: { 'Authorization': `Bearer ${sessionId}` }
        });

        if (response.status === 403) {
          // Сессия на сервере недействительна, удаляем локальный токен
          localStorage.removeItem('sessionId');
          setLoading(false);
          return;
        }

        if (!response.ok) {
          throw new Error('Не удалось загрузить данные');
        }

        const data = await response.json();
        setUsers(data.Users || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []); // Зависимость пуста, запрос идёт только при монтировании

  // --- Условный рендеринг на основе состояния ---

  // Если идёт загрузка
  if (loading) {
    return <h2 className="content">Загрузка списка пользователей...</h2>;
  }

  // Если произошла ошибка при запросе (не связанная с авторизацией)
  if (error) {
    return <h2 className="content auth-error">{error}</h2>;
  }

  // Проверяем авторизацию ПОСЛЕ завершения загрузки
  const sessionId = localStorage.getItem('sessionId');
  if (!sessionId) {
    return (
      <div className="content" style={{ textAlign: 'center', padding: '2rem' }}>
        <h2>Необходимо авторизоваться</h2>
        <p>Пожалуйста, войдите в систему для просмотра списка пользователей.</p>
        <Link to="/auth" className="auth-button" style={{ display: 'inline-block', marginTop: '1rem' }}>
          Перейти к авторизации
        </Link>
      </div>
    );
  }

  // Если всё хорошо, отображаем таблицу
  return (
    <div className="content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Список пользователей</h2>
        {/* Кнопка выхода (опционально, можно вынести в App.js) */}
        <button 
          onClick={() => {
            localStorage.removeItem('sessionId');
            window.location.reload(); // Простой способ обновить состояние
          }}
          className="auth-button" 
          style={{ backgroundColor: '#d32f2f' }}
        >
          Выйти
        </button>
      </div>
      <table className="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Логин</th>
            <th>Email</th>
            <th>Дата создания</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.Id}>
              <td>{user.Id}</td>
              <td>{user.Login}</td>
              <td>{user.Email}</td>
              <td>{new Date(user.CreatedAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersListPage;