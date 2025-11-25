// src/App.js
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Articles from './pages/Articles';
import Bestiary from './pages/Bestiary';
import AuthPage from './pages/Auth';
import UsersListPage from './pages/UsersListPage';
import AuthSuccessPage from './pages/AuthSuccessPage';
import UserMenu from './UserMenu'; // <-- Исправлен путь к компоненту
import './App.css';
import './UserMenu.css'

function App() {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuthStatus = () => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    checkAuthStatus(); // Сразу обновляем состояние
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <BrowserRouter>
      <div className="app">
        <header className="app-header">
          <img src="/DarkOaths.png" alt="Логотип Тёмных Троп" className="app-logo" />
          {/* === КЛЮЧЕВОЕ ИЗМЕНЕНИЕ: Рендерим UserMenu === */}
          <UserMenu 
            isAuthenticated={isAuthenticated} 
            onLogout={handleLogout} 
          />
        </header>
        
        

        <nav className="navigation">
          <ul>
            <li><Link to="/">Все статьи</Link></li>
            {!isAuthenticated && <li><Link to="/auth">Авторизация</Link></li>}
            {isMenuVisible && (
              <>
                <li><Link to="/bestiary">Бестиарий</Link></li>
              </>
            )}
            <li className="menu-checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={isMenuVisible}
                  onChange={(e) => setIsMenuVisible(e.target.checked)}
                />
                {!isMenuVisible ? 'Открыть полное меню' : 'Скройся!'}
              </label>
            </li>
          </ul>
        </nav>

        <main>
          <Routes>
            <Route path="/" element={<Articles />} />
            <Route path="/bestiary" element={<Bestiary />} />
            <Route path="/auth" element={<AuthPage onAuthChange={checkAuthStatus} />} />
            <Route 
              path="/users" 
              element={
                <UsersListPage 
                  isAuthenticated={isAuthenticated} 
                  onAuthChange={checkAuthStatus} 
                />
              } 
            />
            <Route 
              path="/auth-success" 
              element={<AuthSuccessPage onAuthChange={checkAuthStatus} />} 
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;