import { NavLink } from "react-router-dom";
import "./sidebar.css";

const Sidebar = () => {
    return (
        <>
            <aside className="left-sidebar">
                <div>
                    <div className="brand-logo d-flex align-items-center justify-content-between">
                        <a href="/admin" className="text-nowrap logo-img">
                            <img src="/img/freshTime_noBg.png" width="180" alt="" />
                        </a>
                        <div className="close-btn d-xl-none d-block sidebartoggler cursor-pointer" id="sidebarCollapse">
                            <i className="ti ti-x fs-8"></i>
                        </div>
                    </div>
                    <nav className="sidebar-nav scroll-sidebar" data-simplebar="">
                        <ul id="sidebarnav">
                            <li className="nav-small-cap">
                                <i className="ti ti-dots nav-small-cap-icon fs-4"></i>
                                <span className="hide-menu">Home</span>
                            </li>
                            <li className="sidebar-item">
                                <NavLink to="/admin"
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
                                <a className="sidebar-link" href="./add-category.php" aria-expanded="false">
                                    <span>
                                        <i className="ti ti-article"></i>
                                    </span>
                                    <span className="hide-menu">Add Category</span>
                                </a>
                            </li>
                            <li className="sidebar-item">
                                <a className="sidebar-link" href="./view-category.php" aria-expanded="false">
                                    <span>
                                        <i className="ti ti-article"></i>
                                    </span>
                                    <span className="hide-menu">View Category</span>
                                </a>
                            </li>
                            <li className="nav-small-cap">
                                <i className="ti ti-dots nav-small-cap-icon fs-4"></i>
                                <span className="hide-menu">BRAND</span>
                            </li>
                            <li className="sidebar-item">
                                <a className="sidebar-link" href="./add-brand.php" aria-expanded="false">
                                    <span>
                                        <i className="ti ti-article"></i>
                                    </span>
                                    <span className="hide-menu">Add Brand</span>
                                </a>
                            </li>
                            <li className="sidebar-item">
                                <a className="sidebar-link" href="./view-brand.php" aria-expanded="false">
                                    <span>
                                        <i className="ti ti-article"></i>
                                    </span>
                                    <span className="hide-menu">View Brand</span>
                                </a>
                            </li>
                            <li className="nav-small-cap">
                                <i className="ti ti-dots nav-small-cap-icon fs-4"></i>
                                <span className="hide-menu">PRODUCT</span>
                            </li>
                            <li className="sidebar-item">
                                <a className="sidebar-link" href="./add-product.php" aria-expanded="false">
                                    <span>
                                        <i className="ti ti-article"></i>
                                    </span>
                                    <span className="hide-menu">Add Product</span>
                                </a>
                            </li>
                            <li className="sidebar-item">
                                <a className="sidebar-link" href="./view-product.php" aria-expanded="false">
                                    <span>
                                        <i className="ti ti-article"></i>
                                    </span>
                                    <span className="hide-menu">View Product</span>
                                </a>
                            </li>
                        </ul>

                    </nav>
                </div>
            </aside>
        </>
    );
}

export default Sidebar;