import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const ViewFeedback = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { logout } = useAuth();

    useEffect(() => {
        const fetchFeedback = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch('http://localhost:8000/src/backend/api/feedback.php', {
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
                setFeedbacks(data);
            } catch (err) {
                setError(`Failed to fetch feedback: ${err.message}`);
                console.error('Error fetching feedback:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFeedback();
    }, [refreshTrigger]);
    console.log("feedbacks: ", feedbacks);

    const handleEdit = (feedback) => {
        navigate('/editFeedback', {
            state: {
                isEditing: true,
                feedbackId: feedback.id,
                name: feedback.name,
                comment: feedback.comment,
                approved: feedback.approved,
                createdAt: feedback.created_at
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
                const response = await fetch(`http://localhost:8000/src/backend/api/feedback.php`, {
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

                Swal.fire('Deleted!', 'The feedback has been deleted.', 'success');
            } catch (err) {
                setError(`Failed to delete feedback: ${err.message}`);
                console.error('Error deleting feedback:', err);

                Swal.fire('Error!', 'Something went wrong while deleting.', 'error');
            }
        }
    };

    const handleApprove = async (id) => {
        const result = await Swal.fire({
            title: 'Do you want to Approve this comment?',
            text: "Approving will make it visible to all users.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, approve it!',
        });
        if (result.isConfirmed) {
            try {
                const response = await fetch(`http://localhost:8000/src/backend/api/feedback.php`, {
                    method: 'PUT',
                    body: JSON.stringify({ id: id, approved: 1 }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                setRefreshTrigger(prev => prev + 1);

                Swal.fire('Approved!', 'The feedback has been approved.', 'success');
            } catch (err) {
                setError(`Failed to approve feedback: ${err.message}`);
                console.error('Error approving feedback:', err);

                Swal.fire('Error!', 'Something went wrong while approving.', 'error');
            }
        }
    }

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
                    <p className="mt-3 text-muted">Loading feedback...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger d-flex align-items-center m-2" role="alert">
                <div>
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    <strong>Error Loading Feedback</strong>
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

    // Function to render mobile card view for each feedback
    const renderMobileCard = (feedback) => (
        <div className="card mb-3" key={feedback.id}>
            <div className="card-body p-3">
                <h6 className="card-title d-flex justify-content-between">
                    <span>{feedback.name}</span>
                    <small className="text-muted">ID: {feedback.id}</small>
                </h6>
                <p className="card-text">{feedback.comment}</p>
                <div className="d-flex justify-content-between align-items-center">
                    <span className={`badge ${feedback.approved == 1 ? 'bg-success' : 'bg-danger'}`}>
                        {feedback.approved == 1 ? 'Approved' : 'Pending'}
                    </span>
                    <button
                        className="btn btn-sm btn-success"
                        onClick={() => handleApprove(feedback.id)}
                    >
                        <i className="bi bi-check-circle-fill me-1"></i> Approve
                    </button>
                </div>
                <div className="card-text">
                    <div className="mb-2">
                        <i className="bi bi-calendar3 me-2"></i>
                        {formatDate(feedback.created_at)}
                    </div>
                </div>
                <div className="d-flex gap-2 mt-2">
                    <button
                        className="btn btn-sm btn-primary flex-grow-1"
                        onClick={() => handleEdit(feedback)}
                    >
                        <i className="bi bi-pencil-fill me-1"></i> Edit
                    </button>
                    <button
                        className="btn btn-sm btn-danger flex-grow-1"
                        onClick={() => handleDelete(feedback.id)}
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
                <h5 className="card-title m-0">Feedbacks</h5>
                <div className='d-flex gap-2'>
                    <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={refreshData}
                    >
                        <i className="bi bi-arrow-clockwise me-1"></i> Refresh
                    </button>
                </div>
            </div>

            <div className='card-body p-0'>
                {feedbacks.length === 0 ? (
                    <div className="text-center p-4 text-muted">
                        <i className="bi bi-inbox-fill d-block mb-2" style={{ fontSize: '2rem' }}></i>
                        No feedback found.
                    </div>
                ) : (
                    <>
                        {/* Desktop table view - visible on md and larger screens */}
                        <div className="d-none d-md-block table-responsive">
                            <table className="table table-striped table-hover mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Comment</th>
                                        <th>Status</th>
                                        <th>Created At</th>
                                        <th className='text-end'>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {feedbacks.map(feedback => (
                                        <tr key={feedback.id}>
                                            <td>{feedback.id}</td>
                                            <td>{feedback.name}</td>
                                            <td>{feedback.comment}</td>
                                            <td>{<span className={`badge ${feedback.approved == 1 ? 'bg-success' : 'bg-danger'}`}>
                                                {feedback.approved == 1 ? 'Approved' : 'Pending'}</span>}
                                            </td>
                                            <td>{formatDate(feedback.created_at)}</td>
                                            <td className="text-end">
                                                <div className='btn-group'>
                                                    <button
                                                        onClick={() => handleEdit(feedback)}
                                                        className="btn btn-sm btn-primary"
                                                    >
                                                        <i className="bi bi-pencil-fill me-1"></i>
                                                        <span className='d-none d-lg-inline ms-1'>Edit</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(feedback.id)}
                                                        className="btn btn-sm btn-danger"
                                                    >
                                                        <i className="bi bi-trash-fill"></i>
                                                        <span className='d-none d-lg-inline ms-1'>Delete</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleApprove(feedback.id)}
                                                        className="btn btn-sm btn-success"
                                                    >
                                                        <i className="bi bi-check-circle-fill me-1"></i>
                                                        <span className='d-none d-lg-inline ms-1'>Approve</span>
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
                            {feedbacks.map(renderMobileCard)}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default ViewFeedback;