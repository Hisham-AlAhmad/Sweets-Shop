import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './cart.css';

const Cart = () => {
    const location = useLocation();
    const { product } = location.state || {};
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
        return delivery ? 20000 : 0;
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
        if (product) {
            setCartItems(prevCartItems => {
                if (prevCartItems.some(item => item.id === product.id && item.size === product.size)) {
                    return prevCartItems;
                }
                return [...prevCartItems, {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    cost: product.cost,
                    quantity: product.quantity,
                    size: product.size,
                    image: product.image,
                    isWeightBased: product.isWeightBased,
                }];
            });
        }
    }, []); // Runs only once to prevent refresh issue
    console.log("Cart Items:", cartItems);

    // Calculate total price
    var totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    // Handle quantity change
    const handleQuantityChange = (id, newQuantity) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id ? { ...item, quantity: item.isWeightBased ? Math.max(0.5, newQuantity) : Math.max(1, newQuantity) } : item
            )
        );
    };

    // Handle item removal
    const handleRemoveItem = (prod) => {
        if (!prod.isWeightBased) {
            setCartItems((prevItems) => prevItems.filter((item) => !(item.id === prod.id && item.size === prod.size)));
        } else {
            setCartItems((prevItems) => prevItems.filter((item) => item.id !== prod.id));
        }
    };

    // Function to format price with commas 1000000 => 100,000
    const commaInPrice = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' L.L';
    };

    // Redirect to WhatsApp
    function redirectToWhatsApp(cartItems) {
        const phoneNumber = '96181212862'; // Seller's WhatsApp number in international format
        let message = 'Name: ' + name + '\n';
        message += 'Phone Number: ' + phoneNumber + '\n';
        message += 'Address: ' + address + '\n\n';
        message += 'Order Details:\n';
        cartItems.forEach(item => {
            message += `-  ${item.name}:\n`;
            if (!item.isWeightBased) {
                message += `        Size: ${item.size}\n`;
            }
            message += `        Quantity: ${item.isWeightBased ? `${item.quantity} kg` : item.quantity}\n`;
            message += `        Price: ${commaInPrice(item.price)} x ${item.isWeightBased ? `${item.quantity} kg` : item.quantity} = ${commaInPrice(item.price * item.quantity)}\n\n`;
        });
        message += '\nDelivery: ' + (delivery ? '*Yes*' : '*No*');
        if (delivery) {
            message += `\nDelivery Cost: ${commaInPrice(deliveryCost)}`;
        }
        totalPrice = commaInPrice((totalPrice + deliveryCost));
        message += `\nTotal Amount: *${totalPrice}*`;
        const encodedMessage = encodeURIComponent(message);
        const waLink = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        window.open(waLink, '_blank');
    }

    const addCustomer_order = async (e) => {
        e.preventDefault();

        const response = await fetch("http://localhost:8000/src/backend/api/customer.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: name, phoneNum: phoneNum, address: address }),
        });

        const customerData = await fetch(`http://localhost:8000/src/backend/api/customer.php/${phoneNum}`);
        var customer_id = await customerData.json();
        customer_id = customer_id[0].id;
        const orderedItems = cartItems.map(item => ({
            product_id: item.id,
            quantity: item.quantity,
            price: item.price,
            cost: item.cost
        }));

        let totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0) + deliveryCost;
        let totalCost = cartItems.reduce((total, item) => total + item.cost * item.quantity, 0);
        const orderResponse = await fetch("http://localhost:8000/src/backend/api/orders.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ customer_id: customer_id, total_price: totalPrice, total_cost: totalCost, products: orderedItems }),
        });

        const orderData = await orderResponse.json();
        console.log("Order Data:", orderData);

        // Clear the cart after placing the order
        localStorage.removeItem("cart");
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
                    <a href="/menu" className="btn btn-primary py-sm-3 px-sm-5 me-3 animated ">
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
                                            src={`http://localhost:8000/public/img/products/${item.image}`}
                                            alt={item.name}
                                            className="img-fluid rounded-start cart-item-image p-2"
                                        />
                                    </div>
                                    {/* Product Details */}
                                    <div className="col-9 text-start">
                                        <div className="card-body p-2 ms-4">
                                            <h6 className="card-title mb-1">{item.name}</h6>
                                            <p className="card-text mb-1">
                                                <strong>Price:</strong> {commaInPrice(item.price)}
                                            </p>
                                            {item.isWeightBased ?
                                                (item.quantity >= 0.5 &&
                                                    <p className="card-text mb-1">
                                                        <strong>Subtotal:</strong> {commaInPrice(item.price * item.quantity)}
                                                    </p>
                                                ) : (
                                                    item.quantity > 1 &&
                                                    <p className="card-text mb-1">
                                                        <strong>Subtotal:</strong> {commaInPrice(item.price * item.quantity)}
                                                    </p>
                                                )
                                            }
                                            <p className="card-text mb-2">
                                                <strong>Size:</strong> {item.size}
                                            </p>
                                            {/* Quantity Selector */}
                                            <div className="d-flex align-items-center gap-2 mb-2">
                                                <button
                                                    className="btn btn-outline-primary btn-sm"
                                                    onClick={() =>
                                                        handleQuantityChange(item.id, item.isWeightBased ? item.quantity - 0.5 : item.quantity - 1)
                                                    }
                                                >
                                                    -
                                                </button>
                                                <span>{item.isWeightBased ? `${item.quantity} kg` : item.quantity}</span>
                                                <button
                                                    className="btn btn-outline-primary btn-sm"
                                                    onClick={() =>
                                                        handleQuantityChange(item.id, item.isWeightBased ? item.quantity + 0.5 : item.quantity + 1)
                                                    }
                                                >
                                                    +
                                                </button>
                                            </div>
                                            {/* Remove Button */}
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleRemoveItem(item)}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="home-menu">
                            <a href="/menu" className="btn btn-primary py-3 px-5 me-3 mt-5 animated slideInUp">Go to menu</a>
                        </div>
                    </div>

                    <div className="col-lg-4">
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

                        {/* Delivery Section */}
                        <div className="d-flex gap-3 align-items-center mb-3">
                            <h5 className="mb-0">Delivery?</h5>
                            <button className={`btn ${delivery ? 'btn-success' : 'btn-outline-success'}`}
                                onClick={() => (setDelivery(true), setDeliveryCost(20000))}
                                style={{ borderRadius: '5px' }}>
                                Yes
                            </button>
                            <button className={`btn ${!delivery ? 'btn-danger' : 'btn-outline-danger'}`}
                                onClick={() => (setDelivery(false), setDeliveryCost(0))}
                                style={{ borderRadius: '5px' }}>
                                No
                            </button>
                        </div>

                        {/* Order Summary */}
                        <div className="card order-summary-card">
                            <div className="card-body">
                                <h5 className="card-title">Order Summary</h5>
                                <hr />
                                <div className="d-flex justify-content-between mb-3">
                                    <span>Subtotal</span>
                                    <span>{commaInPrice(totalPrice)}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-3">
                                    <span>Delivery</span>
                                    <span>{delivery ? commaInPrice(deliveryCost) : 0}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-3">
                                    <strong>Total</strong>
                                    <strong>{commaInPrice(totalPrice + deliveryCost)}</strong>
                                </div>
                                <hr />
                                {/* Checkout Button */} {/* Disable the btn if there's no details */}
                                <form onSubmit={addCustomer_order}>
                                    <button className={`btn btn-primary w-100 ${name && address && phoneNum ? '' : 'disabled'}`}
                                        onClick={() => redirectToWhatsApp(cartItems)} >
                                        Proceed to Checkout
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Cart;