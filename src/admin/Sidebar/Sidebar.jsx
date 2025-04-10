import { NavLink } from "react-router-dom";
import "./sidebar.css";

const Sidebar = ({ isOpen, setIsOpen }) => {
    return (
        <>
            <aside className={`left-sidebar ${isOpen ? 'open' : ''}`}>
                <div>
                    <div className="brand-logo d-flex align-items-center justify-content-between">
                        <a href="/admin" className="text-nowrap logo-img">
                            <img src="/img/freshTime_noBg.png" width="180" alt="Logo" />
                        </a>
                    </div>
                    <nav className="sidebar-nav scroll-sidebar" data-simplebar="">
                        <ul id="sidebarnav">
                            <li className="nav-small-cap">
                                <i className="ti ti-dots nav-small-cap-icon fs-4"></i>
                                <span className="hide-menu">Home</span>
                            </li>
                            <li className="sidebar-item">
                                <NavLink to="/dashboard"
                                    className={({ isActive }) =>
                                        `sidebar-link ${isActive ? 'active' : ''}`
                                    }>
                                    <span>
                                        <i className="ti ti-layout-dashboard"></i>
                                    </span>
                                    <span className="hide-menu">Dashboard</span>
                                </NavLink>
                            </li>
                            <li className="nav-small-cap">
                                <i className="ti ti-dots nav-small-cap-icon fs-4"></i>
                                <span className="hide-menu">CATEGORY</span>
                            </li>
                            <li className="sidebar-item">
                                <NavLink to="/addCategory"
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
                                    className={({ isActive }) =>
                                        `sidebar-link ${isActive ? 'active' : ''}`
                                    }>
                                    <span>
                                        <i className="ti ti-category"></i>
                                    </span>
                                    <span className="hide-menu">View Category</span>
                                </NavLink>
                            </li>
                            <li className="nav-small-cap">
                                <i className="ti ti-dots nav-small-cap-icon fs-4"></i>
                                <span className="hide-menu">PRODUCT</span>
                            </li>
                            <li className="sidebar-item">
                                <NavLink to="/addProduct"
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
                                    className={({ isActive }) =>
                                        `sidebar-link ${isActive ? 'active' : ''}`
                                    }>
                                    <span>
                                        <i className="ti ti-packages"></i>
                                    </span>
                                    <span className="hide-menu">View Product</span>
                                </NavLink>
                            </li>
                            <li className="nav-small-cap">
                                <i className="ti ti-dots nav-small-cap-icon fs-4"></i>
                                <span className="hide-menu">SUPPLIERS</span>
                            </li>
                            <li className="sidebar-item">
                                <NavLink to="/addSupplier"
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
                                    className={({ isActive }) =>
                                        `sidebar-link ${isActive ? 'active' : ''}`
                                    }>
                                    <span>
                                        <i className="ti ti-users-group"></i>
                                    </span>
                                    <span className="hide-menu">View Suppliers</span>
                                </NavLink>
                            </li>
                        </ul>
                    </nav>
                </div>
            </aside>
            {isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />}
        </>
    );
}

export default Sidebar;