// src/pages/UsersListPage.jsx
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const UsersListPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const menuRef = useRef(null);

  // Закрываем меню при клике вне его
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setSelectedUser(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      const sessionId = localStorage.getItem('sessionId');
      if (!sessionId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('https://localhost:7507/api/users', {
          headers: { 'Authorization': `Bearer ${sessionId}` }
        });

        if (response.status === 403) {
          localStorage.removeItem('sessionId');
          setLoading(false);
          return;
        }

        if (!response.ok) {
          throw new Error('Не удалось загрузить данные');
        }

        const data = await response.json();
        // Обратите внимание: данные приходят в поле `users`
        setUsers(data.users || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleToggleMenu = (user, event) => {
    event.stopPropagation();
    setSelectedUser(selectedUser?.id === user.id ? null : user);
  };

  const handleDelete = (userId) => {
    if (window.confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      // Здесь будет логика удаления пользователя (пока заглушка)
      console.log('Удаление пользователя с ID:', userId);
      // После успешного удаления обычно фильтруют список:
      // setUsers(prev => prev.filter(u => u.id !== userId));
    }
    setSelectedUser(null);
  };

  const handleOpen = (userId) => {
    // Здесь будет логика открытия деталей пользователя
    console.log('Открытие профиля пользователя с ID:', userId);
    setSelectedUser(null);
  };

  if (loading) {
    return <h2 className="content">Загрузка списка пользователей...</h2>;
  }

  if (error) {
    return <h2 className="content auth-error">{error}</h2>;
  }

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

  return (
    <div className="content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Список пользователей</h2>
        <button 
          onClick={() => {
            localStorage.removeItem('sessionId');
            window.location.reload();
          }}
          className="auth-button" 
          style={{ backgroundColor: '#d32f2f' }}
        >
          Выйти
        </button>
      </div>

      {users.length === 0 ? (
        <p>Пользователи не найдены.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {users.map(user => (
            <div 
              key={user.id}
              style={{
                position: 'relative',
                padding: '1.25rem',
                border: '1px solid #e0e0e0',
                borderRadius: '12px',
                backgroundColor: '#131111ff',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'box-shadow 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)'}
            >
              <div>
                <div><strong>ID:</strong> {user.id}</div>
                <div><strong>Логин:</strong> {user.login}</div>
                <div><strong>Email:</strong> {user.email}</div>
                <div><strong>Дата создания:</strong> {new Date(user.createdAt).toLocaleDateString('ru-RU')}</div>
              </div>
              <button 
                onClick={(e) => handleToggleMenu(user, e)}
                aria-label="Действия"
                style={{ 
                  padding: '0.5rem', 
                  cursor: 'pointer',
                  background: '#5e192aff',
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}
              >
                ⋮
              </button>

              {/* Контекстное меню */}
              {selectedUser?.id === user.id && (
                <div 
                  ref={menuRef}
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '0.5rem',
                    backgroundColor: 'white',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    zIndex: 1000,
                    minWidth: '140px',
                    overflow: 'hidden'
                  }}
                >
                  <button
                    onClick={() => handleOpen(user.id)}
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '0.75rem 1rem',
                      border: 'none',
                      background: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '0.95rem'
                    }}
                  >
                    Открыть
                  </button>
                  <hr style={{ margin: 0, borderColor: '#eee' }} />
                  <button
                    onClick={() => handleDelete(user.id)}
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '0.75rem 1rem',
                      border: 'none',
                      background: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '0.95rem',
                      color: '#d32f2f'
                    }}
                  >
                    Удалить
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UsersListPage;