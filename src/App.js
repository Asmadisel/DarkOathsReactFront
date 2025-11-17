// src/App.js
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Articles from './pages/Articles';
import Bestiary from './pages/Bestiary';
import AuthPage from './pages/Auth';
import UsersListPage from './pages/UsersListPage';
import './App.css';

function App() {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Функция для проверки статуса авторизации
  const checkAuthStatus = () => {
    const sessionId = localStorage.getItem('sessionId');
    setIsAuthenticated(!!sessionId);
  };

  // Проверяем статус при первой загрузке
  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <BrowserRouter>
      <div className="app">
        <header className="app-header">
          <img src="/DarkOaths.png" alt="Логотип Тёмных Троп" className="app-logo" />
        </header>
        
        <div className="checkbox-control">
          <label>
            <input
              type="checkbox"
              checked={isMenuVisible}
              onChange={(e) => setIsMenuVisible(e.target.checked)}
            />
            Показать полное меню
          </label>
        </div>

        <nav className="navigation">
          <ul>
            <li><Link to="/">Все статьи</Link></li>
            <li><Link to="/auth">Авторизация</Link></li>
            {isMenuVisible && (
              <>
                <li><Link to="/bestiary">Бестиарий</Link></li>
                {/* Вкладка появляется ТОЛЬКО если пользователь авторизован */}
                {isAuthenticated && <li><Link to="/users">Пользователи</Link></li>}
              </>
            )}
          </ul>
        </nav>

        <main>
          <Routes>
            <Route path="/" element={<Articles />} />
            <Route path="/bestiary" element={<Bestiary />} />
            {/* Передаём функцию checkAuthStatus в AuthPage */}
            <Route path="/auth" element={<AuthPage onAuthChange={checkAuthStatus} />} />
            {/* Передаём функцию checkAuthStatus и флаг isAuthenticated в UsersListPage */}
            <Route 
              path="/users" 
              element={
                <UsersListPage 
                  isAuthenticated={isAuthenticated} 
                  onAuthChange={checkAuthStatus} 
                />
              } 
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;