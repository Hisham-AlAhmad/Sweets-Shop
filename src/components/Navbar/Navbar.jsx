import { NavLink } from "react-router-dom";
import "./navbar.css";
const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-md navbar-dark bg-dark sticky-top shadow-sm px-4 px-lg-5 py-lg-0">
            {/* Logo */}
            <NavLink to="/" className="navbar-brand p-0 d-flex align-items-center me-auto">
                <img src="/img/freshTime_noBg.png" alt="logo image" className="img-fluid" style={{ maxHeight: '100px' }} />
            </NavLink>

            {/* Toggler Button for Mobile */}
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
                <span className="fa fa-bars"></span>
            </button>

            {/* Links */}
            <div className="collapse navbar-collapse" id="navbarCollapse">
                <div className="navbar-nav ms-auto py-0 pe-4">
                    <NavLink to="/"
                        className={({ isActive }) =>
                            `nav-item nav-link ${isActive ? 'active' : ''}`
                        }>Home
                    </NavLink>
                    <NavLink to="/menu"
                        className={({ isActive }) =>
                            `nav-item nav-link ${isActive ? 'active' : ''}`
                        }>Menu
                    </NavLink>
                    <NavLink to="/contact"
                        className={({ isActive }) =>
                            `nav-item nav-link ${isActive ? 'active' : ''}`
                        }>Contact
                    </NavLink>
                    <NavLink to="/cart"
                        className={({ isActive }) =>
                            `nav-item nav-link ${isActive ? 'active' : ''}`
                        }> <i className="fas fa-shopping-cart me-2"></i> Cart
                    </NavLink>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;