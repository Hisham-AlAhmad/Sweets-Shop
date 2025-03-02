import { Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import Home from "/src/components/Home";
import About from "/src/components/About";
import NotFound from "/src/components/NotFound";
import Menu from "../components/Menu";
import ProductDetail from "../components/ProductDetails";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />} >
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/menu/:id" element={<ProductDetail />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
