import React, { useState, useEffect } from 'react';
import { useParams, NavLink, Link } from 'react-router-dom';
import Spinner from '../Spinner';
import './productDetail.css';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [selectedSize, setSelectedSize] = useState('M');
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`https://fakestoreapi.com/products/${id}`);
                const data = await response.json();
                // Add mock sizes since FakeStore API doesn't provide sizes
                setProduct({ ...data, sizes: ['S', 'M', 'L'] });
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (!product) return (
        <>
            <Spinner loading={loading} />
            <div className="text-center">
                <h1 className="product-not-found mb-4">Product Not Found...</h1>
                <NavLink to="/menu" className="btn btn-primary py-3 px-5 me-3 animated slideInUp">Back to Menu</NavLink>
            </div>
        </>
    );

    return (
        <div className="container-xxl py-5">
            <div className="container">
                <div className="row g-5">
                    {/* Product Image */}
                    <div className="col-sm-6 pt-2 text-center">
                        <img
                            src={product.image}
                            alt={product.title}
                            className="img-fluid rounded product-detail-img"
                            style={{ maxHeight: '300px', objectFit: 'contain' }}
                        />
                    </div>

                    {/* Product Details */}
                    <div className="col-sm-6 ">
                        <h1 className="mb-4 product-title">{product.title}</h1>
                        <h3 className="text-primary mb-4">${product.price}</h3>
                        {quantity > 1 && <h5 className="mb-4">Total: <span className='text-primary'>${product.price * quantity}</span></h5>}

                        {/* Size Selection */}
                        <div className="mb-4 size-selector">
                            <h5 className="mb-3">Select Size:</h5>
                            <div className="d-flex gap-2">
                                {product.sizes.map(size => (
                                    <button
                                        key={size}
                                        className={`btn btn-outline-primary ${selectedSize === size ? 'active' : ''}`}
                                        onClick={() => setSelectedSize(size)}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quantity Selector */}
                        <div className="mb-4 quantity-selector">
                            <h5 className="mb-3">Quantity:</h5>
                            <div className="d-flex align-items-center gap-3">
                                <button
                                    className="btn btn-outline-primary"
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                >
                                    -
                                </button>
                                <span className="fs-4">{quantity}</span>
                                <button
                                    className="btn btn-outline-primary"
                                    onClick={() => setQuantity(quantity + 1)}
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-5">
                            <h5 className="mb-3">Description:</h5>
                            <p className="lead">{product.description}</p>
                        </div>
                        
                        {/* this is how u can make a div disappear */}
                        {/* {product.description = ""}
                        {product.description && <div className="mb-5">
                            <h5 className="mb-3">Description:</h5>
                            <p className="lead">{product.description}</p>
                        </div> */}

                        {/* Add to Cart Button */}
                        <Link
                            to="/cart"
                            state={{
                                product: {
                                    id: product.id,
                                    name: product.title,
                                    price: product.price,
                                    image: product.image
                                },
                                size: selectedSize,
                                quantity: quantity
                            }}
                            className="text-decoration-none"
                        >
                            <button className="btn btn-primary py-3 px-3 me-3 animated slideInUp">
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
