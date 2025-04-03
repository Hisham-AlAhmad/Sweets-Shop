import './header.css';

const Header = ({ onToggleSidebar }) => {
  return (
    <header className="app-header">
      <nav className="navbar navbar-expand-lg navbar-light">
        <ul className="navbar-nav">
          <li className="nav-item d-block d-xl-none">
            <button 
              onClick={onToggleSidebar}
              className="btn btn-link nav-link sidebartoggler nav-icon-hover"
              aria-label="Toggle sidebar"
              type="button"
            >
              <i className="ti ti-menu-2"></i>
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;