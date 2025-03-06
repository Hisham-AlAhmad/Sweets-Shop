import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import "./navbar.css";

const Navbar = () => {
    const location = useLocation();
    const navbarCollapseRef = useRef(null);
    
    // Function to close the navbar
    const closeNavbar = () => {
        if (navbarCollapseRef.current && navbarCollapseRef.current.classList.contains('show')) {
            // Check if Bootstrap is available
            if (typeof bootstrap !== 'undefined') {
                const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapseRef.current);
                if (bsCollapse) {
                    bsCollapse.hide();
                }
            }
        }
    };
    
    // Close navbar when route changes
    useEffect(() => {
        closeNavbar();
    }, [location]);
    
    // Close navbar when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                navbarCollapseRef.current && 
                !navbarCollapseRef.current.contains(event.target) &&
                !event.target.classList.contains('navbar-toggler') &&
                !event.target.classList.contains('fa-bars')
            ) {
                closeNavbar();
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    
    return (
        <nav className="navbar navbar-expand-md navbar-dark bg-dark sticky-top shadow-sm px-4 px-lg-5 py-lg-0">
            {/* Logo */}
            <NavLink to="/" className="navbar-brand p-0 d-flex align-items-center me-auto">
                <img src="/img/freshTime_noBg.png" alt="FreshTime logo" className="img-fluid" />
            </NavLink>

            {/* Toggler Button for Mobile */}
            <button 
                className="navbar-toggler" 
                type="button" 
                data-bs-toggle="collapse" 
                data-bs-target="#navbarCollapse" 
                aria-controls="navbarCollapse" 
                aria-expanded="false" 
                aria-label="Toggle navigation"
            >
                <span className="fa fa-bars"></span>
            </button>

            {/* Links */}
            <div className="collapse navbar-collapse" id="navbarCollapse" ref={navbarCollapseRef}>
                <div className="navbar-nav ms-auto py-0 pe-4 text-center">	
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
};

export default Navbar;