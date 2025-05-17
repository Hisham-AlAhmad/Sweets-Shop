import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import BackToTop from "../components/BackToTop";

function Layout() {
  return (
    <div className="app-container">
      <Navbar />
      <div className="content">
        <Outlet />
      </div>
      <Footer />
      <BackToTop />
    </div>
  );
}

export default Layout;