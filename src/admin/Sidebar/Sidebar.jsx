import { useAuth } from "../../auth/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import "./sidebar.css";

const Sidebar = ({ isOpen, setIsOpen }) => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const checkAuth_IsOpened = (e) => {
        const expiresAt = localStorage.getItem('expiresAt');
        if (!expiresAt) return;

        const now = Date.now();
        const expiry = parseInt(expiresAt);

        if (now > expiry) {
            e.preventDefault();
            logout();
            navigate('/login', { replace: true });
            setIsOpen(false);
        } else {
            setIsOpen(false);
        }
    };

    return (
        <>
            <aside className={`left-sidebar ${isOpen ? 'open' : ''}`}>
                <div>
                    <div className="brand-logo d-flex align-items-center justify-content-between">
                        <Link to="/" className="text-nowrap logo-img">
                            <img src="/img/freshTime_noBg.png" width="180" alt="Logo" />
                        </Link>
                    </div>
                    <nav className="sidebar-nav scroll-sidebar" data-simplebar="">
                        <ul id="sidebarnav">

                            {/* Home */}
                            <li className="nav-small-cap">
                                <i className="ti ti-dots nav-small-cap-icon fs-4"></i>
                                <span className="hide-menu">Home</span>
                            </li>
                            <li className="sidebar-item">
                                <NavLink to="/dashboard"
                                    onClick={(e) => (checkAuth_IsOpened(e))}
                                    className={({ isActive }) =>
                                        `sidebar-link ${isActive ? 'active' : ''}`
                                    }>
                                    <span>
                                        <i className="ti ti-layout-dashboard"></i>
                                    </span>
                                    <span className="hide-menu">Dashboard</span>
                                </NavLink>
                            </li>

                            {/* Category */}
                            <li className="nav-small-cap">
                                <i className="ti ti-dots nav-small-cap-icon fs-4"></i>
                                <span className="hide-menu">CATEGORY</span>
                            </li>
                            <li className="sidebar-item">
                                <NavLink to="/addCategory"
                                    onClick={(e) => (checkAuth_IsOpened(e))}
                                    className={({ isActive }) =>
                                        `sidebar-link ${isActive ? 'active' : ''}`
                                    }>
                                    <span>
                                        <i className="ti ti-category-plus"></i>
                                    </span>
                                    <span className="hide-menu">Add Category</span>
                                </NavLink>
                            </li>
                            <li className="sidebar-item">
                                <NavLink to="/viewCategory"
                                    onClick={(e) => (checkAuth_IsOpened(e))}
                                    className={({ isActive }) =>
                                        `sidebar-link ${isActive ? 'active' : ''}`
                                    }>
                                    <span>
                                        <i className="ti ti-category"></i>
                                    </span>
                                    <span className="hide-menu">View Category</span>
                                </NavLink>
                            </li>

                            {/* Product */}
                            <li className="nav-small-cap">
                                <i className="ti ti-dots nav-small-cap-icon fs-4"></i>
                                <span className="hide-menu">PRODUCT</span>
                            </li>
                            <li className="sidebar-item">
                                <NavLink to="/addProduct"
                                    onClick={(e) => (checkAuth_IsOpened(e))}
                                    className={({ isActive }) =>
                                        `sidebar-link ${isActive ? 'active' : ''}`
                                    }>
                                    <span>
                                        <i className="ti ti-package"></i>
                                    </span>
                                    <span className="hide-menu">Add Product</span>
                                </NavLink>
                            </li>
                            <li className="sidebar-item">
                                <NavLink to="/viewProducts"
                                    onClick={(e) => (checkAuth_IsOpened(e))}
                                    className={({ isActive }) =>
                                        `sidebar-link ${isActive ? 'active' : ''}`
                                    }>
                                    <span>
                                        <i className="ti ti-packages"></i>
                                    </span>
                                    <span className="hide-menu">View Product</span>
                                </NavLink>
                            </li>

                            {/* Customers */}
                            <li className="nav-small-cap">
                                <i className="ti ti-dots nav-small-cap-icon fs-4"></i>
                                <span className="hide-menu">CUSTOMERS</span>
                            </li>
                            <li className="sidebar-item">
                                <NavLink to="/viewCustomers"
                                    onClick={(e) => (checkAuth_IsOpened(e))}
                                    className={({ isActive }) =>
                                        `sidebar-link ${isActive ? 'active' : ''}`
                                    }>
                                    <span>
                                        <i className="ti ti-users-group"></i>
                                    </span>
                                    <span className="hide-menu">View Customers</span>
                                </NavLink>
                            </li>

                            {/* Feedback */}
                            <li className="nav-small-cap">
                                <i className="ti ti-dots nav-small-cap-icon fs-4"></i>
                                <span className="hide-menu">FEEDBACK</span>
                            </li>
                            <li className="sidebar-item">
                                <NavLink to="/viewFeedback"
                                    onClick={(e) => (checkAuth_IsOpened(e))}
                                    className={({ isActive }) =>
                                        `sidebar-link ${isActive ? 'active' : ''}`
                                    }>
                                    <span>
                                        <i className="ti ti-message-circle"></i>
                                    </span>
                                    <span className="hide-menu">View Feedback</span>
                                </NavLink>
                            </li>

                            {/* Orders */}
                            <li className="nav-small-cap">
                                <i className="ti ti-dots nav-small-cap-icon fs-4"></i>
                                <span className="hide-menu">ORDERS</span>
                            </li>
                            <li className="sidebar-item">
                                <NavLink to="/viewOrders"
                                    onClick={(e) => (checkAuth_IsOpened(e))}
                                    className={({ isActive }) =>
                                        `sidebar-link ${isActive ? 'active' : ''}`
                                    }>
                                    <span>
                                        <i className="ti ti-shopping-cart"></i>
                                    </span>
                                    <span className="hide-menu">View Orders</span>
                                </NavLink>
                            </li>

                            {/* Suppliers */}
                            <li className="nav-small-cap">
                                <i className="ti ti-dots nav-small-cap-icon fs-4"></i>
                                <span className="hide-menu">SUPPLIERS</span>
                            </li>
                            <li className="sidebar-item">
                                <NavLink to="/addSupplier"
                                    onClick={(e) => (checkAuth_IsOpened(e))}
                                    className={({ isActive }) =>
                                        `sidebar-link ${isActive ? 'active' : ''}`
                                    }>
                                    <span>
                                        <i className="ti ti-user-plus"></i>
                                    </span>
                                    <span className="hide-menu">Add Supplier</span>
                                </NavLink>
                            </li>
                            <li className="sidebar-item">
                                <NavLink to="/viewSuppliers"
                                    onClick={(e) => (checkAuth_IsOpened(e))}
                                    className={({ isActive }) =>
                                        `sidebar-link ${isActive ? 'active' : ''}`
                                    }>
                                    <span>
                                        <i className="ti ti-users-group"></i>
                                    </span>
                                    <span className="hide-menu">View Suppliers</span>
                                </NavLink>
                            </li>

                            {/* Store Settings */}
                            <li className="nav-small-cap">
                                <i className="ti ti-dots nav-small-cap-icon fs-4"></i>
                                <span className="hide-menu">STORE SETTINGS</span>
                            </li>
                            <li className="sidebar-item">
                                <NavLink to="/settings"
                                    onClick={(e) => (checkAuth_IsOpened(e))}
                                    className={({ isActive }) =>
                                        `sidebar-link ${isActive ? 'active' : ''}`
                                    }>
                                    <span>
                                        <i className="ti ti-settings"></i>
                                    </span>
                                    <span className="hide-menu">Settings</span>
                                </NavLink>
                            </li>
                        </ul>
                    </nav>
                </div>
            </aside>
            {isOpen && <div className="sidebar-overlay" onClick={() => (setIsOpen(false))} />}
        </>
    );
}

export default Sidebar;