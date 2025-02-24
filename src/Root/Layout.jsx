import { Outlet } from "react-router-dom";
import Spinner from "../components/Spinner";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Layout() {
  return (
    <div className="app-container">
      <Spinner />
      <Navbar />
      <div className="content">
        <Outlet />
      </div>
      <Footer />
      <a href="#" className="btn btn-lg btn-primary back-to-top">
        <i className="bi bi-arrow-up"></i>
      </a>
    </div>
  );
}

export default Layout;