// src/components/UserMenu.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserRole } from './utils/jwtUtils';

const UserMenu = ({ isAuthenticated, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      setUserRole(getUserRole());
    }
  }, [isAuthenticated]);

  const isAdmin = userRole === 'Admin';

   const toggleSubmenu = (menuName) => {
    setOpenSubmenu(openSubmenu === menuName ? null : menuName);
  };

  // Закрытие меню по нажатию Esc
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') setIsMenuOpen(false);
    };
    if (isMenuOpen) {
      document.addEventListener('keydown', handleEsc);
    }
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isMenuOpen]);

  if (!isAuthenticated) return null;

  return (
    <>
      {/* Кнопка-триггер в хедере */}
      <button 
        className="user-menu-trigger"
        onClick={() => setIsMenuOpen(true)}
        aria-label="Открыть меню пользователя"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 21H3V19C3 17.9 3.9 17 5 17H19C20.1 17 21 17.9 21 19V21ZM21 15H3V5C3 3.9 3.9 3 5 3H19C20.1 3 21 3.9 21 5V15Z"/>
        </svg>
      </button>

      {/* Оверлейное меню */}
      {isMenuOpen && (
        <div className="user-menu-overlay" onClick={() => setIsMenuOpen(false)}>
          <div className="user-menu-content" onClick={(e) => e.stopPropagation()}>
            <button className="menu-close-btn" onClick={() => setIsMenuOpen(false)}>
              &times;
            </button>
            <nav>
              <ul>
                {/* Управление Государством */}
                <li className="menu-item">
                  <button onClick={() => toggleSubmenu('state')} className="menu-button">
                    🏛️ Управление Государством
                  </button>
                  {openSubmenu === 'state' && (
                    <ul className="submenu">
                      <li><Link to="/states" onClick={() => setIsMenuOpen(false)}>Таблица</Link></li>
                      <li><Link to="/states/agents" onClick={() => setIsMenuOpen(false)}>Агенты</Link></li>
                      <li><Link to="/states/modifiers" onClick={() => setIsMenuOpen(false)}>Модификаторы</Link></li>
                      <li><Link to="/states/diplomacy" onClick={() => setIsMenuOpen(false)}>Дипломатия</Link></li>
                      <li><Link to="/states/technologies" onClick={() => setIsMenuOpen(false)}>Технологии</Link></li>
                    </ul>
                  )}
                </li>

                {/* Организации */}
                <li className="menu-item">
                  <button onClick={() => toggleSubmenu('orgs')} className="menu-button">
                    🤝 Организации
                  </button>
                  {openSubmenu === 'orgs' && (
                    <ul className="submenu">
                      <li><Link to="/organizations" onClick={() => setIsMenuOpen(false)}>Таблица</Link></li>
                      <li><Link to="/organizations/agents" onClick={() => setIsMenuOpen(false)}>Агенты</Link></li>
                      <li><Link to="/organizations/modifiers" onClick={() => setIsMenuOpen(false)}>Модификаторы</Link></li>
                      <li><Link to="/organizations/contacts" onClick={() => setIsMenuOpen(false)}>Контакты</Link></li>
                      <li><Link to="/organizations/technologies" onClick={() => setIsMenuOpen(false)}>Технологии</Link></li>
                    </ul>
                  )}
                </li>

                {/* Герои */}
                <li className="menu-item">
                  <button onClick={() => toggleSubmenu('heroes')} className="menu-button">
                    ⚔️ Герои
                  </button>
                  {openSubmenu === 'heroes' && (
                    <ul className="submenu">
                      <li><Link to="/heroes" onClick={() => setIsMenuOpen(false)}>Инвентарь</Link></li>
                      <li><Link to="/heroes/stats" onClick={() => setIsMenuOpen(false)}>Статистика</Link></li>
                    </ul>
                  )}
                </li>

                {/* Админка */}
                <li className="menu-item">
                  <button onClick={() => toggleSubmenu('admin')} className="menu-button admin">
                    🔒 Админка
                  </button>
                  {openSubmenu === 'admin' && (
                    <ul className="submenu">
                      <li><Link to="/admin/players" onClick={() => setIsMenuOpen(false)}>Мои игроки</Link></li>
                      <li><Link to="/admin/notifications" onClick={() => setIsMenuOpen(false)}>Уведомления</Link></li>
                      <li><Link to="/admin/civil" onClick={() => setIsMenuOpen(false)}>Гражданский Блок</Link></li>
                      <li><Link to="/admin/military" onClick={() => setIsMenuOpen(false)}>Военный Блок</Link></li>
                      <li><Link to="/admin/murgia" onClick={() => setIsMenuOpen(false)}>Мургия</Link></li>
                    </ul>
                  )}
                </li>

                {/* Сферикон */}
                <li className="menu-item">
                  <Link to="/sphericone" className="menu-button" onClick={() => setIsMenuOpen(false)}>
                    💎 Сферикон / Мои сферы
                  </Link>
                </li>

                {isAdmin && (
                    <li className="menu-item">
                        <button 
                        onClick={() => toggleSubmenu('site-management')}
                        className="menu-button"
                        >
                        🖥️ Управление сайтом
                        </button>
                        {openSubmenu === 'site-management' && (
                        <ul className="submenu">
                            <li><Link to="/users" onClick={() => setIsMenuOpen(false)}>Пользователи</Link></li>
                            {/* Сюда можно добавить другие пункты управления сайтом */}
                        </ul>
                        )}
                    </li>
                )}

                {/* Выход */}
                <li className="menu-item">
                  <button onClick={() => { onLogout(); setIsMenuOpen(false); }} className="menu-button logout">
                    🔙 Выйти из аккаунта
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default UserMenu;