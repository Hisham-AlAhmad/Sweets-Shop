import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const EditFeedback = () => {
    const [name, setName] = useState("");
    const [comment, setComment] = useState("");
    const [message, setMessage] = useState("");
    const [approved, setApproved] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [feedbackId, setFeedbackId] = useState(null);
    const [createdAt, setCreatedAt] = useState(new Date());
    const [isSubmitting, setIsSubmitting] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    // Check if we have data from the navigation state (edit mode)
    useEffect(() => {
        if (location.state) {
            const { isEditing, feedbackId, name, comment, approved, createdAt } = location.state;

            if (isEditing) {
                setIsEditing(true);
                setFeedbackId(feedbackId);
                setName(name);
                setComment(comment);
                setApproved(approved);
                setCreatedAt(new Date(createdAt));
            }
        }
    }, [location]); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            let url = "http://localhost:8000/src/backend/api/feedback.php";
            let method = "POST";
            let body = { name, comment, approved };

            // If editing, add the ID and use PUT method
            if (isEditing && feedbackId) {
                method = "PUT";
                body.id = feedbackId;
            }

            const response = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
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

            const result = await response.json();

            if (result.error) {
                setMessage(result.error);
            } else {
                setMessage(result.message || "Operation successful!");

                setTimeout(() => {
                    navigate("/viewFeedback");
                }, 2000);
            }
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        // Navigate back to the feedback list
        navigate("/viewFeedback");
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
                                Edit Feedback
                            </h5>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <div className="form-floating">
                                        <input
                                            id="name"
                                            type="text"
                                            value={name}
                                            className="form-control"
                                            placeholder="Enter feedback"
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                        />
                                        <label htmlFor="name">Name</label>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <div className="form-floating">
                                        <input
                                            id="comment"
                                            type="text"
                                            value={comment}
                                            className="form-control"
                                            placeholder="Enter feedback"
                                            onChange={(e) => setComment(e.target.value)}
                                            required
                                        />
                                        <label htmlFor="comment">Comment</label>
                                    </div>
                                </div>

                                <div className="mb-3 form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="approved"
                                        checked={approved}
                                        onChange={(e) => setApproved(e.target.checked)}
                                    />
                                    <label className="form-check-label" htmlFor="approved">Approved</label>
                                </div>

                                <div className="mb-4">
                                    <p className="mb-1 text-muted">
                                        <i className="bi bi-calendar3 me-2"></i>
                                        <span>Created on: </span>
                                        <span className="fw-medium">{formatDate(createdAt)}</span>
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
                                                {isEditing ? "Update Feedback" : "Create Feedback"}
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

export default EditFeedback;