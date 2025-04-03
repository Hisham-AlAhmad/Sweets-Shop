import { Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import Home from "/src/components/Home";
import About from "/src/components/About";
import NotFound from "/src/components/NotFound";
import Menu from "../components/Menu/Menu";
import ProductDetail from "../components/ProductDetail/ProductDetails";
import Cart from "../components/Cart/Cart";
import Contact from "../components/Contact";
import AdminLayout from "../admin/AdminLayout";
import Dashboard from "../admin/Dashboard";
import AddCategory from "../admin/Category/AddCategory";
import AddSupplier from "../admin/AddSupplier";
import ViewCategory from "../admin/Category/ViewCategory";

function AppRoutes() {
  return (
    <Routes>
      {/* User side routes */}
      <Route element={<Layout />} >
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/menu/:id" element={<ProductDetail />} />
        <Route path="cart" element={<Cart />} />
        <Route path="/contact" element={<Contact />} />
      </Route>
      {/* Admin side routes */}
      <Route element={<AdminLayout />} >
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/addCategory" element={<AddCategory /> }/>
        <Route path="/viewCategory" element={<ViewCategory /> }/>
        <Route path="/addSupplier" element={<AddSupplier /> }/>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
