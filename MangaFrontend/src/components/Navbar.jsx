import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Home, Compass, Bookmark, Search, Cat } from 'lucide-react';

export const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="nav-brand">
          <span className="nav-brand-badge">
            <Cat size={18} /> NEKO
          </span>
          <span>
            MangaNeko <span className="kanji">漫画猫</span>
          </span>
        </Link>

        <form onSubmit={handleSearchSubmit} className="nav-search-box">
          <Search size={16} className="nav-search-icon" />
          <input
            type="text"
            className="nav-search-input"
            placeholder="Search manga title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>

        <nav>
          <ul className="nav-links">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? 'nav-link active' : 'nav-link'
                }
                end
              >
                <Home size={18} /> Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/browse"
                className={({ isActive }) =>
                  isActive ? 'nav-link active' : 'nav-link'
                }
              >
                <Compass size={18} /> Browse
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/favorites"
                className={({ isActive }) =>
                  isActive ? 'nav-link active' : 'nav-link'
                }
              >
                <Bookmark size={18} /> Favorites
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};
