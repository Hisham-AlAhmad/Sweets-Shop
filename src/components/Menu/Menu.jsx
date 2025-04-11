import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Spinner from '../Spinner';
import './menu.css';

const Menu = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState('All');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch categories
                const categoriesResponse = await fetch('http://localhost:8000/src/backend/api/category.php');
                if (!categoriesResponse.ok) throw new Error('Failed to fetch categories');
                const categoriesData = await categoriesResponse.json();
                console.log("Categories API Response:", categoriesData);

                // Process categories - now they are objects with id and name properties
                // Add 'All' category
                const allCategory = { id: 'all', name: 'All' };
                const categoriesArray = [allCategory, ...categoriesData]
                setCategories(categoriesArray);

                // Fetch products
                const productsResponse = await fetch('http://localhost:8000/src/backend/api/products.php');
                if (!productsResponse.ok) throw new Error('Failed to fetch products');
                const productsData = await productsResponse.json();
                console.log("Products API Response:", productsData);

                setProducts(productsData);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Filter products based on category
    const filteredProducts = activeCategory === 'All'
        ? products // Show all products
        : products.filter((product) => {
            // Check if product has category object with matching name
            if (product.category && Array.isArray(product.category)) {
                return product.category.some(cat => cat.category_name === activeCategory);
            }
            return false;
        });

    // Function to format price with commas 1000000 => 100,000
    const commaInPrice = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' L.L';
    };

    // Product card component that handles whether it's clickable based on availability
    const ProductCard = ({ product }) => {
        const available = product.availability === "1";

        // Base product card content
        const productContent = (
            <div className={`product-item ${!available ? 'unavailable' : ''}`}>
                <div className="d-flex align-items-center">
                    <img
                        className="flex-shrink-0 img-fluid rounded"
                        src={`http://localhost:8000/public/img/products/${product.image}`}
                        alt={product.name}
                    />
                    <div className="w-100 d-flex flex-column text-start ps-4">
                        <h5 className="d-flex justify-content-between border-bottom pb-2">
                            <span>{product.name}</span>
                            {product.sizes && product.sizes.length > 0 ? (
                                <span className={`${!available ? 'text-unavailable' : 'text-primary'}`}>
                                    {product.sizes.length} size{product.sizes.length > 1 ? 's' : ''}
                                </span>
                            ) : (
                                <span className={`${!available ? 'text-unavailable' : 'text-primary'}`}>
                                    {commaInPrice(product.weight_price)}
                                </span>
                            )}
                        </h5>
                        {!available && <span className="unavailable-badge text-primary">Unavailable</span>}
                        {product.description && (
                            <small className={`fst-italic ${!available ? 'text-unavailable' : ''}`}>
                                {product.description}
                            </small>
                        )}
                        {product.sizes && product.sizes.length > 1 && (
                            <small className={`mt-1 ${!available ? 'text-unavailable' : ''}`}>
                                Multiple sizes available
                            </small>
                        )}
                    </div>
                </div>
            </div>
        );

        // Wrap in Link if available, otherwise just return the content
        return (
            <div className="col-lg-3 col-md-4 col-sm-6" key={product.id}>
                {available ? (
                    <Link to={`/menu/${product.id}`}>
                        {productContent}
                    </Link>
                ) : (
                    productContent
                )}
            </div>
        );
    };

    if (error) return <div>Error: {error}</div>;

    return (
        <>
            <Spinner loading={loading} />
            <div className="container-xxl py-5">
                <div className="container">
                    <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
                        <h5 className="section-title ff-secondary text-center text-primary fw-normal">Food Menu</h5>
                    </div>
                    <div className="tab-class text-center wow fadeInUp mt-4" data-wow-delay="0.1s">
                        {/* Category Navigation */}
                        <ul className="nav nav-pills d-inline-flex justify-content-center border-bottom mb-5">
                            {categories.map((category) => (
                                <li className="nav-item" key={category.id}>
                                    <button
                                        className={`nav-link ${activeCategory === category.name ? 'active' : ''}`}
                                        onClick={() => setActiveCategory(category.name)}
                                    >
                                        {category.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                        {/* Product Cards */}
                        <div className="tab-content">
                            <div id="tab-1" className="tab-pane fade show p-0 active">
                                <div className="row g-4">
                                    {filteredProducts.length > 0 ? (
                                        filteredProducts.map((product) => (
                                            <ProductCard product={product} key={product.id} />
                                        ))
                                    ) : (
                                        <div className="col-12 text-center">
                                            <p>No products found in this category.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Menu;