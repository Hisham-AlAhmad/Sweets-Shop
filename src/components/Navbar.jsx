import { NavLink } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-md navbar-dark bg-dark sticky-top shadow-sm px-4 px-lg-5 py-3 py-lg-0">
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
                    <NavLink to="/about" 
                        className={({ isActive }) => 
                            `nav-item nav-link ${isActive ? 'active' : ''}`
                        }>About
                    </NavLink>

                    <a href="menu.html" className="nav-item nav-link">Menu</a>
                    <a href="contact.html" className="nav-item nav-link">Contact</a>
                    <a href="#" className="nav-item nav-link d-flex align-items-center">
                        <img src="/img/cart.svg" alt="cart-img" className="me-2 img-fluid" style={{ maxWidth: "24px" }} /> Cart
                    </a>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;