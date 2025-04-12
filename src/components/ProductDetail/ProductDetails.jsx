import React, { useState, useEffect } from 'react';
import { useParams, NavLink, Link } from 'react-router-dom';
import Spinner from '../Spinner';
import './productDetail.css';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [price, setPrice] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isWeightBased, setIsWeightBased] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://localhost:8000/src/backend/api/products.php/${id}`);
                const data = await response.json();

                const productData = data[0];
                setProduct(productData);
                console.log("Product API Response:", productData);

                // Set default selected size to the first one if sizes exist
                if (productData.sizes && productData.sizes.length > 0) {
                    setSelectedSize(productData.sizes[0].size_id);
                    setPrice(productData.sizes[0].price);
                    setQuantity(1);
                }
                else {
                    setPrice(productData.weight_price);
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
    }, [id]);

    // Handle loading state
    if (loading) {
        return <Spinner loading={loading} />;
    }

    // Handle error or not found state
    if (error || !product) {
        return (
            <div className="text-center py-5">
                <h1 className="product-not-found mb-4">{error || "Product Not Found..."}</h1>
                <NavLink to="/menu" className="btn btn-primary py-3 px-5 me-3 animated slideInUp">Back to Menu</NavLink>
            </div>
        );
    }

    // Handle size selection
    const handleSizeChange = (sizeId) => {
        setSelectedSize(sizeId);
        if (product.sizes && product.sizes.length > 0) {
            const selectedSizeObj = product.sizes.find(size => size.size_id === sizeId);
            if (selectedSizeObj) {
                setPrice(selectedSizeObj.price);
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
                                    image: product.image,
                                    isWeightBased: isWeightBased,
                                    size: getSelectedSizeName(),
                                    quantity: quantity
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