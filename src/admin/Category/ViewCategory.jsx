import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ViewCategory = () => {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch('http://localhost:8000/src/backend/api/category.php');

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                setCategories(data);
            } catch (err) {
                setError(`Failed to fetch categories: ${err.message}`);
                console.error('Error fetching categories:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategories();
    }, [refreshTrigger]);

    const handleEdit = (category) => {
        navigate('/addCategory', {
            state: {
                isEditing: true,
                categoryId: category.id,
                categoryName: category.name,
                createdAt: category.created_at
            }
        });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                const response = await fetch(`http://localhost:8000/src/backend/api/category.php`, {
                    method: 'DELETE',
                    body: JSON.stringify({ id: id }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                setRefreshTrigger(prev => prev + 1);
            } catch (err) {
                setError(`Failed to delete category: ${err.message}`);
                console.error('Error deleting category:', err);
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

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center p-4">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3 text-muted">Loading categories...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger d-flex align-items-center m-2" role="alert">
                <div>
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    <strong>Error Loading Categories</strong>
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

    // Function to render mobile card view for each category
    const renderMobileCard = (category) => (
        <div className="card mb-3" key={category.id}>
            <div className="card-body p-3">
                <h6 className="card-title d-flex justify-content-between">
                    <span>{category.name}</span>
                    <small className="text-muted">ID: {category.id}</small>
                </h6>
                <div className="card-text">
                    <div className="mb-2">
                        <i className="bi bi-calendar3 me-2"></i>
                        {formatDate(category.created_at)}
                    </div>
                </div>
                <div className="d-flex gap-2 mt-2">
                    <button
                        className="btn btn-sm btn-primary flex-grow-1"
                        onClick={() => handleEdit(category)}
                    >
                        <i className="bi bi-pencil-fill me-1"></i> Edit
                    </button>
                    <button
                        className="btn btn-sm btn-danger flex-grow-1"
                        onClick={() => handleDelete(category.id)}
                    >
                        <i className="bi bi-trash-fill me-1"></i> Delete
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="card shadow">
            <div className="card-header bg-white d-flex justify-content-between align-items-center flex-wrap gap-2">
                <h5 className="card-title mb-0">Categories</h5>
                <div className="d-flex gap-2">
                    <button
                        onClick={() => navigate('/addCategory')}
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
                {categories.length === 0 ? (
                    <div className="text-center p-4 text-muted">
                        <i className="bi bi-inbox-fill d-block mb-2" style={{ fontSize: '2rem' }}></i>
                        No categories found.
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
                                        <th>Creation Date</th>
                                        <th className="text-end">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.map((category) => (
                                        <tr key={category.id}>
                                            <td>{category.id}</td>
                                            <td>{category.name}</td>
                                            <td>{formatDate(category.created_at)}</td>
                                            <td className="text-end">
                                                <div className="btn-group" role="group">
                                                    <button
                                                        onClick={() => handleEdit(category)}
                                                        className="btn btn-sm btn-primary"
                                                    >
                                                        <i className="bi bi-pencil-fill"></i>
                                                        <span className="d-none d-lg-inline ms-1">Edit</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(category.id)}
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
                            {categories.map(renderMobileCard)}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ViewCategory;