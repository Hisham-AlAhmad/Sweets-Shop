import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useFetch from '../Hooks/useFetch';
import Swal from 'sweetalert2';

const ViewProducts = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const navigate = useNavigate();

    const { data, isLoading: hookLoading, error: hookError } = useFetch('products', [refreshTrigger]);
    useEffect(() => {
        if (data) {
            setProducts(data);
        }
        setIsLoading(hookLoading);
        if (hookError) {
            setError(hookError);
        }
        console.log('Products fetched:', products);
    }, [data, hookLoading, hookError]);

    const handleEdit = (product) => {
        // Ensure the product has the correct structure for categories and sizes
        const productCategories = Array.isArray(product.category)
            ? product.category.map((category) => ({ id: category.category_id, name: category.category_name }))
            : [];
        // Properly format the sizes for editing
        const productSizes = Array.isArray(product.sizes)
            ? product.sizes.map(size => ({
                size_id: size.size_id,
                size_name: size.size_name,
                price: size.price,
                cost: size.cost
            }))
            : [];

        navigate('/addProduct', {
            state: {
                isEditing: true,
                productId: product.id,
                productName: product.name,
                image: product.image,
                description: product.description,
                weightPrice: product.weight_price,
                availability: product.availability,
                createdAt: product.created_at,
                productCategories: productCategories,
                productSizes: productSizes
            }
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
                const response = await fetch(`http://localhost:8000/src/backend/api/products.php`, {
                    method: 'DELETE',
                    body: JSON.stringify({ id: id }),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                    }
                });

                if (response.status === 401) {
                    logout(); // Logout if token is expired
                    setError('Session expired. Please log in again.');
                    navigate('/login', { replace: true });
                    return;
                }

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                setRefreshTrigger(prev => prev + 1);

                Swal.fire('Deleted!', 'The product has been deleted.', 'success');
            } catch (err) {
                setError(`Failed to delete product: ${err.message}`);
                console.error('Error deleting product:', err);

                Swal.fire('Error!', 'Something went wrong while deleting.', 'error');
            }
        }
    };

    const handleToggleAvailability = async (product) => {
        // Determine new status (flip the current one)
        const newStatus = Number(product.availability) === 1 ? 0 : 1;
        const actionText = newStatus === 1 ? 'make available' : 'make unavailable';
        const resultText = newStatus === 1 ? 'available' : 'unavailable';

        const result = await Swal.fire({
            title: `Do you want to ${actionText} this product?`,
            text: `Users ${newStatus === 1 ? 'will' : 'will not'} be able to see and order this product.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: `Yes, ${actionText}!`,
        });

        if (result.isConfirmed) {
            try {
                // Create FormData for multipart/form-data request
                const formData = new FormData();
                formData.append('_method', 'PUT'); // Indicate this is a PUT request
                formData.append('id', product.id);
                formData.append('name', product.name);
                formData.append('availability', newStatus); // Use newStatus directly

                // Add other required fields that should be preserved
                formData.append('description', product.description || '');
                formData.append('weight_price', product.weight_price || 0);

                // Send with existing image
                if (product.image) {
                    formData.append('image', product.image);
                }

                const response = await fetch(`http://localhost:8000/src/backend/api/products.php`, {
                    method: 'POST', // Use POST but with _method=PUT
                    body: formData,
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                    },
                    // Don't set Content-Type header when using FormData
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                setRefreshTrigger(prev => prev + 1);

                Swal.fire(
                    newStatus === 1 ? 'Available!' : 'Unavailable!',
                    `The product is now ${resultText}.`,
                    'success'
                );
            } catch (err) {
                setError(`Failed to update product: ${err.message}`);
                console.error('Error updating product:', err);

                Swal.fire('Error!', 'Something went wrong while updating the product.', 'error');
            }
        }
    };

    const refreshData = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Function to format price with commas 1000000 => 100,000
    const commaInPrice = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' L.L';
    };

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center p-4">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3 text-muted">Loading products...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger d-flex align-items-center m-2" role="alert">
                <div>
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    <strong>Error Loading Products</strong>
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

    // Function to render mobile card view for each product
    const renderMobileCard = (product) => (
        <div className="card mb-3" key={product.id}>
            <div className="card-body p-3">
                <div className="d-flex mb-3">
                    {product.image && (
                        <div className="me-3">
                            <img
                                src={`http://localhost:8000/public/img/products/${product.image}`}
                                alt={product.name}
                                className="rounded"
                                style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                            />
                        </div>
                    )}
                    <div>
                        <h6 className="card-title mb-1">{product.name}</h6>
                        <small className="text-muted">ID: {product.id}</small>
                        <div className="mt-1">
                            <span className={`badge ${product.availability == 1 ? 'bg-success' : 'bg-danger'}`}>
                                {product.availability == 1 ? 'Available' : 'Unavailable'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="mb-2">
                    {product.sizes && product.sizes.length > 0 ? (
                        <div>
                            <strong>Sizes:</strong>
                            <div className="d-flex flex-wrap gap-1 mt-1">
                                {product.sizes.map((size, idx) => (
                                    <span key={idx} className="badge bg-info text-dark">
                                        {size.size_name}: {commaInPrice(size.price)}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div><strong>Price:</strong> {commaInPrice(product.weight_price)}</div>
                    )}
                    <div className="mt-1">
                        <i className="bi bi-calendar3 me-1"></i>
                        Created at: {formatDate(product.created_at)}
                    </div>
                </div>

                {product.category && product.category.length > 0 && (
                    <div className="mb-2">
                        <small className="text-muted">Categories:</small>
                        <div className="d-flex flex-wrap gap-1 mt-1">
                            {Array.isArray(product.category) ?
                                product.category.map((cat, idx) => (
                                    <span key={idx} className="badge bg-secondary">{cat.category_name}</span>
                                )) :
                                <span className="badge bg-secondary">{product.category}</span>
                            }
                        </div>
                    </div>
                )}

                <div className="d-flex gap-2 mt-3">
                    <button
                        className={`btn btn-sm ${product.availability == 1 ? 'btn-warning' : 'btn-success'} flex-grow-1`}
                        onClick={() => handleToggleAvailability(product)}
                    >
                        <i className={`bi ${product.availability == 1 ? 'bi-x-circle' : 'bi-check-circle'} me-1`}></i>
                        {product.availability == 1 ? 'Disable' : 'Enable'}
                    </button>
                    <button
                        className="btn btn-sm btn-primary flex-grow-1"
                        onClick={() => handleEdit(product)}
                    >
                        <i className="bi bi-pencil-fill me-1"></i> Edit
                    </button>
                    <button
                        className="btn btn-sm btn-danger flex-grow-1"
                        onClick={() => handleDelete(product.id)}
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
                <h5 className="card-title mb-0">Products</h5>
                <div className="d-flex gap-2">
                    <button
                        onClick={() => navigate('/addProduct')}
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
                {products.length === 0 ? (
                    <div className="text-center p-4 text-muted">
                        <i className="bi bi-inbox-fill d-block mb-2" style={{ fontSize: '2rem' }}></i>
                        No products found.
                    </div>
                ) : (
                    <>
                        {/* Desktop table view - visible on md and larger screens */}
                        <div className="d-none d-md-block table-responsive">
                            <table className="table table-hover table-striped mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>ID</th>
                                        <th>Image</th>
                                        <th>Name</th>
                                        <th>Pricing</th>
                                        <th>Categories</th>
                                        <th>Status</th>
                                        <th>Created at</th>
                                        <th className="text-end">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product) => (
                                        <tr key={product.id}>
                                            <td>{product.id}</td>
                                            <td>
                                                {product.image && (
                                                    <img
                                                        src={`http://localhost:8000/public/img/products/${product.image}`}
                                                        alt={product.name}
                                                        className="rounded"
                                                        style={{ width: '45px', height: '45px', objectFit: 'cover' }}
                                                    />
                                                )}
                                            </td>
                                            <td>{product.name}</td>
                                            <td>
                                                {product.sizes && product.sizes.length > 0 ? (
                                                    <span className="badge bg-info text-dark">
                                                        {product.sizes.length} size{product.sizes.length > 1 ? 's' : ''}
                                                    </span>
                                                ) : (
                                                    commaInPrice(product.weight_price)
                                                )}
                                            </td>
                                            <td>
                                                {Array.isArray(product.category) && product.category.length > 0 ? (
                                                    <div className="d-flex flex-wrap gap-1">
                                                        {product.category.map((cat, idx) => (
                                                            <span key={idx} className="badge bg-secondary">{cat.category_name}</span>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span className="text-muted">-</span>
                                                )}
                                            </td>
                                            <td>
                                                <span className={`badge ${product.availability == 1 ? 'bg-success' : 'bg-danger'}`}>
                                                    {product.availability == 1 ? 'Available' : 'Unavailable'}
                                                </span>
                                            </td>
                                            <td>{formatDate(product.created_at)}</td>
                                            <td className="text-end">
                                                <div className="btn-group" role="group">
                                                    <button
                                                        onClick={() => handleToggleAvailability(product)}
                                                        className={`btn btn-sm ${product.availability == 1 ? 'btn-warning' : 'btn-success'}`}
                                                        title={product.availability == 1 ? 'Make Unavailable' : 'Make Available'}
                                                    >
                                                        <i className={`bi ${product.availability == 1 ? 'bi-x-circle' : 'bi-check-circle'}`}></i>
                                                        <span className="d-none d-lg-inline ms-1">
                                                            {product.availability == 1 ? 'Disable' : 'Enable'}
                                                        </span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleEdit(product)}
                                                        className="btn btn-sm btn-primary"
                                                    >
                                                        <i className="bi bi-pencil-fill"></i>
                                                        <span className="d-none d-lg-inline ms-1">Edit</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(product.id)}
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
                            {products.map(renderMobileCard)}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ViewProducts;