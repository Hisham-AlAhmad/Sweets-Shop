import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './cart.css';

const Cart = () => {
    const location = useLocation();
    const { product, size, quantity } = location.state || {};

    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem("cart");
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // Save the cart to local storage whenever it changes
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cartItems));
    }, [cartItems]);

    // Add the new product to the cart when the component mounts
    useEffect(() => {
        if (product && size && quantity) {
            setCartItems(prevCartItems => {
                if (prevCartItems.some(item => item.id === product.id && item.size === size)) {
                    return prevCartItems;
                }
                return [...prevCartItems, {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: quantity,
                    size: size,
                    image: product.image,
                }];
            });
        }
    }, []); // Runs only once to prevent refresh issue
    
    // Calculate total price
    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    // Handle quantity change
    const handleQuantityChange = (id, newQuantity) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item
            )
        );
    };

    // Handle item removal
    const handleRemoveItem = (id) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    };

    if (cartItems.length === 0) return (
        <>
            <div className="container py-5">
                <div className="text-center wow fadeInUp">
                    <h5 className="section-title ff-secondary text-center text-primary fw-normal">Cart</h5>
                    <h1 className="mb-4">Your Cart</h1>
                </div>
                <div className="text-center wow fadeInUp">
                    <p>Your cart is empty.</p>
                    <a href="/menu" className="btn btn-primary">
                        See the menu
                    </a>
                </div>
            </div>
        </>
    );

    return (
        <div className="container-xxl py-5">
            <div className="container">
                <div className="text-center wow fadeInUp">
                    <h5 className="section-title ff-secondary text-center text-primary fw-normal">Cart</h5>
                    <h1 className="mb-1">Your Cart</h1>
                </div>
                <div className="row g-4 wow fadeInUp">
                    {/* Cart Items */}
                    <div className="col-lg-8">
                        {cartItems.map((item) => (
                            <div key={`${item.id}-${item.size}`} className="card mb-3 cart-item-card">
                                <div className="row g-0 align-items-center">
                                    {/* Product Image */}
                                    <div className="col-3 text-center">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="img-fluid rounded-start cart-item-image py-2"
                                        />
                                    </div>
                                    {/* Product Details */}
                                    <div className="col-9 text-start">
                                        <div className="card-body p-2 ps-4">
                                            <h6 className="card-title mb-1">{item.name}</h6>
                                            <p className="card-text mb-1">
                                                <strong>Price:</strong> ${item.price}
                                            </p>
                                            <p className="card-text mb-2">
                                                <strong>Size:</strong> {item.size}
                                            </p>
                                            {/* Quantity Selector */}
                                            <div className="d-flex align-items-center gap-2 mb-2">
                                                <button
                                                    className="btn btn-outline-primary btn-sm"
                                                    onClick={() =>
                                                        handleQuantityChange(item.id, item.quantity - 1)
                                                    }
                                                >
                                                    -
                                                </button>
                                                <span>{item.quantity}</span>
                                                <button
                                                    className="btn btn-outline-primary btn-sm"
                                                    onClick={() =>
                                                        handleQuantityChange(item.id, item.quantity + 1)
                                                    }
                                                >
                                                    +
                                                </button>
                                            </div>
                                            {/* Remove Button */}
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleRemoveItem(item.id)}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Order Summary */}
                    <div className="col-lg-4">
                        <div className="card order-summary-card">
                            <div className="card-body">
                                <h5 className="card-title">Order Summary</h5>
                                <hr />
                                {/* Subtotal */}
                                <div className="d-flex justify-content-between mb-3">
                                    <span>Subtotal</span>
                                    <span>${totalPrice}</span>
                                </div>
                                {/* Delivery */}
                                <div className="d-flex justify-content-between mb-3">
                                    <span>Delivery</span>
                                    <span>$0</span>
                                </div>
                                {/* Total */}
                                <div className="d-flex justify-content-between mb-3">
                                    <strong>Total</strong>
                                    <strong>${totalPrice}</strong>
                                </div>
                                <hr />
                                {/* Checkout Button */}
                                <button className="btn btn-primary w-100">Proceed to Checkout</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="home-menu">
                    <a href="/menu" className="btn btn-primary py-3 px-5 me-3 mt-5 animated slideInUp">Go to menu</a>
                </div>
            </div>
        </div>
    );
};

export default Cart;