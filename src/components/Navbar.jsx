import { useEffect, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FiMenu, FiMoon, FiSun, FiX } from 'react-icons/fi';
import logo from '../assets/bgnova-ai-logo.png';

function Navbar() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('bgnova-theme') || 'dark');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('bgnova-theme', theme);
  }, [theme]);
  const links = [
    ['/', 'Home'],
    ['/editor', 'Editor'],
    ['/about', 'About'],
    ['/contact', 'Contact'],
  ];

  return (
    <header className="navbar-wrap">
      <nav className="navbar">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark">
            <img src={logo} alt="BgNova AI logo" />
          </span>
          <span>BgNova AI</span>
        </Link>
        <div className={`nav-links ${open ? 'open' : ''}`}>
          {links.map(([to, label]) => (
            <NavLink key={to} to={to} onClick={() => setOpen(false)}>
              {label}
            </NavLink>
          ))}
          <button
            className="icon-btn theme-toggle"
            onClick={() => setTheme((value) => (value === 'dark' ? 'light' : 'dark'))}
            aria-label="Toggle dark mode"
            title="Toggle theme"
          >
            {theme === 'dark' ? <FiSun /> : <FiMoon />}
          </button>
          <Link className="btn btn-small nav-cta" to="/editor" onClick={() => setOpen(false)}>
            Start Editing
          </Link>
        </div>
        <button className="icon-btn nav-toggle" onClick={() => setOpen((value) => !value)} aria-label="Toggle menu">
          {open ? <FiX /> : <FiMenu />}
        </button>
      </nav>
    </header>
  );
}

export default Navbar;
