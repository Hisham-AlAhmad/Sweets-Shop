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

    // Delivery states
    const [delivery, setDelivery] = useState(() => {
        const savedDelivery = localStorage.getItem("delivery");
        return savedDelivery ? JSON.parse(savedDelivery) : false;
    });

    const [deliveryCost, setDeliveryCost] = useState(() => {
        return delivery ? 20 : 0;
    });

    const [name, setName] = useState(() => {
        return localStorage.getItem("name") ? JSON.parse(localStorage.getItem("name")) : "";
    });

    const [address, setAddress] = useState(() => {
        return localStorage.getItem("address") ? JSON.parse(localStorage.getItem("address")) : "";
    });

    const [phoneNum, setPhoneNum] = useState(() => {
        return localStorage.getItem("phoneNum") ? JSON.parse(localStorage.getItem("phoneNum")) : "";
    });


    // Save the data to local storage whenever it changes
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cartItems));
    }, [cartItems]);

    useEffect(() => {
        if (name) { // Ensure we don't save empty values unnecessarily
            localStorage.setItem("name", JSON.stringify(name));
        }
    }, [name]);

    useEffect(() => {
        if (address) {
            localStorage.setItem("address", JSON.stringify(address));
        }
    }, [address]);

    useEffect(() => {
        localStorage.setItem("delivery", JSON.stringify(delivery));
    }, [delivery]);

    useEffect(() => {
        localStorage.setItem("phoneNum", JSON.stringify(phoneNum));
    }, [phoneNum]);

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
    var totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

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

    // Function to add commas in thousands
    const commaInThousands = (num) => {
        num = Math.round(num);
        let noThousands = num % 1000;
        let thousands = Math.floor(num / 1000);
        if (thousands === 0) {
            return noThousands;
        }
        // handling the thousands part
        if (noThousands < 10) {
            noThousands = '00' + noThousands;
        } else if (noThousands < 100) {
            noThousands = '0' + noThousands;
        }
        return thousands + ',' + noThousands;
    };

    // Redirect to WhatsApp
    function redirectToWhatsApp(cartItems) {
        const phoneNumber = '96181212862'; // Seller's WhatsApp number in international format
        let message = 'Name: ' + name + '\n';
        message += 'Address: ' + address + '\n\n';
        message += 'Order Details:\n';
        cartItems.forEach(item => {
            message += `-  ${item.name}:\n`;
            message += `        Size: ${item.size}\n`;
            message += `        Quantity: ${item.quantity}\n`;
            // don't forget to remove the Math.round() when you're done testing
            message += `        Price: ${Math.round(item.price)},000 x ${item.quantity} = ${Math.round(item.price) * item.quantity},000\n\n`;
        });
        message += '\nDelivery: ' + (delivery ? '*Yes*' : '*No*');
        if (delivery) {
            message += `\nDelivery Cost: ${deliveryCost},000 L.L`;
        }
        totalPrice = commaInThousands(totalPrice);
        message += `\nTotal Amount: *${totalPrice},000* L.L`;
        const encodedMessage = encodeURIComponent(message);
        const waLink = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        window.open(waLink, '_blank');
    }

    const addCustomer = async (e) => {
        e.preventDefault();

        const response = await fetch("http://localhost:8000/src/backend/api/customer.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: name, phoneNum: phoneNum, address: address }),
        });

        const result = await response.json();
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
                                            className="img-fluid rounded-start cart-item-image p-2"
                                        />
                                    </div>
                                    {/* Product Details */}
                                    <div className="col-9 text-start">
                                        <div className="card-body p-2 ps-4">
                                            <h6 className="card-title mb-1">{item.name}</h6>
                                            <p className="card-text mb-1">
                                                <strong>Price:</strong> ${item.price}
                                            </p>
                                            {item.quantity > 1 &&
                                                <p className="card-text mb-1">
                                                    <strong>Subtotal:</strong> ${item.price * item.quantity}
                                                </p>
                                            }
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
                    {/* Delivery Section */}
                    <div className="col-lg-4">
                        <div className="d-flex gap-3 align-items-center mb-3">
                            <h5 className="mb-0">Delivery?</h5>
                            <button className={`btn ${delivery ? 'btn-success' : 'btn-outline-success'}`}
                                onClick={() => (setDelivery(true), setDeliveryCost(20))}
                                style={{ borderRadius: '5px' }}>
                                Yes
                            </button>
                            <button className={`btn ${!delivery ? 'btn-danger' : 'btn-outline-danger'}`}
                                onClick={() => (setDelivery(false), setDeliveryCost(0))}
                                style={{ borderRadius: '5px' }}>
                                No
                            </button>
                        </div>

                        {/* Order Details */}
                        <div className="card order-summary-card">
                            <div className="card-body g-2 row">
                                <h5 className="card-title">Order Details</h5>
                                <hr />
                                <div className="form-floating">
                                    <input type="text" className="form-control" placeholder="Enter your name" id="name"
                                        value={name} onChange={(e) => setName(e.target.value)}
                                    />
                                    <label htmlFor="name">Name</label>
                                </div>
                                <div className="form-floating">
                                    <input type="text" className="form-control" placeholder="Enter your Address" id="address"
                                        value={address} onChange={(e) => setAddress(e.target.value)}
                                    />
                                    <label htmlFor="address">Address</label>
                                </div>
                                <div className="form-floating">
                                    <input type="number" className="form-control" placeholder="Enter your Number" id="phoneNum"
                                        value={phoneNum} onChange={(e) => setPhoneNum(e.target.value)}
                                    />
                                    <label htmlFor="phoneNum">Phone Number</label>
                                </div>
                            </div>
                        </div>
                        <br />
                        {/* Order Summary */}
                        <div className="card order-summary-card">
                            <div className="card-body">
                                <h5 className="card-title">Order Summary</h5>
                                <hr />
                                <div className="d-flex justify-content-between mb-3">
                                    <span>Subtotal</span>
                                    <span>{commaInThousands(totalPrice) + ",000 L.L"}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-3">
                                    <span>Delivery</span>
                                    <span>{delivery ? deliveryCost + ",000" : 0} L.L</span>
                                </div>
                                <div className="d-flex justify-content-between mb-3">
                                    <strong>Total</strong>
                                    <strong>{commaInThousands(totalPrice += deliveryCost) + ",000 L.L"}</strong>
                                </div>
                                <hr />
                                {/* Checkout Button */} {/* Disable the btn if there's no details */}
                                <form onSubmit={addCustomer}>
                                    <button className={`btn btn-primary w-100 ${name && address && phoneNum ? '' : 'disabled'}`}
                                        onClick={() => redirectToWhatsApp(cartItems)} >
                                        Proceed to Checkout
                                    </button>
                                </form>
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