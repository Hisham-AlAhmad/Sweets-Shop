import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const ViewCustomers = () => {
    const [customers, setCustomers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { logout } = useAuth();

    useEffect(() => {
        const fetchCustomers = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch('http://localhost:8000/src/backend/api/customer.php', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                    }
                });

                if (response.status === 401) {
                    logout(); // Logout if token is expired
                    setError('Session expired. Please log in again.');
                    navigate('/login', { replace: true });
                }

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                setCustomers(data);
            } catch (err) {
                setError(`Failed to fetch customer: ${err.message}`);
                console.error('Error fetching customer:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCustomers();
    }, [refreshTrigger]);
    console.log("Customers: ", customers);

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
                const response = await fetch(`http://localhost:8000/src/backend/api/customer.php`, {
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

                Swal.fire('Deleted!', 'The customer has been deleted.', 'success');
            } catch (err) {
                setError(`Failed to delete customer: ${err.message}`);
                console.error('Error deleting customer:', err);

                Swal.fire('Error!', 'Something went wrong while deleting.', 'error');
            }
        }
    };

    const refreshData = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center p-4">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3 text-muted">Loading cusotmers...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger d-flex align-items-center m-2" role="alert">
                <div>
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    <strong>Error Loading Customers</strong>
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

    // Function to render mobile card view for each cusotmer
    const renderMobileCard = (customer) => (
        <div className="card mb-3" key={customer.id}>
            <div className="card-body p-3">
                <h6 className="card-title d-flex justify-content-between">
                    <span>{customer.name}</span>
                    <small className="text-muted">ID: {customer.id}</small>
                </h6>
                <div className="d-flex gap-2 mt-2">
                    <button
                        className="btn btn-sm btn-danger flex-grow-1"
                        onClick={() => handleDelete(customer.id)}
                    >
                        <i className="bi bi-trash-fill me-1"></i> Delete
                    </button>
                </div>
            </div>
            <hr />
        </div>
    );

    return (
        <div className='card shadow'>
            <div className="card-header bg-white d-flex justify-content-between align-items-center flex-wrap gap-2">
                <h5 className="card-title mb-0">Customers</h5>
                <div className='d-flex gap-2'>
                    <button
                        onClick={refreshData}
                        className="btn btn-sm btn-outline-secondary"
                    >
                        <i className="bi bi-arrow-clockwise me-1"></i> Refresh
                    </button>
                </div>
            </div>

            <div className="card-body p-0">
                {customers.length === 0 ? (
                    <div className='text-center p-4 text-muted'>
                        <i className='bi bi-inbox-fill d-block mb-2' style={{ fontSize: '2rem' }}></i>
                        No customers found.
                    </div>
                ) : (
                    <>
                        {/* Desktop table view - visible on md and larger screens */}
                        <div className="d-none d-md-block table-responsive">
                            <table className="table table-hover table-striped mb-0">
                                <thead className='table-light'>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Phone Number</th>
                                        <th>Address</th>
                                        <th className='text-end'>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {customers.map(customer => (
                                        <tr key={customer.id}>
                                            <td>{customer.id}</td>
                                            <td>{customer.name}</td>
                                            <td>{customer.phoneNum}</td>
                                            <td>{customer.address}</td>
                                            <td className='text-end'>
                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => handleDelete(customer.id)}
                                                >
                                                    <i className="bi bi-trash-fill me-1"></i> Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile card view - visible on sm and smaller screens */}
                        <div className='d-md-none p-2'>
                            {customers.map(renderMobileCard)}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default ViewCustomers;