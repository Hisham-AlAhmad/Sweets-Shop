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
import Dashboard from "../admin/Dashboard/Dashboard";
import AddCategory from "../admin/Category/AddCategory";
import AddSupplier from "../admin/Suppliers/AddSupplier";
import ViewCategory from "../admin/Category/ViewCategory";
import ViewSuppliers from "../admin/Suppliers/ViewSuppliers";
import AddProduct from "../admin/Product/AddProduct";
import ViewProducts from "../admin/Product/ViewProducts";
import ViewCustomers from "../admin/Customer/ViewCustomers";
import ViewFeedback from "../admin/Feedback/ViewFeedback";
import EditFeedback from "../admin/Feedback/EditFeedback";
import ViewOrders from "../admin/Orders/ViewOrders";
import OrderedProducts from "../admin/Orders/OrderedProducts";
import LoginPage from "../auth/LoginPage";
import { AuthProvider } from "../auth/AuthContext";
import ProtectedRoute from "../auth/ProtectedRoute";
import EditProfile from "../admin/EditProfile/EditProfile";
import Settings from "../admin/Settings/Settings";
import ScrollToTop from "../components/ScrollToTop";
import { SettingsProvider } from "../admin/Settings/SettingsProvider";

function AppRoutes() {
  return (
    <AuthProvider>
      <ScrollToTop />
      <SettingsProvider>
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
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />} >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/addCategory" element={<AddCategory />} />
              <Route path="/viewCategory" element={<ViewCategory />} />
              <Route path="/addSupplier" element={<AddSupplier />} />
              <Route path="/ViewSuppliers" element={<ViewSuppliers />} />
              <Route path="/addProduct" element={<AddProduct />} />
              <Route path="/viewProducts" element={<ViewProducts />} />
              <Route path="/viewCustomers" element={<ViewCustomers />} />
              <Route path="/viewFeedback" element={<ViewFeedback />} />
              <Route path="/editFeedback" element={<EditFeedback />} />
              <Route path="/viewOrders" element={<ViewOrders />} />
              <Route path="/orderedProducts" element={<OrderedProducts />} />
              <Route path="/editProfile" element={<EditProfile />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Route>
          {/* Nameless routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </SettingsProvider>
    </AuthProvider>
  );
}

export default AppRoutes;