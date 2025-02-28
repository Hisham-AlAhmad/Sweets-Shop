import React, { useState, useEffect } from 'react';
import Spinner from './Spinner';

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
                const categoriesResponse = await fetch('https://fakestoreapi.com/products/categories');
                if (!categoriesResponse.ok) throw new Error('Failed to fetch categories');
                const categoriesData = await categoriesResponse.json();
                console.log("Categories API Response:", categoriesData);

                // Handle categories response & Add 'All' category
                const categoriesArray = Array.isArray(categoriesData)
                    ? ['All', ...categoriesData]
                    : categoriesData.categories || [];
                setCategories(categoriesArray);

                // Fetch products
                const productsResponse = await fetch('https://fakestoreapi.com/products');
                if (!productsResponse.ok) throw new Error('Failed to fetch products');
                const productsData = await productsResponse.json();
                console.log("Products API Response:", productsData);

                // Handle products response
                const productsArray = Array.isArray(productsData)
                    ? productsData
                    : productsData.products || [];
                setProducts(productsArray);

                // Set active category
                if (categoriesArray && categoriesArray.length > 0) {
                    setActiveCategory(categoriesArray[0]);
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Filter products
    const filteredProducts = activeCategory === 'All'
        ? products // Show all products
        : products.filter((product) => product.category === activeCategory); // Filter by category

    { loading && <Spinner /> }
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="container-xxl py-5">
            <div className="container">
                <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
                    <h5 className="section-title ff-secondary text-center text-primary fw-normal">Food Menu</h5>
                </div>
                <div className="tab-class text-center wow fadeInUp mt-4" data-wow-delay="0.1s">
                    {/* Category Navigation */}
                    <ul className="nav nav-pills d-inline-flex justify-content-center border-bottom mb-5">
                        {categories.map((category) => (
                            <li className="nav-item" key={category}>
                                <button
                                    className={`nav-link ${activeCategory === category ? 'active' : ''}`}
                                    onClick={() => setActiveCategory(category)}
                                >
                                    {category}
                                </button>
                            </li>
                        ))}
                    </ul>
                    {/* Product Cards */}
                    <div className="tab-content">
                        <div id="tab-1" className="tab-pane fade show p-0 active">
                            <div className="row g-4">
                                {filteredProducts.map((product) => (
                                    <div className="col-lg-3 col-md-4 col-sm-6" key={product.id}>
                                        <div className="product-item">
                                            <div className="d-flex align-items-center">
                                                <img
                                                    className="flex-shrink-0 img-fluid rounded"
                                                    src={product.image}
                                                    alt={product.title}
                                                />
                                                <div className="w-100 d-flex flex-column text-start ps-4">
                                                    <h5 className="d-flex justify-content-between border-bottom pb-2">
                                                        <span>{product.title}</span>
                                                        <span className="text-primary">${product.price}</span>
                                                    </h5>
                                                    {/* <small className="fst-italic">{product.description}</small> */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Menu;