import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import BackToTop from "../components/BackToTop";
import OpeningTime from "../admin/Settings/OpeningTime";

function Layout() {
  return (
    <div className="app-container">
      <Navbar />
      <OpeningTime />
      <div className="content">
        <Outlet />
      </div>
      <Footer />
      <BackToTop />
    </div>
  );
}

export default Layout;