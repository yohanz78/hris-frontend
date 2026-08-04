import { NavLink } from 'react-router-dom';

function AppHeader() {
  return (
    <header className="app-header">
      <div>
        <p className="app-header__eyebrow">HRIS System</p>
        <h1 className="app-header__title">Employee management</h1>
      </div>

      <nav className="app-nav" aria-label="Primary">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `app-nav__link ${isActive ? 'app-nav__link--active' : ''}`
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/upload-data"
          className={({ isActive }) =>
            `app-nav__link ${isActive ? 'app-nav__link--active' : ''}`
          }
        >
          Upload data
        </NavLink>
      </nav>
    </header>
  );
}

export default AppHeader;
