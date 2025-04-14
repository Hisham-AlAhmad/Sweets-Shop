import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const ViewOrders = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch('http://localhost:8000/src/backend/api/orders.php');

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                setOrders(data);
                console.log('Fetched orders:', data);
            } catch (err) {
                setError(`Failed to fetch orders: ${err.message}`);
                console.error('Error fetching orders:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, [refreshTrigger]);

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(`http://localhost:8000/src/backend/api/orders.php`, {
                    method: 'DELETE',
                    body: JSON.stringify({ id: id }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                setRefreshTrigger(prev => prev + 1);

                Swal.fire('Deleted!', 'The order has been deleted.', 'success');
            } catch (err) {
                setError(`Failed to delete order: ${err.message}`);
                console.error('Error deleting order:', err);

                Swal.fire('Error!', 'Something went wrong while deleting.', 'error');
            }
        }
    };

    // Function to format price with commas 1000000 => 100,000
    const commaInPrice = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' L.L';
    };

    const refreshData = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    const seeProducts = (order) => {
        navigate('/orderedProducts', {
            state: {
                products: order.products
            }
        });
    };

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center p-4">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3 text-muted">Loading orders...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger d-flex align-items-center m-2" role="alert">
                <div>
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    <strong>Error Loading Orders</strong>
                    <p className="mb-2 mt-1">{error}</p>
                    <button
                        onClick={refreshData}
                        className="btn btn-sm btn-outline-danger"
                    >
                        <i className="bi bi-arrow-clockwise me-1"></i> Try Again
                    </button>
                </div>
            </div>
        );
    }

    // Function to render mobile card view for each order
    const renderMobileCard = (order) => (
        <div className="card mb-3" key={order.id}>
            <div className="card-body p-3">
                <h6 className="card-title d-flex justify-content-between">
                    <span>{order.customer_name}</span>
                    <small className="text-muted">ID: {order.id}</small>
                </h6>
                <div className='card-text'>
                    <strong>Total Price:</strong> {commaInPrice(order.total_price)}
                </div>
                <div className="card-text">
                    <div className="mb-2">
                        <i className="bi bi-calendar3 me-2"></i>
                        {formatDate(order.order_date)}
                    </div>
                </div>
                <div>
                    <strong>Ordered Products:</strong> {order.products.length}
                </div>
                <div className="d-flex gap-2 mt-2">
                    <button
                        onClick={() => seeProducts(order)}
                        className="btn btn-sm btn-outline-primary"
                    >
                        <i className="bi bi-eye-fill"></i>
                        <span className="ms-1"> View</span>
                    </button>
                </div>
            </div>
            <div className="d-flex gap-2 mt-2">
                <button
                    className="btn btn-sm btn-danger flex-grow-1"
                    onClick={() => handleDelete(order.id)}
                >
                    <i className="bi bi-trash-fill me-1"></i> Delete
                </button>
            </div>
            <hr />
        </div>
    );

return (
    <div className="card shadow">
        <div className="card-header bg-white d-flex justify-content-between align-items-center flex-wrap gap-2">
            <h5 className="card-title mb-0">Orders</h5>
            <div className="d-flex gap-2">
                <button
                    onClick={refreshData}
                    className="btn btn-sm btn-outline-secondary"
                >
                    <i className="bi bi-arrow-clockwise me-1"></i> Refresh
                </button>
            </div>
        </div>

        <div className="card-body p-0">
            {orders.length === 0 ? (
                <div className="text-center p-4 text-muted">
                    <i className="bi bi-inbox-fill d-block mb-2" style={{ fontSize: '2rem' }}></i>
                    No orders found.
                </div>
            ) : (
                <>
                    {/* Desktop table view - visible on md and larger screens */}
                    <div className="d-none d-md-block table-responsive">
                        <table className="table table-hover table-striped mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>ID</th>
                                    <th>Customer Name</th>
                                    <th>Total Price</th>
                                    <th>Creation Date</th>
                                    <th>Ordered Products</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.id}>
                                        <td>{order.id}</td>
                                        <td>{order.customer_name}</td>
                                        <td>{commaInPrice(order.total_price)}</td>
                                        <td>{formatDate(order.order_date)}</td>
                                        <td>
                                            <button
                                                onClick={() => seeProducts(order)}
                                                className="btn btn-sm btn-outline-primary"
                                            >
                                                <i className="bi bi-eye-fill"></i>
                                                <span className="d-none d-lg-inline ms-1"> View</span>
                                            </button>
                                        </td>
                                        <td className="text-end">
                                            <div className="btn-group" role="group">
                                                <button
                                                    onClick={() => handleDelete(order.id)}
                                                    className="btn btn-sm btn-danger"
                                                >
                                                    <i className="bi bi-trash-fill"></i>
                                                    <span className="d-none d-lg-inline ms-1">Delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile card view - visible only on small screens */}
                    <div className="d-md-none p-2">
                        {orders.map(renderMobileCard)}
                    </div>
                </>
            )}
        </div>
    </div>
);
}

export default ViewOrders;