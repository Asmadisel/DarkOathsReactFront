// src/App.js
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';
import Articles from './pages/Articles';
import Bestiary from './pages/Bestiary';
import Auth from './pages/Auth';
import './App.css'; // Вы можете создать его позже или удалить

const AuthPage = () => (
  <div>
    <h2>Авторизация</h2>
    <p>Форма входа для хранителей Тайн.</p>
  </div>
);


function App() {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
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
        {/* Навигация */}
        <nav className="navigation">
          <ul>
            {/* Ссылка "Все статьи" всегда видна */}
            <li><Link to="/">Все статьи</Link></li>
            
            {/* Ссылка "Авторизация" всегда видна */}
            <li><Link to="/auth">Авторизация</Link></li>

            {/* Ссылка "Бестиарий" видна только если чекбокс отмечен */}
            {isMenuVisible && <li><Link to="/bestiary">Бестиарий</Link></li>}
          </ul>
        </nav>

        {/* Контент страниц */}
        <main className="content">
          <Routes>
            <Route path="/" element={<Articles />} />
            <Route path="/bestiary" element={<Bestiary />} />
            <Route path="/auth" element={<Auth />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;