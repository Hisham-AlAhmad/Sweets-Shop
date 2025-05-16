import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './header.css';

const Header = ({ onToggleSidebar }) => {
  const [username, setUsername] = useState('');
  const [image, setImage] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const { logout } = useAuth();
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const getUsername = () => {
    const username = localStorage.getItem('username');
    if (username && username !== 'null' && username !== 'undefined') {
      setUsername(username.charAt(0).toUpperCase() + username.slice(1));
    } else {
      setUsername('Guest');
    }
  }

  const getImage = () => {
    const image = localStorage.getItem('image');
    if (image && image !== 'null' && image !== 'undefined') {
      setImage(image);
    } else {
      setImage(null);
    }
  }

  useEffect(() => {
    getUsername();
    getImage();
  }, []);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You will be logged out!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout !',
    });

    if (result.isConfirmed) {
      logout();
    }
  };

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

        {/* User Profile Area */}
        <div className="ms-auto user-profile-container" ref={dropdownRef}>
          <div className="user-profile" onClick={toggleDropdown}>
            <div className="user-avatar">
              <span className="avatar-initials">
                {image ? (
                  <img
                    src={`http://localhost:8000/public/img/user/${image}`}
                    alt="User Avatar"
                    className="avatar-img"
                  />
                ) : (
                  <i className="ti ti-user"></i>
                )}
              </span>
            </div>
            <span className="user-name">{username}</span>
            <i className={`ti ti-chevron-${showDropdown ? 'up' : 'down'} ms-1`}></i>
          </div>

          {showDropdown && (
            <div className="user-dropdown">
              <div className="user-info">
                <h5 className="mb-1">{username}</h5>
                <p className="user-role">Admin</p>
              </div>
              <div className="dropdown-divider"></div>
              <ul className="dropdown-options">
                <li>
                  <button onClick={() => navigate('/editProfile')}>
                    <i className="ti ti-user me-2"></i>
                    Edit Profile
                  </button>
                </li>
                <li>
                  <button className="logout-btn" onClick={handleLogout}>
                    <i className="ti ti-logout me-2"></i>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;