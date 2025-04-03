import { useState } from 'react';
import Sidebar from "./Sidebar/Sidebar";
import Header from "./Header/Header";
import './adminCss.css'
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="page-wrapper" id="main-wrapper" data-layout="vertical" 
             data-navbarbg="skin6" data-sidebartype="full"
             data-sidebar-position="fixed" data-header-position="fixed">
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            <div className="body-wrapper">
                <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
                <div className="container-fluid">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;