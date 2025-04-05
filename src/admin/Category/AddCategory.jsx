import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AddCategory = () => {
    const [categoryName, setCategoryName] = useState("");
    const [message, setMessage] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [categoryId, setCategoryId] = useState(null);
    const [createdDate, setCreatedDate] = useState(new Date());
    const [isSubmitting, setIsSubmitting] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    // Check if we have data from the navigation state (edit mode)
    useEffect(() => {
        if (location.state) {
            const { isEditing, categoryId, categoryName, createdAt } = location.state;

            if (isEditing) {
                setIsEditing(true);
                setCategoryId(categoryId);
                setCategoryName(categoryName);
                setCreatedDate(new Date(createdAt));
            }
        }
    }, [location]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            let url = "http://localhost:8000/src/backend/api/category.php";
            let method = "POST";
            let body = { name: categoryName };

            // If editing, add the ID and use PUT method
            if (isEditing && categoryId) {
                method = "PUT";
                body.id = categoryId;
            }

            const response = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const result = await response.json();

            if (result.error) {
                setMessage(result.error);
            } else {
                setMessage(result.message || "Operation successful!");

                // Reset form if it was a new category
                if (!isEditing) {
                    setCategoryName("");
                }

                // Optionally redirect back to view after success
                setTimeout(() => {
                    navigate('/viewCategory');
                }, 2000);
            }
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        // Navigate back to the category list
        navigate('/viewCategory');
    };

    const formatDate = (date) => {
        return date.toLocaleDateString();
    };

    return (
        <div className="container-fluid px-0">
            <div className="row justify-content-center mx-0">
                <div className="col-12 col-md-8 col-lg-6">
                    <div className="card shadow mb-4">
                        <div className="card-header bg-white py-3">
                            <h5 className="card-title mb-0 fw-bold">
                                {isEditing ? "Edit Category" : "Add Category"}
                            </h5>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <div className="form-floating">
                                        <input
                                            id="name"
                                            type="text"
                                            value={categoryName}
                                            className="form-control"
                                            placeholder="Enter Category"
                                            onChange={(e) => setCategoryName(e.target.value)}
                                            required
                                        />
                                        <label htmlFor="name">Category Name</label>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <p className="mb-1 text-muted">
                                        <i className="bi bi-calendar3 me-2"></i>
                                        <span>{isEditing ? "Created on: " : "Will be created on: "}</span>
                                        <span className="fw-medium">{formatDate(createdDate)}</span>
                                    </p>
                                </div>

                                <div className="d-flex flex-column flex-sm-row gap-2">
                                    <button
                                        type="submit"
                                        className="btn btn-primary flex-grow-1"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                {isEditing ? "Updating..." : "Creating..."}
                                            </>
                                        ) : (
                                            <>
                                                <i className={`bi ${isEditing ? 'bi-pencil-fill' : 'bi-plus-circle'} me-2`}></i>
                                                {isEditing ? "Update Category" : "Create Category"}
                                            </>
                                        )}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="btn btn-outline-secondary flex-grow-1"
                                    >
                                        <i className="bi bi-x-circle me-2"></i>
                                        Cancel
                                    </button>
                                </div>
                            </form>

                            {message && (
                                <div
                                    className={`alert mt-4 ${message.includes("Error") || message.includes("error") ? "alert-danger" : "alert-success"}`}
                                    role="alert"
                                >
                                    <div className="d-flex align-items-center">
                                        <i className={`bi me-2 ${message.includes("Error") || message.includes("error") ? "bi-exclamation-triangle-fill" : "bi-check-circle-fill"}`}></i>
                                        <div>{message}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddCategory;