// src/pages/AuthSuccessPage.jsx
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthSuccessPage = ({ onAuthChange }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get('token');

    if (token) {
      // Сохраняем JWT-токен
      localStorage.setItem('token', token);
      if (onAuthChange) onAuthChange();
      navigate('/users', { replace: true });
    } else {
      // Если токена нет, возвращаемся на страницу авторизации
      navigate('/auth', { replace: true });
    }
  }, [location, navigate, onAuthChange]);

  return <div>Обработка входа через Google...</div>;
};

export default AuthSuccessPage;