import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import useFetch from '../Hooks/useFetch';
import Swal from 'sweetalert2';

const ViewFeedback = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { logout } = useAuth();

    const { data, isLoading: hookLoading, error: hookError } = useFetch('feedback', [refreshTrigger]);
    // Update your state from the hook's returned values
    useEffect(() => {
        if (data) {
            setFeedbacks(data);
        }
        setIsLoading(hookLoading);
        if (hookError) {
            setError(hookError);
        }
    }, [data, hookLoading, hookError]);


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

                Swal.fire('Deleted!', 'The feedback has been deleted.', 'success');
            } catch (err) {
                setError(`Failed to delete feedback: ${err.message}`);
                console.error('Error deleting feedback:', err);

                Swal.fire('Error!', 'Something went wrong while deleting.', 'error');
            }
        }
    };

    const handleApprove = async (feedback) => {
        const newStatus = feedback.approved == 1 ? 0 : 1;
        const actionText = newStatus == 1 ? 'Approve' : 'Unapprove';

        const resultText = newStatus == 1 ? 'Visible' : 'Invisible';
        const result = await Swal.fire({
            title: `Do you want to ${actionText} this comment?`,
            text: `This will make the feedback ${resultText} to all users.`,
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
                    body: JSON.stringify({ id: feedback.id, approved: newStatus }),
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                setRefreshTrigger(prev => prev + 1);

                Swal.fire(
                    newStatus === 1 ? 'Approved!' : 'Unapproved!',
                    `The feedback has been ${newStatus === 1 ? 'approved' : 'unapproved'}.`,
                    'success');
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
                        onClick={() => handleApprove(feedback)}
                        className={`btn btn-sm ${feedback.approved == 1 ? 'btn-warning' : 'btn-success'}`}
                        title={feedback.approved == 1 ? 'Make Unavailable' : 'Make Available'}
                    >
                        <i className={`bi ${feedback.approved == 1 ? 'bi-x-circle' : 'bi-check-circle'}`}></i>
                        <span className="ms-1">
                            {feedback.approved == 1 ? 'Disable' : 'Enable'}
                        </span>
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
                                                        onClick={() => handleApprove(feedback)}
                                                        className={`btn btn-sm ${feedback.approved == 1 ? 'btn-warning' : 'btn-success'}`}
                                                        title={feedback.approved == 1 ? 'Make Unavailable' : 'Make Available'}
                                                    >
                                                        <i className={`bi ${feedback.approved == 1 ? 'bi-x-circle' : 'bi-check-circle'}`}></i>
                                                        <span className="d-none d-lg-inline ms-1">
                                                            {feedback.approved == 1 ? 'Disable' : 'Enable'}
                                                        </span>
                                                    </button>
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