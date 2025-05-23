import { useParams, NavLink, Link, useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import './productDetail.css';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [price, setPrice] = useState(0);
    const [cost, setCost] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isWeightBased, setIsWeightBased] = useState(false);
    const location = useLocation();

    useEffect(() => {
        // Get product from location state instead of fetching
        if (location.state && location.state.product) {
            const productData = location.state.product;
            setProduct(productData);
            
            if (productData.availability == 0) {
                setError("Product not available");
                setLoading(false);
                return;
            }

            // Set default selected size to the first one if sizes exist
            if (productData.sizes && productData.sizes.length > 0) {
                setSelectedSize(productData.sizes[0].size_id);
                setPrice(productData.sizes[0].price);
                setCost(productData.sizes[0].cost);
                setQuantity(1);
            }
            else {
                setPrice(productData.weight_price);
                setCost(productData.weight_cost);
                setQuantity(0.5);
                setIsWeightBased(true);
            }
            setLoading(false);
        } else {
            // Fallback to API fetch if state is not available
            const fetchProduct = async () => {
                try {
                    const response = await fetch(`http://localhost:8000/src/backend/api/products.php/${id}`);
                    const data = await response.json();
    
                    const productData = data[0];
                    setProduct(productData);
                    console.log("Product API Response:", productData);
    
                    if (productData.availability == 0) {
                        setError("Product not available");
                        return;
                    }
    
                    // Set default selected size to the first one if sizes exist
                    if (productData.sizes && productData.sizes.length > 0) {
                        setSelectedSize(productData.sizes[0].size_id);
                        setPrice(productData.sizes[0].price);
                        setCost(productData.sizes[0].cost);
                        setQuantity(1);
                    }
                    else {
                        setPrice(productData.weight_price);
                        setCost(productData.weight_cost);
                        setQuantity(0.5);
                        setIsWeightBased(true);
                    }
                } catch (error) {
                    console.error('Error fetching product:', error);
                    setError("Failed to fetch product details");
                } finally {
                    setLoading(false);
                }
            };
    
            fetchProduct();
        }
    }, [id, location.state]);

    // Handle loading state
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center p-4">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3 text-muted">Loading Product Details...</p>
                </div>
            </div>
        );
    }

    // Handle error or not found state
    if (error || !product) {
        return (
            <>
                <div className="alert alert-danger d-flex align-items-center m-2" role="alert">
                    <div>
                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                        <strong>Error Loading Product</strong>
                        <p className="mb-2 mt-1">{error}</p>
                        <NavLink to="/menu" className="btn btn-secondary animated slideInUp">Back to Menu</NavLink>
                    </div>
                </div>
            </>
        );
    }

    // Handle size selection
    const handleSizeChange = (sizeId) => {
        setSelectedSize(sizeId);
        setQuantity(1); // Reset quantity to 1 when size changes
        if (product.sizes && product.sizes.length > 0) {
            const selectedSizeObj = product.sizes.find(size => size.size_id === sizeId);
            if (selectedSizeObj) {
                setPrice(selectedSizeObj.price);
                setCost(selectedSizeObj.cost);
                setIsWeightBased(false);
            }
        }
    };

    // Handle quantity decrease
    const decreaseQuantity = () => {
        if (isWeightBased) {
            setQuantity(prev => Math.max(0.5, prev - 0.5));
        } else {
            setQuantity(prev => Math.max(1, prev - 1));
        }
    };

    // Handle quantity increase
    const increaseQuantity = () => {
        if (isWeightBased) {
            setQuantity(prev => prev + 0.5);
        } else {
            setQuantity(prev => prev + 1);
        }
    };

    // Calculate total price
    const totalPrice = price * quantity;

    // Function to format price with commas 1000000 => 100,000
    const commaInPrice = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' L.L';
    };

    // Get selected size name
    const getSelectedSizeName = () => {
        if (product.sizes && product.sizes.length > 0) {
            const size = product.sizes.find(s => s.size_id === selectedSize);
            return size ? size.size_name : '';
        }
        return '';
    };

    // Get quantity display text
    const getQuantityText = () => {
        return isWeightBased ? `${quantity} kg` : quantity;
    };

    return (
        <div className="container-xxl py-5">
            <div className="container">
                <div className="row g-5">
                    {/* Product Image */}
                    <div className="col-sm-6 pt-2 text-center">
                        <img
                            src={`http://localhost:8000/public/img/products/${product.image}`}
                            alt={product.name}
                            className="img-fluid rounded product-detail-img"
                            style={{ maxHeight: '300px', objectFit: 'contain' }}
                        />
                    </div>

                    {/* Product Details */}
                    <div className="col-sm-6">
                        <h1 className="mb-4 product-title">{product.name}</h1>

                        {/* Price based on selected size or weight */}
                        {price > 0 && (
                            <h3 className="text-secondary mb-4">
                                {commaInPrice(price)}
                                {isWeightBased && ' per kg'}
                            </h3>
                        )}

                        {/* Total price */}
                        {quantity >= 0.5 && (
                            <h5 className="mb-4">Total: <span className='text-secondary'>{commaInPrice(totalPrice)}</span></h5>
                        )}

                        {/* Size Selection - only show if not weight-based */}
                        {!isWeightBased && product.sizes && product.sizes.length > 0 && (
                            <div className="mb-4 size-selector">
                                <h5 className="mb-3">Select Size:</h5>
                                <div className="d-flex gap-2">
                                    {product.sizes.map(size => (
                                        <button
                                            key={size.size_id}
                                            className={`btn btn-outline-primary ${selectedSize === size.size_id ? 'active' : ''}`}
                                            onClick={() => handleSizeChange(size.size_id)}
                                        >
                                            {size.size_name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity Selector with appropriate label */}
                        <div className="mb-4 quantity-selector">
                            <h5 className="mb-3">{isWeightBased ? 'Weight (kg):' : 'Quantity:'}</h5>
                            <div className="d-flex align-items-center gap-3">
                                <button
                                    className="btn btn-outline-primary"
                                    onClick={decreaseQuantity}
                                >
                                    -
                                </button>
                                <span className="fs-4">{getQuantityText()}</span>
                                <button
                                    className="btn btn-outline-primary"
                                    onClick={increaseQuantity}
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Description */}
                        {product.description && (
                            <div className="mb-5">
                                <h5 className="mb-3">Description:</h5>
                                <p className="lead">{product.description}</p>
                            </div>
                        )}

                        {/* Add to Cart Button */}
                        <Link
                            to="/cart"
                            state={{
                                product: {
                                    id: product.id,
                                    name: product.name,
                                    price: price,
                                    cost: cost,
                                    quantity: quantity,
                                    image: product.image,
                                    isWeightBased: isWeightBased,
                                    size: getSelectedSizeName()
                                },
                            }}
                            className="text-decoration-none"
                        >
                            <button
                                className="btn btn-primary py-3 px-3 me-3 animated slideInUp"
                            >
                                Add to Cart
                            </button>
                        </Link>

                        {/* Back to Menu Button */}
                        <Link to="/menu" className="btn btn-outline-primary py-3 px-3 animated slideInUp">
                            Back to Menu
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;