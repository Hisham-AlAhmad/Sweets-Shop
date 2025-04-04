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
        // Navigate to the AddCategory component with state containing the category data
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

                // Refresh the category list after successful deletion
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
            <div className="d-flex justify-content-center align-items-center p-5">
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
            <div className="alert alert-danger d-flex align-items-center m-3" role="alert">
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

    return (
        <div className="card shadow">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">Categories</h5>
                <button
                    onClick={refreshData}
                    className="btn btn-sm btn-outline-secondary"
                >
                    <i className="bi bi-arrow-clockwise me-1"></i> Refresh
                </button>
            </div>

            <div className="card-body p-0">
                {categories.length === 0 ? (
                    <div className="text-center p-4 text-muted">
                        <i className="bi bi-inbox-fill d-block mb-2" style={{ fontSize: '2rem' }}></i>
                        No categories found.
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-hover table-striped mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Creation Date</th>
                                    <th className="text-end pe-5">Actions</th>
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
                                                    title="Edit"
                                                >
                                                    <i className="bi bi-pencil-fill me-1"></i> Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(category.id)}
                                                    className="btn btn-sm btn-danger"
                                                    title="Delete"
                                                >
                                                    <i className="bi bi-trash-fill me-1"></i> Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewCategory;