// src/pages/UsersListPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UsersListPage = ({ isAuthenticated, onAuthChange }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!isAuthenticated) navigate('/auth');
  }, [isAuthenticated, navigate]);

  const fetchUsers = async () => {
    if (!token) return;
    try {
      const response = await fetch('/api/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.status === 403) {
        setError('Доступ запрещён. Требуются права администратора.');
        setLoading(false);
        return;
      }
      if (!response.ok) throw new Error(`Ошибка: ${response.status}`);
      const data = await response.json();
      setUsers(data.users || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleCreateUser = async (userData) => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      if (response.ok) {
        setIsModalOpen(false);
        fetchUsers();
      } else {
        throw new Error('Не удалось создать пользователя');
      }
    } catch (err) {
      alert(`Ошибка создания: ${err.message}`);
    }
  };

  const handleUpdateUser = async (id, userData) => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      if (response.ok) {
        setIsModalOpen(false);
        fetchUsers();
      } else {
        throw new Error('Не удалось обновить пользователя');
      }
    } catch (err) {
      alert(`Ошибка обновления: ${err.message}`);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить этого пользователя?')) return;
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setUsers(users.filter(user => user.id !== id));
      } else {
        throw new Error('Не удалось удалить пользователя');
      }
    } catch (err) {
      alert(`Ошибка удаления: ${err.message}`);
    }
  };

  const openCreateModal = () => {
    setModalMode('create');
    setCurrentUser(null);
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setModalMode('edit');
    setCurrentUser(user);
    setIsModalOpen(true);
  };

  if (loading) return <h2 className="content">Загрузка...</h2>;
  if (error) return <h2 className="content auth-error">{error}</h2>;

  return (
    <div className="content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Список пользователей</h2>
        <button onClick={openCreateModal} className="auth-button">
          Добавить пользователя
        </button>
      </div>

      {users.length === 0 ? (
        <p>Нет пользователей.</p>
      ) : (
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Логин</th>
              <th>Email</th>
              <th>Роль</th>
              <th>Провайдер</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.login}</td>
                <td>{user.email}</td>
                <td>{user.role?.name || 'N/A'}</td>
                <td>{user.provider}</td>
                <td>
                  <button onClick={() => openEditModal(user)} style={{ marginRight: '0.5rem' }}>
                    Редактировать
                  </button>
                  <button onClick={() => handleDeleteUser(user.id)} style={{ backgroundColor: '#d32f2f' }}>
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{modalMode === 'create' ? 'Создать пользователя' : 'Редактировать пользователя'}</h3>
            <UserModalForm
              mode={modalMode}
              user={currentUser}
              onClose={() => setIsModalOpen(false)}
              onCreate={handleCreateUser}
              onUpdate={handleUpdateUser}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const UserModalForm = ({ mode, user, onClose, onCreate, onUpdate }) => {
  const [formData, setFormData] = useState({
    login: user?.login || '',
    email: user?.email || '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'create') {
      onCreate(formData);
    } else {
      onUpdate(user.id, formData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Логин:</label>
        <input
          type="text"
          name="login"
          value={formData.login}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Пароль {mode === 'edit' ? '(оставьте пустым, чтобы не менять)' : ''}:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
      </div>
      <div>
        <button type="submit">
          {mode === 'create' ? 'Создать' : 'Сохранить'}
        </button>
        <button type="button" onClick={onClose}>Отмена</button>
      </div>
    </form>
  );
};

export default UsersListPage;