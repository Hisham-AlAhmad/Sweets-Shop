import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const ViewSuppliers = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSuppliers = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch("http://localhost:8000/src/backend/api/suppliers.php");

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                setSuppliers(data);
            } catch (err) {
                setError(`Failed to fetch suppliers: ${err.message}`);
                console.error("Error fetching suppliers:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSuppliers();
    }, [refreshTrigger]);

    const handleEdit = (supplier) => {
        navigate("/addSupplier", {
            state: {
                isEditing: true,
                supplierId: supplier.id,
                supplierName: supplier.name,
                phoneNumber: supplier.phoneNum,
                address: supplier.address,
                products_supplied: supplier.products_supplied,
            },
        });
    };

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
                const response = await fetch(`http://localhost:8000/src/backend/api/suppliers.php`, {
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

                Swal.fire('Deleted!', 'The supplier has been deleted.', 'success');
            } catch (err) {
                setError(`Failed to delete supplier: ${err.message}`);
                console.error('Error deleting supplier:', err);

                Swal.fire('Error!', 'Something went wrong while deleting.', 'error');
            }
        }
    };

    const refreshData = () => {
        setRefreshTrigger((prev) => prev + 1);
    };

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center p-4">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3 text-muted">Loading suppliers...</p>
                </div>
            </div>
        );
    };

    if (error) {
        return (
            <div className="alert alert-danger d-flex align-items-center m-2" role="alert">
                <div>
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    <strong>Error Loading Suppliers</strong>
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

    // Function to render mobile card view for each supplier
    const renderMobileCard = (supplier) => (
        <div className="card mb-3" key={supplier.id}>
            <div className="card-body p-3">
                <h6 className="card-title d-flex justify-content-between">
                    <span>{supplier.name}</span>
                    <small className="text-muted">ID: {supplier.id}</small>
                </h6>
                <div className="card-text">
                    <div className="mb-1">
                        <i className="bi bi-telephone me-2"></i>
                        {supplier.phoneNum}
                    </div>
                    <div className="mb-1">
                        <i className="bi bi-geo-alt me-2"></i>
                        {supplier.address}
                    </div>
                    <div className="mb-2">
                        <i className="bi bi-box me-2"></i>
                        {supplier.products_supplied}
                    </div>
                </div>
                <div className="d-flex gap-2 mt-2">
                    <button
                        className="btn btn-sm btn-primary flex-grow-1"
                        onClick={() => handleEdit(supplier)}
                    >
                        <i className="bi bi-pencil-fill me-1"></i> Edit
                    </button>
                    <button
                        className="btn btn-sm btn-danger flex-grow-1"
                        onClick={() => handleDelete(supplier.id)}
                    >
                        <i className="bi bi-trash-fill me-1"></i> Delete
                    </button>
                </div>
            </div>
            <hr />
        </div>
    );

    return (
        <div className="card shadow">
            <div className="card-header bg-white d-flex justify-content-between align-items-center flex-wrap gap-2">
                <h5 className="cart-title mb-0">Suppliers</h5>
                <div className="d-flex gap-2">
                    <button
                        onClick={() => navigate("/addSupplier")}
                        className="btn btn-sm btn-success"
                    >
                        <i className="bi bi-plus-circle me-1"></i> Add New
                    </button>
                    <button
                        onClick={refreshData}
                        className="btn btn-sm btn-outline-secondary"
                    >
                        <i className="bi bi-arrow-clockwise me-1"></i> Refresh
                    </button>
                </div>
            </div>

            <div className="card-body p-0">
                {suppliers.length === 0 ? (
                    <div className="text-center p-4 text-muted">
                        <i className="bi bi-inbox-fill d-block mb-2" style={{ fontSize: '2rem' }}></i>
                        No Suppliers found.
                    </div>
                ) : (
                    <>
                        {/* Desktop table view - visible on md and larger screens */}
                        <div className="d-none d-md-block table-responsive">
                            <table className="table table-hover table-striped mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Phone Number</th>
                                        <th>Address</th>
                                        <th>Products Supplied</th>
                                        <th className="text-end">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {suppliers.map((supplier) => (
                                        <tr key={supplier.id}>
                                            <td>{supplier.id}</td>
                                            <td>{supplier.name}</td>
                                            <td>{supplier.phoneNum}</td>
                                            <td>{supplier.address}</td>
                                            <td>{supplier.products_supplied}</td>
                                            <td className="text-end">
                                                <div className="btn-group" role="group">
                                                    <button
                                                        className="btn btn-sm btn-primary"
                                                        onClick={() => handleEdit(supplier)}
                                                    >
                                                        <i className="bi bi-pencil-fill"></i>
                                                        <span className="d-none d-lg-inline ms-1">Edit</span>
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => handleDelete(supplier.id)}
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
                            {suppliers.map(renderMobileCard)}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default ViewSuppliers;   